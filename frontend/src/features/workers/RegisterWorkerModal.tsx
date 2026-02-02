import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
    DialogActions,
    Button,
    Input,
    Label,
    makeStyles,
} from '@fluentui/react-components';
import { useState } from 'react';
import { useRegisterWorker } from './api';

const useStyles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingTop: '12px',
    },
});

interface RegisterWorkerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (data: { token: string }) => void;
}

export function RegisterWorkerModal({ open, onOpenChange, onSuccess }: RegisterWorkerModalProps) {
    const styles = useStyles();
    const [name, setName] = useState('');
    const registerWorker = useRegisterWorker();

    const handleSubmit = () => {
        if (!name.trim()) return;

        registerWorker.mutate(
            { name },
            {
                onSuccess: (data) => {
                    onSuccess(data);
                    onOpenChange(false);
                    setName('');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Register New Worker</DialogTitle>
                    <DialogContent className={styles.content}>
                        <Label required>Worker Name</Label>
                        <Input
                            value={name}
                            onChange={(_, data) => setName(data.value)}
                            placeholder='e.g. "Home PC"'
                            disabled={registerWorker.isPending}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            appearance="secondary"
                            onClick={() => onOpenChange(false)}
                            disabled={registerWorker.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={handleSubmit}
                            disabled={!name.trim() || registerWorker.isPending}
                        >
                            {registerWorker.isPending ? 'Registering...' : 'Register'}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
