import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlaywrightService } from './playwright.service';
import { AmazonScraper } from './scrapers/amazon.scraper';
import { ProfitFilter } from './logic/profit-filter';

@Processor('scraping')
export class ScrapingProcessor extends WorkerHost {
  private readonly logger = new Logger(ScrapingProcessor.name);

  constructor(
    private prisma: PrismaService,
    private playwright: PlaywrightService,
    private amazonScraper: AmazonScraper,
    private profitFilter: ProfitFilter,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { botId } = job.data;
    this.logger.log(`Processing scraping job for bot: ${botId}`);

    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      this.logger.error(`Bot ${botId} not found`);
      return;
    }

    if (bot.status !== 'ACTIVE') {
      this.logger.warn(`Bot ${botId} is not ACTIVE. Skipping.`);
      return;
    }

    const context = await this.playwright.createContext();
    const page = await context.newPage();

    try {
      const products = await this.amazonScraper.scrape(page, bot.targetUrl);

      for (const product of products) {
        const status = this.profitFilter.evaluate(product.discountPercentage);

        await this.prisma.scrapedProduct.upsert({
          where: { asin: product.asin },
          update: {
            currentPrice: product.currentPrice,
            originalPrice: product.originalPrice,
            discountPercentage: product.discountPercentage,
            status: status, // Update status if it's found again with high discount
          },
          create: {
            ...product,
            botId: bot.id,
            status: status,
          },
        });
      }

      this.logger.log(
        `Successfully processed ${products.length} products for bot ${bot.name}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to scrape for bot ${bot.name}: ${error.message}`,
      );
      throw error;
    } finally {
      await context.close();
    }
  }
}
