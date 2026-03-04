'use client';

import { useState } from 'react';
import { getNaverAuthorizeInfo } from '@/features/auth/api/authApi';

const NAVER_STATE_KEY = 'naver_oauth_state';

export function useNaverLogin() {
  const [isPending, setIsPending] = useState(false);

  async function handleNaverLogin() {
    if (isPending) return;
    setIsPending(true);
    try {
      const { url, state } = await getNaverAuthorizeInfo();
      // CSRF 검증을 위해 state를 콜백까지 sessionStorage에 보관
      sessionStorage.setItem(NAVER_STATE_KEY, state);
      window.location.href = url;
    } finally {
      setIsPending(false);
    }
  }

  return { handleNaverLogin, isPending };
}
