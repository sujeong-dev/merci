'use client';

import { useSearchParams } from 'next/navigation';
import { useKakaoCallback } from '@/features/auth';

export function AuthKakaoCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams?.get('code') ?? null;

  useKakaoCallback(code);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-base">
      <p className="typography-body-md text-text-subtle">로그인 중...</p>
    </main>
  );
}
