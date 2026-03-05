import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 5분 (ms) */
const THROTTLE_MS = 5 * 60 * 1000;

interface ServerWakeState {
  lastCheckedAt: number;
  /** 마지막 체크로부터 5분 미경과 시 true */
  shouldThrottle: () => boolean;
  /** 체크 완료 시 타임스탬프 갱신 */
  markChecked: () => void;
}

export const useServerWakeStore = create<ServerWakeState>()(
  persist(
    (set, get) => ({
      lastCheckedAt: 0,
      shouldThrottle: () => {
        const elapsed = Date.now() - get().lastCheckedAt;
        return elapsed < THROTTLE_MS;
      },
      markChecked: () => set({ lastCheckedAt: Date.now() }),
    }),
    { name: 'server-wake-storage' },
  ),
);
