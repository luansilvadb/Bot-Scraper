import { Injectable, Logger } from '@nestjs/common';
import { BrowserFactory } from './browser.factory';
import { AmazonListScraper } from './amazon-list.scraper';
import { ScrapedProductData, TaskErrorType, ScrapeJob } from '../types';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        private browserFactory: BrowserFactory,
        private amazonListScraper: AmazonListScraper
    ) { }

    private async delay(min: number, max: number) {
        const delayMs = Math.floor(Math.random() * (max - min + 1)) + min;
        this.logger.log(`Waiting ${delayMs}ms for rate limiting...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    async scrape(job: ScrapeJob): Promise<ScrapedProductData | ScrapedProductData[]> {
        const browser = await this.browserFactory.getBrowser();
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            // Check if it's a product page or a list page
            const isProductPage = job.url.includes('/dp/') || job.url.includes('/gp/product/');

            if (!isProductPage) {
                this.logger.log('Detected as list page. Using AmazonListScraper...');
                return await this.amazonListScraper.scrape(page, job.url);
            }

            this.logger.log(`Navigating to product page: ${job.url}`);
            await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            const title = await page.title();
            if (title.includes('Robot Check')) {
                throw { type: TaskErrorType.CAPTCHA, message: 'Captcha detected' };
            }

            const data = await page.evaluate(() => {
                const titleEl = document.getElementById('productTitle') || document.querySelector('h1');
                const priceEl = document.querySelector('.a-price .a-offscreen');
                const availabilityEl = document.getElementById('availability');
                const imgEl = document.getElementById('landingImage');

                const asinMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
                const asin = asinMatch ? asinMatch[1] : null;

                let price = null;
                if (priceEl && priceEl.textContent) {
                    const priceText = priceEl.textContent.trim().replace('R$', '').replace('.', '').replace(',', '.');
                    const p = parseFloat(priceText);
                    if (!isNaN(p)) price = p;
                }

                return {
                    productTitle: titleEl ? titleEl.textContent?.trim() || '' : '',
                    price,
                    currency: 'BRL',
                    originalPrice: null,
                    rating: null,
                    reviewCount: null,
                    availability: availabilityEl ? availabilityEl.textContent?.trim() || '' : null,
                    isAvailable: availabilityEl ? !availabilityEl.textContent?.toLowerCase().includes('indisponível') : true,
                    imageUrls: imgEl ? [imgEl.getAttribute('src') || ''] : [],
                    asin
                };
            });

            if (!data.productTitle) {
                throw { type: TaskErrorType.PARSE_ERROR, message: 'Failed to extract product title' };
            }

            return data as ScrapedProductData;

        } catch (error: any) {
            this.logger.error(`Scraping failed: ${error.message}`);
            if (error.type) throw error;
            throw {
                type: TaskErrorType.NETWORK,
                message: error.message || 'Scraping failed',
            };
        } finally {
            await page.close();
            await context.close();
        }
    }
}
