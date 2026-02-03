import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { BrowserFactory } from './browser.factory';
import { AmazonListScraper } from './amazon-list.scraper';
import { TaskErrorType, ScrapedProductData } from '../types';

describe('ScraperService', () => {
    let service: ScraperService;
    let browserFactory: jest.Mocked<BrowserFactory>;
    let amazonListScraper: jest.Mocked<AmazonListScraper>;

    beforeEach(async () => {
        const mockPage = {
            goto: jest.fn(),
            title: jest.fn().mockResolvedValue('Product Title'),
            evaluate: jest.fn().mockResolvedValue({ productTitle: 'Test Product' }),
            close: jest.fn(),
        };

        const mockContext = {
            newPage: jest.fn().mockResolvedValue(mockPage),
            close: jest.fn(),
        };

        const mockBrowser = {
            newContext: jest.fn().mockResolvedValue(mockContext),
        };

        browserFactory = {
            getBrowser: jest.fn().mockResolvedValue(mockBrowser),
        } as any;

        amazonListScraper = {
            scrape: jest.fn().mockResolvedValue([{ productTitle: 'List Product' }]),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScraperService,
                { provide: BrowserFactory, useValue: browserFactory },
                { provide: AmazonListScraper, useValue: amazonListScraper },
            ],
        }).compile();

        service = module.get<ScraperService>(ScraperService);

        // Shorten delay for tests
        (service as any).delay = jest.fn().mockResolvedValue(undefined);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should successfully scrape a single product', async () => {
        const result = await service.scrape({ id: '1', url: 'http://amazon.com.br/dp/B08N5KWBKK' }) as ScrapedProductData;
        expect(result.productTitle).toBe('Test Product');
        expect(browserFactory.getBrowser).toHaveBeenCalled();
    });

    it('should successfully scrape a product list', async () => {
        const result = await service.scrape({ id: '1', url: 'http://amazon.com.br/s?k=iphone' }) as ScrapedProductData[];
        expect(Array.isArray(result)).toBe(true);
        expect(result[0].productTitle).toBe('List Product');
        expect(amazonListScraper.scrape).toHaveBeenCalled();
    });

    it('should throw captcha error when detected', async () => {
        // Use a product URL to bypass the list scraper branch
        const url = 'http://amazon.com.br/dp/B08N5KWBKK';
        const mockBrowser = await browserFactory.getBrowser();
        const context = await mockBrowser.newContext();
        const page = await context.newPage();
        (page.title as jest.Mock).mockResolvedValue('Robot Check');

        await expect(service.scrape({ id: '1', url }))
            .rejects.toMatchObject({ type: TaskErrorType.CAPTCHA });
    });
});
