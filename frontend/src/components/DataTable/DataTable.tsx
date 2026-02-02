import {
    Table,
    TableHeader,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Button,
    Spinner,
    Input,
    Select,
} from '@fluentui/react-components';
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import type { ReactNode } from 'react';

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
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spinner size="large" label="Loading..." />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search and Controls */}
            {onSearchChange && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue || ''}
                        onChange={(_, data) => onSearchChange(data.value)}
                        style={{ maxWidth: '300px', flex: 1 }}
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
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <Table aria-label="Data table" style={{ minWidth: '600px' }}>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHeaderCell key={String(col.key)} style={{ width: col.width }}>
                                    {col.header}
                                </TableHeaderCell>
                            ))}
                            {actions && <TableHeaderCell style={{ width: '100px' }}>Actions</TableHeaderCell>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                        {emptyMessage}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)}>
                                            {col.render
                                                ? col.render(item)
                                                : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                                        </TableCell>
                                    ))}
                                    {actions && <TableCell>{actions(item)}</TableCell>}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {meta && onPageChange && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                    }}
                >
                    <span style={{ color: '#666', fontSize: '0.875rem' }}>
                        Showing {(meta.page - 1) * meta.limit + 1} to{' '}
                        {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} items
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Button
                            icon={<ChevronLeft24Regular />}
                            disabled={meta.page <= 1}
                            onClick={() => onPageChange(meta.page - 1)}
                            appearance="subtle"
                        />
                        <span>
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
