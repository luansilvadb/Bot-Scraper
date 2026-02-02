# Bot-Scraper Worker App

Electron-based desktop worker for the Bot-Scraper platform.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (optional - defaults work for local dev):
   ```bash
   # Copy example and edit if needed
   cp .env.example .env.development
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build:win
   ```

## Environment Configuration

The worker uses environment variables for server configuration:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SERVER_URL` | Backend server WebSocket URL | `http://localhost:30001` |

### Environment Files

- `.env.development` - Used during `npm run dev`
- `.env.production` - Used during `npm run build`
- `.env.example` - Template with documentation

**Important**: The server URL is injected at **build time**, not runtime. Users do NOT enter the URL manually - they only need to provide their authentication token.

## User Setup

1. Launch the worker application.
2. The configuration interface will appear automatically in a sleek popup near your system tray.
3. Enter your **Token** (copy from the web dashboard).
4. Click **Conectar** to establish connection.
5. Once connected, the window will smoothly transition to the status view.
6. The window automatically hides when you click away, and can be reopened by clicking the tray icon.

## Features

- **Integrated Tray UX**: Configuration and Status are unified in a single, premium tray popup.
- **Big-Tech Aesthetics**: Modern design with glassmorphism (backdrop-blur) and smooth animations.
- **Unified Visual Identity**: Shares the same design system, colors, and components as the Frontend Dashboard.
- **Fluid Transitions**: Animated switching between Status and Configuration views.
- **Auto-Hide & Persistence**: Popup hides on blur but the worker continues processing in the background.
- **Encrypted Storage**: Credentials stored securely using machine-specific encryption.

## Development

### Project Structure

```
worker-app/
├── electron/           # Main process code
│   ├── main.ts         # Entry point
│   ├── preload.ts      # Context bridge
│   ├── tray.ts         # System tray
│   ├── types.ts        # TypeScript types
│   └── services/       # Backend services
├── src/                # Renderer process (React)
│   ├── App.tsx         # Main component
│   └── components/     # UI components
├── .env.development    # Dev environment
├── .env.production     # Prod environment
└── package.json
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run build:win` - Build Windows installer
- `npm run typecheck` - Run TypeScript type checking

## License

Proprietary - All rights reserved
