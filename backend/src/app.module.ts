import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BotsModule } from './modules/bots/bots.module';
import { ScrapingModule } from './modules/scraping/scraping.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ProxyModule } from './modules/proxy/proxy.module';
import { ProductsModule } from './modules/products/products.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BotsModule,
    ScrapingModule,
    TelegramModule,
    ProxyModule,
    ProductsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
