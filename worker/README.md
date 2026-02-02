# Local Worker Scraper

A standalone Node.js application that scrapes Amazon product pages using Playwright, designed to run on home networks to utilize residential IPs.

## Prerequisites

- Node.js (v18 or later)
- TypeScript (v5+) in the environment (for building)
- Valid `WORKER_TOKEN` (generated from the main Bot-Scraper dashboard)

## Installation

1.  Navigate to the `worker/` directory:
    ```bash
    cd worker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Install Playwright browsers (required for scraping):
    ```bash
    npx playwright install chromium
    ```

## Configuration

1.  Create a `.env` file in the `worker/` directory by copying `.env.example` (if available) or creating it manually:
    ```bash
    # Worker Identity
    WORKER_NAME="Home-PC-01"
    WORKER_TOKEN="your_token_here_from_dashboard"

    # Server Connection
    SERVER_URL="ws://localhost:30001" 
    # Use standard HTTP/WS port of the backend. 
    # If using ngrok or remote server, replace with that URL.

    # Functionality
    HEADLESS=true       # Set to 'false' to see the browser for debugging
    LOG_LEVEL=info      # debug, info, warn, error
    
    # Rate Limiting (in ms)
    RATE_LIMIT_MIN_MS=10000
    RATE_LIMIT_MAX_MS=15000
    ```

## Usage

### Development Mode
To run the worker with hot-reload (using ts-node-dev):
```bash
npm run dev
```

### Production Mode
1.  Build the worker:
    ```bash
    npm run build
    ```
2.  Start the compiled worker:
    ```bash
    npm start
    ```

## Functionality

- **Connection**: Connects to the main Backend via WebSocket.
- **Heartbeat**: Sends a heartbeat every 10 seconds with status (IDLE/BUSY/BLOCKED).
- **Network Info**: Detects and reports the external IP and ISP name (via ipinfo.io).
- **Task Execution**:
    - Receives `task:assigned` events.
    - Scrapes the requested Amazon product URL.
    - Reports success (`task:completed`) or failure (`task:failed`) back to the server.
- **Rate Limiting**: Waits 10-15 seconds (randomized) between scraping requests to avoid detection.

## Troubleshooting

- **Connection Refused**: Ensure the backend server is running and `SERVER_URL` is correct.
- **Authentication Failed**: Check that `WORKER_TOKEN` matches a valid worker created in the dashboard.
- **Playwright Errors**: Ensure `npx playwright install` was run successfully.
