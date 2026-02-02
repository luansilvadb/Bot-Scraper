import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramPoster } from '../telegram/poster.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductStatus } from '@prisma/client';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;
  let telegramPoster: TelegramPoster;

  const mockBot = {
    id: 'bot-123',
    name: 'Test Bot',
    chatId: '-1001234567890',
    affiliateTag: 'test-tag',
  };

  const mockProduct = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    asin: 'B0TESTPROD1',
    title: 'Test Product',
    currentPrice: 49.99,
    originalPrice: 99.99,
    discountPercentage: 50,
    imageUrl: 'https://example.com/image.jpg',
    productUrl: 'https://amazon.com/dp/B0TESTPROD1',
    status: ProductStatus.PENDING_APPROVAL,
    botId: 'bot-123',
    foundAt: new Date(),
    expiresAt: null,
    bot: mockBot,
  };

  const mockPrismaService = {
    scrapedProduct: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockTelegramPoster = {
    postToChannel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TelegramPoster, useValue: mockTelegramPoster },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
    telegramPoster = module.get<TelegramPoster>(TelegramPoster);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product', async () => {
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(null);
      mockPrismaService.scrapedProduct.create.mockResolvedValue(mockProduct);

      const result = await service.create({
        asin: 'B0TESTPROD1',
        title: 'Test Product',
        currentPrice: 49.99,
        originalPrice: 99.99,
        discountPercentage: 50,
        imageUrl: 'https://example.com/image.jpg',
        productUrl: 'https://amazon.com/dp/B0TESTPROD1',
      });

      expect(result).toEqual(mockProduct);
    });

    it('should throw ConflictException if ASIN exists', async () => {
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(
        mockProduct,
      );

      await expect(
        service.create({
          asin: 'B0TESTPROD1',
          title: 'Test Product',
          currentPrice: 49.99,
          originalPrice: 99.99,
          discountPercentage: 50,
          imageUrl: 'https://example.com/image.jpg',
          productUrl: 'https://amazon.com/dp/B0TESTPROD1',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(
        mockProduct,
      );

      const result = await service.findOne(mockProduct.id);

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const products = [mockProduct];
      mockPrismaService.scrapedProduct.findMany.mockResolvedValue(products);
      mockPrismaService.scrapedProduct.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(products);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrismaService.scrapedProduct.findMany.mockResolvedValue([]);
      mockPrismaService.scrapedProduct.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        limit: 10,
        status: ProductStatus.PENDING_APPROVAL,
      });

      expect(mockPrismaService.scrapedProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: ProductStatus.PENDING_APPROVAL },
        }),
      );
    });

    it('should filter by minDiscount', async () => {
      mockPrismaService.scrapedProduct.findMany.mockResolvedValue([]);
      mockPrismaService.scrapedProduct.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        limit: 10,
        minDiscount: 30,
      });

      expect(mockPrismaService.scrapedProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { discountPercentage: { gte: 30 } },
        }),
      );
    });

    it('should filter by search term', async () => {
      mockPrismaService.scrapedProduct.findMany.mockResolvedValue([]);
      mockPrismaService.scrapedProduct.count.mockResolvedValue(0);

      await service.findAll({
        page: 1,
        limit: 10,
        search: 'laptop',
      });

      expect(mockPrismaService.scrapedProduct.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { title: { contains: 'laptop', mode: 'insensitive' } },
        }),
      );
    });
  });

  describe('approve', () => {
    it('should approve a pending product', async () => {
      const pendingProduct = {
        ...mockProduct,
        status: ProductStatus.PENDING_APPROVAL,
      };
      const approvedProduct = {
        ...mockProduct,
        status: ProductStatus.APPROVED,
      };

      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(
        pendingProduct,
      );
      mockPrismaService.scrapedProduct.update.mockResolvedValue(
        approvedProduct,
      );
      mockTelegramPoster.postToChannel.mockResolvedValue(undefined);

      const result = await service.approve(mockProduct.id);

      expect(result.status).toBe(ProductStatus.APPROVED);
      expect(mockTelegramPoster.postToChannel).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(null);

      await expect(service.approve('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if not PENDING_APPROVAL', async () => {
      const approvedProduct = {
        ...mockProduct,
        status: ProductStatus.APPROVED,
      };
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(
        approvedProduct,
      );

      await expect(service.approve(mockProduct.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('reject', () => {
    it('should reject a pending product', async () => {
      const pendingProduct = {
        ...mockProduct,
        status: ProductStatus.PENDING_APPROVAL,
      };
      const rejectedProduct = {
        ...mockProduct,
        status: ProductStatus.REJECTED,
      };

      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(
        pendingProduct,
      );
      mockPrismaService.scrapedProduct.update.mockResolvedValue(
        rejectedProduct,
      );

      const result = await service.reject(mockProduct.id);

      expect(result.status).toBe(ProductStatus.REJECTED);
    });

    it('should throw BadRequestException if not PENDING_APPROVAL', async () => {
      const approvedProduct = {
        ...mockProduct,
        status: ProductStatus.APPROVED,
      };
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(
        approvedProduct,
      );

      await expect(service.reject(mockProduct.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(
        mockProduct,
      );
      mockPrismaService.scrapedProduct.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(mockProduct.id);

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.scrapedProduct.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('bulkReject', () => {
    it('should bulk reject products', async () => {
      mockPrismaService.scrapedProduct.updateMany.mockResolvedValue({
        count: 3,
      });

      const result = await service.bulkReject(['id1', 'id2', 'id3', 'id4']);

      expect(result.updated).toBe(3);
      expect(result.skipped).toBe(1);
    });
  });
});
