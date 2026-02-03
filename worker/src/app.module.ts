import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScraperModule } from './scraper/scraper.module';
import { CommunicationModule } from './communication/communication.module';
import { OrchestrationModule } from './orchestration/orchestration.module';
import { validate } from './config/env.validation';
import configuration from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validate,
        }),
        ScraperModule,
        CommunicationModule,
        OrchestrationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
