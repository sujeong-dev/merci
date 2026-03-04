import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

/**
 * 텍스트 버튼 컴포넌트
 *
 * Figma 컴포넌트:
 * - primary  → Button/primary-56 : bg=#333333, white text, py-[15px] px-10, rounded-[10px], body-lg
 * - outlined → Button-32 outlined : white bg, border-border-default, text-subtle, py-1.5 px-3, rounded-[10px], caption-medium
 * - gray     → Button-32 gray    : bg-bg-disabled, text-subtle, py-[7px] px-3, rounded-[10px], caption-medium
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center transition-opacity active:opacity-70 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-soft text-text-on-dark typography-body-lg rounded-[10px] py-[15px] px-10',
        outlined:
          'bg-bg-surface text-text-subtle typography-caption-medium rounded-[10px] border border-border-default py-1.5 px-3',
        gray:
          'bg-bg-disabled text-text-subtle typography-caption-medium rounded-[10px] py-[7px] px-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ variant, fullWidth, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
