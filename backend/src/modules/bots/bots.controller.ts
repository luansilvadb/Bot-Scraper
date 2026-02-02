import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBotDto, UpdateBotDto, BotQueryDto } from './dto';

@Controller('bots')
@UseGuards(AuthGuard)
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post()
  create(@Body() createBotDto: CreateBotDto) {
    return this.botsService.create(createBotDto);
  }

  @Get()
  findAll(@Query() query: BotQueryDto) {
    // If pagination params provided, use paginated method
    if (query.page || query.limit || query.status || query.search) {
      return this.botsService.findAllPaginated(query);
    }
    // Otherwise return all for backward compatibility
    return this.botsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.botsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBotDto: UpdateBotDto,
  ) {
    return this.botsService.update(id, updateBotDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.botsService.remove(id);
  }

  @Post(':id/trigger')
  trigger(@Param('id', ParseUUIDPipe) id: string) {
    return this.botsService.trigger(id);
  }
}
