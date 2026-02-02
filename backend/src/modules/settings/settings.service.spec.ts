import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: PrismaService;

  const mockSetting = {
    key: 'TELEGRAM_TOKEN',
    value: '123456:ABC-DEF',
  };

  const mockPrismaService = {
    systemSetting: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated settings', async () => {
      mockPrismaService.systemSetting.findMany.mockResolvedValue([mockSetting]);
      mockPrismaService.systemSetting.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual([mockSetting]);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by search term', async () => {
      mockPrismaService.systemSetting.findMany.mockResolvedValue([]);
      mockPrismaService.systemSetting.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, search: 'TOKEN' });

      expect(mockPrismaService.systemSetting.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { key: { contains: 'TOKEN', mode: 'insensitive' } },
        }),
      );
    });
  });

  describe('findByKey', () => {
    it('should return a setting by key', async () => {
      mockPrismaService.systemSetting.findUnique.mockResolvedValue(mockSetting);

      const result = await service.findByKey('TELEGRAM_TOKEN');

      expect(result).toEqual(mockSetting);
    });

    it('should throw NotFoundException if setting does not exist', async () => {
      mockPrismaService.systemSetting.findUnique.mockResolvedValue(null);

      await expect(service.findByKey('NON_EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('upsert', () => {
    it('should upsert a setting', async () => {
      mockPrismaService.systemSetting.upsert.mockResolvedValue(mockSetting);

      const result = await service.upsert({
        key: 'TELEGRAM_TOKEN',
        value: 'new-value',
      });

      expect(result).toEqual(mockSetting);
      expect(mockPrismaService.systemSetting.upsert).toHaveBeenCalledWith({
        where: { key: 'TELEGRAM_TOKEN' },
        update: { value: 'new-value' },
        create: { key: 'TELEGRAM_TOKEN', value: 'new-value' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a setting', async () => {
      mockPrismaService.systemSetting.findUnique.mockResolvedValue(mockSetting);
      mockPrismaService.systemSetting.delete.mockResolvedValue(mockSetting);

      const result = await service.remove('TELEGRAM_TOKEN');

      expect(result).toEqual(mockSetting);
    });

    it('should throw NotFoundException if trying to delete non-existent setting', async () => {
      mockPrismaService.systemSetting.findUnique.mockResolvedValue(null);

      await expect(service.remove('NON_EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
