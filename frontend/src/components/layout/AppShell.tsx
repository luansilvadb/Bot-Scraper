import React, { useState, useCallback } from 'react';
import {
    makeStyles,
    shorthands,
    tokens,
    Subtitle1,
    Button,
    Badge,
    mergeClasses
} from '@fluentui/react-components';
import {
    Bot24Regular,
    Bot24Filled,
    ShieldCheckmark24Regular,
    ShieldCheckmark24Filled,
    Apps24Regular,
    Apps24Filled,
    Settings24Regular,
    Settings24Filled,
    Flash24Regular,
    Desktop24Regular,
    Desktop24Filled,
    PanelLeftContract24Regular,
    PanelLeftExpand24Regular,
    bundleIcon
} from '@fluentui/react-icons';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100vh',
        backgroundColor: tokens.colorNeutralBackground1,
        overflow: 'hidden',
    },
    sidebar: {
        width: '260px',
        minWidth: '260px',
        backgroundColor: tokens.colorNeutralBackground1,
        borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.padding('20px', '16px'),
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: `4px 0 24px ${tokens.colorNeutralShadowAmbient}`,
    },
    sidebarCollapsed: {
        width: '64px',
        minWidth: '64px',
        ...shorthands.padding('20px', '12px'),
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
    },
    sidebarHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        ...shorthands.margin('0', '0', '24px', '0'),
        ...shorthands.gap('4px'),
        position: 'relative',
    },
    headerTop: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '48px',
        position: 'relative',
        transition: 'justify-content 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    headerTopCollapsed: {
        justifyContent: 'center',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('10px'),
        color: tokens.colorBrandForeground1,
        whiteSpace: 'nowrap',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        overflow: 'hidden',
        flexGrow: 1,
    },
    logoCollapsed: {
        width: '0',
        opacity: 0,
        ...shorthands.gap('0'),
        pointerEvents: 'none',
        flexGrow: 0,
    },
    logoIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: tokens.borderRadiusMedium,
        background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackgroundHover} 100%)`,
        color: tokens.colorNeutralForegroundInverted,
        boxShadow: `0 2px 8px ${tokens.colorBrandShadowAmbient}`,
    },
    collapseButton: {
        width: '40px',
        height: '40px',
        minWidth: '40px',
        ...shorthands.padding('0'),
        flexShrink: 0,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        backgroundColor: 'transparent',
        color: tokens.colorNeutralForeground2,
        ...shorthands.border('0'),
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, color 0.2s ease, margin 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: tokens.colorNeutralForeground1,
        },
        ':active': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
    },
    collapseButtonCollapsed: {
        marginRight: '0',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('6px'),
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: `${tokens.colorNeutralStroke1} transparent`,
        '&::-webkit-scrollbar': {
            width: '4px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: tokens.colorNeutralStroke1,
            borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: tokens.colorNeutralStroke2,
        },
    },
    navSection: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('4px'),
    },
    sectionTitle: {
        fontSize: '11px',
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground3,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...shorthands.padding('8px', '12px', '4px', '12px'),
        transition: 'opacity 0.3s ease, height 0.3s ease, padding 0.3s ease',
    },
    sectionTitleCollapsed: {
        opacity: 0,
        height: 0,
        overflow: 'hidden',
        padding: 0,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        height: '40px',
        ...shorthands.padding('0', '12px'),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        textDecoration: 'none',
        color: tokens.colorNeutralForeground2,
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0,
        backgroundColor: 'transparent',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: tokens.colorNeutralForeground1,
        },
        ':active': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
    },
    navItemCollapsed: {
        ...shorthands.padding('0'),
        justifyContent: 'center',
    },
    navItemIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        flexShrink: 0,
        marginRight: '12px',
        position: 'relative',
        transition: 'margin 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    navItemIconCollapsed: {
        marginRight: '0',
    },
    navItemContent: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        overflow: 'hidden',
        transition: 'flex-grow 0.3s ease, opacity 0.2s ease',
        opacity: 1,
    },
    navItemContentCollapsed: {
        flexGrow: 0,
        opacity: 0,
        width: 0,
    },
    navItemBadge: {
        marginLeft: 'auto',
        flexShrink: 0,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    navItemText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '14px',
        opacity: 1,
        transition: 'opacity 0.2s ease',
        whiteSpace: 'nowrap',
    },
    navItemTextCollapsed: {
        opacity: 0,
    },
    activeNavItem: {
        backgroundColor: 'color-mix(in sRGB, var(--primary), transparent 90%)',
        color: tokens.colorBrandForeground1,
        fontWeight: tokens.fontWeightSemibold,
        '::before': {
            content: '""',
            position: 'absolute',
            left: '0',
            top: '8px',
            bottom: '8px',
            width: '4px',
            backgroundColor: tokens.colorBrandBackground,
            borderRadius: '0 4px 4px 0',
        },
    },

    content: {
        flexGrow: 1,
        overflowY: 'auto',
        ...shorthands.padding('20px', '28px'),
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        ...shorthands.margin('20px', '0', '0', '0'),
        ...shorthands.padding('16px', '0', '0', '0'),
        background: `linear-gradient(180deg, transparent 0%, ${tokens.colorNeutralBackground1} 100%)`,
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        height: '48px',
        ...shorthands.padding('0', '12px'),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        overflow: 'hidden',
        cursor: 'pointer',
        boxSizing: 'border-box',
        transition: 'background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        backgroundColor: 'transparent',
        border: `1px solid transparent`,
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover,
            border: `1px solid ${tokens.colorNeutralStroke2}`,
            boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
        },
    },
    userSectionCollapsed: {
        justifyContent: 'center',
        ...shorthands.padding('0'),
    },
    userAvatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: tokens.borderRadiusCircular,
        background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackgroundHover} 100%)`,
        color: tokens.colorNeutralForegroundInverted,
        flexShrink: 0,
        fontSize: tokens.fontSizeBase300,
        fontWeight: tokens.fontWeightSemibold,
        marginRight: tokens.spacingHorizontalM,
        boxShadow: tokens.shadow8,
        transition: 'margin 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    userAvatarCollapsed: {
        marginRight: '0',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: 1,
        transition: 'opacity 0.3s ease, width 0.3s ease, flex-grow 0.3s ease',
        ...shorthands.gap(tokens.spacingVerticalXXS),
        flexGrow: 1,
    },
    userInfoCollapsed: {
        opacity: 0,
        width: 0,
        overflow: 'hidden',
        flexGrow: 0,
    },
    userName: {
        fontWeight: tokens.fontWeightSemibold,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: tokens.lineHeightBase300,
    },
    userRole: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: tokens.lineHeightBase100,
    },
    statusIndicator: {
        width: '8px',
        height: '8px',
        ...shorthands.borderRadius(tokens.borderRadiusCircular),
        backgroundColor: tokens.colorPaletteGreenForeground1,
        marginLeft: 'auto',
        boxShadow: `0 0 8px ${tokens.colorPaletteGreenBackground1}`,
        animation: 'pulse 2s infinite',
    },
    statusText: {
        fontSize: tokens.fontSizeBase100,
        color: tokens.colorPaletteGreenForeground1,
        marginLeft: 'auto',
    },
    logoText: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightBold,
        letterSpacing: '-0.3px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 1,
    },
    logoTextCollapsed: {
        opacity: 0,
        width: 0,
    },
    tooltipContainer: {
        ...shorthands.padding(tokens.spacingHorizontalXS),
    },
    tooltipTitle: {
        fontWeight: tokens.fontWeightSemibold,
        marginBottom: tokens.spacingVerticalXXS,
    },
    tooltipDesc: {
        fontSize: tokens.fontSizeBase200,
        opacity: 0.8,
        marginBottom: tokens.spacingVerticalS,
    },
    themeToggleWrapper: {
        marginBottom: tokens.spacingVerticalS,
        paddingLeft: tokens.spacingHorizontalM,
    }
});

