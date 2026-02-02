import { BrowserWindow, screen, app } from 'electron';
import path from 'path';

let statusWindow: BrowserWindow | null = null;

export function createStatusWindow() {
    if (statusWindow) return statusWindow;

    statusWindow = new BrowserWindow({
        width: 350,
        height: 603,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Load the renderer (now using TrayContainer by default)
    if (process.env.VITE_DEV_SERVER_URL) {
        statusWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        statusWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Hide when focus is lost (like a notification)
    statusWindow.on('blur', () => {
        hideStatusWindow();
    });

    return statusWindow;
}

export function showStatusWindow() {
    if (!statusWindow) createStatusWindow();

    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    const [winWidth, winHeight] = statusWindow!.getSize();

    // Position bottom right, above the tray
    statusWindow!.setPosition(screenWidth - winWidth, screenHeight - winHeight);

    statusWindow!.show();
    statusWindow!.focus();
}

export function hideStatusWindow() {
    if (statusWindow) {
        statusWindow.hide();
    }
}

export function getStatusWindow() {
    return statusWindow;
}
