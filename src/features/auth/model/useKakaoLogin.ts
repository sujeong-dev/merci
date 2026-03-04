'use client';

import { useState } from 'react';
import { getKakaoAuthorizeUrl } from '@/features/auth/api/authApi';

export function useKakaoLogin() {
  const [isPending, setIsPending] = useState(false);

  async function handleKakaoLogin() {
    if (isPending) return;
    setIsPending(true);
    try {
      const url = await getKakaoAuthorizeUrl();
      window.location.href = url;
    } finally {
      setIsPending(false);
    }
  }

  return { handleKakaoLogin, isPending };
}
