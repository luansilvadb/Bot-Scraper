import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScrapingService } from './scraping.service';
import { ProfitFilter } from './logic/profit-filter';
import { ScrapingProcessor } from './scraping.processor';
import { QueueModule } from '../../common/queues/queue.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    QueueModule,
    BullModule.registerQueue({
      name: 'scraping',
    }),
    forwardRef(() => TasksModule),
  ],
  providers: [
    ScrapingService,
    ProfitFilter,
    ScrapingProcessor,
  ],
  exports: [ScrapingService, ProfitFilter],
})
export class ScrapingModule { }
