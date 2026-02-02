import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogContent,
    DialogBody,
    DialogActions,
    Button,
} from '@fluentui/react-components';
import { Warning24Regular } from '@fluentui/react-icons';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const confirmAppearance = variant === 'danger' ? 'primary' : 'primary';

    return (
        <Dialog open={open} onOpenChange={(_, data) => !data.open && onCancel()}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        {variant !== 'default' && (
                            <Warning24Regular
                                style={{
                                    color: variant === 'danger' ? '#d13438' : '#f7630c',
                                }}
                            />
                        )}
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <p style={{ margin: 0, color: '#444' }}>{message}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onCancel} disabled={isLoading}>
                            {cancelLabel}
                        </Button>
                        <Button
                            appearance={confirmAppearance}
                            onClick={onConfirm}
                            disabled={isLoading}
                            style={
                                variant === 'danger'
                                    ? { backgroundColor: '#d13438', color: 'white' }
                                    : undefined
                            }
                        >
                            {isLoading ? 'Loading...' : confirmLabel}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
