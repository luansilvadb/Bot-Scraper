import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NetworkService implements OnModuleInit {
    private readonly logger = new Logger(NetworkService.name);
    private currentInfo = {
        externalIp: '',
        ispName: '',
        lastCheckedAt: new Date().toISOString()
    };

    async onModuleInit() {
        await this.refreshNetworkInfo();
        // Refresh every 30 minutes
        setInterval(() => this.refreshNetworkInfo(), 30 * 60 * 1000);
    }

    async refreshNetworkInfo() {
        try {
            const response = await axios.get('https://ipinfo.io/json');
            const data = response.data;

            this.currentInfo = {
                externalIp: data.ip || 'Unknown',
                ispName: data.org || 'Unknown',
                lastCheckedAt: new Date().toISOString()
            };

            this.logger.log(`Detected IP: ${this.currentInfo.externalIp} (${this.currentInfo.ispName})`);
        } catch (error: any) {
            this.logger.error(`Failed to detect network info: ${error.message}`);
        }
    }

    getNetworkInfo() {
        return this.currentInfo;
    }
}
