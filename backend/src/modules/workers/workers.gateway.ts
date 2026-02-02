import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { WorkersService } from './workers.service';
import {
  WS_EVENTS,
  TaskCompletedDto,
  TaskFailedDto,
  TaskAssignedPayload,
  WorkerRegisteredPayload,
  WorkerHeartbeatDto,
} from './dto/ws-events.dto';
import { TaskStatus, WorkerStatus } from './enums';

@WebSocketGateway({
  namespace: 'workers',
  cors: {
    origin: '*',
  },
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class WorkersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WorkersGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly tasksService: TasksService,
    private readonly workersService: WorkersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;
      if (!token) {
        throw new WsException('Missing auth token');
      }

      const worker = await this.workersService.findByToken(token);
      if (!worker) {
        throw new WsException('Invalid auth token');
      }

      this.logger.log(`Worker connected: ${worker.name} (${worker.id})`);

      // Update status to CONNECTED
      await this.workersService.updateStatus(worker.id, WorkerStatus.CONNECTED);

      // Send registration confirmation
      const payload: WorkerRegisteredPayload = {
        workerId: worker.id,
        serverTime: new Date().toISOString(),
        config: {
          heartbeatInterval: 10000,
          taskTimeout: 60000,
        },
      };
      client.emit(WS_EVENTS.WORKER_REGISTERED, payload);

      // Join room for this worker
      client.join(worker.id);
    } catch (error: any) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.query.token as string;
    if (token) {
      const worker = await this.workersService.findByToken(token);
      if (worker) {
        this.logger.log(`Worker disconnected: ${worker.name}`);
        // If it was gracefully disconnected, we set to DISCONNECTED.
        // If it crashed, heartbeat timeout will eventually catch it.
        // But for cleaner UI, we set it to DISCONNECTED immediately if socket closes.
        await this.workersService.updateStatus(
          worker.id,
          WorkerStatus.DISCONNECTED,
        );
      }
    }
  }

  @SubscribeMessage(WS_EVENTS.WORKER_HEARTBEAT)
  async handleHeartbeat(
    @MessageBody() payload: WorkerHeartbeatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.query.token as string;
    // Low-level debug log to avoid noise, but useful or tracing
    this.logger.debug(
      `Heartbeat from ${token ? 'worker' : 'unknown'} [${payload.status}]`,
    );

    const worker = await this.workersService.findByToken(token);
    if (worker) {
      await this.workersService.processHeartbeat(worker.id, payload);
    }
  }

  @SubscribeMessage(WS_EVENTS.NETWORK_CHANGED)
  async handleNetworkChanged(
    @MessageBody() payload: any, // Using any or specific DTO part
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.query.token as string;
    if (token) {
      const worker = await this.workersService.findByToken(token);
      if (worker) {
        this.logger.log(
          `Network changed for worker ${worker.name}: ${payload.externalIp}`,
        );
        // Reuse heartbeat logic or specific update
        await this.workersService.processHeartbeat(worker.id, {
          status: 'connected' as any, // internal mapping will treat as connected/idle
          networkInfo: payload,
          stats: {
            tasksCompleted: worker.tasksCompletedCount,
            tasksFailed: worker.tasksFailedCount,
            uptime: 0,
          },
        } as any);
      }
    }
  }

  /**
   * Send a task to a specific worker
   */
  async sendTaskToWorker(workerId: string, payload: TaskAssignedPayload) {
    this.server.to(workerId).emit(WS_EVENTS.TASK_ASSIGNED, payload);
    this.logger.log(`Assigned task ${payload.taskId} to worker ${workerId}`);
  }

  @SubscribeMessage(WS_EVENTS.TASK_COMPLETED)
  async handleTaskCompleted(
    @MessageBody() payload: TaskCompletedDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Task ${payload.taskId} completed`);

    try {
      await this.tasksService.saveResult(payload.taskId, {
        ...payload.result,
        taskId: payload.taskId,
        scrapedAt: new Date(payload.completedAt),
      });

      // Update worker status back to CONNECTED if idle
      const token = client.handshake.query.token as string;
      if (token) {
        const worker = await this.workersService.findByToken(token);
        if (worker)
          await this.workersService.updateStatus(
            worker.id,
            WorkerStatus.CONNECTED,
          );
      }
    } catch (error) {
      this.logger.error(
        `Failed to save task result for ${payload.taskId}`,
        error,
      );
      client.emit(WS_EVENTS.ERROR, {
        code: 'SAVE_FAILED',
        message: 'Failed to save task result',
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage(WS_EVENTS.TASK_FAILED)
  async handleTaskFailed(
    @MessageBody() payload: TaskFailedDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.warn(`Task ${payload.taskId} failed: ${payload.error.message}`);

    await this.tasksService.updateStatus(
      payload.taskId,
      TaskStatus.FAILED,
      payload.error.message,
    );

    // Update worker status back to CONNECTED?
    // Depends on error type. If BLOCKED, worker updates via heartbeat logic (status: blocked).
    // If just task specific error, worker goes back to idle.
    // The worker logic sends heartbeat with 'currentTaskId' if busy.
  }
}
