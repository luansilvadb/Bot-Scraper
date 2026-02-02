import { app } from 'electron';

export function setAutoLaunch(enabled: boolean) {
    try {
        // Only works for packaged apps in production
        // In dev mode, app.getPath('exe') might point to electron.exe
        if (app.isPackaged) {
            app.setLoginItemSettings({
                openAtLogin: enabled,
                path: app.getPath('exe'),
            });
            console.log(`[AutoLaunch] Set to ${enabled}`);
        } else {
            console.log(`[AutoLaunch] Skipped in dev mode (would be ${enabled})`);
        }
    } catch (e) {
        console.error('[AutoLaunch] Failed to set login item settings:', e);
    }
}
