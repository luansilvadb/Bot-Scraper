import { io, Socket } from 'socket.io-client';
import dotenv from 'dotenv';
import {
    WS_EVENTS,
    WorkerRegisteredPayload,
    WorkerHeartbeatDto
} from './types';

dotenv.config();

export class WebSocketClient {
    private socket: Socket;
    private isConnected: boolean = false;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private getHeartbeatData?: () => Promise<WorkerHeartbeatDto>;

    private readonly maxReconnectAttempts: number = 10;

    constructor(private serverUrl: string, private workerToken: string) {
        console.log(`[WS] Initializing WebSocket client for ${serverUrl}`);

        this.socket = io(`${serverUrl}/workers`, {
            query: { token: this.workerToken },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            autoConnect: false,
        });

        this.setupEventListeners();
    }

    public connect(): void {
        console.log('[WS] Connecting...');
        this.socket.connect();
    }

    public disconnect(): void {
        this.stopHeartbeat();
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    public emit(event: string, payload: any): void {
        if (this.isConnected) {
            this.socket.emit(event, payload);
        }
    }

    public on(event: string, callback: (...args: any[]) => void): void {
        this.socket.on(event, callback);
    }

    public setHeartbeatDataCallback(cb: () => Promise<WorkerHeartbeatDto>) {
        this.getHeartbeatData = cb;
    }

    private setupEventListeners(): void {
        this.socket.on('connect', () => {
            console.log(`[WS] Connected! Socket ID: ${this.socket.id}`);
            this.isConnected = true;
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`[WS] Disconnected: ${reason}`);
            this.isConnected = false;
            this.stopHeartbeat();
        });

        this.socket.on('connect_error', (error) => {
            //   console.error(`[WS] Connection Error: ${error.message}`);
        });

        this.socket.on(WS_EVENTS.WORKER_REGISTERED, (payload: WorkerRegisteredPayload) => {
            console.log(`[WS] Registered with server. ID: ${payload.workerId}`);
            this.startHeartbeat(payload.config.heartbeatInterval);
        });
    }

    private startHeartbeat(intervalMs: number) {
        this.stopHeartbeat();
        console.log(`[WS] Starting heartbeat every ${intervalMs}ms`);

        this.heartbeatInterval = setInterval(async () => {
            if (this.isConnected && this.getHeartbeatData) {
                try {
                    const data = await this.getHeartbeatData();
                    this.socket.emit(WS_EVENTS.WORKER_HEARTBEAT, data);
                } catch (err) {
                    console.error('[WS] Failed to generate heartbeat data:', err);
                }
            }
        }, intervalMs);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}
