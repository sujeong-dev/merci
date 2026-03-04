import { cn } from '@/shared/lib/utils';
import { CheckIcon } from './icons';

/**
 * 사진 선택/반응 오버레이 컴포넌트
 *
 * Figma 컴포넌트: 사진 반응 (선택=on/off)
 * - off: 기본 사진 상태 (반응 영역 숨김)
 * - on : 사진 선택 상태 (체크 오버레이 표시)
 *
 * 사용법: 사진 카드를 감싸는 래퍼로 사용
 */
interface PhotoReactionProps {
  selected?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function PhotoReaction({ selected = false, onToggle, children, className }: PhotoReactionProps) {
  return (
    <div
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        'relative overflow-hidden rounded-md transition-all',
        onToggle && 'cursor-pointer',
        className,
      )}
    >
      {children}

      {/* 선택 오버레이 */}
      {selected && (
        <div className="absolute inset-0 bg-primary-navy/20">
          <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary-navy">
            <CheckIcon className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
