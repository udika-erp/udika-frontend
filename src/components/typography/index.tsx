import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Title({ className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn('text-2xl font-bold tracking-tight text-foreground', className)}
      {...props}
    />
  );
}

export function Subtitle({ className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn('text-xl font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
}

export function Body({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-foreground', className)}
      {...props}
    />
  );
}

export function Muted({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}
