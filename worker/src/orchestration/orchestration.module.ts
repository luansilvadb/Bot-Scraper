import { Module } from '@nestjs/common';
import { WorkerOrchestrator } from './worker.orchestrator';
import { NetworkService } from './network.service';
import { ScraperModule } from '../scraper/scraper.module';
import { CommunicationModule } from '../communication/communication.module';

@Module({
    imports: [ScraperModule, CommunicationModule],
    providers: [WorkerOrchestrator, NetworkService],
})
export class OrchestrationModule { }
