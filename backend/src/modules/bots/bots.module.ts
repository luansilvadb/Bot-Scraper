import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [ScrapingModule],
  controllers: [BotsController],
  providers: [BotsService, ConfigService],
})
export class BotsModule {}
