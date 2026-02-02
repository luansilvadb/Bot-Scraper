import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramPoster } from '../telegram/poster.service';
import { ScrapedProduct, ProductStatus, Prisma } from '@prisma/client';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private telegramPoster: TelegramPoster,
  ) {}

  async create(data: CreateProductDto): Promise<ScrapedProduct> {
    // Check for duplicate ASIN
    const existing = await this.prisma.scrapedProduct.findUnique({
      where: { asin: data.asin },
    });
    if (existing) {
      throw new ConflictException(
        `Product with ASIN ${data.asin} already exists`,
      );
    }

    return this.prisma.scrapedProduct.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: { bot: true },
    });
  }

  async findAll(
    query: ProductQueryDto,
  ): Promise<PaginatedResponseDto<ScrapedProduct>> {
    const { page = 1, limit = 10, status, botId, minDiscount, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ScrapedProductWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (botId) {
      where.botId = botId;
    }

    if (minDiscount !== undefined) {
      where.discountPercentage = { gte: minDiscount };
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.scrapedProduct.findMany({
        where,
        skip,
        take: limit,
        orderBy: { foundAt: 'desc' },
        include: { bot: { select: { id: true, name: true } } },
      }),
      this.prisma.scrapedProduct.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string): Promise<ScrapedProduct> {
    const product = await this.prisma.scrapedProduct.findUnique({
      where: { id },
      include: { bot: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, data: UpdateProductDto): Promise<ScrapedProduct> {
    await this.findOne(id);

    return this.prisma.scrapedProduct.update({
      where: { id },
      data: {
        ...data,
        expiresAt:
          data.expiresAt !== undefined
            ? data.expiresAt
              ? new Date(data.expiresAt)
              : null
            : undefined,
      },
      include: { bot: true },
    });
  }

  async remove(id: string): Promise<ScrapedProduct> {
    await this.findOne(id);

    return this.prisma.scrapedProduct.delete({
      where: { id },
    });
  }

  async findAllPending(): Promise<ScrapedProduct[]> {
    return this.prisma.scrapedProduct.findMany({
      where: { status: ProductStatus.PENDING_APPROVAL },
      include: { bot: true },
    });
  }

  async approve(id: string): Promise<ScrapedProduct> {
    const product = await this.prisma.scrapedProduct.findUnique({
      where: { id },
      include: { bot: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.status !== ProductStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'Only products with PENDING_APPROVAL status can be approved',
      );
    }

    if (!product.bot) throw new Error('Bot not found for this product');

    await this.telegramPoster.postToChannel(
      product.bot.chatId,
      product,
      product.bot.affiliateTag,
    );

    return this.prisma.scrapedProduct.update({
      where: { id },
      data: { status: ProductStatus.APPROVED },
      include: { bot: true },
    });
  }

  async reject(id: string): Promise<ScrapedProduct> {
    const product = await this.findOne(id);

    if (product.status !== ProductStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'Only products with PENDING_APPROVAL status can be rejected',
      );
    }

    return this.prisma.scrapedProduct.update({
      where: { id },
      data: { status: ProductStatus.REJECTED },
      include: { bot: true },
    });
  }

  async bulkApprove(
    ids: string[],
  ): Promise<{ updated: number; skipped: number }> {
    let updated = 0;
    let skipped = 0;

    for (const id of ids) {
      try {
        await this.approve(id);
        updated++;
      } catch {
        skipped++;
      }
    }

    return { updated, skipped };
  }

  async bulkReject(
    ids: string[],
  ): Promise<{ updated: number; skipped: number }> {
    const result = await this.prisma.scrapedProduct.updateMany({
      where: {
        id: { in: ids },
        status: ProductStatus.PENDING_APPROVAL,
      },
      data: { status: ProductStatus.REJECTED },
    });

    return { updated: result.count, skipped: ids.length - result.count };
  }
}
