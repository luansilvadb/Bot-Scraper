import React, { useState, useEffect } from 'react';
import {
    Field,
    Input,
    Textarea,
    Button,
    makeStyles,
    shorthands,
} from '@fluentui/react-components';
import type { SystemSetting } from './api';

const useStyles = makeStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('16px'),
        paddingTop: '16px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        ...shorthands.gap('8px'),
        paddingTop: '8px',
    },
});

interface SettingFormProps {
    mode: 'create' | 'edit';
    initialData?: SystemSetting;
    onSubmit: (data: SystemSetting) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const SettingForm: React.FC<SettingFormProps> = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const styles = useStyles();
    const [formData, setFormData] = useState<SystemSetting>({
        key: '',
        value: '',
    });
    const [errors, setErrors] = useState<{ key?: string; value?: string }>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: { key?: string; value?: string } = {};
        if (!formData.key.trim()) {
            newErrors.key = 'Key is required';
        }
        if (!formData.value.trim()) {
            newErrors.value = 'Value is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <Field
                label="Setting Key"
                required
                validationState={errors.key ? 'error' : 'none'}
                validationMessage={errors.key}
            >
                <Input
                    value={formData.key}
                    onChange={(e) => {
                        setFormData({ ...formData, key: e.target.value.toUpperCase() });
                        if (errors.key) setErrors({ ...errors, key: undefined });
                    }}
                    placeholder="E.g. TELEGRAM_TOKEN"
                    disabled={mode === 'edit'}
                />
            </Field>

            <Field
                label="Value"
                required
                validationState={errors.value ? 'error' : 'none'}
                validationMessage={errors.value}
            >
                <Textarea
                    value={formData.value}
                    onChange={(e) => {
                        setFormData({ ...formData, value: e.target.value });
                        if (errors.value) setErrors({ ...errors, value: undefined });
                    }}
                    placeholder="Enter value..."
                    resize="vertical"
                />
            </Field>

            <div className={styles.actions}>
                <Button appearance="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button appearance="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : mode === 'create' ? 'Add' : 'Update'}
                </Button>
            </div>
        </form>
    );
};

