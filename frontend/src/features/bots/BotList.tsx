import { useState } from 'react';
import {
    Badge,
    Button,
    makeStyles,
    shorthands,
    tokens,
    Input,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    ToastBody,
    useId,
    Card,
    Title3,
    Text,
} from '@fluentui/react-components';
import {
    Edit20Regular,
    Delete20Regular,
    Play20Regular,
    Search20Regular,
} from '@fluentui/react-icons';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { CreateBotModal } from './CreateBotModal';
import { EditBotModal } from './EditBotModal';
import { useBots, useDeleteBot, useTriggerBot } from './api';
import type { Bot } from './api';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXL),
    },
    card: {
        ...shorthands.padding(tokens.spacingHorizontalXL),
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.06)'),
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...shorthands.gap(tokens.spacingHorizontalM),
        marginBottom: tokens.spacingVerticalXL,
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXXS),
    },
    subtitle: {
        color: tokens.colorNeutralForeground2,
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('16px'),
    },
    searchContainer: {
        minWidth: '250px',
    },
    controlsRight: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalM),
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingHorizontalM),
    },
    tableContainer: {
        marginTop: tokens.spacingVerticalM,
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('6px'),
        justifyContent: 'flex-end',
    },
    deleteAction: {
        ':hover': {
            color: tokens.colorStatusDangerForeground1,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
        },
    },
    urlText: {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
        color: tokens.colorNeutralForeground3,
    },
    errorContainer: {
        color: tokens.colorStatusDangerForeground1,
        ...shorthands.padding('24px'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...shorthands.gap('16px'),
    }
});

export function BotList() {
    const styles = useStyles();
    const toasterId = useId('bot-list-toaster');
    const { dispatchToast } = useToastController(toasterId);

    // State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [editingBot, setEditingBot] = useState<Bot | null>(null);
    const [deletingBot, setDeletingBot] = useState<Bot | null>(null);

    // Queries & Mutations
    const { data, isLoading, error } = useBots({ page, limit, search: search || undefined });
    const deleteBot = useDeleteBot();
    const triggerBot = useTriggerBot();

    // Handlers
    const handleTrigger = (bot: Bot) => {
        triggerBot.mutate(bot.id, {
            onSuccess: () => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Scraping started!</ToastTitle>
                        <ToastBody>Bot "{bot.name}" is now scraping.</ToastBody>
                    </Toast>,
                    { intent: 'success' }
                );
            },
            onError: (err) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Failed to trigger scraping</ToastTitle>
                        <ToastBody>{err.message || 'An error occurred'}</ToastBody>
                    </Toast>,
                    { intent: 'error' }
                );
            },
        });
    };

    const handleDelete = () => {
        if (!deletingBot) return;

        deleteBot.mutate(deletingBot.id, {
            onSuccess: () => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Bot deleted</ToastTitle>
                        <ToastBody>Bot "{deletingBot.name}" has been removed.</ToastBody>
                    </Toast>,
                    { intent: 'success' }
                );
                setDeletingBot(null);
            },
            onError: (err) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Failed to delete bot</ToastTitle>
                        <ToastBody>{err.message || 'An error occurred'}</ToastBody>
                    </Toast>,
                    { intent: 'error' }
                );
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge appearance="filled" color="success">Active</Badge>;
            case 'PAUSED':
                return <Badge appearance="filled" color="warning">Paused</Badge>;
            case 'ERROR':
                return <Badge appearance="filled" color="danger">Error</Badge>;
            default:
                return <Badge appearance="outline">Unknown</Badge>;
        }
    };

    const columns: Column<Bot>[] = [
        { key: 'name', header: 'Name' },
        {
            key: 'targetUrl',
            header: 'Target URL',
            render: (bot) => (
                <span className={styles.urlText}>
                    {bot.targetUrl}
                </span>
            ),
        },
        { key: 'scheduleCron', header: 'Schedule' },
        {
            key: 'status',
            header: 'Status',
            render: (bot) => getStatusBadge(bot.status),
        },
    ];

    const renderActions = (bot: Bot) => (
        <div className={styles.actions}>
            <Button
                icon={<Search20Regular />}
                size="small"
                appearance="subtle"
                title="Scrape Now"
                onClick={() => handleTrigger(bot)}
                disabled={triggerBot.isPending}
            />
            <Button
                icon={<Play20Regular />}
                size="small"
                appearance="subtle"
                title="Run"
                disabled={bot.status === 'ACTIVE'}
            />
            <Button
                icon={<Edit20Regular />}
                size="small"
                appearance="subtle"
                title="Edit"
                onClick={() => setEditingBot(bot)}
            />
            <Button
                icon={<Delete20Regular />}
                size="small"
                appearance="subtle"
                title="Delete"
                className={styles.deleteAction}
                onClick={() => setDeletingBot(bot)}
            />
        </div>
    );

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <Text weight="semibold">Error loading bots: {error.message}</Text>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    // Data is now properly extracted by the hook: { data: [], meta: {} }
    const bots = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className={styles.container}>
            <Toaster toasterId={toasterId} />

            <Card className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <Title3>Managed Bots</Title3>
                        <Text size={300} className={styles.subtitle}>
                            Configure and monitor your scraping automation
                        </Text>
                    </div>
                    <div className={styles.controls}>
                        <div className={styles.controlsRight}>
                            <Input
                                placeholder="Search bots..."
                                value={search}
                                onChange={(_, d) => {
                                    setSearch(d.value);
                                    setPage(1);
                                }}
                                contentBefore={<Search20Regular />}
                                className={styles.searchContainer}
                            />
                            <CreateBotModal />
                        </div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <DataTable
                        columns={columns}
                        data={bots}
                        meta={meta}
                        isLoading={isLoading}
                        emptyMessage="No bots found. Create your first bot!"
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                        actions={renderActions}
                    />
                </div>
            </Card>

            {/* Edit Modal */}
            {editingBot && (
                <EditBotModal
                    bot={editingBot}
                    open={!!editingBot}
                    onOpenChange={(open) => !open && setEditingBot(null)}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deletingBot}
                title="Delete Bot"
                message={`Are you sure you want to delete "${deletingBot?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={deleteBot.isPending}
                onConfirm={handleDelete}
                onCancel={() => setDeletingBot(null)}
            />
        </div>
    );
}

