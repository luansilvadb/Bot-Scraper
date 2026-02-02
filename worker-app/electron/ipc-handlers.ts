import { BrowserWindow, ipcMain, app, IpcMainInvokeEvent } from 'electron';
import { getWorkerState } from './services/worker-state';
import { WebSocketClient } from './services/websocket';
import { NetworkService } from './services/network';
import { ScraperService } from './services/scraper';
import { WS_EVENTS, WorkerStatus, WorkerConfig, ConfigValidationResult, SERVER_URL } from './types';
import { getConfig, saveConfig } from './services/config-store';
import { setAutoLaunch } from './services/auto-launch';
import { getStatusWindow } from './status-window';

let wsClient: WebSocketClient | null = null;
const state = getWorkerState();
const network = NetworkService.getInstance();
const scraper = ScraperService.getInstance();

let _mainWindow: BrowserWindow | null = null;

export function setMainWindow(win: BrowserWindow) {
    _mainWindow = win;
}

async function startWorker(config: any) {
    if (wsClient) wsClient.disconnect();

    // Use environment URL as fallback if serverUrl is empty
    const serverUrl = config.serverUrl || SERVER_URL;
    console.log('[Worker] Connecting to:', serverUrl);

    wsClient = new WebSocketClient(serverUrl, config.workerToken);

    // Setup heartbeat callback
    wsClient.setHeartbeatDataCallback(async () => {
        const netInfo = network.getNetworkInfo();
        const status = state.getStatus();
        return {
            status: status.connectionState === 'WORKING' ? 'busy' : 'idle',
            networkInfo: {
                externalIp: netInfo.externalIp,
                ispName: netInfo.ispName,
                lastCheckedAt: netInfo.lastCheckedAt
            },
            stats: {
                tasksCompleted: status.tasksCompleted,
                tasksFailed: status.tasksFailed,
                uptime: state.getUptime()
            }
        };
    });

    // Handle task assignments
    wsClient.on(WS_EVENTS.TASK_ASSIGNED, async (payload) => {
        if (state.getStatus().isPaused) {
            console.log('[WS] Task ignored - Worker is paused');
            return;
        }

        state.setCurrentTask({
            taskId: payload.taskId,
            productUrl: payload.productUrl,
            startedAt: new Date().toISOString(),
            progress: 'Iniciando...'
        });

        try {
            const result = await scraper.scrapeProduct(
                payload.productUrl,
                payload.taskId,
                (progress) => state.updateTaskProgress(progress)
            );

            wsClient?.emit(WS_EVENTS.TASK_COMPLETED, {
                taskId: payload.taskId,
                completedAt: new Date().toISOString(),
                result: result.data,
                metrics: result.metrics
            });

            const currentStats = state.getStatus();
            state.setTasksStats(currentStats.tasksCompleted + 1, currentStats.tasksFailed);
        } catch (error: any) {
            console.error('[WS] Scrape failed:', error);
            wsClient?.emit(WS_EVENTS.TASK_FAILED, {
                taskId: payload.taskId,
                failedAt: new Date().toISOString(),
                error: {
                    type: error.type || 'NETWORK',
                    message: error.message
                }
            });
            const currentStats = state.getStatus();
            state.setTasksStats(currentStats.tasksCompleted, currentStats.tasksFailed + 1);
        } finally {
            state.setCurrentTask(null);
        }
    });

    // Update connection state based on WS events
    wsClient.on('connect', () => state.setConnectionState('CONNECTED'));
    wsClient.on('disconnect', () => state.setConnectionState('DISCONNECTED'));
    wsClient.on('error', (err: any) => state.setError(err.message));
    wsClient.on(WS_EVENTS.WORKER_REGISTERED, (payload: any) => {
        state.setWorkerId(payload.workerId);
        state.setConnectionState('CONNECTED');
    });

    wsClient.connect();
}

export async function connectToBackend(config: WorkerConfig) {
    await startWorker(config);
}

export function registerIpcHandlers() {
    // Status handlers
    ipcMain.handle('worker:get-status', (): WorkerStatus => state.getStatus());
    ipcMain.handle('worker:get-config', (): WorkerConfig => getConfig());

    ipcMain.handle('worker:save-config', async (_event: IpcMainInvokeEvent, config: WorkerConfig): Promise<ConfigValidationResult> => {
        console.log('[IPC] Save config requested');

        // Validation - only token is required (URL comes from environment)
        const errors: string[] = [];
        if (!config.workerToken || config.workerToken.trim().length === 0) {
            errors.push('O token é obrigatório');
        }

        if (errors.length > 0) {
            return { valid: false, errors };
        }

        // Inject server URL from environment variable
        const configToSave: WorkerConfig = {
            ...config,
            serverUrl: SERVER_URL  // Always use environment URL
        };

        saveConfig(configToSave);

        // Apply auto-start setting
        if (config.autoStart !== undefined) {
            setAutoLaunch(config.autoStart);
        }

        // Notify windows about config change
        if (_mainWindow && !_mainWindow.isDestroyed()) {
            _mainWindow.webContents.send('worker:config-loaded', configToSave);
        }
        const statusWin = getStatusWindow();
        if (statusWin && !statusWin.isDestroyed()) {
            statusWin.webContents.send('worker:config-loaded', configToSave);
        }

        // Auto connect after saving
        await startWorker(configToSave);

        return { valid: true, errors: [] };
    });

    ipcMain.handle('worker:connect', async () => {
        const config = getConfig();
        // Only require token - serverUrl will be filled from environment
        if (config.workerToken) {
            await startWorker(config);
        }
    });

    ipcMain.handle('worker:disconnect', () => {
        if (wsClient) {
            wsClient.disconnect();
            state.setConnectionState('DISCONNECTED');
        }
    });

    ipcMain.handle('worker:toggle-pause', () => {
        const currentStatus = state.getStatus();
        state.setPaused(!currentStatus.isPaused);
        return state.getStatus().isPaused;
    });

    ipcMain.handle('worker:open-settings', () => {
        const { showStatusWindow } = require('./status-window');
        showStatusWindow();
    });

    ipcMain.handle('worker:quit', () => {
        (app as any).isQuitting = true;
        app.quit();
    });

    // Listener for state changes to notify renderer
    state.on('change', (newStatus: WorkerStatus) => {
        if (_mainWindow && !_mainWindow.isDestroyed()) {
            _mainWindow.webContents.send('worker:status-changed', newStatus);
        }

        const statusWin = getStatusWindow();
        if (statusWin && !statusWin.isDestroyed()) {
            statusWin.webContents.send('worker:status-changed', newStatus);
        }
    });
}
