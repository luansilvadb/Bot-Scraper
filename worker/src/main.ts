import dotenv from 'dotenv';
import { WebSocketClient } from './websocket.client';
import { ScraperService } from './scraper.service';
import { WorkerService } from './worker.service';

import { NetworkService } from './network.service';

dotenv.config();

async function bootstrap() {
    console.log('Starting Local Worker Scraper...');

    // Configuration
    const serverUrl = process.env.SERVER_URL || 'ws://localhost:3000';
    const workerToken = process.env.WORKER_TOKEN;

    if (!workerToken) {
        console.error('Error: WORKER_TOKEN is not defined in .env');
        process.exit(1);
    }

    // Initialize Services
    const networkService = new NetworkService();
    const scraperService = new ScraperService();
    const wsClient = new WebSocketClient(serverUrl, workerToken);
    const workerService = new WorkerService(wsClient, scraperService, networkService);

    // Start
    await networkService.init();
    workerService.init();
    wsClient.connect();

    // Graceful Shutdown
    const cleanup = async () => {
        console.log('Shutting down...');
        wsClient.disconnect();
        await scraperService.close();
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}

bootstrap().catch(err => {
    console.error('Bootstrap error:', err);
    process.exit(1);
});
