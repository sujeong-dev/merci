'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CopyIcon, CheckIcon } from '@/shared/ui/icons';
import { Button, Input, SocialLoginButton } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';

/**
 * 가족 그룹 생성 완료 모달
 *
 * Figma: 마씨 › 그룹 생성 완료 모달 (node 6:1080)
 * - 오버레이: fixed inset, rgba(0,0,0,0.4), backdrop-blur-[2px]
 * - 카드: max-w-[340px], rounded-[24px], pt-12 px-6 pb-8, shadow-lg
 * - 제목 섹션: typography-modal-title, text-center, pb-10
 * - 초대 코드 섹션: caption-spaced 라벨 + 코드박스(row space-between), pb-10
 * - 버튼 섹션: 카카오 공유 버튼 + 홈으로 이동 텍스트 버튼
 *
 * ## 복사 버튼 동작
 * 복사 클립보드 성공 → CopyIcon을 CheckIcon(node 157:762)으로 교체 → 2초 후 원복
 *
 * ## 재사용된 공통 컴포넌트
 * - SocialLoginButton (variant="kakao") — children으로 텍스트 오버라이드
 * - CopyIcon, CheckIcon — shared/ui/icons
 * - typography-modal-title, typography-caption-spaced, typography-body-lg-bold — globals.css
 */

interface InviteCodeInputModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 콜백 */
  onClose: () => void;
  /** 표시할 초대 코드 */
  inviteCode: string;
}

export function InviteCodeInputModal({ isOpen, onClose, inviteCode }: InviteCodeInputModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  return (
    /* 오버레이 — fixed 전체, rgba(0,0,0,0.4), backdrop-blur-[2px] */
    <div className='fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-[2px]'>
      {/* 모달 카드 — max-w-340px, rounded-24px, shadow-lg */}
      <div className='w-full max-w-[340px] rounded-[24px] bg-bg-surface pt-12 px-6 pb-8 shadow-lg'>
        {/* ── 제목 섹션 ─────────────────────────────────────────
            피그마 (6:1059): pb-40px, text-center
            typography/modal-title — 22px Bold, ls -0.55px, lh 150%  */}
        <div className='pb-10 text-center'>
          <h2 className='typography-modal-title text-text-primary'>
            초대 코드 입력
          </h2>
          <h3 className='typography-body-md text-text-subtle'>
            전달받은 초대 코드를 입력해 주세요.
          </h3>
        </div>

        {/* ── 초대 코드 섹션 ────────────────────────────────────
            피그마 (6:1062 Margin): pb-40px
            (6:1063 Container): col, center, gap-8px               */}
        <div className='pb-10 flex flex-col items-center gap-2'>
          <Input placeholder='예: MC-1234-AB' />
        </div>

        {/* ── 버튼 섹션 ─────────────────────────────────────────
            피그마 (6:1072): col, center, gap-12px                  */}
        <div className='flex flex-col gap-3'>
          {/* 카카오 공유 버튼 — SocialLoginButton 재사용
              피그마: bg #FEE500, radius 10px, typography/body-lg-bold
              className으로 rounded-[10px], h-auto py-4 오버라이드     */}
          <Button
            type='button'
            variant='primary'
            fullWidth
            className='h-[60px]'
            onClick={() => onClose()}
          >
            확인
          </Button>
          {/* 취소 — typography/body-sm: 14px Regular */}
          <button
            type='button'
            onClick={handleCancel}
            className='typography-body-sm text-text-subtle text-center py-3 active:opacity-70'
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
