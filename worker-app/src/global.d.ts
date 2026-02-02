import type { WorkerAPI } from '../electron/preload';

declare global {
    interface Window {
        workerAPI: WorkerAPI;
    }
}

export { };
