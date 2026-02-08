import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
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
  Text,
  Skeleton,
  SkeletonItem,
} from '@fluentui/react-components';
import {
  Delete20Regular,
  Checkmark20Regular,
  Dismiss20Regular,
  Search20Regular,
  ArrowSync20Regular,
  ChevronLeft24Regular,
  ChevronRight24Regular,
} from '@fluentui/react-icons';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { StatusBadge } from '../../components/StatusBadge';
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
        ...shorthands.gap(tokens.spacingVerticalL),
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXS),
        marginBottom: tokens.spacingVerticalM,
    },
    headerTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtitle: {
        color: tokens.colorNeutralForeground4,
    },
    filterBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.05)'),
        ...shorthands.gap(tokens.spacingHorizontalM),
        flexWrap: 'wrap',
    },
    filtersLeft: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingHorizontalS),
        flexWrap: 'wrap',
    },
    searchInput: {
        minWidth: '240px',
    },
    filterSelect: {
        minWidth: '130px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        ...shorthands.gap(tokens.spacingHorizontalL),
    },
    card: {
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.06)'),
        ...shorthands.padding(tokens.spacingHorizontalM),
        transition: 'background-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
        },
    },
    cardCheckbox: {
        position: 'absolute',
        top: '8px',
        left: '8px',
        zIndex: 2,
    },
    imageContainer: {
        width: '100%',
        height: '180px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        overflow: 'hidden',
        marginBottom: tokens.spacingVerticalM,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalS),
        flexGrow: 1,
    },
    cardTitle: {
        fontWeight: tokens.fontWeightSemibold,
        minHeight: '44px',
        lineHeight: '1.4',
    },
    priceContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    priceBlock: {
        display: 'flex',
        flexDirection: 'column',
    },
    currentPrice: {
        fontSize: tokens.fontSizeBase500,
        fontWeight: tokens.fontWeightBold,
        color: tokens.colorBrandForeground1,
    },
    originalPrice: {
        textDecoration: 'line-through',
        color: tokens.colorNeutralForeground4,
        fontSize: tokens.fontSizeBase200,
    },
    discountBadge: {
        backgroundColor: tokens.colorPaletteRedBackground3,
        color: tokens.colorNeutralForegroundInverted,
        fontWeight: tokens.fontWeightBold,
    },
    footerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: tokens.spacingVerticalM,
        paddingTop: tokens.spacingVerticalS,
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    cardActions: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalXS),
    },
    bulkBar: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: tokens.colorBrandBackground2,
        color: tokens.colorBrandForeground2,
        ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.gap(tokens.spacingHorizontalM),
        marginBottom: tokens.spacingVerticalM,
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: tokens.spacingVerticalXL,
        ...shorthands.padding(tokens.spacingVerticalM, '0'),
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    paginationControls: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalS),
        alignItems: 'center',
    },
    emptyState: {
        textAlign: 'center',
        ...shorthands.padding('80px', '20px'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingVerticalM),
        color: tokens.colorNeutralForeground4,
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...shorthands.padding('100px', '20px'),
        ...shorthands.gap(tokens.spacingVerticalM),
    }
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



    if (error) {
        return (
            <div className={styles.errorContainer}>
                <Body1>Error loading products: {error.message}</Body1>
                <Button onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    const products = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className={styles.container}>
            <Toaster toasterId={toasterId} />

            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div>
                        <Text size={600} weight="bold" as="h1">Product Approval</Text>
                        <div className={styles.subtitle}>
                            Review and approve products captured by your bot network
                        </div>
                    </div>
                    <Button
                        icon={<ArrowSync20Regular />}
                        appearance="subtle"
                        onClick={() => refetch()}
                        disabled={isLoading}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.filtersLeft}>
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
                <div className={styles.bulkBar}>
                    <Checkbox
                        checked={products.length > 0 && selectedIds.size === products.length}
                        onChange={toggleSelectAll}
                        label={`${selectedIds.size} items selected`}
                    />
                    <div style={{ flexGrow: 1 }} />
                    <Button
                        icon={<Checkmark20Regular />}
                        appearance="primary"
                        onClick={handleBulkApprove}
                        disabled={bulkApprove.isPending}
                    >
                        Approve All
                    </Button>
                    <Button
                        icon={<Dismiss20Regular />}
                        appearance="subtle"
                        onClick={handleBulkReject}
                        disabled={bulkReject.isPending}
                    >
                        Reject All
                    </Button>
                </div>
            )}

            {isLoading ? (
                <div className={styles.grid}>
                    {[...Array(8)].map((_, i) => (
                        <Card key={i} className={styles.card}>
                            <div className={styles.imageContainer}>
                                <Skeleton style={{ width: '100%', height: '100%' }}>
                                    <SkeletonItem shape="rectangle" style={{ width: '100%', height: '100%' }} />
                                </Skeleton>
                            </div>
                            <div className={styles.cardContent}>
                                <Skeleton>
                                    <SkeletonItem size={16} style={{ width: '90%' }} />
                                    <SkeletonItem size={16} style={{ width: '60%', marginTop: '8px' }} />
                                </Skeleton>

                                <div className={styles.priceContainer} style={{ marginTop: 'auto' }}>
                                    <div className={styles.priceBlock}>
                                        <Skeleton>
                                            <SkeletonItem size={24} style={{ width: '70px' }} />
                                            <SkeletonItem size={12} style={{ width: '40px', marginTop: '4px' }} />
                                        </Skeleton>
                                    </div>
                                    <Skeleton>
                                        <SkeletonItem shape="rectangle" style={{ width: '48px', height: '24px', borderRadius: '4px' }} />
                                    </Skeleton>
                                </div>

                                <div className={styles.footerContainer}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Skeleton>
                                            <SkeletonItem shape="rectangle" style={{ width: '60px', height: '20px', borderRadius: '4px' }} />
                                        </Skeleton>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <Skeleton>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <SkeletonItem shape="circle" size={24} />
                                                <SkeletonItem shape="circle" size={24} />
                                                <SkeletonItem shape="circle" size={24} />
                                            </div>
                                        </Skeleton>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className={styles.emptyState}>
                    <Body1>No products found</Body1>
                    <Caption1>Try adjusting your search filters or status</Caption1>
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
                                <div className={styles.imageContainer}>
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className={styles.cardImage}
                                    />
                                </div>
                                <div className={styles.cardContent}>
                                    <Body1 className={styles.cardTitle}>
                                        {product.title}
                                    </Body1>

                                    <div className={styles.priceContainer}>
                                        <div className={styles.priceBlock}>
                                            <span className={styles.currentPrice}>
                                                ${product.currentPrice.toFixed(2)}
                                            </span>
                                            <span className={styles.originalPrice}>
                                                ${product.originalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <Badge
                                            className={styles.discountBadge}
                                            appearance="filled"
                                        >
                                            -{product.discountPercentage}%
                                        </Badge>
                                    </div>

<div className={styles.footerContainer}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge
                      status={product.status}
                      customMap={{
                        pendingapproval: { color: 'warning', label: 'Pending' },
                        approved: { color: 'success', label: 'Approved' },
                        rejected: { color: 'danger', label: 'Rejected' },
                        posted: { color: 'brand', label: 'Posted' },
                      }}
                    />
                                            {product.bot && (
                                                <Caption1 style={{ opacity: 0.6 }}>
                                                    {product.bot.name}
                                                </Caption1>
                                            )}
                                        </div>

                                        <div className={styles.cardActions}>
                                            {product.status === 'PENDING_APPROVAL' && (
                                                <>
                                                    <Button
                                                        icon={<Checkmark20Regular />}
                                                        size="small"
                                                        appearance="subtle"
                                                        onClick={() => handleApprove(product)}
                                                        disabled={approveProduct.isPending}
                                                    />
                                                    <Button
                                                        icon={<Dismiss20Regular />}
                                                        size="small"
                                                        appearance="subtle"
                                                        onClick={() => handleReject(product)}
                                                        disabled={rejectProduct.isPending}
                                                    />
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
                                </div>
                            </Card>
                        ))}
                    </div>

                    {meta && meta.totalPages > 1 && (
                        <div className={styles.pagination}>
                            <Caption1 style={{ opacity: 0.6 }}>
                                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, meta.total)} of {meta.total} products
                            </Caption1>
                            <div className={styles.paginationControls}>
                                <Button
                                    icon={<ChevronLeft24Regular />}
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    appearance="subtle"
                                />
                                <Text size={300}>
                                    Page {meta.page} of {meta.totalPages}
                                </Text>
                                <Button
                                    icon={<ChevronRight24Regular />}
                                    disabled={page >= meta.totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    appearance="subtle"
                                />
                            </div>
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
