import { useState, useEffect } from 'react';
import type { WorkerStatus, WorkerConfig } from '../../electron/types';

export function useWorkerStatus() {
    const [status, setStatus] = useState<WorkerStatus | null>(null);
    const [config, setConfig] = useState<WorkerConfig | null>(null);
    const [isConfigured, setIsConfigured] = useState<boolean>(true); // Assume true until we check

    useEffect(() => {
        // Initial fetch
        window.workerAPI.getStatus().then(setStatus);
        window.workerAPI.getConfig().then((cfg) => {
            setConfig(cfg);
            setIsConfigured(cfg !== null && cfg.serverUrl !== '' && cfg.workerToken !== '');
        });

        // Listen for changes
        window.workerAPI.onStatusChange((newStatus) => {
            setStatus(newStatus);
        });

        window.workerAPI.onConfigLoaded((newConfig) => {
            setConfig(newConfig);
            setIsConfigured(newConfig !== null && newConfig.serverUrl !== '' && newConfig.workerToken !== '');
        });

        return () => {
            window.workerAPI.removeAllListeners();
        };
    }, []);

    return {
        status,
        config,
        isConfigured,
        connect: () => window.workerAPI.connect(),
        disconnect: () => window.workerAPI.disconnect(),
        togglePause: () => window.workerAPI.togglePause(),
    };
}
