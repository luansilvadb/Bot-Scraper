import { Test, TestingModule } from '@nestjs/testing';
import { BotsService } from './bots.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ScrapingService } from '../scraping/scraping.service';
import { NotFoundException } from '@nestjs/common';
import { BotStatus } from '@prisma/client';

describe('BotsService', () => {
  let service: BotsService;
  let prisma: PrismaService;
  let scrapingService: ScrapingService;

  const mockBot = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Bot',
    targetUrl: 'https://example.com',
    affiliateTag: 'test-tag',
    telegramToken: 'test-token',
    chatId: 'test-chat',
    scheduleCron: '*/5 * * * *',
    status: BotStatus.ACTIVE,
    createdAt: new Date(),
  };

  const mockPrismaService = {
    bot: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockScrapingService = {
    scheduleBot: jest.fn(),
    unscheduleBot: jest.fn(),
    triggerNow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ScrapingService, useValue: mockScrapingService },
      ],
    }).compile();

    service = module.get<BotsService>(BotsService);
    prisma = module.get<PrismaService>(PrismaService);
    scrapingService = module.get<ScrapingService>(ScrapingService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a bot and schedule if active', async () => {
      mockPrismaService.bot.create.mockResolvedValue(mockBot);

      const result = await service.create({
        name: 'Test Bot',
        targetUrl: 'https://example.com',
        affiliateTag: 'test-tag',
        telegramToken: 'test-token',
        chatId: 'test-chat',
        scheduleCron: '*/5 * * * *',
      });

      expect(result).toEqual(mockBot);
      expect(mockScrapingService.scheduleBot).toHaveBeenCalledWith(
        mockBot.id,
        mockBot.scheduleCron,
      );
    });

    it('should not schedule if bot is paused', async () => {
      const pausedBot = { ...mockBot, status: BotStatus.PAUSED };
      mockPrismaService.bot.create.mockResolvedValue(pausedBot);

      await service.create({
        name: 'Test Bot',
        targetUrl: 'https://example.com',
        affiliateTag: 'test-tag',
        telegramToken: 'test-token',
        chatId: 'test-chat',
        scheduleCron: '*/5 * * * *',
        status: BotStatus.PAUSED,
      });

      expect(mockScrapingService.scheduleBot).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a bot by id', async () => {
      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);

      const result = await service.findOne(mockBot.id);

      expect(result).toEqual(mockBot);
    });

    it('should throw NotFoundException if bot not found', async () => {
      mockPrismaService.bot.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated bots', async () => {
      const bots = [mockBot];
      mockPrismaService.bot.findMany.mockResolvedValue(bots);
      mockPrismaService.bot.count.mockResolvedValue(1);

      const result = await service.findAllPaginated({ page: 1, limit: 10 });

      expect(result.data).toEqual(bots);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrismaService.bot.findMany.mockResolvedValue([]);
      mockPrismaService.bot.count.mockResolvedValue(0);

      await service.findAllPaginated({
        page: 1,
        limit: 10,
        status: BotStatus.ACTIVE,
      });

      expect(mockPrismaService.bot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: BotStatus.ACTIVE },
        }),
      );
    });

    it('should filter by search term', async () => {
      mockPrismaService.bot.findMany.mockResolvedValue([]);
      mockPrismaService.bot.count.mockResolvedValue(0);

      await service.findAllPaginated({
        page: 1,
        limit: 10,
        search: 'test',
      });

      expect(mockPrismaService.bot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: 'test', mode: 'insensitive' } },
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a bot and reschedule if active', async () => {
      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);
      mockPrismaService.bot.update.mockResolvedValue(mockBot);

      const result = await service.update(mockBot.id, { name: 'Updated Bot' });

      expect(result).toEqual(mockBot);
      expect(mockScrapingService.scheduleBot).toHaveBeenCalled();
    });

    it('should unschedule if bot is paused', async () => {
      const pausedBot = { ...mockBot, status: BotStatus.PAUSED };
      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);
      mockPrismaService.bot.update.mockResolvedValue(pausedBot);

      await service.update(mockBot.id, { status: BotStatus.PAUSED });

      expect(mockScrapingService.unscheduleBot).toHaveBeenCalledWith(
        mockBot.id,
      );
    });
  });

  describe('remove', () => {
    it('should delete a bot and unschedule', async () => {
      mockPrismaService.bot.findUnique.mockResolvedValue(mockBot);
      mockPrismaService.bot.delete.mockResolvedValue(mockBot);

      const result = await service.remove(mockBot.id);

      expect(result).toEqual(mockBot);
      expect(mockScrapingService.unscheduleBot).toHaveBeenCalledWith(
        mockBot.id,
      );
    });
  });

  describe('trigger', () => {
    it('should trigger scraping for a bot', async () => {
      mockScrapingService.triggerNow.mockResolvedValue({ jobId: 'test-job' });

      const result = await service.trigger(mockBot.id);

      expect(result).toEqual({ jobId: 'test-job' });
      expect(mockScrapingService.triggerNow).toHaveBeenCalledWith(mockBot.id);
    });
  });
});
