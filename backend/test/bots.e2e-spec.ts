process.env.SKIP_TELEGRAM = 'true';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('BotsController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    const configService = app.get(ConfigService);
    adminToken = `Bearer ${configService.get('ADMIN_PASSWORD')}`;
  });

  afterAll(async () => {
    await app.close();
  });

  let botId: string;

  it('/bots (POST) - should create a bot', async () => {
    const payload = {
      name: 'Test Bot E2E',
      targetUrl: 'https://example.com',
      affiliateTag: 'tag-20',
      telegramToken: '123:abc',
      chatId: '987654321',
      scheduleCron: '0 0 1 1 *',
      status: 'PAUSED',
    };

    const response = await request(app.getHttpServer())
      .post('/bots')
      .set('Authorization', adminToken)
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(payload.name);
    botId = response.body.data.id;
  });

  it('/bots (GET) - should return a list of bots', async () => {
    const response = await request(app.getHttpServer())
      .get('/bots')
      .set('Authorization', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    const data = response.body.data;
    if (Array.isArray(data)) {
      expect(data.length).toBeGreaterThan(0);
    } else {
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    }
  });

  it('/bots/:id (GET) - should return a single bot', async () => {
    const response = await request(app.getHttpServer())
      .get(`/bots/${botId}`)
      .set('Authorization', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(botId);
  });

  it('/bots/:id (PATCH) - should update a bot', async () => {
    const updatePayload = { name: 'Updated Bot E2E' };
    const response = await request(app.getHttpServer())
      .patch(`/bots/${botId}`)
      .set('Authorization', adminToken)
      .send(updatePayload)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Updated Bot E2E');
  });

  it('/bots/:id (DELETE) - should remove a bot', async () => {
    await request(app.getHttpServer())
      .delete(`/bots/${botId}`)
      .set('Authorization', adminToken)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/bots/${botId}`)
      .set('Authorization', adminToken)
      .expect(404);
  });
});
