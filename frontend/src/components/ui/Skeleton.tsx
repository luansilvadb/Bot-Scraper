/**
* Skeleton Component
* Loading placeholder for content while data is being fetched
* Provides visual feedback during async operations
*/

import * as React from 'react';
import {
makeStyles,
tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
root: {
display: 'flex',
flexDirection: 'column',
gap: tokens.spacingVerticalM,
width: '100%',
},
skeletonItem: {
backgroundColor: tokens.colorNeutralBackground3,
borderRadius: tokens.borderRadiusSmall,
animation: 'pulse 1.5s ease-in-out infinite',
},
// Size variants
small: {
height: '16px',
},
medium: {
height: '24px',
},
large: {
height: '40px',
},
// Width variants
full: {
width: '100%',
},
threeQuarters: {
width: '75%',
},
half: {
width: '50%',
},
quarter: {
width: '25%',
},
// Shapes
circle: {
borderRadius: '50%',
},
rounded: {
borderRadius: tokens.borderRadiusMedium,
},
// Layout
row: {
display: 'flex',
alignItems: 'center',
gap: tokens.spacingHorizontalM,
},
rowItem: {
flexShrink: 0,
},
// Keyframes
'@keyframes pulse': {
'0%': {
opacity: 0.6,
},
'50%': {
opacity: 1,
},
'100%': {
opacity: 0.6,
},
},
});

export interface SkeletonItemProps {
/** Size of the skeleton item */
size?: 'small' | 'medium' | 'large';
/** Width of the skeleton item */
width?: 'full' | 'threeQuarters' | 'half' | 'quarter';
/** Shape of the skeleton item */
shape?: 'rect' | 'circle' | 'rounded';
/** Custom className */
className?: string;
}

export const SkeletonItem: React.FC<SkeletonItemProps> = ({
size = 'medium',
width = 'full',
shape = 'rounded',
className,
}) => {
const styles = useStyles();

const sizeClass = styles[size];
const widthClass = styles[width];
const shapeClass = shape === 'circle' ? styles.circle : shape === 'rounded' ? styles.rounded : undefined;

return (
<div
className={`${styles.skeletonItem} ${sizeClass} ${widthClass} ${shapeClass || ''} ${className || ''}`}
aria-hidden="true"
/>
);
};

export interface SkeletonRowProps {
/** Number of items in the row */
itemCount?: number;
/** Size of items */
itemSize?: 'small' | 'medium' | 'large';
/** Whether to include a circle avatar */
hasAvatar?: boolean;
/** Custom className */
className?: string;
}

export const SkeletonRow: React.FC<SkeletonRowProps> = ({
itemCount = 2,
itemSize = 'medium',
hasAvatar = true,
className,
}) => {
const styles = useStyles();

return (
<div className={`${styles.row} ${className || ''}`} aria-hidden="true">
{hasAvatar && (
<SkeletonItem
size={itemSize === 'small' ? 'small' : 'medium'}
shape="circle"
className={styles.rowItem}
/>
)}
{Array.from({ length: itemCount }).map((_, index) => (
<SkeletonItem
key={index}
size={itemSize}
width={index === 0 ? 'full' : index === itemCount - 1 ? 'quarter' : 'half'}
/>
))}
</div>
);
};

export interface SkeletonProps {
/** Number of rows to display */
rowCount?: number;
/** Whether to show header skeleton */
hasHeader?: boolean;
/** Whether rows have avatars */
hasAvatar?: boolean;
/** Custom className */
className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
rowCount = 5,
hasHeader = true,
hasAvatar = true,
className,
}) => {
const styles = useStyles();

return (
<div className={`${styles.root} ${className || ''}`} role="status" aria-label="Loading content">
{hasHeader && (
<SkeletonRow
itemCount={1}
itemSize="large"
hasAvatar={false}
/>
)}
{Array.from({ length: rowCount }).map((_, index) => (
<SkeletonRow
key={index}
itemCount={2}
itemSize="medium"
hasAvatar={hasAvatar}
/>
))}
</div>
);
};

Skeleton.displayName = 'Skeleton';
SkeletonItem.displayName = 'SkeletonItem';
SkeletonRow.displayName = 'SkeletonRow';
