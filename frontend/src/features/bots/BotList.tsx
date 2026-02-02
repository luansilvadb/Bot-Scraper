import { useState } from 'react';
import {
    Badge,
    Button,
    Subtitle1,
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
        ...shorthands.gap('24px'),
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...shorthands.gap('16px'),
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('16px'),
    },
    searchContainer: {
        minWidth: '250px',
    },
    tableContainer: {
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
        ...shorthands.padding('16px'),
    },
    actions: {
        display: 'flex',
        ...shorthands.gap('4px'),
    },
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
                <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
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
                title="Scrape Now"
                onClick={() => handleTrigger(bot)}
                disabled={triggerBot.isPending}
            />
            <Button
                icon={<Play20Regular />}
                size="small"
                title="Run"
                disabled={bot.status === 'ACTIVE'}
            />
            <Button
                icon={<Edit20Regular />}
                size="small"
                title="Edit"
                onClick={() => setEditingBot(bot)}
            />
            <Button
                icon={<Delete20Regular />}
                size="small"
                appearance="subtle"
                title="Delete"
                onClick={() => setDeletingBot(bot)}
            />
        </div>
    );

    if (error) {
        return (
            <div style={{ color: 'red', padding: '1rem' }}>
                Error loading bots: {error.message}
            </div>
        );
    }

    // Data is now properly extracted by the hook: { data: [], meta: {} }
    const bots = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className={styles.container}>
            <Toaster toasterId={toasterId} />

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Subtitle1>Managed Bots</Subtitle1>
                    <div className={styles.searchContainer}>
                        <Input
                            placeholder="Search bots..."
                            value={search}
                            onChange={(_, d) => {
                                setSearch(d.value);
                                setPage(1);
                            }}
                            contentBefore={<Search20Regular />}
                        />
                    </div>
                </div>
                <CreateBotModal />
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

