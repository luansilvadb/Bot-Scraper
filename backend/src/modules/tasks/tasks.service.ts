import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from '../workers/enums';
import { TaskResultDto } from './dto/task-result.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

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
        include: {
          result: true,
          assignedWorker: {
            select: { id: true, name: true },
          },
        },
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
    let newStatus = TaskStatus.PENDING;

    if (newAttemptCount >= task.maxAttempts) {
      newStatus = TaskStatus.PERMANENTLY_FAILED;
    }

    return this.prisma.scrapingTask.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        attemptCount: newAttemptCount,
        errorMessage: error,
        assignedWorkerId:
          newStatus === TaskStatus.PENDING ? null : task.assignedWorkerId,
        updatedAt: new Date(),
        completedAt:
          newStatus === TaskStatus.PERMANENTLY_FAILED ? new Date() : undefined,
      },
    });
  }

  async reassignOrphanedTasks(workerId: string) {
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

  async saveResults(taskId: string, results: TaskResultDto[]) {
    const task = await this.findOne(taskId);

    return this.prisma.$transaction(async (tx) => {
      for (const res of results) {
        // If it was a broad search/bot task, we also update the main ScrapedProduct table
        if (task.botId) {
          const discount = res.originalPrice && res.price
            ? Math.round(((Number(res.originalPrice) - Number(res.price)) / Number(res.originalPrice)) * 100)
            : 0;

          const productStatus = discount >= 80 ? ProductStatus.PENDING_APPROVAL : ProductStatus.APPROVED;

          await tx.scrapedProduct.upsert({
            where: { asin: res.asin || 'unknown' },
            update: {
              title: res.productTitle,
              currentPrice: Number(res.price),
              originalPrice: Number(res.originalPrice || res.price),
              discountPercentage: discount,
              imageUrl: res.imageUrls?.[0] || '',
              productUrl: res.productUrl || task.productUrl,
              foundAt: new Date(),
            },
            create: {
              asin: res.asin || `unknown-${Date.now()}`,
              title: res.productTitle,
              currentPrice: Number(res.price),
              originalPrice: Number(res.originalPrice || res.price),
              discountPercentage: discount,
              imageUrl: res.imageUrls?.[0] || '',
              productUrl: res.productUrl || task.productUrl,
              botId: task.botId,
              status: productStatus,
            },
          });
        }
      }

      // If there's at least one result, save the first one as representative result for the Task
      if (results.length > 0) {
        const first = results[0];
        await tx.scrapingResult.upsert({
          where: { taskId },
          update: {
            productTitle: first.productTitle,
            price: first.price,
            asin: first.asin,
            scrapedAt: new Date(first.scrapedAt),
          },
          create: {
            taskId,
            productTitle: first.productTitle,
            price: first.price,
            asin: first.asin,
            scrapedAt: new Date(first.scrapedAt),
          },
        });
      }

      await tx.scrapingTask.update({
        where: { id: taskId },
        data: {
          status: TaskStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    });
  }

  async saveResult(taskId: string, resultData: TaskResultDto) {
    return this.saveResults(taskId, [resultData]);
  }
}
