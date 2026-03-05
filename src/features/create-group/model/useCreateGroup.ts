'use client';

import { useState } from 'react';
import { createGroup } from '@/shared/api';

/**
 * 가족 그룹 생성 훅
 *
 * 폼 상태(어르신 성함) + API 호출 + 성공 모달 제어를 캡슐화합니다.
 */
export function useCreateGroup() {
  const [elderName, setElderName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleSubmit() {
    const trimmed = elderName.trim();
    if (!trimmed || isPending) return;

    setError(null);
    setIsPending(true);

    try {
      const code = await createGroup(trimmed);
      setInviteCode(code);
      setIsModalOpen(true);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status === 409
      ) {
        setError('이미 다른 그룹에 소속되어 있습니다.');
      } else {
        setError('그룹 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsPending(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return {
    elderName,
    setElderName,
    isPending,
    error,
    inviteCode,
    isModalOpen,
    handleSubmit,
    closeModal,
  };
}
