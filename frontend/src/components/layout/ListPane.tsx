import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
makeStyles,
tokens,
Text,
Caption1,
} from '@fluentui/react-components';
import type { ListItem } from '../../types';
import { ChannelListItem } from '../ui/ChannelListItem';

const useStyles = makeStyles({
  listPane: {
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
    minWidth: '280px',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
  },
  listPaneCollapsed: {
    width: '240px',
    minWidth: '240px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '56px',
    padding: `0 ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  list: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: `${tokens.spacingVerticalS} 0`,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  listItemSelected: {
    backgroundColor: tokens.colorNeutralBackground1Pressed,
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: tokens.spacingHorizontalM,
    overflow: 'hidden',
  },
  primaryText: {
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  secondaryText: {
    color: tokens.colorNeutralForeground2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground3,
  },
});

interface ListPaneProps {
title: string;
items: ListItem[];
selectedId?: string;
onSelect?: (id: string) => void;
emptyMessage?: string;
}

const ITEM_HEIGHT = 72; // Height of each ChannelListItem
const OVERSCAN = 5; // Number of items to render outside viewport
const VIRTUALIZATION_THRESHOLD = 100; // Enable virtualization when items exceed this count

const VirtualizedList: React.FC<{
items: ListItem[];
selectedId?: string;
onSelect?: (id: string) => void;
}> = ({ items, selectedId, onSelect }) => {
const styles = useStyles();
const parentRef = React.useRef<HTMLDivElement>(null);

const virtualizer = useVirtualizer({
count: items.length,
getScrollElement: () => parentRef.current,
estimateSize: () => ITEM_HEIGHT,
overscan: OVERSCAN,
});

return (
<div
ref={parentRef}
className={styles.list}
role="list"
style={{
overflowY: 'auto',
overflowX: 'hidden',
position: 'relative',
height: '100%',
}}
>
<div
style={{
height: `${virtualizer.getTotalSize()}px`,
width: '100%',
position: 'relative',
}}
>
{virtualizer.getVirtualItems().map((virtualRow) => {
const item = items[virtualRow.index];
return (
<div
key={virtualRow.key}
style={{
position: 'absolute',
top: 0,
left: 0,
width: '100%',
height: `${virtualRow.size}px`,
transform: `translateY(${virtualRow.start}px)`,
}}
>
<ChannelListItem
id={item.id}
primaryText={item.primaryText}
secondaryText={item.secondaryText}
avatarUrl={item.avatarUrl}
presence={item.presence}
timestamp={item.timestamp}
unreadCount={item.unreadCount}
isPinned={item.isPinned}
isSelected={selectedId === item.id}
onClick={onSelect}
onSelect={onSelect}
/>
</div>
);
})}
</div>
</div>
);
};

const StandardList: React.FC<{
items: ListItem[];
selectedId?: string;
onSelect?: (id: string) => void;
}> = ({ items, selectedId, onSelect }) => {
const styles = useStyles();

return (
<div className={styles.list} role="list">
{items.map((item) => (
<ChannelListItem
key={item.id}
id={item.id}
primaryText={item.primaryText}
secondaryText={item.secondaryText}
avatarUrl={item.avatarUrl}
presence={item.presence}
timestamp={item.timestamp}
unreadCount={item.unreadCount}
isPinned={item.isPinned}
isSelected={selectedId === item.id}
onClick={onSelect}
onSelect={onSelect}
/>
))}
</div>
);
};

export const ListPane: React.FC<ListPaneProps> = ({
title,
items,
selectedId,
onSelect,
emptyMessage = 'No items available',
}) => {
const styles = useStyles();
const useVirtualization = items.length > VIRTUALIZATION_THRESHOLD;

return (
<div className={styles.listPane} role="complementary" aria-label={`${title} List`}>
<div className={styles.header}>
<Text className={styles.title}>{title}</Text>
</div>

{items.length === 0 ? (
<div className={styles.emptyState}>
<Caption1>{emptyMessage}</Caption1>
</div>
) : useVirtualization ? (
<VirtualizedList items={items} selectedId={selectedId} onSelect={onSelect} />
) : (
<StandardList items={items} selectedId={selectedId} onSelect={onSelect} />
)}
</div>
);
};
