import axios from 'axios';

export interface NetworkInfo {
    externalIp: string;
    ispName: string;
    lastCheckedAt: string;
}

export class NetworkService {
    private currentInfo: NetworkInfo = {
        externalIp: '',
        ispName: '',
        lastCheckedAt: new Date().toISOString(),
    };

    private static instance: NetworkService;

    private constructor() { }

    public static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }

    async init() {
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
                lastCheckedAt: new Date().toISOString(),
            };

            console.log(`[Network] Detected IP: ${this.currentInfo.externalIp} (${this.currentInfo.ispName})`);
        } catch (error) {
            console.error('[Network] Failed to detect network info:', error);
        }
    }

    getNetworkInfo(): NetworkInfo {
        return this.currentInfo;
    }
}
