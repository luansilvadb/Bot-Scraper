import React from 'react';
import {
  Text,
  makeStyles,
  tokens,
  Divider,
} from '@fluentui/react-components';

export interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  showDivider?: boolean;
}

const useStyles = makeStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  icon: {
    color: tokens.colorBrandForeground1,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
});

export const FormSection: React.FC<FormSectionProps> = ({
  icon,
  title,
  children,
  showDivider = false,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <Text className={styles.title}>{title}</Text>
      </div>
      {children}
      {showDivider && <Divider />}
    </div>
  );
};

FormSection.displayName = 'FormSection';
