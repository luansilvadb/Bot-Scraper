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
    Edit20Regular,
    Delete20Regular,
    Play20Regular,
    Pause20Regular,
    Search20Regular
} from '@fluentui/react-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { CreateBotModal } from './CreateBotModal';

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

export const BotList: React.FC = () => {
    const styles = useStyles();

    const { data: bots, isLoading } = useQuery({
        queryKey: ['bots'],
        queryFn: async () => {
            const response = await api.get('/bots');
            return response.data;
        }
    });

    const triggerMutation = useMutation({
        mutationFn: (botId: string) => api.post(`/bots/${botId}/trigger`),
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE': return <Badge appearance="filled" color="success">Active</Badge>;
            case 'PAUSED': return <Badge appearance="filled" color="warning">Paused</Badge>;
            case 'ERROR': return <Badge appearance="filled" color="danger">Error</Badge>;
            default: return <Badge appearance="outline">Unknown</Badge>;
        }
    };

    if (isLoading) return <div>Loading bots...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Subtitle1>Managed Bots</Subtitle1>
                <CreateBotModal />
            </div>

            <Table className={styles.table}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Target URL</TableHeaderCell>
                        <TableHeaderCell>Schedule</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bots?.map((bot: any) => (
                        <TableRow key={bot.id}>
                            <TableCell>{bot.name}</TableCell>
                            <TableCell>{bot.targetUrl}</TableCell>
                            <TableCell>{bot.scheduleCron}</TableCell>
                            <TableCell>{getStatusBadge(bot.status)}</TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <Button
                                        icon={<Search20Regular />}
                                        size="small"
                                        title="Scrape Now"
                                        onClick={() => triggerMutation.mutate(bot.id)}
                                        disabled={triggerMutation.isPending}
                                    />
                                    <Button icon={bot.status === 'ACTIVE' ? <Pause20Regular /> : <Play20Regular />} size="small" />
                                    <Button icon={<Edit20Regular />} size="small" />
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
