import {
    makeStyles,
    tokens,
    Badge,
    Title3,
} from '@fluentui/react-components';
import { useTasks } from './api';
import type { ScrapingTask } from './api';
import { DataTable } from '../../components/DataTable/DataTable';
import type { Column } from '../../components/DataTable/DataTable';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px',
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        marginTop: '24px',
    },
});

export function TaskQueue() {
    const styles = useStyles();
    const { data: tasks, isLoading } = useTasks();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'FAILED': return 'danger';
            case 'IN_PROGRESS': return 'brand';
            case 'ASSIGNED': return 'important';
            default: return 'subtle';
        }
    };

    const columns: Column<ScrapingTask>[] = [
        { key: 'targetUrl', header: 'Product URL', render: (t) => t.targetUrl },
        {
            key: 'status',
            header: 'Status',
            render: (t) => (
                <Badge appearance="filled" color={getStatusColor(t.status)}>
                    {t.status}
                </Badge>
            )
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

    return (
        <div className={styles.container}>
            <Title3>Task Queue</Title3>
            <DataTable
                columns={columns}
                data={tasks || []}
                isLoading={isLoading}
                emptyMessage="No tasks in queue."
            // Pagination props omitted for MVP (auto-pagination in DataTable if data provided?)
            // Actually DataTable expects manual pagination meta. 
            // Since I'm not handling pagination in useTasks yet (returning full list or first page), 
            // I'll leave pagination out for now or mock it.
            />
        </div>
    );
}
