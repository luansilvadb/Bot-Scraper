import React from 'react';
import {
    makeStyles,
    shorthands,
    tokens,
    Caption1,
    Body1,
    Subtitle1
} from '@fluentui/react-components';
import {
    Bot24Regular,
    ShieldCheckmark24Regular,
    Apps24Regular,
    Settings24Regular,
    Globe24Regular,
    Flash24Regular,
    Desktop24Regular
} from '@fluentui/react-icons';
import { NavLink, Outlet } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100vh',
        backgroundColor: tokens.colorNeutralBackground2,
    },
    sidebar: {
        width: '260px',
        backgroundColor: tokens.colorNeutralBackground1,
        borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.padding('20px', '12px'),
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('12px'),
        ...shorthands.margin('0', '0', '32px', '8px'),
        color: tokens.colorBrandForeground1,
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('4px'),
        flexGrow: 1,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('12px'),
        ...shorthands.padding('10px', '12px'),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        textDecoration: 'none',
        color: tokens.colorNeutralForeground2,
        transition: 'background-color 0.2s, color 0.2s',
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover,
            color: tokens.colorNeutralForeground1,
        },
    },
    activeNavItem: {
        backgroundColor: tokens.colorBrandBackgroundSelected,
        color: tokens.colorNeutralForegroundInverted,
        fontWeight: tokens.fontWeightSemibold,
        ':hover': {
            backgroundColor: tokens.colorBrandBackgroundSelected,
        }
    },
    content: {
        flexGrow: 1,
        overflowY: 'auto',
        ...shorthands.padding('40px'),
    },
    footer: {
        ...shorthands.padding('12px', '8px'),
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        ...shorthands.margin('20px', '0', '0', '0'),
    }
});

export const AppShell: React.FC = () => {
    const styles = useStyles();

    const navItems = [
        { label: 'Dashboard', icon: <Apps24Regular />, to: '/' },
        { label: 'Bots', icon: <Bot24Regular />, to: '/bots' },
        { label: 'Workers', icon: <Desktop24Regular />, to: '/workers' },
        { label: 'Approval Center', icon: <ShieldCheckmark24Regular />, to: '/approval' },
        { label: 'System', icon: <Settings24Regular />, to: '/system' },
    ];

    return (
        <div className={styles.root}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Flash24Regular fontSize={32} />
                    <Subtitle1>Affiliate Bot</Subtitle1>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
                            }
                        >
                            {item.icon}
                            <Body1>{item.label}</Body1>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <Caption1 block style={{ textAlign: 'center', color: tokens.colorNeutralForeground4 }}>
                        v1.0.0-mvp
                    </Caption1>
                </div>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div >
    );
};
