import { EventEmitter } from 'events';
import { WorkerStatus, ConnectionState, CurrentTask, DEFAULT_WORKER_STATUS } from '../types';

export class WorkerState extends (EventEmitter as { new(): any }) {
    private state: WorkerStatus;
    private static instance: WorkerState;
    private startTime: number;

    private constructor() {
        super();
        this.state = { ...DEFAULT_WORKER_STATUS };
        this.startTime = Date.now();
    }

    public static getInstance(): WorkerState {
        if (!WorkerState.instance) {
            WorkerState.instance = new WorkerState();
        }
        return WorkerState.instance;
    }

    public getUptime(): number {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    public getStatus(): WorkerStatus {
        return { ...this.state };
    }

    public setConnectionState(connectionState: ConnectionState) {
        if (this.state.connectionState !== connectionState) {
            this.state.connectionState = connectionState;
            this.emitChange();
        }
    }

    public setWorkerId(workerId: string | null) {
        this.state.workerId = workerId;
        if (workerId) {
            this.state.connectedAt = new Date().toISOString();
        }
        this.emitChange();
    }

    public setTasksStats(completed: number, failed: number) {
        this.state.tasksCompleted = completed;
        this.state.tasksFailed = failed;
        this.emitChange();
    }

    public setCurrentTask(task: CurrentTask | null) {
        this.state.currentTask = task;
        if (task) {
            this.setConnectionState('WORKING');
        } else if (this.state.connectionState === 'WORKING') {
            this.setConnectionState('CONNECTED');
        }
        this.emitChange();
    }

    public updateTaskProgress(progress: string) {
        if (this.state.currentTask) {
            this.state.currentTask.progress = progress;
            this.emitChange();
        }
    }

    public setNetworkInfo(ip: string, isp: string) {
        this.state.externalIp = ip;
        this.state.ispName = isp;
        this.emitChange();
    }

    public setPaused(isPaused: boolean) {
        this.state.isPaused = isPaused;
        this.emitChange();
    }

    public setError(error: string | null) {
        this.state.lastError = error;
        if (error) {
            this.setConnectionState('ERROR');
        }
        this.emitChange();
    }

    public resetStats() {
        this.state.tasksCompleted = 0;
        this.state.tasksFailed = 0;
        this.emitChange();
    }

    private emitChange() {
        this.emit('change', this.getStatus());
    }

    // Add explicit on method if needed, or rely on any cast
    public on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}

export const getWorkerState = () => WorkerState.getInstance();
