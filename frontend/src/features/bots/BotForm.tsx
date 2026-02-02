import { useState, useEffect } from 'react';
import {
    Field,
    Input,
    Select,
    Button,
    Spinner,
} from '@fluentui/react-components';
import type { CreateBotInput, UpdateBotInput, Bot } from './api';

interface BotFormProps {
    initialData?: Bot;
    onSubmit: (data: CreateBotInput | UpdateBotInput) => void;
    onCancel: () => void;
    isLoading?: boolean;
    mode: 'create' | 'edit';
}

interface FormErrors {
    name?: string;
    targetUrl?: string;
    affiliateTag?: string;
    telegramToken?: string;
    chatId?: string;
    scheduleCron?: string;
}

export function BotForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    mode,
}: BotFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        targetUrl: '',
        affiliateTag: '',
        telegramToken: '',
        chatId: '',
        scheduleCron: '*/30 * * * *',
        status: 'ACTIVE' as 'ACTIVE' | 'PAUSED' | 'ERROR',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                targetUrl: initialData.targetUrl || '',
                affiliateTag: initialData.affiliateTag || '',
                telegramToken: initialData.telegramToken || '',
                chatId: initialData.chatId || '',
                scheduleCron: initialData.scheduleCron || '*/30 * * * *',
                status: initialData.status || 'ACTIVE',
            });
        }
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.targetUrl.trim()) {
            newErrors.targetUrl = 'Target URL is required';
        } else {
            try {
                new URL(formData.targetUrl);
            } catch {
                newErrors.targetUrl = 'Must be a valid URL';
            }
        }

        if (!formData.affiliateTag.trim()) {
            newErrors.affiliateTag = 'Affiliate tag is required';
        }

        if (!formData.telegramToken.trim()) {
            newErrors.telegramToken = 'Telegram token is required';
        }

        if (!formData.chatId.trim()) {
            newErrors.chatId = 'Chat ID is required';
        }

        if (!formData.scheduleCron.trim()) {
            newErrors.scheduleCron = 'Schedule cron is required';
        } else {
            const cronRegex = /^(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)$/;
            if (!cronRegex.test(formData.scheduleCron)) {
                newErrors.scheduleCron = 'Must be a valid cron expression';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const submitData: CreateBotInput | UpdateBotInput = {
            name: formData.name,
            targetUrl: formData.targetUrl,
            affiliateTag: formData.affiliateTag,
            telegramToken: formData.telegramToken,
            chatId: formData.chatId,
            scheduleCron: formData.scheduleCron,
            status: formData.status,
        };

        onSubmit(submitData);
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field
                label="Name"
                required
                validationState={errors.name ? 'error' : 'none'}
                validationMessage={errors.name}
            >
                <Input
                    value={formData.name}
                    onChange={(_, data) => handleChange('name', data.value)}
                    placeholder="My Bot"
                    disabled={isLoading}
                />
            </Field>

            <Field
                label="Target URL"
                required
                validationState={errors.targetUrl ? 'error' : 'none'}
                validationMessage={errors.targetUrl}
            >
                <Input
                    value={formData.targetUrl}
                    onChange={(_, data) => handleChange('targetUrl', data.value)}
                    placeholder="https://www.amazon.com/..."
                    disabled={isLoading}
                />
            </Field>

            <Field
                label="Affiliate Tag"
                required
                validationState={errors.affiliateTag ? 'error' : 'none'}
                validationMessage={errors.affiliateTag}
            >
                <Input
                    value={formData.affiliateTag}
                    onChange={(_, data) => handleChange('affiliateTag', data.value)}
                    placeholder="mytag-20"
                    disabled={isLoading}
                />
            </Field>

            <Field
                label="Telegram Token"
                required
                validationState={errors.telegramToken ? 'error' : 'none'}
                validationMessage={errors.telegramToken}
            >
                <Input
                    value={formData.telegramToken}
                    onChange={(_, data) => handleChange('telegramToken', data.value)}
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    type="password"
                    disabled={isLoading}
                />
            </Field>

            <Field
                label="Chat ID"
                required
                validationState={errors.chatId ? 'error' : 'none'}
                validationMessage={errors.chatId}
            >
                <Input
                    value={formData.chatId}
                    onChange={(_, data) => handleChange('chatId', data.value)}
                    placeholder="-1001234567890"
                    disabled={isLoading}
                />
            </Field>

            <Field
                label="Schedule (Cron)"
                required
                validationState={errors.scheduleCron ? 'error' : 'none'}
                validationMessage={errors.scheduleCron}
            >
                <Input
                    value={formData.scheduleCron}
                    onChange={(_, data) => handleChange('scheduleCron', data.value)}
                    placeholder="*/30 * * * *"
                    disabled={isLoading}
                />
            </Field>

            <Field label="Status">
                <Select
                    value={formData.status}
                    onChange={(_, data) => handleChange('status', data.value)}
                    disabled={isLoading}
                >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                </Select>
            </Field>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button appearance="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button appearance="primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner size="tiny" /> : mode === 'create' ? 'Create Bot' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
