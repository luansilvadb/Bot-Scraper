import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [forwardRef(() => ScrapingModule)],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule { }
