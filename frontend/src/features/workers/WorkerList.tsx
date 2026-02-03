import {
    makeStyles,
    shorthands,
    tokens,
    Title3,
    Button,
    Skeleton,
    SkeletonItem,
    Card,
    Input,
    Text,
} from '@fluentui/react-components';
import {
    ArrowClockwise20Regular,
    Add20Regular,
    Search20Regular,
} from '@fluentui/react-icons';
import { useState } from 'react';
import { useWorkers } from './api';
import { WorkerCard } from './WorkerCard';
import { RegisterWorkerModal } from './RegisterWorkerModal';
import { TokenModal } from './TokenModal';
import { TaskQueue } from './TaskQueue';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXL),
        ...shorthands.padding(tokens.spacingVerticalXL),
        height: '100%',
        boxSizing: 'border-box',
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: tokens.spacingVerticalXL,
    },
    controls: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalM),
        alignItems: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        ...shorthands.gap(tokens.spacingHorizontalXL),
        width: '100%',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding(tokens.spacingVerticalXXXL),
        ...shorthands.gap(tokens.spacingHorizontalM),
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground2, // Use Card background
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'dashed', tokens.colorNeutralStroke1),
    },
    emptyStateText: {
        textAlign: 'center',
        maxWidth: '300px',
    },
    emptyStateIcon: {
        fontSize: '48px',
        marginBottom: '8px',
    },
    registerButton: {
        marginTop: tokens.spacingVerticalM,
    },
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
        ...shorthands.padding(tokens.spacingVerticalXXXL),
    },
    subtitle: {
        color: tokens.colorNeutralForeground2,
        marginTop: tokens.spacingVerticalXXS,
    }
});

export function WorkerList() {
    const styles = useStyles();

    const [search, setSearch] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // Token modal state
    const [tokenModalOpen, setTokenModalOpen] = useState(false);
    const [registeredToken, setRegisteredToken] = useState('');
    const [registeredWorkerName, setRegisteredWorkerName] = useState('');

    const { data: workers, isLoading, error, refetch } = useWorkers();

    const filteredWorkers = workers?.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.id.includes(search) ||
        w.networkInfo?.externalIp?.includes(search)
    ) || [];

    const handleRegisterSuccess = (data: { token: string; name?: string }) => {
        // Open TokenModal instead of Toast
        setRegisteredToken(data.token);
        setRegisteredWorkerName(data.name || '');
        setTokenModalOpen(true);
    };

    const handleTokenModalClose = () => {
        setTokenModalOpen(false);
        setRegisteredToken('');
        setRegisteredWorkerName('');
        refetch(); // Refresh worker list
    };

    if (error) {
        return (
            <div className={styles.container}>
                <Text>Error loading workers: {(error as Error).message}</Text>
                <Button onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div>
                    <Title3>Local Workers</Title3>
                    <Text block size={300} className={styles.subtitle}>
                        Manage your distributed scraping nodes
                    </Text>
                </div>
                <div className={styles.controls}>
                    <Input
                        placeholder="Search workers..."
                        contentBefore={<Search20Regular />}
                        value={search}
                        onChange={(_, d) => setSearch(d.value)}
                    />
                    <Button
                        icon={<ArrowClockwise20Regular />}
                        appearance="subtle"
                        onClick={() => refetch()}
                        title="Refresh list"
                    />
                    <Button
                        icon={<Add20Regular />}
                        appearance="primary"
                        onClick={() => setIsRegistering(true)}
                    >
                        Register Worker
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className={styles.grid}>
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} style={{ padding: '16px', minHeight: '300px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <Skeleton>
                                    <SkeletonItem size={20} style={{ width: '120px' }} />
                                </Skeleton>
                                <Skeleton>
                                    <SkeletonItem size={24} style={{ width: '60px', borderRadius: '12px' }} />
                                </Skeleton>
                            </div>
                            <Skeleton>
                                <SkeletonItem size={12} style={{ width: '40%', marginBottom: '24px' }} />
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <SkeletonItem shape="circle" size={16} />
                                    <SkeletonItem size={16} style={{ width: '60%' }} />
                                </div>
                                <SkeletonItem size={12} style={{ width: '80%', marginBottom: '8px' }} />
                                <SkeletonItem size={12} style={{ width: '70%', marginBottom: '8px' }} />
                                <SkeletonItem size={12} style={{ width: '90%', marginBottom: '24px' }} />
                            </Skeleton>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                <SkeletonItem shape="rectangle" style={{ flexGrow: 1, height: '32px', borderRadius: '4px' }} />
                                <SkeletonItem shape="rectangle" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : filteredWorkers.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>🔍</div>
                    <Text size={500} weight="semibold">No Workers Found</Text>
                    <Text className={styles.emptyStateText}>
                        {search ? `We couldn't find any workers matching "${search}".` : "Register a new local worker node to start scraping at scale."}
                    </Text>
                    {!search && (
                        <Button
                            appearance="primary"
                            size="large"
                            icon={<Add20Regular />}
                            onClick={() => setIsRegistering(true)}
                            className={styles.registerButton}
                        >
                            Register First Worker
                        </Button>
                    )}
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredWorkers.map(worker => (
                        <WorkerCard key={worker.id} worker={worker} />
                    ))}
                </div>
            )}

            <TaskQueue />

            <RegisterWorkerModal
                open={isRegistering}
                onOpenChange={setIsRegistering}
                onSuccess={handleRegisterSuccess}
            />

            <TokenModal
                open={tokenModalOpen}
                token={registeredToken}
                workerName={registeredWorkerName}
                onClose={handleTokenModalClose}
                title="Worker Registered Successfully"
            />
        </div>
    );
}
