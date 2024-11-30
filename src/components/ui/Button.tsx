import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { cn } from '../../lib/utils';

interface ButtonProps extends MuiButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      className={cn(className)}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
