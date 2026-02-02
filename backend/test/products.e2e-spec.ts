process.env.SKIP_TELEGRAM = 'true';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { TelegramPoster } from '../src/modules/telegram/poster.service';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let botId: string;

  const mockTelegramPoster = {
    postToChannel: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TelegramPoster)
      .useValue(mockTelegramPoster)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    const configService = app.get(ConfigService);
    adminToken = `Bearer ${configService.get('ADMIN_PASSWORD')}`;

    // Create a bot for product association
    const botResponse = await request(app.getHttpServer())
      .post('/bots')
      .set('Authorization', adminToken)
      .send({
        name: 'Product Test Bot',
        targetUrl: 'https://example.com',
        affiliateTag: 'tag-20',
        telegramToken: 'mock:token',
        chatId: '123456',
        scheduleCron: '0 0 1 1 *',
        status: 'PAUSED',
      });
    botId = botResponse.body.data.id;
  });

  afterAll(async () => {
    if (botId) {
      await request(app.getHttpServer())
        .delete(`/bots/${botId}`)
        .set('Authorization', adminToken);
    }
    await app.close();
  });

  let productId: string;

  it('/products (POST) - should create a product', async () => {
    const payload = {
      asin: 'TESTASIN' + Math.floor(Math.random() * 1000000),
      title: 'Test Product E2E',
      currentPrice: 99.99,
      originalPrice: 129.99,
      discountPercentage: 23,
      imageUrl: 'https://example.com/image.jpg',
      productUrl: 'https://example.com/product',
      status: 'PENDING_APPROVAL',
      botId: botId,
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', adminToken)
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    productId = response.body.data.id;
  });

  it('/products (GET) - should return a list of products', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    const data = response.body.data;
    if (data.data) {
      expect(Array.isArray(data.data)).toBe(true);
    } else {
      expect(Array.isArray(data)).toBe(true);
    }
  });

  it('/products/:id/approve (POST) - should approve a product', async () => {
    const response = await request(app.getHttpServer())
      .post(`/products/${productId}/approve`)
      .set('Authorization', adminToken)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('APPROVED');
    expect(mockTelegramPoster.postToChannel).toHaveBeenCalled();
  });

  it('/products/:id/reject (POST) - should reject a product', async () => {
    // Create a new product for rejection
    const payload = {
      asin: 'TESTASIN' + Math.floor(Math.random() * 1000000),
      title: 'Test Product Rejected',
      currentPrice: 50.0,
      originalPrice: 100.0,
      discountPercentage: 50,
      imageUrl: 'https://example.com/image.jpg',
      productUrl: 'https://example.com/product',
      status: 'PENDING_APPROVAL',
      botId: botId,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', adminToken)
      .send(payload)
      .expect(201);

    const rejectId = createResponse.body.data.id;

    const response = await request(app.getHttpServer())
      .post(`/products/${rejectId}/reject`)
      .set('Authorization', adminToken)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('REJECTED');
  });

  it('/products/:id (DELETE) - should remove a product', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .set('Authorization', adminToken)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .set('Authorization', adminToken)
      .expect(404);
  });
});
