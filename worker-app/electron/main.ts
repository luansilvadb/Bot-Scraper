import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { createTray, updateTrayIcon } from './tray';
import { createStatusWindow, showStatusWindow } from './status-window';
import { registerIpcHandlers, setMainWindow } from './ipc-handlers';
import { getWorkerState } from './services/worker-state';
import { initConfigStore, hasConfig, getConfig } from './services/config-store';
import { ScraperService } from './services/scraper';
import { connectToBackend } from './ipc-handlers';
import { SERVER_URL } from './types';

// Handle single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Focus the status window if someone tries to open another instance
        showStatusWindow();
    });
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 603,
        show: false,
        frame: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Load the renderer
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Minimize to tray instead of closing
    mainWindow.on('close', (event) => {
        if (!(app as any).isQuitting) {
            event.preventDefault();
            mainWindow?.hide();
        }
    });

    return mainWindow;
}

app.whenReady().then(() => {
    // Initialize config store
    initConfigStore();
    const configExists = hasConfig();

    // Register IPC handlers
    registerIpcHandlers();

    // Create the main window
    const win = createWindow();
    setMainWindow(win);

    // Create the status popup window
    createStatusWindow();

    // Create system tray
    createTray();

    // Subscribe to worker state changes to update tray
    const state = getWorkerState();
    state.on('change', (newStatus) => {
        updateTrayIcon(newStatus.connectionState);
    });

    // Decide what to show first
    if (configExists) {
        console.log('[Main] Configuration found, connecting...');
        const config = getConfig();
        // Log server URL in development mode
        if (process.env.NODE_ENV !== 'production') {
            console.log('[Main] Server URL (from env):', SERVER_URL);
        }
        connectToBackend(config);
    } else {
        console.log('[Main] No configuration found, opening tray popup for setup');
        // Show the tray window (which will render ConfigWindow via TrayContainer)
        setTimeout(() => {
            showStatusWindow();
        }, 1000); // Small delay to ensure everything is ready
    }

    console.log('[Main] Application started');
});

app.on('window-all-closed', () => {
    // Don't quit on Windows when all windows are closed
    // The app should continue running in the tray
});

app.on('before-quit', async () => {
    (app as any).isQuitting = true;

    // Graceful shutdown
    await ScraperService.getInstance().close();

    console.log('[Main] Cleaning up before quit...');
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

export { mainWindow };
