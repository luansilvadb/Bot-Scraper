/**
* ErrorState Component
* Displays error message with retry capability
* Used when async operations fail
*/

import * as React from 'react';
import {
makeStyles,
tokens,
Button,
Text,
Title3,
} from '@fluentui/react-components';
import { ErrorCircle24Regular, ArrowCounterclockwise24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
root: {
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
padding: tokens.spacingVerticalXXL,
textAlign: 'center',
minHeight: '200px',
},
icon: {
fontSize: '48px',
color: tokens.colorStatusDangerForeground1,
marginBottom: tokens.spacingVerticalL,
},
title: {
color: tokens.colorNeutralForeground1,
marginBottom: tokens.spacingVerticalS,
},
description: {
color: tokens.colorNeutralForeground2,
maxWidth: '400px',
marginBottom: tokens.spacingVerticalL,
},
actions: {
display: 'flex',
gap: tokens.spacingHorizontalM,
marginTop: tokens.spacingVerticalM,
},
});

export interface ErrorStateProps {
/** Error title */
title?: string;
/** Error description or message */
description?: string;
/** Whether to show retry button */
showRetry?: boolean;
/** Retry button label */
retryLabel?: string;
/** Called when retry button is clicked */
onRetry?: () => void;
/** Whether retry is currently in progress */
isRetrying?: boolean;
/** Additional CSS class */
className?: string;
/** Full error object for debugging */
error?: Error | null;
}

/**
* ErrorState - Displays error with optional retry action
*
* Usage:
* ```tsx
* <ErrorState
* title="Failed to load data"
* description="Please check your connection and try again"
* showRetry
* onRetry={refetch}
* isRetrying={isLoading}
* />
* ```
*/
export const ErrorState: React.FC<ErrorStateProps> = ({
title = 'Something went wrong',
description = 'An error occurred while loading the content.',
showRetry = true,
retryLabel = 'Try again',
onRetry,
isRetrying = false,
className,
error,
}) => {
const styles = useStyles();

return (
<div className={className} role="alert" aria-live="assertive">
<div className={styles.root}>
<div className={styles.icon}>
<ErrorCircle24Regular />
</div>
<Title3 className={styles.title}>{title}</Title3>
{description && (
<Text className={styles.description}>{description}</Text>
)}
{import.meta.env.DEV && error?.message && (
<Text className={styles.description} style={{ fontSize: '12px', marginTop: tokens.spacingVerticalS }}>
{error.message}
</Text>
)}
{showRetry && onRetry && (
<div className={styles.actions}>
<Button
appearance="primary"
onClick={onRetry}
disabled={isRetrying}
icon={isRetrying ? undefined : <ArrowCounterclockwise24Regular />}
>
{isRetrying ? 'Retrying...' : retryLabel}
</Button>
</div>
)}
</div>
</div>
);
};

ErrorState.displayName = 'ErrorState';
