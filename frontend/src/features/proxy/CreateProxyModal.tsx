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
    Select,
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

export const CreateProxyModal: React.FC = () => {
    const styles = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        host: '',
        port: 8080,
        username: '',
        password: '',
        protocol: 'HTTP',
    });

    const mutation = useMutation({
        mutationFn: (newProxy: typeof formData) => api.post('/proxy', newProxy),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proxies'] });
            setIsOpen(false);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            ...formData,
            port: Number(formData.port),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary">Add Proxy</Button>
            </DialogTrigger>
            <DialogSurface>
                <form onSubmit={handleSubmit}>
                    <DialogBody>
                        <DialogTitle>Add New Proxy</DialogTitle>
                        <DialogContent className={styles.form}>
                            <Field label="Host (IP/Domain)" required>
                                <Input value={formData.host} onChange={(e) => setFormData({ ...formData, host: e.target.value })} />
                            </Field>
                            <Field label="Port" required>
                                <Input type="number" value={formData.port.toString()} onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 0 })} />
                            </Field>
                            <Field label="Protocol" required>
                                <Select value={formData.protocol} onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}>
                                    <option value="HTTP">HTTP</option>
                                    <option value="HTTPS">HTTPS</option>
                                    <option value="SOCKS5">SOCKS5</option>
                                </Select>
                            </Field>
                            <Field label="Username (Optional)">
                                <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                            </Field>
                            <Field label="Password (Optional)">
                                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </Field>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button appearance="primary" type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Adding...' : 'Add Proxy'}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </form>
            </DialogSurface>
        </Dialog>
    );
};
