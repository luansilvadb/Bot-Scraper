import React from 'react';
import {
    makeStyles,
    shorthands,
    Subtitle1,
    MessageBar,
    Skeleton,
    SkeletonItem,
    Card,
} from '@fluentui/react-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ProductCard } from './ProductCard';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('24px'),
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        ...shorthands.gap('24px'),
    }
});

export const ApprovalGrid: React.FC = () => {
    const styles = useStyles();
    const queryClient = useQueryClient();

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['pending-products'],
        queryFn: async () => {
            const response = await api.get('/products/pending');
            // Extract from envelope: { success: true, data: [...] }
            return response.data?.data ?? response.data ?? [];
        }
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => api.post(`/products/${id}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-products'] });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => api.post(`/products/${id}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-products'] });
        }
    });

    if (isLoading) {
        return (
            <div className={styles.container}>
                <Subtitle1>Approval Center...</Subtitle1>
                <div className={styles.grid}>
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                            <div style={{ height: '180px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', marginBottom: '16px' }}>
                                <Skeleton style={{ width: '100%', height: '100%' }}>
                                    <SkeletonItem shape="rectangle" style={{ width: '100%', height: '100%' }} />
                                </Skeleton>
                            </div>
                            <Skeleton>
                                <SkeletonItem size={16} style={{ width: '80%', marginBottom: '8px' }} />
                                <SkeletonItem size={16} style={{ width: '60%' }} />
                            </Skeleton>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <MessageBar intent="error">
                Failed to load pending products.
            </MessageBar>
        );
    }

    return (
        <div className={styles.container}>
            <Subtitle1>Approval Center ({products?.length || 0} items)</Subtitle1>

            {products?.length === 0 ? (
                <MessageBar intent="info">
                    No items pending approval. Great job!
                </MessageBar>
            ) : (
                <div className={styles.grid}>
                    {products?.map((product: any) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onApprove={(id) => approveMutation.mutate(id)}
                            onReject={(id) => rejectMutation.mutate(id)}
                            isLoading={approveMutation.isPending || rejectMutation.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
