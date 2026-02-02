import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, ConfigService],
  exports: [SettingsService],
})
export class SettingsModule {}
