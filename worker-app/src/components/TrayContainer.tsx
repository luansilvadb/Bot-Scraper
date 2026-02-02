import React, { useState, useCallback, useEffect } from 'react';
import ViewTransition from './ViewTransition';
import StatusWindow from './StatusWindow';
import ConfigWindow from './ConfigWindow';
import { useWorkerStatus } from '../hooks/useWorkerStatus';
import './TrayContainer.css';

type ViewType = 'status' | 'config';

/**
 * TrayContainer - Main container for the tray popup window
 * 
 * Manages view state (Status vs Config) and provides smooth
 * animated transitions between views. Integrates with worker
 * status to determine initial view.
 */
const TrayContainer: React.FC = () => {
    const { status, isConfigured, connect } = useWorkerStatus();

    // Determine initial view based on configuration state
    const [activeView, setActiveView] = useState<ViewType>(
        isConfigured ? 'status' : 'config'
    );
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [configViewKey, setConfigViewKey] = useState(0);

    // Update view when configuration state changes externally
    useEffect(() => {
        if (!isConfigured && activeView === 'status') {
            setActiveView('config');
        }
    }, [isConfigured, activeView]);

    const handleOpenSettings = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setConfigViewKey(prev => prev + 1); // Force fresh mount to reset form state
        setActiveView('config');
    }, [isTransitioning]);

    const handleConfigSaved = useCallback(() => {
        setIsTransitioning(true);
        setActiveView('status');
        connect();
    }, [connect]);

    const handleConfigCancel = useCallback(() => {
        if (!isConfigured) return; // Can't cancel if not configured
        setIsTransitioning(true);
        setActiveView('status');
    }, [isConfigured]);

    const handleTransitionEnd = useCallback(() => {
        setIsTransitioning(false);
    }, []);

    return (
        <div className="tray-container glass-panel">
            <ViewTransition
                activeView={activeView}
                onTransitionEnd={handleTransitionEnd}
            >
                <StatusWindow
                    status={status}
                    onOpenSettings={handleOpenSettings}
                    embedded
                />
                <ConfigWindow
                    key={`config-${configViewKey}`}
                    onSaved={handleConfigSaved}
                    onCancel={isConfigured ? handleConfigCancel : undefined}
                    embedded
                />
            </ViewTransition>
        </div>
    );
};

export default TrayContainer;
