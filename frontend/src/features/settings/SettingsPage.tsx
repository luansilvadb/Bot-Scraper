import { useState } from 'react';
import {
    Button,
    makeStyles,
    shorthands,
    tokens,
    Input,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    useId,
    Card,
    Title3,
    Text,
} from '@fluentui/react-components';
import {
    Search20Regular,
    Edit20Regular,
    Delete20Regular,
} from '@fluentui/react-icons';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { CreateSettingModal } from './CreateSettingModal';
import { useSettings, useDeleteSetting, useUpsertSetting, type SystemSetting } from './api';
import { SettingForm } from './SettingForm';
import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
} from '@fluentui/react-components';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXL),
    },
    card: {
        ...shorthands.padding(tokens.spacingHorizontalXL),
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...shorthands.gap(tokens.spacingHorizontalM),
        marginBottom: tokens.spacingVerticalXL,
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingHorizontalM),
    },
    searchContainer: {
        minWidth: '250px',
    },
    tableContainer: {
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    },
    errorContainer: {
        color: tokens.colorStatusDangerForeground1,
        ...shorthands.padding(tokens.spacingVerticalXL),
        textAlign: 'center',
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXXS),
    },
    subtitle: {
        color: tokens.colorNeutralForeground2,
    },
    actions: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalXXS),
    },
    valueCell: {
        color: tokens.colorNeutralForeground2,
        fontFamily: 'monospace',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '300px',
    }
});

export const SettingsPage: React.FC = () => {
    const styles = useStyles();
    const toasterId = useId('settings-toaster');
    const { dispatchToast } = useToastController(toasterId);

    // State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);

    // Queries
    const { data, isLoading, error } = useSettings({ page, limit, search: search || undefined });
    const deleteMutation = useDeleteSetting();
    const upsertMutation = useUpsertSetting();

    const handleDelete = async () => {
        if (!deletingKey) return;
        try {
            await deleteMutation.mutateAsync(deletingKey);
            dispatchToast(
                <Toast><ToastTitle>Setting "{deletingKey}" deleted</ToastTitle></Toast>,
                { intent: 'success' }
            );
            setDeletingKey(null);
        } catch (err: any) {
            dispatchToast(
                <Toast><ToastTitle>Error: {err.message}</ToastTitle></Toast>,
                { intent: 'error' }
            );
        }
    };

    const handleEditSubmit = async (data: SystemSetting) => {
        try {
            await upsertMutation.mutateAsync(data);
            dispatchToast(
                <Toast><ToastTitle>Setting updated</ToastTitle></Toast>,
                { intent: 'success' }
            );
            setEditingSetting(null);
        } catch (err: any) {
            dispatchToast(
                <Toast><ToastTitle>Error: {err.message}</ToastTitle></Toast>,
                { intent: 'error' }
            );
        }
    };

    const columns: Column<SystemSetting>[] = [
        { key: 'key', header: 'Key' },
        {
            key: 'value',
            header: 'Value',
            render: (item) => <div className={styles.valueCell}>{item.value}</div>
        },
    ];

    const renderActions = (item: SystemSetting) => (
        <div className={styles.actions}>
            <Button
                icon={<Edit20Regular />}
                size="small"
                appearance="subtle"
                onClick={() => setEditingSetting(item)}
            />
            <Button
                icon={<Delete20Regular />}
                size="small"
                appearance="subtle"
                onClick={() => setDeletingKey(item.key)}
            />
        </div>
    );

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <Text weight="semibold">Error loading settings: {error.message}</Text>
            </div>
        );
    }

    const settings = (data?.data ?? []).map(s => ({ ...s, id: s.key }));
    const meta = data?.meta;

    return (
        <div className={styles.container}>
            <Toaster toasterId={toasterId} />

            <Card className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <Title3>System Settings</Title3>
                        <Text size={300} className={styles.subtitle}>
                            Global configuration for bots and scrapers
                        </Text>
                    </div>
                    <div className={styles.headerLeft}>
                        <div className={styles.searchContainer}>
                            <Input
                                placeholder="Search keys..."
                                value={search}
                                onChange={(_, d) => {
                                    setSearch(d.value);
                                    setPage(1);
                                }}
                                contentBefore={<Search20Regular />}
                            />
                        </div>
                        <CreateSettingModal />
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <DataTable
                        columns={columns as any}
                        data={settings}
                        meta={meta}
                        isLoading={isLoading}
                        emptyMessage="No settings found."
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                        actions={renderActions as any}
                    />
                </div>
            </Card>



            {/* Edit Dialog */}
            <Dialog
                open={!!editingSetting}
                onOpenChange={(_, d) => !d.open && setEditingSetting(null)}
            >
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Edit Setting</DialogTitle>
                        <DialogContent>
                            <SettingForm
                                mode="edit"
                                initialData={editingSetting || undefined}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setEditingSetting(null)}
                                isLoading={upsertMutation.isPending}
                            />
                        </DialogContent>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deletingKey}
                title="Delete Setting"
                message={`Are you sure you want to delete setting "${deletingKey}"? This value might be required for the system to function.`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={deleteMutation.isPending}
                onConfirm={handleDelete}
                onCancel={() => setDeletingKey(null)}
            />
        </div>
    );
};

