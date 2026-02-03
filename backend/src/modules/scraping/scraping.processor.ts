import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';

@Processor('scraping')
export class ScrapingProcessor extends WorkerHost {
  private readonly logger = new Logger(ScrapingProcessor.name);

  constructor(
    private prisma: PrismaService,
    private tasksService: TasksService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { botId } = job.data;
    this.logger.log('=============================================');
    this.logger.log(`BULLMQ JOB STARTED - Bot: ${botId}`);
    this.logger.log(`Job ID: ${job.id}`);
    this.logger.log(`Job Name: ${job.name}`);
    this.logger.log(`Job Data: ${JSON.stringify(job.data)}`);

    try {
      const bot = await this.prisma.bot.findUnique({
        where: { id: botId },
      });

      if (!bot) {
        this.logger.error(`Bot ${botId} not found`);
        this.logger.log('=============================================');
        return { error: 'Bot not found' };
      }

      this.logger.log(`Bot found: ${bot.name} (${bot.id})`);
      this.logger.log(`Bot status: ${bot.status}`);
      this.logger.log(`Bot target URL: ${bot.targetUrl}`);

      if (bot.status !== 'ACTIVE') {
        this.logger.warn(`Bot ${botId} is not ACTIVE. Status: ${bot.status}. Skipping.`);
        this.logger.log('=============================================');
        return { error: `Bot is ${bot.status}` };
      }

      this.logger.log(`Creating delegated scraping task for bot ${bot.name} (${bot.id})`);

      // Create a task that will be picked up by the WorkersService cron and sent to a worker
      const task = await this.prisma.scrapingTask.create({
        data: {
          productUrl: bot.targetUrl,
          priority: 10, // High priority for bot-triggered tasks
          botId: bot.id,
          status: 'PENDING',
        },
      });

      this.logger.log(`SUCCESS! Task ${task.id} created successfully`);
      this.logger.log(`Task URL: ${task.productUrl}`);
      this.logger.log(`Task Status: ${task.status}`);
      this.logger.log(`Task Priority: ${task.priority}`);
      this.logger.log('=============================================');

      return { taskId: task.id, status: 'PENDING' };
    } catch (error) {
      this.logger.error(`Error processing job for bot ${botId}: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      this.logger.log('=============================================');
      throw error;
    }
  }
}
