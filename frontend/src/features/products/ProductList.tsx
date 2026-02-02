import { useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Subtitle1,
    Body1,
    Caption1,
    makeStyles,
    shorthands,
    tokens,
    Select,
    Input,
    Checkbox,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    ToastBody,
    useId,
    Image,
} from '@fluentui/react-components';
import {
    Delete20Regular,
    Checkmark20Regular,
    Dismiss20Regular,
    Search20Regular,
    ArrowSync20Regular,
} from '@fluentui/react-icons';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
    useProducts,
    useDeleteProduct,
    useApproveProduct,
    useRejectProduct,
    useBulkApprove,
    useBulkReject,
    type Product,
    type ProductQueryParams,
} from './api';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('24px'),
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...shorthands.gap('16px'),
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('16px'),
    },
    filters: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('8px'),
        flexWrap: 'wrap',
    },
    filterSelect: {
        minWidth: '140px',
    },
    searchInput: {
        minWidth: '200px',
    },
    bulkActions: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('8px'),
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        ...shorthands.gap('16px'),
    },
    card: {
        position: 'relative',
        ...shorthands.padding('16px'),
    },
    cardCheckbox: {
        position: 'absolute',
        top: '8px',
        left: '8px',
        zIndex: 1,
    },
    cardImage: {
        width: '100%',
        height: '160px',
        objectFit: 'contain',
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        marginBottom: '12px',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('8px'),
    },
    cardTitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        minHeight: '40px',
    },
    priceRow: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('8px'),
    },
    currentPrice: {
        fontSize: '18px',
        fontWeight: 600,
        color: tokens.colorPaletteGreenForeground1,
    },
    originalPrice: {
        textDecoration: 'line-through',
        color: tokens.colorNeutralForeground3,
    },
    discountBadge: {
        marginLeft: 'auto',
    },
    cardActions: {
        display: 'flex',
        ...shorthands.gap('4px'),
        marginTop: '8px',
    },
    emptyState: {
        textAlign: 'center',
        ...shorthands.padding('48px'),
        color: tokens.colorNeutralForeground3,
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...shorthands.gap('16px'),
        marginTop: '16px',
    },
});

