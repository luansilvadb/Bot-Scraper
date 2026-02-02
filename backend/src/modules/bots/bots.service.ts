import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Bot, Prisma } from '@prisma/client';
import { ScrapingService } from '../scraping/scraping.service';

@Injectable()
export class BotsService {
    constructor(
        private prisma: PrismaService,
        private scrapingService: ScrapingService,
    ) { }

    async create(data: Prisma.BotCreateInput): Promise<Bot> {
        const bot = await this.prisma.bot.create({
            data,
        });
        if (bot.status === 'ACTIVE') {
            await this.scrapingService.scheduleBot(bot.id, bot.scheduleCron);
        }
        return bot;
    }

    async findAll(): Promise<Bot[]> {
        return this.prisma.bot.findMany({
            include: { proxy: true },
        });
    }

    async findOne(id: string): Promise<Bot> {
        const bot = await this.prisma.bot.findUnique({
            where: { id },
            include: { proxy: true },
        });
        if (!bot) throw new NotFoundException('Bot not found');
        return bot;
    }

    async update(id: string, data: Prisma.BotUpdateInput): Promise<Bot> {
        const bot = await this.prisma.bot.update({
            where: { id },
            data,
        });

        if (bot.status === 'ACTIVE') {
            await this.scrapingService.scheduleBot(bot.id, bot.scheduleCron);
        } else {
            await this.scrapingService.unscheduleBot(bot.id);
        }

        return bot;
    }

    async remove(id: string): Promise<Bot> {
        const bot = await this.prisma.bot.delete({
            where: { id },
        });
        await this.scrapingService.unscheduleBot(bot.id);
        return bot;
    }

    async trigger(id: string) {
        return this.scrapingService.triggerNow(id);
    }
}
