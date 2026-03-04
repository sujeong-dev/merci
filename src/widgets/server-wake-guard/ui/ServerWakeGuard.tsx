'use client';

import { Spinner } from '@/shared/ui';
import { useServerWake } from '@/features/server-wake/model/useServerWake';

interface ServerWakeGuardProps {
  children: React.ReactNode;
}

export function ServerWakeGuard({ children }: ServerWakeGuardProps) {
  const { isReady } = useServerWake();

  if (!isReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={40} className="text-text-subtle" />
          <p className="typography-body-sm text-text-subtle">서버를 깨우는 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
