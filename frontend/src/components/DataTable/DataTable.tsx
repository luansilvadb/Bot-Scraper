import {
    Table,
    TableHeader,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Button,
    Skeleton,
    SkeletonItem,
    Input,
    Select,
    Text,
    makeStyles,
    shorthands,
    tokens
} from '@fluentui/react-components';
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import type { ReactNode } from 'react';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(255, 255, 255, 0.015)',
        ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.06)'),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
    },
    controls: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalM),
        alignItems: 'center',
        flexWrap: 'wrap',
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    searchInput: {
        maxWidth: '300px',
        flex: 1,
    },
    tableWrapper: {
        overflowX: 'auto',
        maxWidth: '100%',
    },
    table: {
        minWidth: '600px',
        width: '100%',
    },
    emptyCell: {
        textAlign: 'center',
        ...shorthands.padding(tokens.spacingVerticalXXL),
        color: tokens.colorNeutralForeground4,
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        ...shorthands.padding(tokens.spacingVerticalXXL),
    },
    headerRow: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    headerCell: {
        fontWeight: tokens.fontWeightSemibold,
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        color: tokens.colorNeutralForeground2,
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    },
    cell: {
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
    },
    actionCell: {
        width: '120px',
        textAlign: 'right',
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    },
    actionCellData: {
        width: '120px',
        textAlign: 'right',
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    },
    tableRow: {
        transition: 'background-color 0.2s ease',
        cursor: 'default',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        ':last-child': {
            borderBottom: '0',
        }
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        flexWrap: 'wrap',
        ...shorthands.gap(tokens.spacingHorizontalS),
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    paginationInfo: {
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase200,
    },
    paginationControls: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalS),
        alignItems: 'center',
    },
    pageText: {
        color: tokens.colorNeutralForeground1,
        fontWeight: tokens.fontWeightSemibold,
    }
});

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => ReactNode;
    width?: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    meta?: PaginationMeta;
    isLoading?: boolean;
    emptyMessage?: string;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    actions?: (item: T) => ReactNode;
}

export function DataTable<T extends { id: string }>({
    columns,
    data,
    meta,
    isLoading,
    emptyMessage = 'No items found',
    onPageChange,
    onLimitChange,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    actions,
}: DataTableProps<T>) {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            {/* Search and Controls */}
            {onSearchChange && (
                <div className={styles.controls}>
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue || ''}
                        onChange={(_, data) => onSearchChange(data.value)}
                        className={styles.searchInput}
                    />
                    {onLimitChange && (
                        <Select
                            value={String(meta?.limit || 10)}
                            onChange={(_, data) => onLimitChange(Number(data.value))}
                        >
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </Select>
                    )}
                </div>
            )}

            {/* Table Container */}
            <div className={styles.tableWrapper}>
                <Table aria-label="Data table" className={styles.table}>
                    <TableHeader>
                        <TableRow className={styles.headerRow}>
                            {columns.map((col) => (
                                <TableHeaderCell key={String(col.key)} className={styles.headerCell} style={{ width: col.width }}>
                                    {col.header}
                                </TableHeaderCell>
                            ))}
                            {actions && <TableHeaderCell className={styles.actionCell}>Actions</TableHeaderCell>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i} className={styles.tableRow}>
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)} className={styles.cell}>
                                            <Skeleton>
                                                <SkeletonItem size={16} style={{ width: '80%' }} />
                                            </Skeleton>
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell className={styles.actionCellData}>
                                            <Skeleton>
                                                <SkeletonItem shape="circle" size={24} />
                                            </Skeleton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                                    <div className={styles.emptyCell}>
                                        {emptyMessage}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id} className={styles.tableRow}>
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)} className={styles.cell}>
                                            {col.render
                                                ? col.render(item)
                                                : <Text size={300}>{String((item as Record<string, unknown>)[col.key as string] ?? '')}</Text>}
                                        </TableCell>
                                    ))}
                                    {actions && <TableCell className={styles.actionCellData}>{actions(item)}</TableCell>}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {meta && onPageChange && (
                <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>
                        Showing {(meta.page - 1) * meta.limit + 1} to{' '}
                        {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} items
                    </span>
                    <div className={styles.paginationControls}>
                        <Button
                            icon={<ChevronLeft24Regular />}
                            disabled={meta.page <= 1}
                            onClick={() => onPageChange(meta.page - 1)}
                            appearance="subtle"
                        />
                        <span className={styles.pageText}>
                            Page {meta.page} of {meta.totalPages}
                        </span>
                        <Button
                            icon={<ChevronRight24Regular />}
                            disabled={meta.page >= meta.totalPages}
                            onClick={() => onPageChange(meta.page + 1)}
                            appearance="subtle"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
