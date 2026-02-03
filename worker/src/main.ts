import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        app.enableShutdownHooks();
        console.log('Worker NestJS application context initialized');
    } catch (error) {
        console.error('FAILED TO START WORKER:', error.message);
        process.exit(1);
    }
}
bootstrap();
