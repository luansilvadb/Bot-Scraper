import { useState, useCallback } from 'react';

interface UseClipboardResult {
    copied: boolean;
    copyToClipboard: (text: string) => Promise<boolean>;
    error: string | null;
}

/**
 * Hook for clipboard operations with Clipboard API and fallback support.
 * 
 * @param resetDelay - Time in ms to reset "copied" state (default: 2000ms)
 * @returns Object with copied state, copyToClipboard function, and error state
 * 
 * @example
 * const { copied, copyToClipboard } = useClipboard();
 * <Button onClick={() => copyToClipboard(token)}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </Button>
 */
export function useClipboard(resetDelay: number = 2000): UseClipboardResult {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        setError(null);

        try {
            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), resetDelay);
                return true;
            }

            // Fallback for older browsers
            return fallbackCopy(text);
        } catch (err) {
            // Clipboard API might be blocked, try fallback
            try {
                return fallbackCopy(text);
            } catch (fallbackErr) {
                const message = fallbackErr instanceof Error ? fallbackErr.message : 'Failed to copy';
                setError(message);
                return false;
            }
        }

        function fallbackCopy(text: string): boolean {
            const textarea = document.createElement('textarea');
            textarea.value = text;

            // Prevent scrolling to bottom
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = '0';
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            textarea.style.opacity = '0';

            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);

                if (success) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), resetDelay);
                    return true;
                } else {
                    throw new Error('execCommand copy failed');
                }
            } catch {
                document.body.removeChild(textarea);
                throw new Error('Unable to copy to clipboard');
            }
        }
    }, [resetDelay]);

    return { copied, copyToClipboard, error };
}

export default useClipboard;
