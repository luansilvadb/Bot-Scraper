import { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardHeader,
    CardFooter,
    Text,
    Badge,
    Button,
    makeStyles,
    tokens,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    Spinner,
    ProgressBar,
} from '@fluentui/react-components';
import {
    Delete20Regular,
    ArrowCounterclockwise20Regular,
    Globe20Regular,
    MoreVertical20Regular,
    Key20Regular,
    Eye20Regular,
    EyeOff20Regular,
} from '@fluentui/react-icons';
import type { LocalWorker } from './api';
import { useDeleteWorker, useRegenerateToken, useGetWorkerToken } from './api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { RegenerateTokenDialog } from './RegenerateTokenDialog';
import { TokenModal } from './TokenModal';
import { TokenDisplay } from './TokenDisplay';

const useStyles = makeStyles({
    card: {
        width: '320px',
        maxWidth: '100%',
        height: 'fit-content',
    },
    header: {
        marginBottom: '12px',
    },
    textWhite: {
        color: tokens.colorNeutralForeground1,
    },
    textSubtle: {
        color: tokens.colorNeutralForeground2,
    },
    stats: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        marginTop: '12px',
    },
    statRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badgeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        marginTop: '12px',
    },
    tokenSection: {
        marginTop: '12px',
        padding: '12px',
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
    },
    tokenHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    progressContainer: {
        marginTop: '8px',
    },
    progressLabel: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
    },
});

interface WorkerCardProps {
    worker: LocalWorker;
}

const AUTO_HIDE_SECONDS = 30;

