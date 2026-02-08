import React, { useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  makeStyles,
} from '@fluentui/react-components';

export interface FormModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}

const useStyles = makeStyles({
  surface: {
    width: '90%',
    maxWidth: '560px',
  },
  surfaceSmall: {
    width: '90%',
    maxWidth: '400px',
  },
  surfaceLarge: {
    width: '90%',
    maxWidth: '800px',
  },
});

/**
 * A standardized modal wrapper component for forms with consistent styling and behavior.
 *
 * @example
 * ```tsx
 * <FormModal
 *   title="Create Product"
 *   isOpen={isOpen}
 *   onClose={close}
 *   size="medium"
 * >
 *   <ProductForm onSubmit={handleSubmit} />
 * </FormModal>
 * ```
 */
export const FormModal: React.FC<FormModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  size = 'medium',
}) => {
  const styles = useStyles();

  const getSurfaceClass = () => {
    switch (size) {
      case 'small':
        return styles.surfaceSmall;
      case 'large':
        return styles.surfaceLarge;
      case 'medium':
      default:
        return styles.surface;
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={getSurfaceClass()}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{children}</DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

FormModal.displayName = 'FormModal';
