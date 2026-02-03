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
  implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WorkersGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly tasksService: TasksService,
    private readonly workersService: WorkersService,
  ) { }

  async handleConnection(client: Socket) {
    this.logger.log(`Connection attempt from ${client.handshake.address} (ID: ${client.id})`);
    this.logger.debug(`Handshake auth: ${JSON.stringify(client.handshake.auth)}`);
    this.logger.debug(`Handshake query: ${JSON.stringify(client.handshake.query)}`);

    try {
      const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
      if (!token) {
        this.logger.warn(`Connection rejected: Missing auth token from ${client.handshake.address}`);
        throw new WsException('Missing auth token');
      }

      this.logger.debug(`Token received: ${token.substring(0, 10)}...`);

      const worker = await this.workersService.findByToken(token);
      if (!worker) {
        this.logger.warn(`Connection rejected: Invalid auth token from ${client.handshake.address}`);
        this.logger.debug(`Token searched: ${token}`);
        const existingWorkers = await this.workersService.findAll();
        this.logger.debug(`Available workers: ${existingWorkers.length}`);
        existingWorkers.forEach(w => this.logger.debug(`  - ${w.name}: ${w.token.substring(0, 10)}...`));
        throw new WsException('Invalid auth token');
      }

      this.logger.log(`Worker connected: ${worker.name} (${worker.id})`);

      await this.workersService.updateStatus(worker.id, WorkerStatus.CONNECTED);

      const payload: WorkerRegisteredPayload = {
        workerId: worker.id,
        serverTime: new Date().toISOString(),
        config: {
          heartbeatInterval: 30000,
          taskTimeout: 60000,
        },
      };
      client.emit(WS_EVENTS.WORKER_REGISTERED, payload);

      client.join(worker.id);
      this.logger.log(`Worker ${worker.name} joined room ${worker.id}`);
    } catch (error: any) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
    if (token) {
      const worker = await this.workersService.findByToken(token);
      if (worker) {
        this.logger.log(`Worker disconnected: ${worker.name}`);
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
    const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
    const worker = await this.workersService.findByToken(token);
    if (worker) {
      await this.workersService.processHeartbeat(worker.id, payload);
    }
  }

  @SubscribeMessage(WS_EVENTS.NETWORK_CHANGED)
  async handleNetworkChanged(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
    if (token) {
      const worker = await this.workersService.findByToken(token);
      if (worker) {
        this.logger.log(
          `Network changed for worker ${worker.name}: ${payload.externalIp}`,
        );
        await this.workersService.processHeartbeat(worker.id, {
          status: 'idle',
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

  async sendTaskToWorker(workerId: string, payload: TaskAssignedPayload) {
    this.server.to(workerId).emit(WS_EVENTS.TASK_ASSIGNED, payload);
    this.logger.log(`Assigned task ${payload.taskId} to worker ${workerId}`);
  }

  @SubscribeMessage(WS_EVENTS.TASK_COMPLETED)
  async handleTaskCompleted(
    @MessageBody() payload: TaskCompletedDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Task ${payload.taskId} completed by worker ${client.id}`);
    this.logger.debug(`Payload: ${JSON.stringify(payload, null, 2)}`);

    try {
      // Normalize results - handle both single result and array of results
      let results: any[] = [];
      if (payload.results && Array.isArray(payload.results) && payload.results.length > 0) {
        results = payload.results;
        this.logger.log(`Task ${payload.taskId}: Received ${results.length} results`);
      } else if (payload.result) {
        results = [payload.result];
        this.logger.log(`Task ${payload.taskId}: Received 1 result`);
      } else {
        this.logger.warn(`Task ${payload.taskId}: No results received!`);
      }

      if (results.length > 0) {
        await this.tasksService.saveResults(payload.taskId, results.map(r => ({
          ...r,
          taskId: payload.taskId,
          scrapedAt: new Date(payload.completedAt),
        } as any)));
        this.logger.log(`Task ${payload.taskId}: Results saved successfully`);
      }

      // Update worker stats and status
      const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
      if (token) {
        const worker = await this.workersService.findByToken(token);
        if (worker) {
          await this.workersService.updateStatus(worker.id, WorkerStatus.CONNECTED);
          await this.workersService.incrementTasksCompleted(worker.id);
          this.logger.log(`Worker ${worker.name} status updated to CONNECTED and stats incremented`);
        }
      }
    } catch (error: any) {
      this.logger.error(
        `Failed to save task result for ${payload.taskId}: ${error.message}`,
        error.stack,
      );
      client.emit(WS_EVENTS.ERROR, {
        code: 'SAVE_FAILED',
        message: 'Failed to save task result',
        details: error.message,
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
    this.logger.debug(`Error details: ${JSON.stringify(payload.error)}`);

    try {
      await this.tasksService.updateStatus(
        payload.taskId,
        TaskStatus.FAILED,
        payload.error.message,
      );

      // Update worker stats
      const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
      if (token) {
        const worker = await this.workersService.findByToken(token);
        if (worker) {
          await this.workersService.updateStatus(worker.id, WorkerStatus.CONNECTED);
          await this.workersService.incrementTasksFailed(worker.id);
          this.logger.log(`Worker ${worker.name} stats updated after task failure`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to process task failure for ${payload.taskId}: ${error.message}`);
    }
  }
}
