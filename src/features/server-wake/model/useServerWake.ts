'use client';

import { useEffect, useState } from 'react';
import { checkHealth } from '@/shared/api';
import { useServerWakeStore } from './serverWakeStore';

export function useServerWake() {
  const [isReady, setIsReady] = useState(false);
  const { shouldThrottle, markChecked } = useServerWakeStore();

  useEffect(() => {
    let cancelled = false;

    async function wake() {
      // 마지막 체크로부터 5분 미경과 시 API 호출 스킵
      if (shouldThrottle()) {
        if (!cancelled) setIsReady(true);
        return;
      }

      try {
        await checkHealth();
        if (!cancelled) markChecked();
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    // 최초 마운트 시 서버 깨우기
    wake();

    // 탭이 포그라운드로 복귀할 때마다 재호출 (5분 쓰로틀 적용)
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
  }, [shouldThrottle, markChecked]);

  return { isReady };
}
