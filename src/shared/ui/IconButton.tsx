import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

/**
 * 원형 아이콘 버튼 컴포넌트
 *
 * Figma 컴포넌트 매핑:
 * - dark    56 → Button/play-56, Button/pause-56, Button/stop-56, Button/plus-56
 * - dark    40 → Button/play-40, Button/pause-40
 * - outlined 56 → Button/recording
 * - outlined 40 → Button/settings
 * - muted   28 → Button/more
 * - ghost   56 → Icon/warning, Icon/add-picture (bg-muted 원형 배지)
 * - ghost   32 → Icon/comment
 * - ghost   28 → Icon/recording (배지)
 */
const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full transition-opacity active:opacity-70 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        // 진한 남색 배경 (미디어 컨트롤 버튼)
        dark: 'bg-primary-navy text-white',
        // 흰색 배경 + 테두리 + 그림자 (녹음, 설정 버튼)
        outlined:
          'bg-bg-surface text-text-primary border border-border-subtle shadow',
        // 회색 배경 (더보기, 녹음 배지)
        muted: 'bg-[var(--dt-color-primitive-gray-400)] text-white',
        // 연회색 배경 (경고, 사진추가 배지)
        ghost: 'bg-bg-muted text-text-secondary',
        // 백그라운드 없음 (copy, chevron 등 평면 아이콘)
        plain: 'text-text-secondary',
      },
      size: {
        56: 'size-14',  // 56px
        40: 'size-10',  // 40px
        32: 'size-8',   // 32px
        28: 'size-7',   // 28px
        24: 'size-6',   // 24px
      },
    },
    defaultVariants: {
      variant: 'dark',
      size: 56,
    },
  },
);

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  children: React.ReactNode;
  /** backdrop-filter blur (녹음 배지 등) */
  blur?: boolean;
}

export function IconButton({
  variant,
  size,
  blur,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        iconButtonVariants({ variant, size }),
        blur && 'backdrop-blur-md',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
