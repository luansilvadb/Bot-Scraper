import { useCallback } from 'react';
import {
    Toast,
    ToastTitle,
    ToastBody,
    Toaster,
    useToastController,
    useId,
} from '@fluentui/react-components';
import type { ToastIntent } from '@fluentui/react-components';

interface ToastOptions {
    title: string;
    body?: string;
    intent?: ToastIntent;
    timeout?: number;
}

export function useToast() {
    const toasterId = useId('toaster');
    const { dispatchToast } = useToastController(toasterId);

    const showToast = useCallback(
        ({ title, body, intent = 'info', timeout = 3000 }: ToastOptions) => {
            dispatchToast(
                <Toast>
                    <ToastTitle>{title}</ToastTitle>
                    {body && <ToastBody>{body}</ToastBody>}
                </Toast>,
                { intent, timeout }
            );
        },
        [dispatchToast]
    );

    const success = useCallback(
        (title: string, body?: string) => {
            showToast({ title, body, intent: 'success' });
        },
        [showToast]
    );

    const error = useCallback(
        (title: string, body?: string) => {
            showToast({ title, body, intent: 'error', timeout: 5000 });
        },
        [showToast]
    );

    const warning = useCallback(
        (title: string, body?: string) => {
            showToast({ title, body, intent: 'warning' });
        },
        [showToast]
    );

    const info = useCallback(
        (title: string, body?: string) => {
            showToast({ title, body, intent: 'info' });
        },
        [showToast]
    );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      showToast({ title: title || 'Success', body: message, intent: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      showToast({ title: title || 'Error', body: message, intent: 'error', timeout: 5000 });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      showToast({ title: title || 'Warning', body: message, intent: 'warning' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      showToast({ title: title || 'Info', body: message, intent: 'info' });
    },
    [showToast]
  );

  return {
    toasterId,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    success,
    error,
    warning,
    info,
    ToasterComponent: () => <Toaster toasterId={toasterId} />,
  };
}

// Global toast context for app-wide notifications
let globalToast: ReturnType<typeof useToast> | null = null;

export function setGlobalToast(toast: ReturnType<typeof useToast>) {
    globalToast = toast;
}

export function getGlobalToast() {
    return globalToast;
}
