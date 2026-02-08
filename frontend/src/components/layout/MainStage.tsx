import React from 'react';
import {
  makeStyles,
  tokens,
  Title2,
  mergeClasses,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  mainStage: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '56px',
    padding: `0 ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  headerTitle: {
    fontWeight: tokens.fontWeightSemibold,
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: tokens.spacingHorizontalL,
  },
});

interface MainStageProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const MainStage: React.FC<MainStageProps> = ({
  title,
  children,
  className,
}) => {
  const styles = useStyles();

  return (
    <main className={mergeClasses(styles.mainStage, className)} role="main" aria-label="Main Content">
      {title && (
        <header className={styles.header}>
          <Title2 className={styles.headerTitle}>{title}</Title2>
        </header>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </main>
  );
};
