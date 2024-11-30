import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardHeader as MuiCardHeader,
  CardContent as MuiCardContent,
  Typography,
  CardHeaderProps,
  CardContentProps,
} from '@mui/material';
import { cn } from '../../lib/utils';

interface CardProps extends MuiCardProps {
  variant?: 'outlined' | 'elevation';
}

export function Card({ className, variant = 'outlined', children, ...props }: CardProps) {
  return (
    <MuiCard variant={variant} className={cn(className)} {...props}>
      {children}
    </MuiCard>
  );
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <MuiCardHeader className={cn(className)} {...props} />;
}

export function CardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography variant="h6" component="h3" className={cn(className)} {...props}>
      {children}
    </Typography>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography variant="body2" color="text.secondary" className={cn(className)} {...props}>
      {children}
    </Typography>
  );
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <MuiCardContent className={cn(className)} {...props} />;
}
