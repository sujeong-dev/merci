'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { naverLogin } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/model/authStore';
import { ROUTES } from '@/shared/config/routes';

const NAVER_STATE_KEY = 'naver_oauth_state';

export function useNaverCallback(code: string | null, state: string | null) {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!code || !state || calledRef.current) return;
    calledRef.current = true;

    const savedState = sessionStorage.getItem(NAVER_STATE_KEY);

    // state 불일치 시 CSRF 공격으로 간주하고 랜딩으로 복귀
    if (savedState !== state) {
      router.replace(ROUTES.landing);
      return;
    }

    sessionStorage.removeItem(NAVER_STATE_KEY);

    naverLogin(code, state)
      .then((tokens) => {
        setTokens(tokens.access_token, tokens.refresh_token);
        router.replace(ROUTES.home);
      })
      .catch(() => {
        router.replace(ROUTES.landing);
      });
  }, [code, state, router, setTokens]);
}
