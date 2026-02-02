import {
    Card,
    CardHeader,
    CardFooter,
    Text,
    Badge,
    Button,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import {
    Delete20Regular,
    ArrowCounterclockwise20Regular,
    Globe20Regular,
} from '@fluentui/react-icons';
import type { LocalWorker } from './api';
import { useDeleteWorker } from './api';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useState } from 'react';

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
});

interface WorkerCardProps {
    worker: LocalWorker;
}

export function WorkerCard({ worker }: WorkerCardProps) {
    const styles = useStyles();
    const deleteWorker = useDeleteWorker();
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONNECTED':
                return 'success';
            case 'DISCONNECTED':
                return 'severe'; // Using 'severe' for disconnected/warning
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

                <CardFooter className={styles.footer}>
                    {/* Placeholder for future reset functionality */}
                    {worker.status === 'BLOCKED' && (
                        <Button icon={<ArrowCounterclockwise20Regular />} size="small">
                            Reset Block
                        </Button>
                    )}
                    <Button
                        icon={<Delete20Regular />}
                        appearance="subtle"
                        size="small"
                        onClick={() => setIsDeleting(true)}
                    />
                </CardFooter>
            </Card>

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
        </>
    );
}
