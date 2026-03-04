'use client';

import { useSearchParams } from 'next/navigation';
import { useNaverCallback } from '@/features/auth';

export function AuthNaverCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams?.get('code') ?? null;
  const state = searchParams?.get('state') ?? null;

  useNaverCallback(code, state);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-base">
      <p className="typography-body-md text-text-subtle">로그인 중...</p>
    </main>
  );
}
