import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramPoster } from '../telegram/poster.service';
import { ScrapedProduct, ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private telegramPoster: TelegramPoster,
    ) { }

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
        if (!product.bot) throw new Error('Bot not found for this product');

        await this.telegramPoster.postToChannel(
            product.bot.chatId,
            product,
            product.bot.affiliateTag
        );

        return this.prisma.scrapedProduct.update({
            where: { id },
            data: { status: ProductStatus.APPROVED },
        });
    }

    async reject(id: string): Promise<ScrapedProduct> {
        return this.prisma.scrapedProduct.update({
            where: { id },
            data: { status: ProductStatus.REJECTED },
        });
    }
}
