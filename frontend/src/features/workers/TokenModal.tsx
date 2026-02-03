import { useState, useCallback } from 'react';
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
} from '@fluentui/react-components';
import {
    Warning24Regular,
    Dismiss24Regular,
    Checkmark24Regular,
} from '@fluentui/react-icons';
import { TokenDisplay } from './TokenDisplay';
import { shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalM),
        paddingTop: tokens.spacingVerticalM,
    },
    warningBanner: {
        backgroundColor: tokens.colorPaletteYellowBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        display: 'flex',
        alignItems: 'flex-start',
        ...shorthands.gap(tokens.spacingHorizontalM),
    },
    warningIcon: {
        color: tokens.colorPaletteYellowForeground1,
        flexShrink: 0,
        marginTop: '2px',
    },
    warningText: {
        color: tokens.colorNeutralForeground1,
        fontSize: tokens.fontSizeBase300,
        lineHeight: tokens.lineHeightBase300,
    },
    tokenSection: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalS),
    },
    tokenLabel: {
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground2,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        ...shorthands.gap(tokens.spacingHorizontalS),
        paddingTop: tokens.spacingVerticalS,
    },
    confirmContent: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalM),
        ...shorthands.padding(tokens.spacingVerticalM, '0'),
    },
    surface: {
        width: '90%',
        maxWidth: '560px',
    },
    confirmSurface: {
        width: '90%',
        maxWidth: '440px',
    },
});

interface TokenModalProps {
    open: boolean;
    token: string;
    workerName?: string;
    onClose: () => void;
    title?: string;
}

/**
 * Modal for displaying a worker token after registration or regeneration.
 * 
 * Features:
 * - Prominent token display with copy button
 * - Security warning about one-time visibility
 * - Confirmation dialog before closing to ensure user saved token
 * - Clipboard fallback for older browsers
 */
export function TokenModal({
    open,
    token,
    workerName,
    onClose,
    title = 'Worker Token Generated'
}: TokenModalProps) {
    const styles = useStyles();
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const handleCloseAttempt = useCallback(() => {
        if (!hasCopied) {
            setShowConfirmClose(true);
        } else {
            onClose();
        }
    }, [hasCopied, onClose]);

    const handleConfirmClose = useCallback(() => {
        setShowConfirmClose(false);
        onClose();
    }, [onClose]);

    const handleCancelClose = useCallback(() => {
        setShowConfirmClose(false);
    }, []);

    const handleTokenCopied = useCallback(() => {
        setHasCopied(true);
    }, []);

    // Reset state when modal reopens
    const handleOpenChange = useCallback((_: unknown, data: { open: boolean }) => {
        if (!data.open) {
            handleCloseAttempt();
        }
    }, [handleCloseAttempt]);

    // Confirmation dialog for closing without copying
    if (showConfirmClose) {
        return (
            <Dialog open={true}>
                <DialogSurface className={styles.confirmSurface}>
                    <DialogBody>
                        <DialogTitle>Did you save your token?</DialogTitle>
                        <DialogContent className={styles.confirmContent}>
                            <MessageBar intent="warning">
                                <MessageBarBody>
                                    This token will not be shown again unless you regenerate it.
                                    Make sure you have copied and saved it securely.
                                </MessageBarBody>
                            </MessageBar>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                appearance="secondary"
                                onClick={handleCancelClose}
                            >
                                Go Back
                            </Button>
                            <Button
                                appearance="primary"
                                icon={<Checkmark24Regular />}
                                onClick={handleConfirmClose}
                            >
                                Yes, I saved it
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
            modalType="alert"
        >
            <DialogSurface className={styles.surface}>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent className={styles.content}>
                        {/* Security Warning Banner */}
                        <div className={styles.warningBanner}>
                            <Warning24Regular className={styles.warningIcon} />
                            <Text className={styles.warningText}>
                                <strong>Save this token now!</strong> It will only be shown once.
                                {' '}You will need this token to configure your worker application.
                            </Text>
                        </div>

                        {/* Worker Name (if provided) */}
                        {workerName && (
                            <Text>
                                Worker: <strong>{workerName}</strong>
                            </Text>
                        )}

                        {/* Token Display Section */}
                        <div className={styles.tokenSection}>
                            <Text className={styles.tokenLabel}>Your Token:</Text>
                            <TokenDisplay
                                token={token}
                                onCopied={handleTokenCopied}
                                size="large"
                            />
                        </div>

                        {hasCopied && (
                            <MessageBar intent="success">
                                <MessageBarBody>
                                    Token copied to clipboard! You can now close this dialog.
                                </MessageBarBody>
                            </MessageBar>
                        )}
                    </DialogContent>
                    <DialogActions className={styles.actions}>
                        <Button
                            appearance={hasCopied ? "primary" : "secondary"}
                            icon={hasCopied ? <Checkmark24Regular /> : <Dismiss24Regular />}
                            onClick={handleCloseAttempt}
                        >
                            {hasCopied ? 'Done' : 'Close'}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}

export default TokenModal;
