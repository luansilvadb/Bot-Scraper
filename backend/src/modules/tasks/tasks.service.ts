import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from '../workers/enums';
import { TaskResultDto } from './dto/task-result.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.scrapingTask.create({
      data: {
        productUrl: createTaskDto.productUrl,
        priority: createTaskDto.priority || 0,
        status: TaskStatus.PENDING,
      },
    });
  }

  async createBatch(dtos: { productUrl: string; priority?: number }[]) {
    return this.prisma.$transaction(
      dtos.map((dto) =>
        this.prisma.scrapingTask.create({
          data: {
            productUrl: dto.productUrl,
            priority: dto.priority || 0,
            status: TaskStatus.PENDING,
          },
        }),
      ),
    );
  }

  async findAll(query: {
    status?: TaskStatus;
    workerId?: string;
    limit?: number;
    page?: number;
  }) {
    const { status, workerId, limit = 20, page = 1 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (workerId) where.assignedWorkerId = workerId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.scrapingTask.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: { result: true },
      }),
      this.prisma.scrapingTask.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async delete(id: string) {
    return this.prisma.scrapingTask.delete({ where: { id } });
  }

  async retry(id: string) {
    return this.prisma.scrapingTask.update({
      where: { id },
      data: {
        status: TaskStatus.PENDING,
        errorMessage: null,
        errorType: null,
        updatedAt: new Date(),
        // We don't reset attemptCount so we track total attempts,
        // OR we could reset if it was permanently failed.
        // For MVP manual retry, let's keep attempt count but ensure it's runnable.
        // If maxAttempts is hit, maybe we should increase maxAttempts or reset count?
        // Let's reset attempt count for manual retry to ensure it runs.
        attemptCount: 0,
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.scrapingTask.findUnique({
      where: { id },
      include: {
        result: true,
        assignedWorker: {
          select: { id: true, name: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async getNextPendingTask() {
    return this.prisma.scrapingTask.findFirst({
      where: { status: TaskStatus.PENDING },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async assignTaskToWorker(taskId: string, workerId: string) {
    return this.prisma.scrapingTask.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.IN_PROGRESS,
        assignedWorkerId: workerId,
        startedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async markAsFailed(taskId: string, error: string) {
    const task = await this.prisma.scrapingTask.findUnique({
      where: { id: taskId },
    });
    if (!task) return;

    const newAttemptCount = task.attemptCount + 1;
    let newStatus = TaskStatus.PENDING; // Retry by default

    // Check max attempts
    if (newAttemptCount >= task.maxAttempts) {
      newStatus = TaskStatus.PERMANENTLY_FAILED;
    }

    // Update
    return this.prisma.scrapingTask.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        attemptCount: newAttemptCount,
        errorMessage: error,
        // If retrying, reset worker assignment so any worker can pick it up
        assignedWorkerId:
          newStatus === TaskStatus.PENDING ? null : task.assignedWorkerId,
        updatedAt: new Date(),
        completedAt:
          newStatus === TaskStatus.PERMANENTLY_FAILED ? new Date() : undefined,
      },
    });
  }

  async reassignOrphanedTasks(workerId: string) {
    // Find tasks assigned to this worker that are still IN_PROGRESS
    // and move them back to PENDING
    return this.prisma.scrapingTask.updateMany({
      where: {
        assignedWorkerId: workerId,
        status: TaskStatus.IN_PROGRESS,
      },
      data: {
        status: TaskStatus.PENDING,
        assignedWorkerId: null,
      },
    });
  }

  async updateStatus(id: string, status: TaskStatus, errorMessage?: string) {
    // Wrapper to handle failure logic specifically if status is FAILED
    if (status === TaskStatus.FAILED && errorMessage) {
      return this.markAsFailed(id, errorMessage);
    }

    return this.prisma.scrapingTask.update({
      where: { id },
      data: {
        status,
        errorMessage: errorMessage || null,
        updatedAt: new Date(),
        startedAt: status === TaskStatus.IN_PROGRESS ? new Date() : undefined,
        completedAt: status === TaskStatus.COMPLETED ? new Date() : undefined,
      },
    });
  }

  async saveResult(taskId: string, resultData: TaskResultDto) {
    // Transaction to ensure task is marked completed and result is saved
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the result
      const result = await tx.scrapingResult.create({
        data: {
          taskId,
          productTitle: resultData.productTitle,
          price: resultData.price,
          currency: resultData.currency,
          originalPrice: resultData.originalPrice,
          rating: resultData.rating,
          reviewCount: resultData.reviewCount,
          availability: resultData.availability,
          isAvailable: resultData.isAvailable,
          imageUrls: resultData.imageUrls,
          asin: resultData.asin,
          scrapedAt: new Date(resultData.scrapedAt),
        },
      });

      // 2. Mark task as COMPLETED
      const task = await tx.scrapingTask.update({
        where: { id: taskId },
        data: {
          status: TaskStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      return { task, result };
    });
  }
}
