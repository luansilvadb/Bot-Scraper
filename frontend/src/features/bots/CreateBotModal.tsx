import React, { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
    Field,
    Input,
    makeStyles,
    shorthands,
} from '@fluentui/react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('16px'),
    },
});

export const CreateBotModal: React.FC = () => {
    const styles = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: '',
        targetUrl: '',
        affiliateTag: '',
        telegramToken: '',
        chatId: '',
        scheduleCron: '0 */4 * * *',
        proxyId: '', // Ideally a dropdown from fetched proxies
    });

    const mutation = useMutation({
        mutationFn: (newBot: Partial<typeof formData> & Omit<typeof formData, 'proxyId'> & { proxyId?: string }) =>
            api.post('/bots', newBot),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bots'] });
            setIsOpen(false);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            proxyId: formData.proxyId || undefined,
        };
        mutation.mutate(submissionData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary">Create Bot</Button>
            </DialogTrigger>
            <DialogSurface>
                <form onSubmit={handleSubmit}>
                    <DialogBody>
                        <DialogTitle>Create New Bot</DialogTitle>
                        <DialogContent className={styles.form}>
                            <Field label="Bot Name" required>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </Field>
                            <Field label="Target Amazon URL" required>
                                <Input value={formData.targetUrl} onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })} />
                            </Field>
                            <Field label="Affiliate Tag" required>
                                <Input value={formData.affiliateTag} onChange={(e) => setFormData({ ...formData, affiliateTag: e.target.value })} />
                            </Field>
                            <Field label="Telegram Bot Token" required>
                                <Input type="password" value={formData.telegramToken} onChange={(e) => setFormData({ ...formData, telegramToken: e.target.value })} />
                            </Field>
                            <Field label="Telegram Chat ID" required>
                                <Input value={formData.chatId} onChange={(e) => setFormData({ ...formData, chatId: e.target.value })} />
                            </Field>
                            <Field label="Schedule (Cron)" required>
                                <Input value={formData.scheduleCron} onChange={(e) => setFormData({ ...formData, scheduleCron: e.target.value })} />
                            </Field>
                            <Field label="Proxy ID (UUID)">
                                <Input value={formData.proxyId} onChange={(e) => setFormData({ ...formData, proxyId: e.target.value })} />
                            </Field>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button appearance="primary" type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Creating...' : 'Create'}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </form>
            </DialogSurface>
        </Dialog>
    );
};
