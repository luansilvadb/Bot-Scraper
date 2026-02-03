import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogContent,
    DialogActions,
    Button,
    Text,
    makeStyles,
    tokens,
    MessageBar,
    MessageBarBody,
    shorthands,
} from '@fluentui/react-components';
import { Warning24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalM),
        paddingTop: tokens.spacingVerticalXS,
    },
    warningSection: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalS),
    },
    bulletList: {
        margin: '0',
        paddingLeft: '20px',
        color: tokens.colorNeutralForeground2,
    },
    bulletItem: {
        marginBottom: tokens.spacingVerticalXXS,
    },
    surface: {
        width: '90%',
        maxWidth: '480px',
    },
});

interface RegenerateTokenDialogProps {
    open: boolean;
    workerName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

/**
 * Confirmation dialog for token regeneration.
 * 
 * Warns the user that:
 * - The old token will stop working immediately
 * - Connected workers will be disconnected
 * - They need to reconfigure worker with new token
 */
export function RegenerateTokenDialog({
    open,
    workerName,
    onConfirm,
    onCancel,
    isLoading = false,
}: RegenerateTokenDialogProps) {
    const styles = useStyles();

    return (
        <Dialog open={open} modalType="alert">
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle>Regenerate Token?</DialogTitle>
                    <DialogContent className={styles.content}>
                        <Text>
                            Are you sure you want to regenerate the token for <strong>{workerName}</strong>?
                        </Text>

                        <MessageBar intent="warning" icon={<Warning24Regular />}>
                            <MessageBarBody>
                                This action cannot be undone.
                            </MessageBarBody>
                        </MessageBar>

                        <div className={styles.warningSection}>
                            <Text weight="semibold">What will happen:</Text>
                            <ul className={styles.bulletList}>
                                <li className={styles.bulletItem}>
                                    The current token will <strong>stop working immediately</strong>
                                </li>
                                <li className={styles.bulletItem}>
                                    Any connected worker using the old token will be <strong>disconnected</strong>
                                </li>
                                <li className={styles.bulletItem}>
                                    You will need to <strong>reconfigure your worker application</strong> with the new token
                                </li>
                            </ul>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            appearance="secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Regenerating...' : 'Regenerate Token'}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}

export default RegenerateTokenDialog;
