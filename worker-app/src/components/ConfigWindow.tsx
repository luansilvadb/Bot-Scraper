import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardHeader,
    Text,
    Field,
    Input,
    Button,
    Switch,
    Spinner
} from '@fluentui/react-components';
import {
    Save24Regular,
    Dismiss24Regular,
    Checkmark24Regular
} from '@fluentui/react-icons';
import type { WorkerConfig, ConfigValidationResult } from '../../electron/types';
import './ConfigWindow.css';

/** Connection state types for visual feedback */
type ConnectionState = 'idle' | 'validating' | 'connecting' | 'success' | 'error';

interface ConfigWindowProps {
    onSaved: () => void;
    onCancel?: () => void;
    /** When true, renders in compact embedded style for tray popup */
    embedded?: boolean;
}

const ConfigWindow: React.FC<ConfigWindowProps> = ({ onSaved, onCancel, embedded = false }) => {
    const [loading, setLoading] = useState(true);
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [config, setConfig] = useState<WorkerConfig>({
        serverUrl: '',
        workerToken: '',
        workerName: '',
        autoStart: false,
        minimizeToTray: true,
    });
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        window.workerAPI.getConfig().then((savedConfig) => {
            if (savedConfig) {
                setConfig(savedConfig);
            }
            setLoading(false);
        });
    }, []);

    const handleSave = useCallback(async () => {
        setConnectionState('validating');
        setErrors([]);

        // Brief validation delay for UX
        await new Promise(r => setTimeout(r, 200));

        if (!config.workerToken.trim()) {
            setConnectionState('error');
            setErrors(['Token é obrigatório']);
            return;
        }

        setConnectionState('connecting');

        try {
            const result: ConfigValidationResult = await window.workerAPI.saveConfig(config);
            if (result.valid) {
                setConnectionState('success');
                // Brief success animation before transitioning
                setTimeout(() => {
                    onSaved();
                }, 600);
            } else {
                setConnectionState('error');
                setErrors(result.errors);
            }
        } catch (e: any) {
            setConnectionState('error');
            setErrors(['Erro ao conectar: ' + e.message]);
        }
    }, [config, onSaved]);

    const isProcessing = connectionState === 'validating' || connectionState === 'connecting';
    const isSuccess = connectionState === 'success';
    const isError = connectionState === 'error';

    // Get state-specific class for animations
    const getStateClass = () => {
        if (isSuccess) return 'success';
        if (isError) return 'error';
        if (isProcessing) return 'connecting';
        return '';
    };

    if (loading) {
        return (
            <div className={`config-window ${embedded ? 'embedded' : 'glass-panel'} loading`}>
                <Spinner label="Carregando configurações..." />
            </div>
        );
    }

    // Success state - show checkmark
    if (isSuccess) {
        return (
            <div className={`config-window ${embedded ? 'embedded' : 'glass-panel'} success`}>
                <div className="success-feedback">
                    <div className="success-checkmark">
                        <svg viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-path" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                    <Text weight="semibold" size={400}>Conectado!</Text>
                </div>
            </div>
        );
    }

    return (
        <div className={`config-window ${embedded ? 'embedded' : 'glass-panel'} ${getStateClass()}`}>
            <Card appearance="subtle" className="config-card">
                <CardHeader
                    header={<Text weight="bold" size={500}>Configurações do Worker</Text>}
                    description={<Text size={200}>Cole seu token de acesso para conectar ao painel.</Text>}
                />

                <div className="form-content">
                    <div className="form-group">
                        <Field
                            label="Token de Acesso"
                            required
                            validationState={isError && config.workerToken.trim() === '' ? 'error' : 'none'}
                            validationMessage={isError && config.workerToken.trim() === '' ? 'Token é obrigatório' : 'Copie o token do seu painel de controle'}
                        >
                            <Input
                                value={config.workerToken}
                                onChange={(e, data) => {
                                    setConfig({ ...config, workerToken: data.value });
                                    if (isError) {
                                        setConnectionState('idle');
                                        setErrors([]);
                                    }
                                }}
                                placeholder="Cole seu token aqui"
                                type="password"
                                disabled={isProcessing}
                            />
                        </Field>
                    </div>



                    <div className="switches">
                        <Switch
                            label="Iniciar com o Windows"
                            checked={config.autoStart}
                            onChange={(e, data) => setConfig({ ...config, autoStart: data.checked })}
                            disabled={isProcessing}
                        />
                        <Switch
                            label="Minimizar para bandeja ao fechar"
                            checked={config.minimizeToTray}
                            onChange={(e, data) => setConfig({ ...config, minimizeToTray: data.checked })}
                            disabled={isProcessing}
                        />
                    </div>

                    {errors.length > 0 && (
                        <div className="error-list">
                            {errors.map((err, i) => (
                                <Text key={i} className="error-text" size={200}>• {err}</Text>
                            ))}
                        </div>
                    )}
                </div>

                <div className="footer-actions">
                    {onCancel && (
                        <Button
                            appearance="outline"
                            icon={<Dismiss24Regular />}
                            onClick={onCancel}
                            disabled={isProcessing}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        appearance="primary"
                        icon={isProcessing ? <Spinner size="tiny" /> : <Save24Regular />}
                        onClick={handleSave}
                        disabled={isProcessing}
                    >
                        {connectionState === 'connecting'
                            ? 'Conectando...'
                            : connectionState === 'validating'
                                ? 'Validando...'
                                : 'Conectar'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ConfigWindow;
