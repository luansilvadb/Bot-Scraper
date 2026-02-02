import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { RegisterWorkerDto } from './dto/register-worker.dto';
import { WorkerStatusDto } from './dto/worker-status.dto';

@Controller('api/workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  async register(@Body() registerWorkerDto: RegisterWorkerDto) {
    const worker = await this.workersService.register(registerWorkerDto);
    return worker;
  }

  @Get()
  async findAll() {
    const workers = await this.workersService.findAll();
    return workers;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const worker = await this.workersService.findOne(id);
    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }
    return worker;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.workersService.findOne(id); // Check existence
    return this.workersService.delete(id);
  }

  @Post(':id/reset')
  async reset(@Param('id') id: string) {
    return this.workersService.resetWorker(id);
  }
}
