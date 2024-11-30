import { FormLabel, FormLabelProps } from '@mui/material';
import { cn } from '../../lib/utils';

interface LabelProps extends FormLabelProps {
  htmlFor?: string;
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <FormLabel className={cn(className)} {...props}>
      {children}
    </FormLabel>
  );
}