export function ProductList() {
    const styles = useStyles();
    const toasterId = useId('product-list-toaster');
    const { dispatchToast } = useToastController(toasterId);

    // State
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [statusFilter, setStatusFilter] = useState<ProductQueryParams['status'] | ''>('');
    const [search, setSearch] = useState('');
    const [minDiscount, setMinDiscount] = useState<number | ''>('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    // Queries & Mutations
    const { data, isLoading, error, refetch } = useProducts({
        page,
        limit,
        status: statusFilter || undefined,
        search: search || undefined,
        minDiscount: minDiscount || undefined,
    });
    const deleteProduct = useDeleteProduct();
    const approveProduct = useApproveProduct();
    const rejectProduct = useRejectProduct();
    const bulkApprove = useBulkApprove();
    const bulkReject = useBulkReject();

    // Handlers
    const handleApprove = (product: Product) => {
        approveProduct.mutate(product.id, {
            onSuccess: () => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Product approved</ToastTitle>
                        <ToastBody>"{product.title}" has been approved and posted.</ToastBody>
                    </Toast>,
                    { intent: 'success' }
                );
            },
            onError: (err) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Failed to approve</ToastTitle>
                        <ToastBody>{err.message || 'An error occurred'}</ToastBody>
                    </Toast>,
                    { intent: 'error' }
                );
            },
        });
    };

    const handleReject = (product: Product) => {
        rejectProduct.mutate(product.id, {
            onSuccess: () => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Product rejected</ToastTitle>
                    </Toast>,
                    { intent: 'success' }
                );
            },
            onError: (err) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Failed to reject</ToastTitle>
                        <ToastBody>{err.message || 'An error occurred'}</ToastBody>
                    </Toast>,
                    { intent: 'error' }
                );
            },
        });
    };

    const handleDelete = () => {
        if (!deletingProduct) return;

        deleteProduct.mutate(deletingProduct.id, {
            onSuccess: () => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Product deleted</ToastTitle>
                    </Toast>,
                    { intent: 'success' }
                );
                setDeletingProduct(null);
            },
            onError: (err) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Failed to delete</ToastTitle>
                        <ToastBody>{err.message || 'An error occurred'}</ToastBody>
                    </Toast>,
                    { intent: 'error' }
                );
            },
        });
    };

    const handleBulkApprove = () => {
        const ids = Array.from(selectedIds);
        bulkApprove.mutate(ids, {
            onSuccess: (result) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Bulk approve complete</ToastTitle>
                        <ToastBody>
                            {result.updated} approved, {result.skipped} skipped
                        </ToastBody>
                    </Toast>,
                    { intent: 'success' }
                );
                setSelectedIds(new Set());
            },
        });
    };

    const handleBulkReject = () => {
        const ids = Array.from(selectedIds);
        bulkReject.mutate(ids, {
            onSuccess: (result) => {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Bulk reject complete</ToastTitle>
                        <ToastBody>
                            {result.updated} rejected, {result.skipped} skipped
                        </ToastBody>
                    </Toast>,
                    { intent: 'success' }
                );
                setSelectedIds(new Set());
            },
        });
    };

    const toggleSelectAll = () => {
        if (!data?.data) return;

        if (selectedIds.size === data.data.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(data.data.map((p) => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING_APPROVAL':
                return <Badge appearance="filled" color="warning">Pending</Badge>;
            case 'APPROVED':
                return <Badge appearance="filled" color="success">Approved</Badge>;
            case 'REJECTED':
                return <Badge appearance="filled" color="danger">Rejected</Badge>;
            case 'POSTED':
                return <Badge appearance="filled" color="brand">Posted</Badge>;
            default:
                return <Badge appearance="outline">Unknown</Badge>;
        }
    };

    if (error) {
        return (
            <div style={{ color: 'red', padding: '1rem' }}>
                Error loading products: {error.message}
            </div>
        );
    }

    const products = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className={styles.container}>
            <Toaster toasterId={toasterId} />

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Subtitle1>Product Approval</Subtitle1>
                    <Button
                        icon={<ArrowSync20Regular />}
                        appearance="subtle"
                        onClick={() => refetch()}
                    >
                        Refresh
                    </Button>
                </div>
                <div className={styles.filters}>
                    <Input
                        className={styles.searchInput}
                        placeholder="Search products..."
                        value={search}
                        onChange={(_, d) => {
                            setSearch(d.value);
                            setPage(1);
                        }}
                        contentBefore={<Search20Regular />}
                    />
                    <Select
                        className={styles.filterSelect}
                        value={statusFilter}
                        onChange={(_, d) => {
                            setStatusFilter(d.value as ProductQueryParams['status'] | '');
                            setPage(1);
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="PENDING_APPROVAL">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="POSTED">Posted</option>
                    </Select>
                    <Select
                        className={styles.filterSelect}
                        value={minDiscount.toString()}
                        onChange={(_, d) => {
                            setMinDiscount(d.value ? parseInt(d.value, 10) : '');
                            setPage(1);
                        }}
                    >
                        <option value="">Any Discount</option>
                        <option value="20">20%+</option>
                        <option value="30">30%+</option>
                        <option value="50">50%+</option>
                        <option value="70">70%+</option>
                    </Select>
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div className={styles.bulkActions}>
                    <Checkbox
                        checked={products.length > 0 && selectedIds.size === products.length}
                        onChange={toggleSelectAll}
                        label={`${selectedIds.size} selected`}
                    />
                    <Button
                        icon={<Checkmark20Regular />}
                        appearance="primary"
                        onClick={handleBulkApprove}
                        disabled={bulkApprove.isPending}
                    >
                        Approve Selected
                    </Button>
                    <Button
                        icon={<Dismiss20Regular />}
                        appearance="outline"
                        onClick={handleBulkReject}
                        disabled={bulkReject.isPending}
                    >
                        Reject Selected
                    </Button>
                </div>
            )}

            {isLoading ? (
                <div className={styles.emptyState}>Loading products...</div>
            ) : products.length === 0 ? (
                <div className={styles.emptyState}>
                    <Body1>No products found</Body1>
                    <Caption1>Try adjusting your filters</Caption1>
                </div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {products.map((product) => (
                            <Card key={product.id} className={styles.card}>
                                <Checkbox
                                    className={styles.cardCheckbox}
                                    checked={selectedIds.has(product.id)}
                                    onChange={() => toggleSelect(product.id)}
                                />
                                <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className={styles.cardImage}
                                />
                                <div className={styles.cardContent}>
                                    <Body1 className={styles.cardTitle}>
                                        {product.title}
                                    </Body1>
                                    <div className={styles.priceRow}>
                                        <span className={styles.currentPrice}>
                                            ${product.currentPrice.toFixed(2)}
                                        </span>
                                        <span className={styles.originalPrice}>
                                            ${product.originalPrice.toFixed(2)}
                                        </span>
                                        <Badge
                                            className={styles.discountBadge}
                                            appearance="filled"
                                            color="danger"
                                        >
                                            -{product.discountPercentage}%
                                        </Badge>
                                    </div>
                                    <div>
                                        {getStatusBadge(product.status)}
                                        {product.bot && (
                                            <Caption1 style={{ marginLeft: '8px' }}>
                                                via {product.bot.name}
                                            </Caption1>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        {product.status === 'PENDING_APPROVAL' && (
                                            <>
                                                <Button
                                                    icon={<Checkmark20Regular />}
                                                    size="small"
                                                    appearance="primary"
                                                    onClick={() => handleApprove(product)}
                                                    disabled={approveProduct.isPending}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    icon={<Dismiss20Regular />}
                                                    size="small"
                                                    appearance="outline"
                                                    onClick={() => handleReject(product)}
                                                    disabled={rejectProduct.isPending}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            icon={<Delete20Regular />}
                                            size="small"
                                            appearance="subtle"
                                            onClick={() => setDeletingProduct(product)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <div className={styles.pagination}>
                            <Button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <Body1>
                                Page {meta.page} of {meta.totalPages}
                            </Body1>
                            <Button
                                disabled={page >= meta.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

            <ConfirmDialog
                open={!!deletingProduct}
                title="Delete Product"
                message={`Are you sure you want to delete "${deletingProduct?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={deleteProduct.isPending}
                onConfirm={handleDelete}
                onCancel={() => setDeletingProduct(null)}
            />
        </div>
    );
}
