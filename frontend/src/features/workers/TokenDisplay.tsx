import {
    makeStyles,
    tokens,
    Input,
    Button,
    Text,
    Tooltip,
} from '@fluentui/react-components';
import { Copy20Regular, Checkmark20Regular } from '@fluentui/react-icons';
import { useClipboard } from '../../hooks/useClipboard';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    tokenRow: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    tokenInput: {
        flex: 1,
        fontFamily: 'monospace',
        letterSpacing: '0.5px',
    },
    copyButton: {
        minWidth: '100px',
    },
    copiedButton: {
        backgroundColor: tokens.colorPaletteGreenBackground2,
        color: tokens.colorPaletteGreenForeground2,
        '&:hover': {
            backgroundColor: tokens.colorPaletteGreenBackground2,
        },
    },
    errorText: {
        color: tokens.colorPaletteRedForeground1,
        fontSize: tokens.fontSizeBase200,
    },
    fallbackContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    fallbackLabel: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground2,
    },
});

interface TokenDisplayProps {
    token: string;
    showCopyButton?: boolean;
    size?: 'small' | 'medium' | 'large';
    onCopied?: () => void;
}

/**
 * Reusable component for displaying tokens with copy functionality.
 * 
 * Features:
 * - Monospace font for token display
 * - One-click copy button with "Copied!" feedback
 * - Fallback to selectable text if clipboard API unavailable
 * 
 * @example
 * <TokenDisplay token="abc-123-xyz" onCopied={() => console.log('Copied!')} />
 */
export function TokenDisplay({
    token,
    showCopyButton = true,
    size = 'medium',
    onCopied
}: TokenDisplayProps) {
    const styles = useStyles();
    const { copied, copyToClipboard, error } = useClipboard();

    const handleCopy = async () => {
        const success = await copyToClipboard(token);
        if (success && onCopied) {
            onCopied();
        }
    };

    const inputSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';

    return (
        <div className={styles.container}>
            <div className={styles.tokenRow}>
                <Input
                    value={token}
                    readOnly
                    size={inputSize}
                    className={styles.tokenInput}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                {showCopyButton && (
                    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'} relationship="label">
                        <Button
                            appearance={copied ? 'subtle' : 'primary'}
                            icon={copied ? <Checkmark20Regular /> : <Copy20Regular />}
                            onClick={handleCopy}
                            className={`${styles.copyButton} ${copied ? styles.copiedButton : ''}`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </Tooltip>
                )}
            </div>

            {error && (
                <div className={styles.fallbackContainer}>
                    <Text className={styles.errorText}>
                        {error}. Select the token manually and press Ctrl+C to copy.
                    </Text>
                </div>
            )}
        </div>
    );
}

export default TokenDisplay;
