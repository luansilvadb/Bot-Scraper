import { useState, useCallback } from 'react';

export interface UseModalReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
}

/**
 * A hook for managing modal state with optional data payload.
 * @template T The type of data stored in the modal
 * @returns An object containing modal state and control functions
 */
export function useModal<T>(): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((modalData?: T) => {
    setData(modalData ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setData(null);
      }
      return next;
    });
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
}
