import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ScrapingService {
  constructor(@InjectQueue('scraping') private scrapingQueue: Queue) {}

  async scheduleBot(botId: string, cron: string) {
    await this.scrapingQueue.add(
      'scrape',
      { botId },
      {
        repeat: { pattern: cron },
        jobId: `bot-${botId}`,
      },
    );
  }

  async unscheduleBot(botId: string) {
    const repeatableJobs = await this.scrapingQueue.getRepeatableJobs();
    const job = repeatableJobs.find((j) => j.id === `bot-${botId}`);
    if (job) {
      await this.scrapingQueue.removeRepeatableByKey(job.key);
    }
  }

  async triggerNow(botId: string) {
    await this.scrapingQueue.add('scrape', { botId });
  }
}
