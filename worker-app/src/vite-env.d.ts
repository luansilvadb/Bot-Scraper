/// <reference types="vite/client" />

interface ImportMetaEnv {
    /**
     * Backend server URL for WebSocket connection
     * @see .env.development and .env.production
     */
    readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
