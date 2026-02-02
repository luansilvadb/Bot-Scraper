import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { BatchCreateTaskDto } from './dto/batch-create-task.dto';
import { TaskStatus } from '../workers/enums';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Post('batch')
  createBatch(@Body() dto: BatchCreateTaskDto) {
    return this.tasksService.createBatch(dto.tasks);
  }

  @Get()
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('workerId') workerId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.tasksService.findAll({ status, workerId, page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  @Post(':id/retry')
  retry(@Param('id') id: string) {
    return this.tasksService.retry(id);
  }
}
