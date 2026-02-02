import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule, getBotToken } from 'nestjs-telegraf';
import { TelegramAlertService } from './alert.service';
import { TelegramPoster } from './poster.service';

const isTest = process.env.SKIP_TELEGRAM === 'true';

@Module({
  imports: isTest
    ? []
    : [
        TelegrafModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            token:
              configService.get<string>('TELEGRAM_TOKEN') || 'fallback-token',
          }),
          inject: [ConfigService],
        }),
      ],
  providers: [
    TelegramAlertService,
    TelegramPoster,
    ...(isTest
      ? [
          {
            provide: getBotToken(),
            useValue: {
              telegram: {
                sendMessage: async () => {},
                sendPhoto: async () => {},
              },
            },
          },
        ]
      : []),
  ],
  exports: [TelegramAlertService, TelegramPoster],
})
export class TelegramModule {}
