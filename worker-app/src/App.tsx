import TrayContainer from './components/TrayContainer';
import StatusWindow from './components/StatusWindow';
import ConfigWindow from './components/ConfigWindow';
import { useWorkerStatus } from './hooks/useWorkerStatus';

/**
 * App - Main application entry point
 * 
 * Routes between different window modes:
 * - #status: Status-only view for legacy/standalone status window
 * - No hash: TrayContainer with integrated Status/Config views
 */
function App() {
    const { status, isConfigured, connect } = useWorkerStatus();

    // Hash-based routing for different window types
    const hash = window.location.hash;

    // Status window (legacy popup or dedicated status view)
    if (hash === '#status') {
        return (
            <StatusWindow
                status={status}
                onOpenSettings={() => window.workerAPI.openSettings()}
            />
        );
    }

    // Main tray popup - uses TrayContainer for integrated experience
    return <TrayContainer />;
}

export default App;
