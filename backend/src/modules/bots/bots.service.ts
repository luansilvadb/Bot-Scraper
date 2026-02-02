import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Bot, Prisma } from '@prisma/client';
import { ScrapingService } from '../scraping/scraping.service';
import { BotQueryDto, CreateBotDto, UpdateBotDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class BotsService {
  constructor(
    private prisma: PrismaService,
    private scrapingService: ScrapingService,
  ) { }

  async create(data: CreateBotDto): Promise<Bot> {
    const bot = await this.prisma.bot.create({
      data: {
        name: data.name,
        targetUrl: data.targetUrl,
        affiliateTag: data.affiliateTag,
        telegramToken: data.telegramToken,
        chatId: data.chatId,
        scheduleCron: data.scheduleCron,
        status: data.status,
      },
    });
    if (bot.status === 'ACTIVE') {
      await this.scrapingService.scheduleBot(bot.id, bot.scheduleCron);
    }
    return bot;
  }

  async findAll(): Promise<Bot[]> {
    return this.prisma.bot.findMany();
  }

  async findAllPaginated(
    query: BotQueryDto,
  ): Promise<PaginatedResponseDto<Bot>> {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BotWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.bot.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bot.count({ where }),
    ]);

    return PaginatedResponseDto.create(data, total, page, limit);
  }

  async findOne(id: string): Promise<Bot> {
    const bot = await this.prisma.bot.findUnique({
      where: { id },
    });
    if (!bot) throw new NotFoundException('Bot not found');
    return bot;
  }

  async update(id: string, data: UpdateBotDto): Promise<Bot> {
    // Check if bot exists
    await this.findOne(id);

    const updateData: Prisma.BotUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.targetUrl && { targetUrl: data.targetUrl }),
      ...(data.affiliateTag && { affiliateTag: data.affiliateTag }),
      ...(data.telegramToken && { telegramToken: data.telegramToken }),
      ...(data.chatId && { chatId: data.chatId }),
      ...(data.scheduleCron && { scheduleCron: data.scheduleCron }),
      ...(data.status && { status: data.status }),
    };

    const bot = await this.prisma.bot.update({
      where: { id },
      data: updateData,
    });

    if (bot.status === 'ACTIVE') {
      await this.scrapingService.scheduleBot(bot.id, bot.scheduleCron);
    } else {
      await this.scrapingService.unscheduleBot(bot.id);
    }

    return bot;
  }

  async remove(id: string): Promise<Bot> {
    // Check if bot exists
    await this.findOne(id);

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
