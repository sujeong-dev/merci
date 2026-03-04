'use client';

import { useEffect, useState } from 'react';
import { checkHealth } from '@/shared/api';

export function useServerWake() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function wake() {
      try {
        await checkHealth();
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    // 최초 마운트 시 서버 깨우기
    wake();

    // 탭이 포그라운드로 복귀할 때마다 재호출
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        wake();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isReady };
}
