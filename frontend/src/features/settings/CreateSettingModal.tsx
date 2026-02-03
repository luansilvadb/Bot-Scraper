import React, { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
    Button,
    makeStyles,
} from '@fluentui/react-components';
import { Add20Regular } from '@fluentui/react-icons';
import { SettingForm } from './SettingForm';
import { useUpsertSetting, type SystemSetting } from './api';
import { useToast } from '../../hooks/useToast';

const useStyles = makeStyles({
    surface: {
        width: '90%',
        maxWidth: '560px',
    },
});

export const CreateSettingModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const upsertSetting = useUpsertSetting();
    const { showToast } = useToast();

    const handleSubmit = async (data: SystemSetting) => {
        try {
            await upsertSetting.mutateAsync(data);
            showToast({ title: 'Setting added successfully', intent: 'success' });
            setIsOpen(false);
        } catch (error) {
            showToast({
                title: 'Failed to add setting',
                body: error instanceof Error ? error.message : undefined,
                intent: 'error',
            });
        }
    };

    const styles = useStyles();

    return (
        <Dialog open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" icon={<Add20Regular />}>
                    Add New Setting
                </Button>
            </DialogTrigger>
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle>Add System Setting</DialogTitle>
                    <DialogContent>
                        <SettingForm
                            mode="create"
                            onSubmit={handleSubmit}
                            onCancel={() => setIsOpen(false)}
                            isLoading={upsertSetting.isPending}
                        />
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
