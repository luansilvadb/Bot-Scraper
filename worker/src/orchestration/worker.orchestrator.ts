import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { SocketService } from '../communication/socket.service';
import { ScraperService } from '../scraper/scraper.service';
import { NetworkService } from './network.service';
import { WS_EVENTS, TaskAssignedPayload, TaskErrorType } from '../types';

@Injectable()
export class WorkerOrchestrator implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(WorkerOrchestrator.name);
    private heartbeatInterval: NodeJS.Timeout | null = null;

    private isBusy = false;
    private currentTaskId?: string;
    private tasksCompleted = 0;
    private tasksFailed = 0;

    constructor(
        private socketService: SocketService,
        private scraperService: ScraperService,
        private networkService: NetworkService,
    ) { }

    onModuleInit() {
        this.logger.log('Worker Orchestrator initialized');

        this.socketService.on(WS_EVENTS.TASK_ASSIGNED, async (payload: TaskAssignedPayload) => {
            this.handleTask(payload);
        });

        this.socketService.on('connect', () => {
            this.logger.log('Connected to backend, sending immediate heartbeat');
            this.sendHeartbeat();
        });

        // Start heartbeat - every 30 seconds
        this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), 30000);
    }

    onModuleDestroy() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    }

    private sendHeartbeat() {
        const netInfo = this.networkService.getNetworkInfo();
        const payload = {
            status: this.isBusy ? 'busy' : 'idle',
            currentTaskId: this.currentTaskId,
            networkInfo: netInfo,
            stats: {
                tasksCompleted: this.tasksCompleted,
                tasksFailed: this.tasksFailed,
                uptime: process.uptime()
            }
        };
        this.socketService.emit(WS_EVENTS.WORKER_HEARTBEAT, payload);
    }

  private async handleTask(task: TaskAssignedPayload) {
    if (this.isBusy) {
      this.logger.warn(`Received task ${task.taskId} while busy!`);
      this.logger.warn(`Current task: ${this.currentTaskId}, isBusy: ${this.isBusy}`);
    }

    this.isBusy = true;
    this.currentTaskId = task.taskId;
    this.logger.log(`=============================================`);
    this.logger.log(`Processing task ${task.taskId}`);
    this.logger.log(`URL: ${task.productUrl}`);
    this.logger.log(`Priority: ${task.priority || 'default'}`);
    this.logger.log(`Attempt: ${task.attemptNumber || 1}`);
    this.logger.log(`=============================================`);

    this.socketService.emit(WS_EVENTS.TASK_STARTED, {
      taskId: task.taskId,
      startedAt: new Date().toISOString()
    });

    const startTime = Date.now();

    try {
      this.logger.log(`Starting scrape...`);
      const result = await this.scraperService.scrape({
        id: task.taskId,
        url: task.productUrl
      });
      const duration = Date.now() - startTime;

      // Handle both single result and array of results
      let resultCount = 0;
      if (Array.isArray(result)) {
        resultCount = result.length;
      } else if (result) {
        resultCount = 1;
      }

      this.logger.log(`Task ${task.taskId} completed successfully in ${duration}ms`);
      this.logger.log(`Found ${resultCount} product(s)`);

      const payload: any = {
        taskId: task.taskId,
        completedAt: new Date().toISOString(),
        metrics: {
          scrapeDurationMs: duration,
          pageLoadTimeMs: 0
        }
      };

      if (Array.isArray(result)) {
        payload.results = result;
      } else {
        payload.result = result;
      }

      this.socketService.emit(WS_EVENTS.TASK_COMPLETED, payload);
      this.logger.log(`Sent TASK_COMPLETED event for task ${task.taskId}`);
      this.tasksCompleted++;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.logger.error(`Task ${task.taskId} failed after ${duration}ms`);
      this.logger.error(`Error: ${error.message}`);
      if (error.stack) {
        this.logger.debug(`Stack trace: ${error.stack}`);
      }

      this.socketService.emit(WS_EVENTS.TASK_FAILED, {
        taskId: task.taskId,
        failedAt: new Date().toISOString(),
        error: {
          type: error.type || TaskErrorType.NETWORK,
          message: error.message || 'Unknown error',
          details: error.stack
        },
        metrics: {
          attemptDurationMs: duration
        }
      });
      this.logger.log(`Sent TASK_FAILED event for task ${task.taskId}`);
      this.tasksFailed++;
    } finally {
      this.isBusy = false;
      this.currentTaskId = undefined;
      this.logger.log(`Worker is now idle and ready for next task`);
      this.logger.log(`Stats: ${this.tasksCompleted} completed, ${this.tasksFailed} failed`);
      this.logger.log(`=============================================`);
    }
  }
}
