import {
    makeStyles,
    shorthands,
    tokens,
    Title1,
    Title3,
    Text,
    Card,
    CardHeader,
    Button,
    Badge,
} from '@fluentui/react-components';
import {
    Bot24Regular,
    Desktop24Regular,
    CheckmarkCircle24Regular,
    ArrowRight20Regular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useBots } from '../bots/api';
import { useWorkers } from '../workers/api';
import { useProducts } from '../products/api';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXL),
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalXS),
    },
    welcome: {
        color: tokens.colorNeutralForeground1,
    },
    subtitle: {
        color: tokens.colorNeutralForeground4,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        ...shorthands.gap(tokens.spacingHorizontalXL),
    },
    statCard: {
        ...shorthands.padding(tokens.spacingHorizontalXL),
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalM),
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.06)'),
        transition: 'background-color 0.3s ease',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
        },
    },
    statHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statValue: {
        fontSize: tokens.fontSizeHero700,
        fontWeight: tokens.fontWeightBold,
        lineHeight: '1',
    },
    statLabel: {
        color: tokens.colorNeutralForeground3,
        fontWeight: tokens.fontWeightSemibold,
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    statIcon: {
        width: '40px',
        height: '40px',
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: tokens.fontSizeBase500,
    },
    blueIcon: {
        backgroundColor: tokens.colorBrandBackground2,
        color: tokens.colorBrandForeground2,
    },
    greenIcon: {
        backgroundColor: tokens.colorPaletteGreenBackground1,
        color: tokens.colorPaletteGreenForeground1,
    },
    orangeIcon: {
        backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
        color: tokens.colorPaletteDarkOrangeForeground1,
    },
    sectionTitle: {
        marginBottom: tokens.spacingVerticalM,
    },
    recentGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        ...shorthands.gap(tokens.spacingHorizontalXXL),
        '@media (max-width: 900px)': {
            gridTemplateColumns: '1fr',
        },
    },
    quickActionList: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalS),
        marginTop: tokens.spacingVerticalM,
    },
    quickActionButton: {
        justifyContent: 'flex-start',
    },
    statusList: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalM),
        marginTop: tokens.spacingVerticalM,
    },
    statusRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export function DashboardHome() {
    const styles = useStyles();
    const navigate = useNavigate();

    // Fetch data for stats
    const { data: botsData } = useBots({ limit: 1 });
    const { data: workers } = useWorkers();
    const { data: productsData } = useProducts({ limit: 1, status: 'PENDING_APPROVAL' });

    const stats = [
        {
            label: 'Total Bots',
            value: botsData?.meta?.total || 0,
            icon: <Bot24Regular />,
            colorClass: styles.blueIcon,
            link: '/bots'
        },
        {
            label: 'Active Workers',
            value: workers?.filter(w => w.status === 'CONNECTED').length || 0,
            icon: <Desktop24Regular />,
            colorClass: styles.greenIcon,
            subtitle: `${workers?.length || 0} registered`,
            link: '/workers'
        },
        {
            label: 'Pending Approval',
            value: productsData?.meta?.total || 0,
            icon: <CheckmarkCircle24Regular />,
            colorClass: styles.orangeIcon,
            link: '/approval'
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title1 className={styles.welcome}>Control Center</Title1>
                <Text size={400} className={styles.subtitle}>
                    Overview of your distribution automation and scraping network
                </Text>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <Card
                        key={i}
                        className={styles.statCard}
                        onClick={() => navigate(stat.link)}
                    >
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIcon} ${stat.colorClass}`}>
                                {stat.icon}
                            </div>
                            <Button
                                icon={<ArrowRight20Regular />}
                                appearance="subtle"
                            />
                        </div>
                        <div>
                            <div className={styles.statValue}>{stat.value}</div>
                            <div className={styles.statLabel}>{stat.label}</div>
                            {stat.subtitle && (
                                <Text size={200} className={styles.subtitle}>
                                    {stat.subtitle}
                                </Text>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <div className={styles.recentGrid}>
                <Card>
                    <CardHeader
                        header={<Title3>Quick Actions</Title3>}
                        description="Access common tools and configuration"
                    />
                    <div className={styles.quickActionList}>
                        <Button
                            appearance="outline"
                            size="large"
                            onClick={() => navigate('/bots')}
                            className={styles.quickActionButton}
                        >
                            Configure a New Bot
                        </Button>
                        <Button
                            appearance="outline"
                            size="large"
                            onClick={() => navigate('/approval')}
                            className={styles.quickActionButton}
                        >
                            Review Pending Products
                        </Button>
                        <Button
                            appearance="outline"
                            size="large"
                            onClick={() => navigate('/workers')}
                            className={styles.quickActionButton}
                        >
                            Monitor Worker Status
                        </Button>
                    </div>
                </Card>

                <Card>
                    <CardHeader
                        header={<Title3>System Status</Title3>}
                        description="Network and process health"
                    />
                    <div className={styles.statusList}>
                        <div className={styles.statusRow}>
                            <Text>API Server</Text>
                            <Badge color="success" appearance="filled">Operational</Badge>
                        </div>
                        <div className={styles.statusRow}>
                            <Text>Worker Network</Text>
                            <Badge color={workers?.some(w => w.status === 'CONNECTED') ? "success" : "warning"} appearance="filled">
                                {workers?.filter(w => w.status === 'CONNECTED').length || 0} Online
                            </Badge>
                        </div>
                        <div className={styles.statusRow}>
                            <Text>Database</Text>
                            <Badge color="success" appearance="filled">Healthy</Badge>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
