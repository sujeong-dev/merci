import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * 모달 공통 레이아웃
 *
 * Figma: 모달 공통 구조 (GroupCreatedModal · InviteCodeInputModal)
 * - 오버레이: fixed inset, bg-black/40, backdrop-blur-[2px]
 * - 카드: max-w-[340px], rounded-[24px], bg-bg-surface, pt-12 px-6 pb-8, shadow-lg
 *
 * @example
 * <ModalSheet isOpen={isOpen}>
 *   <h2>제목</h2>
 *   ...
 * </ModalSheet>
 */

interface ModalSheetProps {
  /** 모달 표시 여부 — false이면 null 반환 */
  isOpen: boolean;
  /** 카드 className 오버라이드 */
  className?: string;
  children: ReactNode;
}

export function ModalSheet({ isOpen, className, children }: ModalSheetProps) {
  if (!isOpen) return null;

  return (
    /* 오버레이 — fixed 전체, rgba(0,0,0,0.4), backdrop-blur-[2px] */
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-[2px]">
      {/* 모달 카드 — max-w-340px, rounded-24px, shadow-lg */}
      <div className={cn('w-full max-w-[340px] rounded-[24px] bg-bg-surface pt-12 px-6 pb-8 shadow-lg', className)}>
        {children}
      </div>
    </div>
  );
}
