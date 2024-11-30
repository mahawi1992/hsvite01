import { TextField, TextFieldProps } from '@mui/material';
import { cn } from '../../lib/utils';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

export function Input({ className, variant = 'outlined', ...props }: InputProps) {
  return <TextField variant={variant} className={cn(className)} {...props} />;
}
