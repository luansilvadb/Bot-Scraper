process.env.SKIP_TELEGRAM = 'true';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('SettingsController (e2e)', () => {
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

  const testKey = 'E2E_TEST_SETTING_' + Math.floor(Math.random() * 1000000);

  it('/settings (POST) - should upsert a setting', async () => {
    const payload = {
      key: testKey,
      value: 'initial-value-e2e',
    };

    const response = await request(app.getHttpServer())
      .post('/settings')
      .set('Authorization', adminToken)
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.key).toBe(testKey);
    expect(response.body.data.value).toBe('initial-value-e2e');
  });

  it('/settings (GET) - should return a list of settings', async () => {
    const response = await request(app.getHttpServer())
      .get('/settings')
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

  it('/settings/:key (GET) - should return a single setting', async () => {
    const response = await request(app.getHttpServer())
      .get(`/settings/${testKey}`)
      .set('Authorization', adminToken)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.key).toBe(testKey);
  });

  it('/settings (POST) - should update existing setting (upsert)', async () => {
    const payload = {
      key: testKey,
      value: 'updated-value-e2e',
    };

    const response = await request(app.getHttpServer())
      .post('/settings')
      .set('Authorization', adminToken)
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.value).toBe('updated-value-e2e');
  });

  it('/settings/:key (DELETE) - should remove a setting', async () => {
    await request(app.getHttpServer())
      .delete(`/settings/${testKey}`)
      .set('Authorization', adminToken)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/settings/${testKey}`)
      .set('Authorization', adminToken)
      .expect(404);
  });
});
