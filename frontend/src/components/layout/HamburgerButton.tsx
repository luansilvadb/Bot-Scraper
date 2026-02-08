import React from 'react';
import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import {
  Navigation24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  button: {
    minWidth: '44px',
    width: '44px',
    height: '44px',
    padding: 0,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },
});

interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  'aria-label'?: string;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  onToggle,
  'aria-label': ariaLabel,
}) => {
  const styles = useStyles();

  return (
    <Button
      appearance="transparent"
      className={styles.button}
      onClick={onToggle}
      aria-label={ariaLabel || (isOpen ? 'Close menu' : 'Open menu')}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      icon={isOpen ? <Dismiss24Regular /> : <Navigation24Regular />}
      size="large"
    />
  );
};
