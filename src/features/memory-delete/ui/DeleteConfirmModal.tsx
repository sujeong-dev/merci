'use client';

import { useState, useCallback } from 'react';
import { ModalSheet, Button } from '@/shared/ui';
import { deleteMemory } from '@/shared/api';
import type { MemoryResponse } from '@/shared/api';

type DeleteStep = 'confirm' | 'loading' | 'success' | 'error';

interface DeleteConfirmModalProps {
  memory: MemoryResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteConfirmModal({ memory, isOpen, onClose, onSuccess }: DeleteConfirmModalProps) {
  const [step, setStep] = useState<DeleteStep>('confirm');

  const handleDelete = useCallback(async () => {
    setStep('loading');
    try {
      await deleteMemory(memory.id);
      setStep('success');
    } catch {
      setStep('error');
    }
  }, [memory.id]);

  const handleSuccessClose = useCallback(() => {
    onSuccess();
    onClose();
  }, [onSuccess, onClose]);

  const handleClose = useCallback(() => {
    setStep('confirm'); // 다음 열림을 위해 초기화
    onClose();
  }, [onClose]);

  return (
    <ModalSheet isOpen={isOpen}>
      {/* 확인 단계 */}
      {(step === 'confirm' || step === 'loading') && (
        <>
          <div className="pb-8 text-center">
            <h2 className="typography-modal-title text-text-primary">
              정말 삭제하시겠어요?
            </h2>
            <p className="typography-body-sm text-text-tertiary mt-3">
              삭제 후에는 복구할 수 없습니다.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="primary"
              fullWidth
              disabled={step === 'loading'}
              onClick={handleDelete}
              className="h-[52px] !bg-red-500 hover:!bg-red-600"
            >
              {step === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  삭제 중...
                </span>
              ) : '삭제하기'}
            </Button>
            <button
              type="button"
              onClick={handleClose}
              disabled={step === 'loading'}
              className="typography-body-sm text-text-subtle text-center py-3 active:opacity-70"
            >
              취소
            </button>
          </div>
        </>
      )}

      {/* 성공 단계 */}
      {step === 'success' && (
        <>
          <div className="pb-8 text-center">
            <h2 className="typography-modal-title text-text-primary">
              삭제되었습니다
            </h2>
            <p className="typography-body-sm text-text-tertiary mt-3">
              추억이 목록에서 삭제되었습니다.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleSuccessClose}
            className="h-[52px]"
          >
            목록으로
          </Button>
        </>
      )}

      {/* 실패 단계 */}
      {step === 'error' && (
        <>
          <div className="pb-8 text-center">
            <h2 className="typography-modal-title text-text-primary">
              삭제 실패
            </h2>
            <p className="typography-body-sm text-text-tertiary mt-3">
              삭제에 실패했습니다.<br />다시 시도해 주세요.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => setStep('confirm')}
              className="h-[52px] !bg-red-500"
            >
              다시 시도
            </Button>
            <button
              type="button"
              onClick={handleClose}
              className="typography-body-sm text-text-subtle text-center py-3"
            >
              닫기
            </button>
          </div>
        </>
      )}
    </ModalSheet>
  );
}
