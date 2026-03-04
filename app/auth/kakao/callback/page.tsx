import { Suspense } from 'react';
import { AuthKakaoCallbackPage } from '@/pages/auth-kakao-callback/ui/AuthKakaoCallbackPage';

export default function Page() {
  return (
    <Suspense>
      <AuthKakaoCallbackPage />
    </Suspense>
  );
}
