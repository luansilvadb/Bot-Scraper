import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium, Browser } from 'playwright';

@Injectable()
export class BrowserFactory implements OnModuleDestroy {
    private browser: Browser | null = null;
    private readonly logger = new Logger(BrowserFactory.name);

    constructor(private configService: ConfigService) { }

    async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            const headless = this.configService.get<boolean>('headless');
            this.logger.log(`Launching browser (headless: ${headless})`);
            this.browser = await chromium.launch({ headless });
        }
        return this.browser;
    }

    async onModuleDestroy() {
        if (this.browser) {
            this.logger.log('Closing browser');
            await this.browser.close();
        }
    }
}
