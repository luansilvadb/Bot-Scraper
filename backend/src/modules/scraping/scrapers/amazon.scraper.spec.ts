import { Test, TestingModule } from '@nestjs/testing';
import { AmazonScraper } from './amazon.scraper';
import { Page } from 'playwright';

describe('AmazonScraper', () => {
  let scraper: AmazonScraper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmazonScraper],
    }).compile();

    scraper = module.get<AmazonScraper>(AmazonScraper);
  });

  it('should be defined', () => {
    expect(scraper).toBeDefined();
  });

  describe('scrape', () => {
    it('should prepend https:// if protocol is missing', async () => {
      const mockPage = {
        setExtraHTTPHeaders: jest.fn().mockResolvedValue(undefined),
        goto: jest.fn().mockResolvedValue(undefined),
        waitForSelector: jest.fn().mockResolvedValue(undefined),
        evaluate: jest.fn().mockResolvedValue([]),
      } as unknown as Page;

      const url = 'amazon.com.br';
      await scraper.scrape(mockPage, url);

      expect(mockPage.goto).toHaveBeenCalledWith(
        'https://amazon.com.br',
        expect.objectContaining({ waitUntil: 'domcontentloaded' }),
      );
    });

    it('should NOT prepend https:// if protocol is already present', async () => {
      const mockPage = {
        setExtraHTTPHeaders: jest.fn().mockResolvedValue(undefined),
        goto: jest.fn().mockResolvedValue(undefined),
        waitForSelector: jest.fn().mockResolvedValue(undefined),
        evaluate: jest.fn().mockResolvedValue([]),
      } as unknown as Page;

      const url = 'https://amazon.com.br';
      await scraper.scrape(mockPage, url);

      expect(mockPage.goto).toHaveBeenCalledWith(
        'https://amazon.com.br',
        expect.objectContaining({ waitUntil: 'domcontentloaded' }),
      );
    });

    it('should return empty array if product grid not found', async () => {
      const mockPage = {
        setExtraHTTPHeaders: jest.fn().mockResolvedValue(undefined),
        goto: jest.fn().mockResolvedValue(undefined),
        waitForSelector: jest.fn().mockRejectedValue(new Error('Timeout')),
        evaluate: jest.fn(),
      } as unknown as Page;

      const url = 'https://amazon.com.br';
      const result = await scraper.scrape(mockPage, url);

      expect(result).toEqual([]);
    });
  });
});
