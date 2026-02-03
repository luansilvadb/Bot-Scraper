import { WebSocketClient } from './websocket.client';
import { ScraperService } from './scraper.service';
import { NetworkService } from './network.service';
import {
    WS_EVENTS,
    TaskAssignedPayload,
    TaskStartedDto,
    TaskCompletedDto,
    TaskFailedDto,
    TaskErrorType
} from './types';

export class WorkerService {
    private isBusy: boolean = false;
    private currentTaskId?: string;
    private tasksCompleted: number = 0;
    private tasksFailed: number = 0;

    constructor(
        private wsClient: WebSocketClient,
        private scraperService: ScraperService,
        private networkService: NetworkService
    ) { }

    public init() {
        // Setup heartbeat data provider
        this.wsClient.setHeartbeatDataCallback(async () => {
            const netInfo = this.networkService.getNetworkInfo();
            return {
                status: this.isBusy ? 'busy' : 'idle',
                currentTaskId: this.currentTaskId,
                networkInfo: {
                    externalIp: netInfo?.externalIp || 'Unknown',
                    ispName: netInfo?.ispName || 'Unknown',
                    lastCheckedAt: netInfo?.lastCheckedAt || new Date().toISOString()
                },
                stats: {
                    tasksCompleted: this.tasksCompleted,
                    tasksFailed: this.tasksFailed,
                    uptime: process.uptime()
                }
            };
        });

        // Listen for assigned tasks
        this.wsClient.on(WS_EVENTS.TASK_ASSIGNED, async (payload: TaskAssignedPayload) => {
            await this.handleTask(payload);
        });
    }

    private async handleTask(task: TaskAssignedPayload) {
        if (this.isBusy) {
            // Technically shouldn't happen if server checks status, but safety check
            console.warn(`[Worker] Received task ${task.taskId} while busy!`);
        }

        this.isBusy = true;
        this.currentTaskId = task.taskId;
        console.log(`[Worker] Received task ${task.taskId}: ${task.productUrl}`);

        // 1. Notify started
        const startedPayload: TaskStartedDto = {
            taskId: task.taskId,
            startedAt: new Date().toISOString()
        };
        this.wsClient.emit(WS_EVENTS.TASK_STARTED, startedPayload);
        const startTime = Date.now();

        try {
            // 2. Exec scraping
            const result = await this.scraperService.scrapeProduct(task.productUrl, task.taskId);
            const endTime = Date.now();

            // 3. Notify success
            const completedPayload: TaskCompletedDto = {
                taskId: task.taskId,
                completedAt: new Date().toISOString(),
                result: result,
                metrics: {
                    scrapeDurationMs: endTime - startTime,
                    pageLoadTimeMs: 0
                }
            };

            console.log(`[Worker] Task ${task.taskId} completed successfully`);
            this.wsClient.emit(WS_EVENTS.TASK_COMPLETED, completedPayload);
            this.tasksCompleted++;

        } catch (error: any) {
            const endTime = Date.now();
            console.error(`[Worker] Task ${task.taskId} failed:`, error);

            // 4. Notify failure
            const failedPayload: TaskFailedDto = {
                taskId: task.taskId,
                failedAt: new Date().toISOString(),
                error: {
                    type: error.type || TaskErrorType.NETWORK,
                    message: error.message || 'Unknown error',
                    details: error.details
                },
                metrics: {
                    attemptDurationMs: endTime - startTime
                }
            };
            this.wsClient.emit(WS_EVENTS.TASK_FAILED, failedPayload);
            this.tasksFailed++;
        } finally {
            this.isBusy = false;
            this.currentTaskId = undefined;
        }
    }
}
