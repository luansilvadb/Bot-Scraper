import {
    Injectable,
    NotFoundException,
    Logger,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkerStatus } from './enums';
import { RegisterWorkerDto } from './dto/register-worker.dto';
import { WorkerHeartbeatDto } from './dto/ws-events.dto';
import { randomBytes } from 'crypto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { TasksService } from '../tasks/tasks.service';
import { WorkersGateway } from './workers.gateway';

@Injectable()
export class WorkersService {
    private readonly logger = new Logger(WorkersService.name);
    private readonly heartbeatTimeout: number;

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly tasksService: TasksService,
        @Inject(forwardRef(() => WorkersGateway))
        private readonly workersGateway: WorkersGateway,
    ) {
        this.heartbeatTimeout = this.configService.get<number>(
            'WS_HEARTBEAT_TIMEOUT',
            30000,
        );
    }

    /**
     * Attempt to dispatch pending tasks to idle workers
     * @param specificWorkerId Optional: if provided, only try to assign to this worker
     */
    async dispatchTask(specificWorkerId?: string) {
        // 1. Find next pending task
        const task = await this.tasksService.getNextPendingTask();
        if (!task) return; // No tasks pending

        // 2. Find idle worker
        let worker;
        if (specificWorkerId) {
            worker = await this.prisma.localWorker.findFirst({
                where: { id: specificWorkerId, status: WorkerStatus.CONNECTED },
            });
        } else {
            worker = await this.prisma.localWorker.findFirst({
                where: { status: WorkerStatus.CONNECTED },
                orderBy: { tasksCompletedCount: 'asc' }, // Load balancing strategy: least busy
            });
        }

        if (!worker) return; // No worker available

        // 3. Assign task
        await this.tasksService.assignTaskToWorker(task.id, worker.id);

        // 4. Update worker status (optimistic)
        await this.updateStatus(worker.id, WorkerStatus.BUSY);

        // 5. Emit to worker
        this.workersGateway.sendTaskToWorker(worker.id, {
            taskId: task.id,
            productUrl: task.productUrl,
            priority: task.priority,
            attemptNumber: task.attemptCount + 1,
            assignedAt: new Date().toISOString(),
        });
    }

    /**
     * Register a new worker via REST API
     */
    async register(dto: RegisterWorkerDto) {
        const token = randomBytes(32).toString('hex');

        return this.prisma.localWorker.create({
            data: {
                name: dto.name,
                token,
                status: WorkerStatus.DISCONNECTED,
            },
        });
    }

    async findAll() {
        return this.prisma.localWorker.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const worker = await this.prisma.localWorker.findUnique({
            where: { id },
        });
        if (!worker) throw new NotFoundException(`Worker ${id} not found`);
        return worker;
    }

    /**
     * Authenticate worker by token
     */
    async findByToken(token: string) {
        return this.prisma.localWorker.findUnique({
            where: { token },
        });
    }

    async updateStatus(id: string, status: WorkerStatus) {
        return this.prisma.localWorker.update({
            where: { id },
            data: { status, updatedAt: new Date() },
        });
    }

    async processHeartbeat(workerId: string, payload: WorkerHeartbeatDto) {
        // Map idle/busy to WorkerStatus enum
        let status: WorkerStatus = WorkerStatus.CONNECTED;
        if (payload.status === 'busy') status = WorkerStatus.BUSY;
        if (payload.status === 'blocked') status = WorkerStatus.BLOCKED;

        if (!payload.networkInfo) {
            this.logger.warn(`Worker ${workerId} sent heartbeat without networkInfo`);
        }

        try {
            await this.prisma.localWorker.update({
                where: { id: workerId },
                data: {
                    status,
                    lastHeartbeatAt: new Date(),
                    externalIp: payload.networkInfo?.externalIp,
                    ispName: payload.networkInfo?.ispName,
                    tasksCompletedCount: payload.stats?.tasksCompleted,
                    tasksFailedCount: payload.stats?.tasksFailed,
                },
            });

            // T050: Trigger dispatch if worker is idle
            if (status === WorkerStatus.CONNECTED) {
                // We use setImmediate to not block the heartbeat response
                setImmediate(() => this.dispatchTask(workerId));
            }
        } catch (error) {
            this.logger.error(
                `Failed to process heartbeat for worker ${workerId}: ${error.message}`,
            );
        }
    }

    async delete(id: string) {
        return this.prisma.localWorker.delete({
            where: { id },
        });
    }

    /**
     * Reset a worker's status to DISCONNECTED.
     * Useful if a worker is stuck in BUSY/BLOCKED state but is actually offline or needs a soft reset.
     */
    async resetWorker(id: string) {
        const worker = await this.findOne(id); // Ensure exists

        this.logger.log(`Manual reset triggered for worker ${worker.name} (${id})`);

        return this.prisma.localWorker.update({
            where: { id },
            data: {
                status: WorkerStatus.DISCONNECTED,
                updatedAt: new Date(),
            },
        });
    }

    /**
     * Periodic queue processing
     */
    @Cron(CronExpression.EVERY_5_SECONDS)
    async dispatchQueue() {
        // Try to dispatch to any available worker
        await this.dispatchTask();
    }

    /**
     * Check for workers that haven't sent heartbeat recently
     */
    @Cron(CronExpression.EVERY_10_SECONDS)
    async checkHeartbeatTimeouts() {
        const timeoutThreshold = new Date(Date.now() - this.heartbeatTimeout);

        const timedOutWorkers = await this.prisma.localWorker.findMany({
            where: {
                status: { in: [WorkerStatus.CONNECTED, WorkerStatus.BUSY] },
                lastHeartbeatAt: { lt: timeoutThreshold },
            },
        });

        if (timedOutWorkers.length > 0) {
            this.logger.log(`Detected ${timedOutWorkers.length} timed out workers`);

            await this.prisma.localWorker.updateMany({
                where: {
                    id: { in: timedOutWorkers.map((w) => w.id) },
                },
                data: {
                    status: WorkerStatus.DISCONNECTED,
                },
            });
        }
    }
}
