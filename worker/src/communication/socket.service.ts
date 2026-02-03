import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { io, Socket } from 'socket.io-client';
import { WS_EVENTS } from '../types';

@Injectable()
export class SocketService implements OnModuleInit, OnModuleDestroy {
    private socket: Socket;
    private readonly logger = new Logger(SocketService.name);

    constructor(private configService: ConfigService) { }

  onModuleInit() {
    const backendUrl = this.configService.get<string>('backendUrl');
    const token = this.configService.get<string>('workerToken');

    if (!backendUrl) {
      this.logger.error('BACKEND_URL environment variable is not set!');
      process.exit(1);
    }

    if (!token) {
      this.logger.error('WORKER_TOKEN environment variable is not set!');
      process.exit(1);
    }

    // Connect to backend with namespace 'workers'
    // The namespace should be part of the path, not appended to the URL
    this.logger.log(`Connecting to backend at ${backendUrl} (namespace: workers)`);

    this.socket = io(`${backendUrl}/workers`, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      this.logger.log('=============================================');
      this.logger.log('SUCCESSFULLY CONNECTED TO BACKEND!');
      this.logger.log(`Socket ID: ${this.socket.id}`);
      this.logger.log('=============================================');
    });

    this.socket.on(WS_EVENTS.WORKER_REGISTERED, (data) => {
      this.logger.log('Worker registered successfully');
      this.logger.log(`Server time: ${data.serverTime}`);
      this.logger.log(`Heartbeat interval: ${data.config.heartbeatInterval}ms`);
      this.logger.log(`Task timeout: ${data.config.taskTimeout}ms`);
    });

    this.socket.on(WS_EVENTS.TASK_ASSIGNED, (data) => {
      this.logger.log('=============================================');
      this.logger.log('NEW TASK RECEIVED!');
      this.logger.log(`Task ID: ${data.taskId}`);
      this.logger.log(`URL: ${data.productUrl}`);
      this.logger.log(`Priority: ${data.priority}`);
      this.logger.log(`Assigned at: ${data.assignedAt}`);
      this.logger.log('=============================================');
    });

        this.socket.on('disconnect', () => {
            this.logger.warn('Disconnected from backend');
        });

        this.socket.on('connect_error', (error) => {
            this.logger.error(`Connection error: ${error.message}`);
        });
    }

    onModuleDestroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    on(event: string, callback: (...args: any[]) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }
}
