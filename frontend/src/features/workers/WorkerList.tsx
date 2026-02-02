import {
    makeStyles,
    tokens,
    Title3,
    Button,
    Spinner,
    Input,
    Text,
    Toaster,
    useToastController,
    useId,
    Toast,
    ToastTitle,
    ToastBody,
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
import { TaskQueue } from './TaskQueue';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px',
        height: '100%',
        boxSizing: 'border-box',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
    },
    controls: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
        width: '100%',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        gap: '16px',
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        border: `1px dashed ${tokens.colorNeutralStroke1}`,
    },
});

export function WorkerList() {
    const styles = useStyles();
    const toasterId = useId('worker-list-toaster');
    const { dispatchToast } = useToastController(toasterId);

    const [search, setSearch] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const { data: workers, isLoading, error, refetch } = useWorkers();

    const filteredWorkers = workers?.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.id.includes(search) ||
        w.networkInfo?.externalIp?.includes(search)
    ) || [];

    const handleRegisterSuccess = (data: { token: string }) => {
        dispatchToast(
            <Toast>
                <ToastTitle>Worker Registered</ToastTitle>
                <ToastBody>
                    Token: <strong>{data.token}</strong><br />
                    Copy this token now! It won't be shown again.
                </ToastBody>
            </Toast>,
            { intent: 'success', timeout: 10000 }
        );
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
            <Toaster toasterId={toasterId} />

            <div className={styles.header}>
                <Title3>Local Workers</Title3>
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
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                    <Spinner label="Loading workers..." />
                </div>
            ) : filteredWorkers.length === 0 ? (
                <div className={styles.emptyState}>
                    <Text size={400} weight="semibold">No Workers Found</Text>
                    <Text>
                        {search ? "Try adjusting your search filters." : "Register a new local worker to get started."}
                    </Text>
                    {!search && (
                        <Button appearance="primary" onClick={() => setIsRegistering(true)}>
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
        </div>
    );
}
