import { Injectable, Logger } from '@nestjs/common';
import { Page } from 'playwright';

export interface ScrapedProductData {
    asin: string;
    title: string;
    currentPrice: number;
    originalPrice: number;
    discountPercentage: number;
    imageUrl: string;
    productUrl: string;
}

@Injectable()
export class AmazonScraper {
    private readonly logger = new Logger(AmazonScraper.name);

    async scrape(page: Page, url: string): Promise<ScrapedProductData[]> {
        // Ensure URL has a protocol
        let targetUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            targetUrl = `https://${url}`;
            this.logger.log(`URL missing protocol. Sanitized to: ${targetUrl}`);
        }

        this.logger.log(`Navigating to ${targetUrl}...`);

        // Set some headers/cookies to avoid simple bans
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        });

        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        this.logger.log('Wait for product grid...');
        try {
            await page.waitForSelector('.s-result-item', { timeout: 10000 });
        } catch (e) {
            this.logger.warn('Product grid not found. Returning empty list.');
            return [];
        }

        this.logger.log('Extracting products...');
        const products = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.s-result-item[data-asin]'));

            return items.map((item) => {
                const asin = item.getAttribute('data-asin') || '';
                const titleEl = item.querySelector('h2 a span');
                const imgEl = item.querySelector('.s-image') as HTMLImageElement;
                const currentPriceEl = item.querySelector('.a-price .a-offscreen');
                const originalPriceEl = item.querySelector('.a-price.a-text-price .a-offscreen');
                const linkEl = item.querySelector('h2 a') as HTMLAnchorElement;

                const parsePrice = (text: string | null) => {
                    if (!text) return 0;
                    // Extract numbers (handles R$ 1.234,56 or $1,234.56)
                    const clean = text.replace(/[^\d.,]/g, '').replace(',', '.');
                    return parseFloat(clean) || 0;
                };

                const currentPrice = parsePrice(currentPriceEl?.textContent || null);
                const originalPrice = parsePrice(originalPriceEl?.textContent || null) || currentPrice;

                let discountPercentage = 0;
                if (originalPrice > currentPrice && originalPrice > 0) {
                    discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
                }

                return {
                    asin,
                    title: titleEl?.textContent?.trim() || 'No Title',
                    currentPrice,
                    originalPrice,
                    discountPercentage,
                    imageUrl: imgEl?.src || '',
                    productUrl: linkEl?.href ? linkEl.href.split('?')[0] : '', // Clean URL
                };
            }).filter(p => p.asin && p.currentPrice > 0);
        });

        this.logger.log(`Found ${products.length} products.`);
        return products as ScrapedProductData[];
    }
}
