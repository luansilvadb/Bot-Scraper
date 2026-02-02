import { contextBridge, ipcRenderer } from 'electron';
import type { WorkerConfig, WorkerStatus, ConfigValidationResult } from './types';

export interface WorkerAPI {
    // Invoke methods (Renderer → Main)
    getStatus: () => Promise<WorkerStatus>;
    getConfig: () => Promise<WorkerConfig | null>;
    saveConfig: (config: WorkerConfig) => Promise<ConfigValidationResult>;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    togglePause: () => Promise<boolean>;
    openSettings: () => Promise<void>;
    quitApp: () => Promise<void>;

    // Event listeners (Main → Renderer)
    onStatusChange: (callback: (status: WorkerStatus) => void) => void;
    onConfigLoaded: (callback: (config: WorkerConfig | null) => void) => void;
    onTaskProgress: (callback: (data: { taskId: string; progress: string }) => void) => void;
    onNotification: (callback: (data: { type: string; title: string; message: string }) => void) => void;

    // Cleanup
    removeAllListeners: () => void;
}

const workerAPI: WorkerAPI = {
    getStatus: () => ipcRenderer.invoke('worker:get-status'),
    getConfig: () => ipcRenderer.invoke('worker:get-config'),
    saveConfig: (config) => ipcRenderer.invoke('worker:save-config', config),
    connect: () => ipcRenderer.invoke('worker:connect'),
    disconnect: () => ipcRenderer.invoke('worker:disconnect'),
    togglePause: () => ipcRenderer.invoke('worker:toggle-pause'),
    openSettings: () => ipcRenderer.invoke('worker:open-settings'),
    quitApp: () => ipcRenderer.invoke('worker:quit'),

    onStatusChange: (callback) => {
        ipcRenderer.on('worker:status-changed', (_, status) => callback(status));
    },
    onConfigLoaded: (callback) => {
        ipcRenderer.on('worker:config-loaded', (_, config) => callback(config));
    },
    onTaskProgress: (callback) => {
        ipcRenderer.on('worker:task-progress', (_, data) => callback(data));
    },
    onNotification: (callback) => {
        ipcRenderer.on('worker:notification', (_, data) => callback(data));
    },

    removeAllListeners: () => {
        ipcRenderer.removeAllListeners('worker:status-changed');
        ipcRenderer.removeAllListeners('worker:config-loaded');
        ipcRenderer.removeAllListeners('worker:task-progress');
        ipcRenderer.removeAllListeners('worker:notification');
    },
};

contextBridge.exposeInMainWorld('workerAPI', workerAPI);
