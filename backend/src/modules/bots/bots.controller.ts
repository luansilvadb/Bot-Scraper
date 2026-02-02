import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bots')
@UseGuards(AuthGuard)
export class BotsController {
    constructor(private readonly botsService: BotsService) { }

    @Post()
    create(@Body() createBotDto: Prisma.BotCreateInput) {
        return this.botsService.create(createBotDto);
    }

    @Get()
    findAll() {
        return this.botsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.botsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBotDto: Prisma.BotUpdateInput) {
        return this.botsService.update(id, updateBotDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.botsService.remove(id);
    }

    @Post(':id/trigger')
    trigger(@Param('id') id: string) {
        return this.botsService.trigger(id);
    }
}
