import { Injectable, Logger } from '@nestjs/common';
import { Page } from 'playwright';
import { ScrapedProductData } from '../types';

@Injectable()
export class AmazonListScraper {
    private readonly logger = new Logger(AmazonListScraper.name);

    async scrape(page: Page, url: string): Promise<ScrapedProductData[]> {
        this.logger.log(`Navigating to ${url}...`);

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        });

        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });

        try {
            await page.waitForSelector('.s-result-item', { timeout: 10000 });
        } catch (e) {
            this.logger.warn('Product grid not found. Returning empty list.');
            return [];
        }

        const products = await page.evaluate(() => {
            const items = Array.from(
                document.querySelectorAll('.s-result-item[data-asin]'),
            );

            return items
                .map((item) => {
                    const asin = item.getAttribute('data-asin') || '';
                    const titleEl = item.querySelector('h2 a span');
                    const imgEl = item.querySelector('.s-image') as HTMLImageElement;
                    const currentPriceEl = item.querySelector('.a-price .a-offscreen');
                    const originalPriceEl = item.querySelector(
                        '.a-price.a-text-price .a-offscreen',
                    );
                    const linkEl = item.querySelector('h2 a') as HTMLAnchorElement;

                    const parsePrice = (text: string | null) => {
                        if (!text) return null;
                        const clean = text.replace(/[^\d.,]/g, '').replace('.', '').replace(',', '.');
                        const p = parseFloat(clean);
                        return isNaN(p) ? null : p;
                    };

                    const currentPrice = parsePrice(currentPriceEl?.textContent || null);
                    const originalPrice = parsePrice(originalPriceEl?.textContent || null) || currentPrice;

                    return {
                        asin,
                        productTitle: titleEl?.textContent?.trim() || 'No Title',
                        price: currentPrice,
                        originalPrice: originalPrice,
                        currency: 'BRL',
                        rating: null,
                        reviewCount: null,
                        availability: 'Em estoque',
                        isAvailable: true,
                        imageUrls: imgEl?.src ? [imgEl.src] : [],
                        productUrl: linkEl?.href ? linkEl.href.split('?')[0] : '',
                    };
                })
                .filter((p) => p.asin && p.price !== null);
        });

        this.logger.log(`Found ${products.length} products.`);
        return products as any[];
    }
}
