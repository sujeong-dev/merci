import { Suspense } from 'react';
import { AuthNaverCallbackPage } from '@/pages/auth-naver-callback/ui/AuthNaverCallbackPage';

export default function Page() {
  return (
    <Suspense>
      <AuthNaverCallbackPage />
    </Suspense>
  );
}
