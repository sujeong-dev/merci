import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { ChevronRightIcon } from '@/shared/ui/icons';

/**
 * 아이콘 + 타이틀 + 부제목 + 우측 화살표로 구성된 카드형 버튼
 *
 * Figma: 홈 페이지 Button(2PIFDJ) 패턴
 * - row, gap-4, p-6, rounded-2xl
 * - bg-white, border border-border-subtle, shadow-sm
 *
 * ## href vs onClick
 * - `href` 제공 시 → Next.js `<Link>`로 렌더링 (Server Component에서 사용 가능, SEO 친화적)
 * - `href` 없을 시 → `<button>`으로 렌더링 (onClick 등 ButtonHTMLAttributes 전달 가능)
 *
 * @example
 * // 페이지 이동 (Server Component에서 사용 가능)
 * <CardButton href="/create-group" icon={...} title="가족 그룹 만들기" subtitle="..." />
 *
 * // 동작 트리거 (Client Component에서 사용)
 * <CardButton icon={...} title="..." subtitle="..." onClick={handleClick} />
 */

const cardClass =
  'flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-6 text-left shadow-sm transition-opacity active:opacity-75';

const cardInner = (icon: React.ReactNode, title: string, subtitle: string) => (
  <>
    {/* 아이콘 영역 (52×52) */}
    <div className="shrink-0">{icon}</div>

    {/* 텍스트 영역 */}
    <div className="flex flex-1 flex-col">
      <span className="typography-h3 text-text-primary">{title}</span>
      <span className="typography-body-sm text-text-body">{subtitle}</span>
    </div>

    {/* 우측 화살표 — 피그마 chevron(8×12, #D1D5DB) */}
    <ChevronRightIcon className="shrink-0 text-[#D1D5DB]" />
  </>
);

export interface CardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 왼쪽 아이콘 영역 (52×52 권장) */
  icon: React.ReactNode;
  /** 주 텍스트 — typography-h3 (20px Bold) */
  title: string;
  /** 보조 텍스트 — typography-body-sm (14px Regular) */
  subtitle: string;
  /**
   * 이동할 경로 — 제공 시 `<Link>`로 렌더링됩니다.
   * Server Component 페이지에서도 onClick 없이 라우팅이 가능합니다.
   */
  href?: string;
}

export function CardButton({ icon, title, subtitle, href, className, ...props }: CardButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(cardClass, className)}
      >
        {cardInner(icon, title, subtitle)}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        cardClass,
        'disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {cardInner(icon, title, subtitle)}
    </button>
  );
}
