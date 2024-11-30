import React, { createContext, useContext } from 'react';
import { Toast, ToastViewport } from './Toast';
import { useToast } from '../../hooks/useToast';

type ToastContextType = ReturnType<typeof useToast>;

const ToastContext = createContext<ToastContextType | null>(null);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, toast, dismiss, update } = useToast();

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, update }}>
      {children}
      <ToastViewport>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => dismiss(toast.id)} />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}
