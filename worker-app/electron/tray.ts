import { Tray, Menu, app, nativeImage } from 'electron';
import path from 'path';
import { ConnectionState } from './types';
import { showStatusWindow } from './status-window';
import { getWorkerState } from './services/worker-state';

let tray: Tray | null = null;

const ICON_PATHS = {
    DISCONNECTED: 'assets/icons/error.png',
    CONNECTING: 'assets/icons/connecting.png',
    CONNECTED: 'assets/icons/idle.png',
    WORKING: 'assets/icons/working.png',
    WORKING_PULSE: 'assets/icons/idle.png',
    ERROR: 'assets/icons/error.png',
    RECONNECTING: 'assets/icons/connecting.png',
};

let animationInterval: NodeJS.Timeout | null = null;

export function createTray() {
    if (tray) return;

    // Use a temporary empty icon if real icons don't exist yet
    const icon = nativeImage.createEmpty();
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir Status',
            click: () => showStatusWindow()
        },
        {
            label: 'Pausar/Retomar',
            click: () => {
                const state = getWorkerState();
                state.setPaused(!state.getStatus().isPaused);
            }
        },
        { type: 'separator' },
        {
            label: 'Configurações',
            click: () => {
                const { mainWindow } = require('./main');
                mainWindow?.show();
            }
        },
        { type: 'separator' },
        {
            label: 'Sair',
            click: () => {
                (app as any).isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Bot-Scraper Worker');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        showStatusWindow();
    });

    // Initial icon update
    updateTrayIcon('DISCONNECTED');
}

export function updateTrayIcon(state: ConnectionState) {
    if (!tray) return;

    // Clear previous animation
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }

    if (state === 'WORKING') {
        let toggle = false;
        animationInterval = setInterval(() => {
            const icon = toggle ? ICON_PATHS.WORKING : ICON_PATHS.WORKING_PULSE;
            const iconPath = path.join(app.getAppPath(), icon);
            try { tray?.setImage(iconPath); } catch (e) { }
            toggle = !toggle;
        }, 1000);
    } else {
        const iconName = ICON_PATHS[state] || ICON_PATHS.DISCONNECTED;
        const iconPath = path.join(app.getAppPath(), iconName);
        try {
            tray.setImage(iconPath);
        } catch (e) { }
    }

    const statusMap: Record<string, string> = {
        CONNECTED: 'Conectado',
        WORKING: 'Extraindo dados...',
        CONNECTING: 'Conectando...',
        RECONNECTING: 'Reconectando...',
        DISCONNECTED: 'Desconectado',
        ERROR: 'Erro de conexão'
    };

    const tooltip = `Bot-Scraper Worker - ${statusMap[state] || state}`;
    tray.setToolTip(tooltip);
}