export const AppShell: React.FC = () => {
    const styles = useStyles();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        // Restore from localStorage
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved ? JSON.parse(saved) : false;
    });

    const toggleSidebar = useCallback(() => {
        setIsCollapsed(prev => {
            const newValue = !prev;
            localStorage.setItem('sidebar-collapsed', JSON.stringify(newValue));
            return newValue;
        });
    }, []);

    const navSections = [
        {
            title: 'Overview',
            items: [
                {
                    label: 'Dashboard',
                    icon: bundleIcon(Apps24Filled, Apps24Regular),
                    to: '/',
                    description: 'Overview and analytics'
                },
            ]
        },
        {
            title: 'Operations',
            items: [
                {
                    label: 'Bots',
                    icon: bundleIcon(Bot24Filled, Bot24Regular),
                    to: '/bots',
                    description: 'Manage automation bots'
                },
                {
                    label: 'Workers',
                    icon: bundleIcon(Desktop24Filled, Desktop24Regular),
                    to: '/workers',
                    description: 'Worker nodes management'
                },
                {
                    label: 'Approval Center',
                    icon: bundleIcon(ShieldCheckmark24Filled, ShieldCheckmark24Regular),
                    to: '/approval',
                    description: 'Review pending approvals',
                    badge: 3
                },
            ]
        },
        {
            title: 'Settings',
            items: [
                {
                    label: 'System',
                    icon: bundleIcon(Settings24Filled, Settings24Regular),
                    to: '/system',
                    description: 'System configuration'
                },
            ]
        },
    ];

    return (
        <div className={styles.root}>
            <aside className={mergeClasses(styles.sidebar, isCollapsed && styles.sidebarCollapsed)}>
                <div className={styles.sidebarHeader}>
                    <div className={mergeClasses(styles.headerTop, isCollapsed && styles.headerTopCollapsed)}>
                        <div className={mergeClasses(styles.logo, isCollapsed && styles.logoCollapsed)}>
                            <div className={styles.logoIcon}>
                                <Flash24Regular fontSize={20} />
                            </div>
                            <Subtitle1 className={mergeClasses(styles.logoText, isCollapsed && styles.logoTextCollapsed)}>
                                Affiliate Bot
                            </Subtitle1>
                        </div>
                        <Button
                            icon={isCollapsed ? <PanelLeftExpand24Regular /> : <PanelLeftContract24Regular />}
                            appearance="subtle"
                            className={mergeClasses(styles.collapseButton, isCollapsed && styles.collapseButtonCollapsed)}
                            onClick={toggleSidebar}
                            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                            size="large" // Matches the 40px height target better
                        />
                    </div>
                </div>

                <nav className={styles.nav}>
                    {navSections.map((section, sectionIndex) => (
                        <div key={section.title} className={styles.navSection}>
                            <div className={mergeClasses(styles.sectionTitle, isCollapsed && styles.sectionTitleCollapsed)}>
                                {section.title}
                            </div>
                            {section.items.map((item, index) => {
                                const isActive = location.pathname === item.to ||
                                    (item.to !== '/' && location.pathname.startsWith(item.to));

                                const IconComponent = item.icon;
                                const globalIndex = sectionIndex * 10 + index;

                                const navItemContent = (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive: linkActive }) =>
                                            mergeClasses(
                                                styles.navItem,
                                                isCollapsed && styles.navItemCollapsed,
                                                (linkActive || isActive) && styles.activeNavItem
                                            )
                                        }
                                        title={isCollapsed ? item.label : undefined}
                                        style={{
                                            animationDelay: `${globalIndex * 50}ms`,
                                        }}
                                    >
                                        <span className={mergeClasses(styles.navItemIcon, isCollapsed && styles.navItemIconCollapsed)}>
                                            <IconComponent filled={isActive} fontSize={24} />
                                        </span>
                                        <span className={mergeClasses(styles.navItemContent, isCollapsed && styles.navItemContentCollapsed)}>
                                            <span className={mergeClasses(styles.navItemText, isCollapsed && styles.navItemTextCollapsed)}>
                                                {item.label}
                                            </span>
                                            {item.badge && !isCollapsed && (
                                                <Badge
                                                    appearance="filled"
                                                    color="brand"
                                                    size="small"
                                                    className={styles.navItemBadge}
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </span>
                                    </NavLink>
                                );

                                return navItemContent;
                            })}
                        </div>
                    ))}
                </nav>

                <div className={styles.footer}>
                    {!isCollapsed && (
                        <div className={styles.themeToggleWrapper}>
                            <ThemeToggle />
                        </div>
                    )}
                    <div className={mergeClasses(styles.userSection, isCollapsed && styles.userSectionCollapsed)}>
                        <div className={mergeClasses(styles.userAvatar, isCollapsed && styles.userAvatarCollapsed)}>
                            A
                        </div>
                        <div className={mergeClasses(styles.userInfo, isCollapsed && styles.userInfoCollapsed)}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span className={styles.userName}>Admin</span>
                                <div className={styles.statusIndicator} title="Online" />
                            </div>
                            <span className={styles.userRole}>System Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};
