import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SESSION_COOKIE = 'auth-session';

function setSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) => {
        setSessionCookie();
        set({ accessToken, refreshToken });
      },
      clearTokens: () => {
        clearSessionCookie();
        set({ accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'auth-storage',
      // 페이지 새로고침 시 localStorage 재수화 후 쿠키 동기화
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setSessionCookie();
        } else {
          clearSessionCookie();
        }
      },
    },
  ),
);
