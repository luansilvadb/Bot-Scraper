import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramAlertService } from './alert.service';
import { TelegramPoster } from './poster.service';

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                token: configService.get<string>('TELEGRAM_TOKEN') || 'fallback-token',
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [TelegramAlertService, TelegramPoster],
    exports: [TelegramAlertService, TelegramPoster],
})
export class TelegramModule { }
