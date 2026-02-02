import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { chromium, Browser, BrowserContext } from 'playwright';

@Injectable()
export class PlaywrightService implements OnModuleDestroy {
    private readonly logger = new Logger(PlaywrightService.name);
    private browser: Browser | null = null;

    async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.logger.log('Launching browser instance...');
            this.browser = await chromium.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                ],
            });
        }
        return this.browser;
    }

    async createProxyContext(proxyConfig?: {
        server: string;
        username?: string;
        password?: string;
    }): Promise<BrowserContext> {
        const browser = await this.getBrowser();
        this.logger.log(`Creating browser context${proxyConfig ? ` with proxy ${proxyConfig.server}` : ''}`);

        return browser.newContext({
            proxy: proxyConfig,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });
    }

    async onModuleDestroy() {
        if (this.browser) {
            this.logger.log('Closing browser instance...');
            await this.browser.close();
        }
    }
}
