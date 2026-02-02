/// <reference types="vite/client" />

interface ImportMetaEnv {
    /**
     * Backend server URL for WebSocket connection
     * Injected at build time from .env files
     */
    readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
