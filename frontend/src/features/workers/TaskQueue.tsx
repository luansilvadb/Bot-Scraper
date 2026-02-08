import {
    makeStyles,
    tokens,
    Badge,
    Card,
    CardHeader,
    Title3,
    Text,
    shorthands,
} from '@fluentui/react-components';
import { useTasks } from './api';
import type { ScrapingTask } from './api';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { Open20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    container: {
        marginTop: tokens.spacingVerticalL,
    },
    card: {
        height: '100%',
    },
    description: {
        color: tokens.colorNeutralForeground2,
    },
    error: {
        color: tokens.colorStatusDangerForeground1,
        ...shorthands.padding(tokens.spacingVerticalM),
    },
});

export const TaskQueue = () => {
    const styles = useStyles();
    const { data: tasks, isLoading, error } = useTasks();

    const columns: Column<ScrapingTask>[] = [
        {
            key: 'targetUrl',
            header: 'Product',
            render: (t) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px' }}>
                    <Open20Regular fontSize={16} style={{ color: tokens.colorBrandForeground1, flexShrink: 0 }} />
                    <Text
                        size={300}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {t.targetUrl}
                    </Text>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (t) => {
                const statusMap: Record<string, { appearance: 'filled' | 'outline', color: 'success' | 'danger' | 'brand' | 'important' | 'subtle' }> = {
                    'COMPLETED': { appearance: 'filled', color: 'success' },
                    'FAILED': { appearance: 'filled', color: 'danger' },
                    'IN_PROGRESS': { appearance: 'outline', color: 'brand' },
                    'ASSIGNED': { appearance: 'outline', color: 'important' },
                };
                const style = statusMap[t.status] || { appearance: 'outline', color: 'subtle' };

                return (
                    <Badge appearance={style.appearance} color={style.color}>
                        {t.status}
                    </Badge>
                );
            }
        },
        { key: 'workerName', header: 'Assigned Worker', render: (t) => t.workerName || '-' },
        { key: 'priority', header: 'Priority' },
        {
            key: 'createdAt',
            header: 'Created',
            render: (t) => new Date(t.createdAt).toLocaleTimeString()
        },
        { key: 'attempts', header: 'Attempts' },
    ];

    if (error) {
        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <CardHeader
                        header={<Title3>Task Queue</Title3>}
                        description={<Text size={300} className={styles.description}>Monitor ongoing and completed automation tasks</Text>}
                    />
                    <div className={styles.error}>
                        Error loading tasks: {(error as Error).message}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <CardHeader
                    header={<Title3>Task Queue</Title3>}
                    description={<Text size={300} className={styles.description}>Monitor ongoing and completed automation tasks</Text>}
                />
                <DataTable
                    columns={columns}
                    data={tasks || []}
                    isLoading={isLoading}
                    emptyMessage="No tasks in queue."
                />
            </Card>
        </div>
    );
};