export function WorkerCard({ worker }: WorkerCardProps) {
    const styles = useStyles();
    const deleteWorker = useDeleteWorker();
    const regenerateToken = useRegenerateToken();

    // State
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [tokenModalOpen, setTokenModalOpen] = useState(false);
    const [newToken, setNewToken] = useState('');

    // Show token state
    const [showToken, setShowToken] = useState(false);
    const [autoHideTimer, setAutoHideTimer] = useState<number>(AUTO_HIDE_SECONDS);

    // Fetch token only when revealing
    const { data: tokenData, isLoading: isLoadingToken, refetch: refetchToken } = useGetWorkerToken(
        worker.id,
        { enabled: showToken }
    );

    // Auto-hide countdown
    useEffect(() => {
        if (showToken && autoHideTimer > 0) {
            const interval = setInterval(() => {
                setAutoHideTimer((prev) => {
                    if (prev <= 1) {
                        setShowToken(false);
                        return AUTO_HIDE_SECONDS;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [showToken, autoHideTimer]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONNECTED':
                return 'success';
            case 'DISCONNECTED':
                return 'severe';
            case 'BLOCKED':
                return 'danger';
            default:
                return 'brand';
        }
    };

    const handleDelete = () => {
        deleteWorker.mutate(worker.id, {
            onSettled: () => setIsDeleting(false),
        });
    };

    const handleRegenerateConfirm = () => {
        regenerateToken.mutate(worker.id, {
            onSuccess: (data) => {
                setNewToken(data.token);
                setIsRegenerating(false);
                setTokenModalOpen(true);
            },
            onError: () => {
                setIsRegenerating(false);
                // TODO: Show error toast
            },
        });
    };

    const handleShowToken = useCallback(() => {
        setShowToken(true);
        setAutoHideTimer(AUTO_HIDE_SECONDS);
        refetchToken();
    }, [refetchToken]);

    const handleHideToken = useCallback(() => {
        setShowToken(false);
        setAutoHideTimer(AUTO_HIDE_SECONDS);
    }, []);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <>
            <Card className={styles.card}>
                <CardHeader
                    header={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Text weight="semibold" className={styles.textWhite}>{worker.name}</Text>
                            <Badge appearance="filled" color={getStatusColor(worker.status)}>
                                {worker.status}
                            </Badge>
                        </div>
                    }
                    description={
                        <Text size={200} className={styles.textSubtle}>ID: {worker.id.slice(0, 8)}...</Text>
                    }
                    className={styles.header}
                />

                <div className={styles.stats}>
                    <div className={styles.badgeRow}>
                        <Globe20Regular />
                        <Text size={300} weight="medium">
                            {worker.networkInfo?.ispName || 'Unknown ISP'}
                        </Text>
                    </div>
                    <div className={styles.statRow}>
                        <Text size={200} className={styles.textSubtle}>IP Address</Text>
                        <Text size={200}>{worker.networkInfo?.externalIp || 'N/A'}</Text>
                    </div>
                    <div className={styles.statRow}>
                        <Text size={200} className={styles.textSubtle}>Last Seen</Text>
                        <Text size={200}>{new Date(worker.lastSeenAt).toLocaleTimeString()}</Text>
                    </div>
                    <div className={styles.statRow}>
                        <Text size={200} className={styles.textSubtle}>Uptime</Text>
                        <Text size={200}>{formatUptime(worker.stats?.uptime || 0)}</Text>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${tokens.colorNeutralStroke2}` }}>
                        <div className={styles.statRow}>
                            <Text size={200} weight="semibold">Completed</Text>
                            <Text size={200} style={{ color: tokens.colorStatusSuccessForeground1 }}>
                                {worker.stats?.tasksCompleted || 0}
                            </Text>
                        </div>
                        <div className={styles.statRow}>
                            <Text size={200} weight="semibold">Failed</Text>
                            <Text size={200} style={{ color: tokens.colorStatusDangerForeground1 }}>
                                {worker.stats?.tasksFailed || 0}
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Token Reveal Section */}
                {showToken && (
                    <div className={styles.tokenSection}>
                        <div className={styles.tokenHeader}>
                            <Text weight="semibold" size={200}>Worker Token</Text>
                            <Button
                                appearance="subtle"
                                size="small"
                                icon={<EyeOff20Regular />}
                                onClick={handleHideToken}
                            >
                                Hide
                            </Button>
                        </div>
                        {isLoadingToken ? (
                            <Spinner size="tiny" label="Loading token..." />
                        ) : tokenData?.token ? (
                            <>
                                <TokenDisplay token={tokenData.token} size="small" />
                                <div className={styles.progressContainer}>
                                    <Text className={styles.progressLabel}>
                                        Auto-hiding in {autoHideTimer}s
                                    </Text>
                                    <ProgressBar
                                        value={autoHideTimer / AUTO_HIDE_SECONDS}
                                        thickness="medium"
                                    />
                                </div>
                            </>
                        ) : (
                            <Text size={200} className={styles.textSubtle}>
                                Failed to load token
                            </Text>
                        )}
                    </div>
                )}

                <CardFooter className={styles.footer}>
                    {/* Show Token Button */}
                    {!showToken && (
                        <Button
                            icon={<Eye20Regular />}
                            size="small"
                            appearance="subtle"
                            onClick={handleShowToken}
                        >
                            Show Token
                        </Button>
                    )}

                    {/* Reset Block Button */}
                    {worker.status === 'BLOCKED' && (
                        <Button icon={<ArrowCounterclockwise20Regular />} size="small">
                            Reset Block
                        </Button>
                    )}

                    {/* Actions Menu */}
                    <Menu>
                        <MenuTrigger disableButtonEnhancement>
                            <Button
                                icon={<MoreVertical20Regular />}
                                appearance="subtle"
                                size="small"
                            />
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                <MenuItem
                                    icon={<Key20Regular />}
                                    onClick={() => setIsRegenerating(true)}
                                >
                                    Regenerate Token
                                </MenuItem>
                                <MenuItem
                                    icon={<Delete20Regular />}
                                    onClick={() => setIsDeleting(true)}
                                >
                                    Delete Worker
                                </MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </CardFooter>
            </Card>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={isDeleting}
                title="Disconnect Worker"
                message={`Are you sure you want to remove worker "${worker.name}"? It will stop processing tasks immediately.`}
                confirmLabel="Disconnect"
                variant="danger"
                isLoading={deleteWorker.isPending}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleting(false)}
            />

            {/* Regenerate Token Confirmation */}
            <RegenerateTokenDialog
                open={isRegenerating}
                workerName={worker.name}
                isLoading={regenerateToken.isPending}
                onConfirm={handleRegenerateConfirm}
                onCancel={() => setIsRegenerating(false)}
            />

            {/* Token Modal (after regeneration) */}
            <TokenModal
                open={tokenModalOpen}
                token={newToken}
                workerName={worker.name}
                onClose={() => setTokenModalOpen(false)}
                title="Token Regenerated"
            />
        </>
    );
}
