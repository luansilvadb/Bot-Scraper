import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    findAll() {
        return this.settingsService.findAll();
    }

    @Post()
    upsert(@Body() data: { key: string; value: string }) {
        return this.settingsService.upsert(data.key, data.value);
    }
}
