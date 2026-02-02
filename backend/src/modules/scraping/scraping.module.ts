import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScrapingService } from './scraping.service';
import { PlaywrightService } from './playwright.service';
import { AmazonScraper } from './scrapers/amazon.scraper';
import { ProfitFilter } from './logic/profit-filter';
import { ScrapingProcessor } from './scraping.processor';
import { QueueModule } from '../../common/queues/queue.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    imports: [
        QueueModule,
        BullModule.registerQueue({
            name: 'scraping',
        }),
    ],
    providers: [
        ScrapingService,
        PlaywrightService,
        AmazonScraper,
        ProfitFilter,
        ScrapingProcessor,
        PrismaService
    ],
    exports: [ScrapingService, PlaywrightService],
})
export class ScrapingModule { }
