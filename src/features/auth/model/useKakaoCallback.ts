'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { kakaoLogin } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/model/authStore';
import { ROUTES } from '@/shared/config/routes';

export function useKakaoCallback(code: string | null) {
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!code || calledRef.current) return;
    calledRef.current = true;

    kakaoLogin(code)
      .then((tokens) => {
        setTokens(tokens.access_token, tokens.refresh_token);
        router.replace(ROUTES.home);
      })
      .catch(() => {
        router.replace(ROUTES.landing);
      });
  }, [code, router]);
}
