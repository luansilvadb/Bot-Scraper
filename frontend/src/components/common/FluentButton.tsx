/**
* FluentButton Component
* Wrapper around Fluent UI Button with consistent styling and loading state
* Replaces all native <button> elements
*/

import * as React from 'react';
import {
Button,
Spinner,
makeStyles,
tokens,
} from '@fluentui/react-components';
import { mergeClasses } from '@fluentui/react-components';

const useStyles = makeStyles({
root: {
// Ensures consistent button behavior
position: 'relative',
},
loading: {
opacity: 0.7,
cursor: 'wait',
pointerEvents: 'none',
},
spinner: {
marginRight: tokens.spacingHorizontalXS,
},
});

export interface FluentButtonProps {
/** Loading state - shows spinner */
loading?: boolean;
/** Loading text to display */
loadingText?: string;
/** Click handler */
onClick?: React.MouseEventHandler<HTMLButtonElement>;
/** Additional CSS class */
className?: string;
/** Button content */
children?: React.ReactNode;
/** Whether the button is disabled */
disabled?: boolean;
/** Button appearance variant */
appearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
/** Button size */
size?: 'small' | 'medium' | 'large';
/** ARIA label */
'aria-label'?: string;
/** Button type */
type?: 'button' | 'submit' | 'reset';
}

/**
* FluentButton - Standardized button component with loading support
*
* Usage:
* ```tsx
* <FluentButton onClick={handleClick}>Click me</FluentButton>
* <FluentButton loading loadingText="Saving...">Save</FluentButton>
* <FluentButton appearance="primary">Primary Action</FluentButton>
* ```
*/
export const FluentButton: React.FC<FluentButtonProps> = ({
loading = false,
loadingText,
children,
onClick,
disabled,
className,
appearance = 'secondary',
size = 'medium',
...props
}) => {
const styles = useStyles();

const handleClick = React.useCallback(
(e: React.MouseEvent<HTMLButtonElement>) => {
if (loading || disabled) {
e.preventDefault();
return;
}
onClick?.(e);
},
[loading, disabled, onClick]
);

return (
<Button
appearance={appearance}
size={size}
disabled={disabled || loading}
onClick={handleClick}
className={mergeClasses(styles.root, loading && styles.loading, className)}
{...props}
>
{loading ? (
<>
<Spinner size="tiny" className={styles.spinner} />
{loadingText || children}
</>
) : (
children
)}
</Button>
);
};

FluentButton.displayName = 'FluentButton';
