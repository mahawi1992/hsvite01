import React from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: () => void;
}

const variants = {
  default: 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800',
  destructive:
    'bg-red-50 border-red-200 text-red-900 dark:bg-red-900 dark:border-red-800 dark:text-red-50',
  success:
    'bg-green-50 border-green-200 text-green-900 dark:bg-green-900 dark:border-green-800 dark:text-green-50',
  warning:
    'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-50',
};

export function Toast({
  id,
  title,
  description,
  action,
  variant = 'default',
  onClose,
}: ToastProps) {
  return (
    <Transition
      appear={true}
      show={true}
      enter="transition-all duration-300"
      enterFrom="opacity-0 translate-x-full"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-300"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-full"
    >
      <div
        className={cn(
          'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg border p-4 shadow-lg',
          variants[variant]
        )}
      >
        <div className="flex w-full items-start gap-4">
          <div className="flex-1">
            {title && <div className="text-sm font-semibold">{title}</div>}
            {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
          </div>
          {action}
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  );
}

interface ToastViewportProps {
  children: React.ReactNode;
}

export function ToastViewport({ children }: ToastViewportProps) {
  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  );
}
