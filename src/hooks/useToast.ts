import { useState, useCallback } from 'react';
import type { Toast } from '../components/ui/Toast';

type ToastProps = Omit<Toast, 'id'>;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((props: ToastProps | string) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = typeof props === 'string' ? { id, description: props } : { id, ...props };

    setToasts((current) => [...current, toast]);

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, toast.duration || 5000);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, props: Partial<ToastProps>) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, ...props } : toast))
    );
  }, []);

  return {
    toasts,
    toast: addToast,
    dismiss: removeToast,
    update: updateToast,
  };
}
