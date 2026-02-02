import { Module } from '@nestjs/common';
import { WorkersGateway } from './workers.gateway';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';

import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [WorkersController],
  providers: [WorkersGateway, WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
