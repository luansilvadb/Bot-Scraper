import Store from 'electron-store';
import { WorkerConfig, DEFAULT_WORKER_CONFIG, SERVER_URL } from '../types';
import { execSync } from 'child_process';
import crypto from 'crypto';

let store: Store<WorkerConfig> | null = null;

function getMachineId(): string {
    try {
        // Try PowerShell first (modern Windows)
        const psOutput = execSync('powershell -Command "(Get-CimInstance -Class Win32_ComputerSystemProduct).UUID"').toString().trim();
        if (psOutput && psOutput.length > 10) return psOutput;

        // Fallback to WMIC
        const wmicOutput = execSync('wmic csproduct get uuid').toString();
        return wmicOutput.split('\n')[1].trim();
    } catch (e) {
        console.warn('[ConfigStore] Failed to get machine UUID, using fallback:', e);
        return 'fallback-machine-id-12345';
    }
}

export function initConfigStore() {
    if (store) return store;

    const machineId = getMachineId();
    const encryptionKey = crypto
        .createHash('sha256')
        .update(machineId + 'bot-scraper-salt')
        .digest('hex');

    try {
        store = new Store<WorkerConfig>({
            defaults: DEFAULT_WORKER_CONFIG,
            encryptionKey: encryptionKey, // AES-256 encryption
            name: 'worker-config'
        });

        // Test access to trigger decryption error early if key changed
        const _test = store.store;
    } catch (e) {
        console.error('[ConfigStore] Failed to initialize store (possibly due to encryption key change). Resetting...', e);
        // If it fails (likely decryption error), we'll try to recreate it without encryption or clear it
        // For now, let's try to clear the file by recreating it without defaults first, then with.
        try {
            store = new Store<WorkerConfig>({ name: 'worker-config', encryptionKey });
            store.clear();
            store.set(DEFAULT_WORKER_CONFIG);
        } catch (innerError) {
            // Absolute fallback if everything fails
            store = new Store<WorkerConfig>({ name: 'worker-config-new', defaults: DEFAULT_WORKER_CONFIG, encryptionKey });
        }
    }

    return store;
}

export function getConfig(): WorkerConfig {
    const s = initConfigStore();
    const config = s.store;
    // Ensure serverUrl always has the environment value
    return {
        ...config,
        serverUrl: config.serverUrl || SERVER_URL
    };
}

export function saveConfig(config: Partial<WorkerConfig>) {
    const s = initConfigStore();
    s.set(config);
}

export function hasConfig(): boolean {
    const config = getConfig();
    // Only check token - serverUrl comes from environment
    return !!config.workerToken;
}
