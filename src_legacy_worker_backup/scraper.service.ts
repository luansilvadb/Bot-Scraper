import { chromium, Browser, Page } from 'playwright';
import { ScrapedProductData, TaskErrorType } from './types'; // Note .js extension for ts-node ESM or standard
import dotenv from 'dotenv';

dotenv.config();

export class ScraperService {
    private browser: Browser | null = null;
    private readonly rateLimitMin = parseInt(process.env.RATE_LIMIT_MIN_MS || '10000', 10);
    private readonly rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_MS || '15000', 10);

    constructor() { }

    async init() {
        this.browser = await chromium.launch({
            headless: process.env.HEADLESS !== 'false',
        });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    private async delay(min: number, max: number) {
        const delayMs = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`[Scraper] Waiting ${delayMs}ms for rate limiting...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    async scrapeProduct(url: string, taskId: string): Promise<ScrapedProductData> {
        if (!this.browser) {
            await this.init();
        }

        // Rate limiting before request
        await this.delay(this.rateLimitMin, this.rateLimitMax);

        const page = await this.browser!.newPage();
        const startTime = Date.now();

        try {
            console.log(`[Scraper] Navigating to ${url}`);
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Check for CAPTCHA/Blocks
            const title = await page.title();
            if (title.includes('Robot Check') || (await page.$('form[action*="/errors/validateCaptcha"]'))) {
                throw { type: TaskErrorType.CAPTCHA, message: 'Amazon CAPTCHA detected' };
            }
            if (title.includes('Page Not Found') || (await page.$('img[alt="Dogs of Amazon"]'))) {
                // This might just be 404, but sometimes blocks look like 404s. Assuming 404 for now is just availability false?
                // Spec says check for blocks.
            }

            // Selectors (T023)
            const data = await page.evaluate(() => {
                const titleEl = document.getElementById('productTitle') ||
                    document.querySelector('#title') ||
                    document.querySelector('h1') ||
                    document.querySelector('[data-feature-name="title"]'); // Fallbacks
                const priceEl = document.querySelector('.a-price .a-offscreen') || document.querySelector('#priceblock_ourprice');
                const availabilityEl = document.getElementById('availability');
                const ratingEl = document.querySelector('#acrPopover') || document.querySelector('.a-icon-star');
                const reviewCountEl = document.getElementById('acrCustomerReviewText');
                const imgEl = document.getElementById('landingImage') || document.getElementById('imgBlkFront');

                // ASIN from URL or page
                const asinMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
                const asin = asinMatch ? asinMatch[1] : null;

                // Parse price
                let price = null;
                let currency = 'BRL';
                if (priceEl && priceEl.textContent) {
                    const priceText = priceEl.textContent.trim().replace('R$', '').replace('.', '').replace(',', '.');
                    const p = parseFloat(priceText);
                    if (!isNaN(p)) price = p;
                }

                return {
                    productTitle: titleEl ? titleEl.textContent?.trim() || '' : '',
                    price,
                    currency,
                    originalPrice: null, // Need selector for original
                    rating: ratingEl ? parseFloat(ratingEl.textContent?.split(' ')[0] || '0') : null,
                    reviewCount: reviewCountEl ? parseInt(reviewCountEl.textContent?.replace(/\D/g, '') || '0') : null,
                    availability: availabilityEl ? availabilityEl.textContent?.trim() || '' : null,
                    isAvailable: availabilityEl ? !availabilityEl.textContent?.toLowerCase().includes('indisponível') : true,
                    imageUrls: imgEl ? [imgEl.getAttribute('src') || ''] : [],
                    asin
                };
            });

            if (!data.productTitle) {
                // Potentially blocked or weird page structure
                throw { type: TaskErrorType.PARSE_ERROR, message: 'Failed to extract product title' };
            }

            return data as ScrapedProductData;

        } catch (error: any) {
            if (error.type) throw error; // Re-throw known errors

            // Default to NETWORK error if playwright fails
            throw {
                type: TaskErrorType.NETWORK,
                message: error.message || 'Scraping failed',
                details: error.stack
            };
        } finally {
            await page.close();
        }
    }
}
