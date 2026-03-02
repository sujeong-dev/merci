import { cn } from '@/shared/lib/utils';

/**
 * 필 탭 컴포넌트
 *
 * Figma 컴포넌트: Tab (Property 1=on/off)
 * - off : 흰색 bg, border-border-default, dark text, rounded-full, py-[10px] px-5
 * - on  : dark bg(#111827), border-dark, white text, rounded-full, py-[10px] px-5
 */
interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function Tab({ active = false, className, children, ...props }: TabProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      className={cn(
        'inline-flex items-center justify-center rounded-full border py-[10px] px-5 typography-body-lg transition-colors',
        active
          ? 'border-primary-navy bg-primary-navy text-text-on-dark'
          : 'border-border-default bg-bg-surface text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
