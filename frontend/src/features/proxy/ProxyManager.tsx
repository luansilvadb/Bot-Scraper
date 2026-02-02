import React from 'react';
import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    Badge,
    Button,
    Subtitle1,
    makeStyles,
    shorthands,
    tokens
} from '@fluentui/react-components';
import {
    Delete20Regular,
    CheckmarkCircle20Regular,
    ArrowClockwise20Regular
} from '@fluentui/react-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { CreateProxyModal } from './CreateProxyModal';

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
    },
    table: {
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    }
});

export const ProxyManager: React.FC = () => {
    const styles = useStyles();
    const queryClient = useQueryClient();

    const { data: proxies, isLoading } = useQuery({
        queryKey: ['proxies'],
        queryFn: async () => {
            const response = await api.get('/proxy');
            return response.data;
        }
    });

    const checkMutation = useMutation({
        mutationFn: (id: string) => api.post(`/proxy/${id}/check`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proxies'] });
        }
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ONLINE': return <Badge appearance="filled" color="success">Online</Badge>;
            case 'OFFLINE': return <Badge appearance="filled" color="danger">Offline</Badge>;
            default: return <Badge appearance="outline">Unknown</Badge>;
        }
    };

    if (isLoading) return <div>Loading proxies...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Subtitle1>Proxy Infrastructure</Subtitle1>
                <CreateProxyModal />
            </div>

            <Table className={styles.table}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Host</TableHeaderCell>
                        <TableHeaderCell>Port</TableHeaderCell>
                        <TableHeaderCell>Protocol</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Last Checked</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {proxies?.map((proxy: any) => (
                        <TableRow key={proxy.id}>
                            <TableCell>{proxy.host}</TableCell>
                            <TableCell>{proxy.port}</TableCell>
                            <TableCell>{proxy.protocol}</TableCell>
                            <TableCell>{getStatusBadge(proxy.status)}</TableCell>
                            <TableCell>{proxy.lastChecked ? new Date(proxy.lastChecked).toLocaleString() : 'Never'}</TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <Button
                                        icon={checkMutation.isPending && checkMutation.variables === proxy.id ? <ArrowClockwise20Regular /> : <CheckmarkCircle20Regular />}
                                        size="small"
                                        onClick={() => checkMutation.mutate(proxy.id)}
                                        disabled={checkMutation.isPending}
                                    >
                                        Check
                                    </Button>
                                    <Button icon={<Delete20Regular />} size="small" appearance="subtle" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
