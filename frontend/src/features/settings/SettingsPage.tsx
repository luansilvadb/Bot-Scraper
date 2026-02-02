import React, { useState } from 'react';
import {
    Subtitle1,
    Field,
    Input,
    Button,
    makeStyles,
    shorthands,
    tokens,
    MessageBar,
    Spinner
} from '@fluentui/react-components';
import { Save20Regular } from '@fluentui/react-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('24px'),
        maxWidth: '600px',
    },
    card: {
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.padding('24px'),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('16px'),
    }
});

export const SettingsPage: React.FC = () => {
    const styles = useStyles();
    const queryClient = useQueryClient();
    const [success, setSuccess] = useState(false);

    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await api.get('/settings');
            return response.data;
        }
    });

    const mutation = useMutation({
        mutationFn: (data: { key: string; value: string }) => api.post('/settings', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    });

    const getSetting = (key: string) => settings?.find((s: any) => s.key === key)?.value || '';

    const handleSave = (key: string, value: string) => {
        mutation.mutate({ key, value });
    };

    if (isLoading) return <Spinner label="Loading settings..." />;

    return (
        <div className={styles.container}>
            <Subtitle1>System Settings</Subtitle1>

            {success && <MessageBar intent="success">Settings saved successfully!</MessageBar>}

            <div className={styles.card}>
                <Field label="Global Amazon Affiliate Tag" hint="This will be used if a bot doesn't have one.">
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Input
                            defaultValue={getSetting('GLOBAL_AFFILIATE_TAG')}
                            onBlur={(e) => handleSave('GLOBAL_AFFILIATE_TAG', e.target.value)}
                        />
                    </div>
                </Field>

                <Field label="Scraping Frequency Multiplier" hint="1.0 is default. Increase to slow down.">
                    <Input
                        type="number"
                        defaultValue={getSetting('SCRAPING_MULTIPLIER') || '1.0'}
                        onBlur={(e) => handleSave('SCRAPING_MULTIPLIER', e.target.value)}
                    />
                </Field>

                <Field label="Admin Telegram ID" hint="For internal alerts.">
                    <Input
                        defaultValue={getSetting('ADMIN_TELEGRAM_ID')}
                        onBlur={(e) => handleSave('ADMIN_TELEGRAM_ID', e.target.value)}
                    />
                </Field>

                <Button
                    icon={<Save20Regular />}
                    appearance="primary"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>
        </div>
    );
};
