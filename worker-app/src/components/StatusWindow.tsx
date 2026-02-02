import React from 'react';
import {
    Card,
    CardHeader,
    Text,
    Badge,
    Button,
    ProgressBar,
    Tooltip
} from '@fluentui/react-components';
import {
    Settings24Regular,
    Power24Regular,
    Play24Regular,
    Pause24Regular
} from '@fluentui/react-icons';
import type { WorkerStatus } from '../../electron/types';
import './StatusWindow.css';

interface StatusWindowProps {
    status: WorkerStatus | null;
    onOpenSettings: () => void;
    /** When true, renders in compact embedded style for tray popup */
    embedded?: boolean;
}

const StatusWindow: React.FC<StatusWindowProps> = ({ status, onOpenSettings, embedded = false }) => {
    if (!status) return null;

    const isWorking = status.connectionState === 'WORKING';
    const isConnected = status.connectionState === 'CONNECTED' || isWorking;

    const getStatusColor = () => {
        switch (status.connectionState) {
            case 'CONNECTED': return 'success';
            case 'WORKING': return 'brand';
            case 'CONNECTING':
            case 'RECONNECTING': return 'warning';
            case 'ERROR':
            case 'DISCONNECTED': return 'danger';
            default: return 'neutral';
        }
    };

    const getStatusText = () => {
        switch (status.connectionState) {
            case 'CONNECTED': return 'Conectado';
            case 'WORKING': return 'Trabalhando...';
            case 'CONNECTING': return 'Conectando...';
            case 'RECONNECTING': return 'Reconectando...';
            case 'DISCONNECTED': return 'Desconectado';
            case 'ERROR': return 'Erro';
            default: return status.connectionState;
        }
    };

    return (
        <div className={`status-window ${embedded ? 'embedded' : 'glass-panel'}`}>
            <Card appearance="subtle" className="status-card">
                <div className="status-header">
                    <div className="status-indicator-container">
                        <div className={`status-pulse ${status.connectionState.toLowerCase()}`} />
                        <div className={`status-dot ${status.connectionState.toLowerCase()}`} />
                    </div>
                    <div className="status-text-container">
                        <Text weight="bold" size={400} className="status-title">{getStatusText()}</Text>
                        <Text size={200} className="status-subtitle">
                            {status.ispName || 'Provedor desconhecido'} • {status.externalIp || 'IP não detectado'}
                        </Text>
                    </div>
                    <Button
                        appearance="subtle"
                        icon={<Settings24Regular />}
                        onClick={onOpenSettings}
                    />
                </div>

                <div className="stats-grid">
                    <Card appearance="filled-alternative" className="stat-card">
                        <Text size={500} weight="bold">{status.tasksCompleted}</Text>
                        <Text size={100} className="stat-label">COMPLETOS</Text>
                    </Card>
                    <Card appearance="filled-alternative" className="stat-card">
                        <Text size={500} weight="bold">{status.tasksFailed}</Text>
                        <Text size={100} className="stat-label">FALHAS</Text>
                    </Card>
                </div>

                {isWorking && status.currentTask && (
                    <Card appearance="filled-alternative" className="task-card">
                        <div className="task-header">
                            <Text weight="semibold">Processando...</Text>
                        </div>
                        <ProgressBar value={undefined} className="task-progress" />
                        <Text size={100} className="task-url" truncate>{status.currentTask.productUrl}</Text>
                    </Card>
                )}

                <div className="footer-actions">
                    <Button
                        appearance={status.isPaused ? "primary" : "outline"}
                        icon={status.isPaused ? <Play24Regular /> : <Pause24Regular />}
                        onClick={() => window.workerAPI.togglePause()}
                        size="large"
                        className="action-btn"
                    >
                        {status.isPaused ? 'Retomar' : 'Pausar'}
                    </Button>

                    <Button
                        appearance="outline"
                        icon={<Power24Regular />}
                        onClick={() => window.workerAPI.quitApp()}
                        size="large"
                        className="action-btn quit-btn"
                    >
                        Fechar
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default StatusWindow;
