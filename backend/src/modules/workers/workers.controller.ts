import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { RegisterWorkerDto } from './dto/register-worker.dto';
import { WorkerStatusDto } from './dto/worker-status.dto';

@Controller('api/workers')
export class WorkersController {
  private readonly logger = new Logger(WorkersController.name);

  constructor(private readonly workersService: WorkersService) { }

  @Post()
  async register(@Body() registerWorkerDto: RegisterWorkerDto) {
    this.logger.log('=============================================');
    this.logger.log('REGISTERING NEW WORKER');
    this.logger.log(`Worker name: ${registerWorkerDto.name}`);
    
    const worker = await this.workersService.register(registerWorkerDto);
    
    this.logger.log(`Worker registered successfully!`);
    this.logger.log(`Worker ID: ${worker.id}`);
    this.logger.log(`Worker Token: ${worker.token}`);
    this.logger.log(`IMPORTANT: Save this token in your worker/.env file!`);
    this.logger.log('=============================================');
    
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

  /**
   * Regenerate token for an existing worker.
   * The old token is immediately invalidated.
   */
  @Post(':id/regenerate-token')
  async regenerateToken(@Param('id') id: string) {
    return this.workersService.regenerateToken(id);
  }

  /**
   * Get the current token for a worker.
   * Use sparingly - prefer regeneration for lost tokens.
   */
  @Get(':id/token')
  async getToken(@Param('id') id: string) {
    return this.workersService.getToken(id);
  }
}
