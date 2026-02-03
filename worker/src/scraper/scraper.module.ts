import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { BrowserFactory } from './browser.factory';
import { AmazonListScraper } from './amazon-list.scraper';

@Module({
    providers: [ScraperService, BrowserFactory, AmazonListScraper],
    exports: [ScraperService],
})
export class ScraperModule { }
