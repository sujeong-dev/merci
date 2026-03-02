import { cn } from '@/shared/lib/utils';
import { ChevronRightIcon } from '@/shared/ui/icons';

/**
 * 아이콘 + 타이틀 + 부제목 + 우측 화살표로 구성된 카드형 버튼
 *
 * Figma: 홈 페이지 Button(2PIFDJ) 패턴
 * - row, gap-4, p-6, rounded-2xl
 * - bg-white, border border-border-subtle, shadow-sm
 *
 * @example
 * <CardButton
 *   icon={<Image src="/images/home-icon-group.svg" alt="" width={52} height={52} />}
 *   title="가족 그룹 만들기"
 *   subtitle="새로운 앨범 시작하기"
 *   onClick={...}
 * />
 */

export interface CardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 왼쪽 아이콘 영역 (52×52 권장) */
  icon: React.ReactNode;
  /** 주 텍스트 — typography-h3 (20px Bold) */
  title: string;
  /** 보조 텍스트 — typography-body-sm (14px Regular) */
  subtitle: string;
}

export function CardButton({ icon, title, subtitle, className, ...props }: CardButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-6 text-left shadow-sm transition-opacity active:opacity-75 disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {/* 아이콘 영역 (52×52) */}
      <div className="shrink-0">{icon}</div>

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col">
        <span className="typography-h3 text-text-primary">{title}</span>
        <span className="typography-body-sm text-text-body">{subtitle}</span>
      </div>

      {/* 우측 화살표 — 피그마 chevron(8×12, #D1D5DB) */}
      <ChevronRightIcon className="shrink-0 text-[#D1D5DB]" />
    </button>
  );
}
