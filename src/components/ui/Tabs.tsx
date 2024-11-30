import React from 'react';
import { Tab as HeadlessTab } from '@headlessui/react';
import { cn } from '../../lib/utils';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children }: TabsProps) {
  const selectedIndex = React.Children.toArray(children).findIndex(
    (child) => React.isValidElement(child) && child.props.value === (value || defaultValue)
  );

  return (
    <HeadlessTab.Group
      defaultIndex={selectedIndex !== -1 ? selectedIndex : 0}
      onChange={(index) => {
        const child = React.Children.toArray(children)[index];
        if (React.isValidElement(child) && onValueChange) {
          onValueChange(child.props.value);
        }
      }}
    >
      {children}
    </HeadlessTab.Group>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <HeadlessTab.List
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        className
      )}
    >
      {children}
    </HeadlessTab.List>
  );
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  return (
    <HeadlessTab
      className={({ selected }) =>
        cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800',
          selected
            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50',
          className
        )
      }
    >
      {children}
    </HeadlessTab>
  );
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  return (
    <HeadlessTab.Panel
      className={cn(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800',
        className
      )}
    >
      {children}
    </HeadlessTab.Panel>
  );
}
