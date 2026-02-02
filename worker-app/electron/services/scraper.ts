import { chromium, Browser, Page } from 'playwright';
import { ScrapedProductData, TaskErrorType } from '../types';

export class ScraperService {
    private browser: Browser | null = null;
    private static instance: ScraperService;

    // Defaults that can be overridden later via config
    private rateLimitMin = 5000;
    private rateLimitMax = 10000;

    private constructor() { }

    public static getInstance(): ScraperService {
        if (!ScraperService.instance) {
            ScraperService.instance = new ScraperService();
        }
        return ScraperService.instance;
    }

    async init(headless: boolean = true) {
        if (this.browser) return;

        console.log('[Scraper] Launching Playwright Chromium...');
        this.browser = await chromium.launch({
            headless: headless,
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
        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    async scrapeProduct(url: string, taskId: string, onProgress?: (msg: string) => void): Promise<{ data: ScrapedProductData, metrics: { scrapeDurationMs: number, pageLoadTimeMs: number } }> {
        const startTime = Date.now();
        let pageLoadStartTime = 0;
        let pageLoadTimeMs = 0;

        if (!this.browser) {
            onProgress?.('Iniciando navegador...');
            await this.init();
        }

        onProgress?.('Aguardando intervalo de segurança...');
        await this.delay(this.rateLimitMin, this.rateLimitMax);

        onProgress?.('Abrindo página do produto...');
        const page = await this.browser!.newPage();

        try {
            console.log(`[Scraper] Navigating to ${url}`);
            onProgress?.('Carregando dados da Amazon...');

            pageLoadStartTime = Date.now();
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            pageLoadTimeMs = Date.now() - pageLoadStartTime;

            // Check for CAPTCHA/Blocks
            const title = await page.title();
            if (title.includes('Robot Check') || (await page.$('form[action*="/errors/validateCaptcha"]'))) {
                throw { type: TaskErrorType.CAPTCHA, message: 'Amazon CAPTCHA detected' };
            }

            onProgress?.('Extraindo informações...');
            const data = await page.evaluate(() => {
                const titleEl = document.getElementById('productTitle') ||
                    document.querySelector('#title') ||
                    document.querySelector('h1') ||
                    document.querySelector('[data-feature-name="title"]');
                const priceEl = document.querySelector('.a-price .a-offscreen') || document.querySelector('#priceblock_ourprice');
                const availabilityEl = document.getElementById('availability');
                const ratingEl = document.querySelector('#acrPopover') || document.querySelector('.a-icon-star');
                const reviewCountEl = document.getElementById('acrCustomerReviewText');
                const imgEl = (document.getElementById('landingImage') || document.getElementById('imgBlkFront')) as HTMLImageElement;

                const asinMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
                const asin = asinMatch ? asinMatch[1] : null;

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
                    originalPrice: null,
                    rating: ratingEl ? parseFloat(ratingEl.textContent?.split(' ')[0] || '0') : null,
                    reviewCount: reviewCountEl ? parseInt(reviewCountEl.textContent?.replace(/\D/g, '') || '0') : null,
                    availability: availabilityEl ? availabilityEl.textContent?.trim() || '' : null,
                    isAvailable: availabilityEl ? !availabilityEl.textContent?.toLowerCase().includes('indisponível') : true,
                    imageUrls: imgEl ? [imgEl.src] : [],
                    asin
                };
            });

            if (!data.productTitle) {
                throw { type: TaskErrorType.PARSE_ERROR, message: 'Failed to extract product title' };
            }

            onProgress?.('Concluído!');
            return {
                data: data as ScrapedProductData,
                metrics: {
                    scrapeDurationMs: Date.now() - startTime,
                    pageLoadTimeMs
                }
            };

        } catch (error: any) {
            if (error.type) throw error;

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
