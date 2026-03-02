import { cn } from '@/shared/lib/utils';

/**
 * 오디오/비디오 프로그레스 바
 *
 * Figma 컴포넌트: Progress Bar
 * - 3px 높이, rounded-full
 * - 배경: bg-bg-disabled (#E5E7EB)
 * - 진행: bg-primary-soft (#333333)
 */
interface ProgressBarProps {
  /** 0 ~ 100 */
  value: number;
  className?: string;
  onClick?: (ratio: number) => void;
}

export function ProgressBar({ value, className, onClick }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onClick(Math.min(1, Math.max(0, ratio)));
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleClick}
      className={cn(
        'relative h-[3px] w-full rounded-full bg-bg-disabled',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary-soft transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
