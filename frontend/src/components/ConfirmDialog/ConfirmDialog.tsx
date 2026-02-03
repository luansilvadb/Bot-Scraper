import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogContent,
    DialogBody,
    DialogActions,
    Button,
    makeStyles,
    shorthands,
    tokens,
} from '@fluentui/react-components';
import { Warning24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    title: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingHorizontalS),
    },
    dangerIcon: {
        color: tokens.colorStatusDangerForeground1,
    },
    warningIcon: {
        color: tokens.colorStatusWarningForeground1,
    },
    message: {
        margin: 0,
        color: tokens.colorNeutralForeground2,
    },
    dangerButton: {
        backgroundColor: tokens.colorStatusDangerBackground3,
        color: tokens.colorNeutralForegroundInverted,
        ':hover': {
            backgroundColor: tokens.colorStatusDangerBackground3Hover,
            color: tokens.colorNeutralForegroundInverted,
        },
        ':active': {
            backgroundColor: tokens.colorStatusDangerBackground3Pressed,
            color: tokens.colorNeutralForegroundInverted,
        },
    },
    surface: {
        width: '90%',
        maxWidth: '440px',
    },
});

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
    const styles = useStyles();

    const getIcon = () => {
        if (variant === 'danger') return <Warning24Regular className={styles.dangerIcon} />;
        if (variant === 'warning') return <Warning24Regular className={styles.warningIcon} />;
        return null;
    };

    return (
        <Dialog open={open} onOpenChange={(_, data) => !data.open && onCancel()}>
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle className={styles.title}>
                        {getIcon()}
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <p className={styles.message}>{message}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onCancel} disabled={isLoading}>
                            {cancelLabel}
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={variant === 'danger' ? styles.dangerButton : undefined}
                        >
                            {isLoading ? 'Loading...' : confirmLabel}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
