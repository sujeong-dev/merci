import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/model/authStore';
import { ROUTES } from '@/shared/config/routes';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request 인터셉터 ──────────────────────────────────────────
// store에서 access_token을 읽어 Authorization 헤더로 자동 첨부
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Response 인터셉터 ─────────────────────────────────────────
// 401 응답 시 refresh_token으로 토큰 갱신 후 원래 요청 재시도
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processPendingQueue(error: AxiosError | null, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalConfig._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // 토큰 갱신 중이면 큐에 쌓아두고 갱신 완료 후 일괄 처리
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalConfig);
      });
    }

    originalConfig._retry = true;
    isRefreshing = true;

    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (!refreshToken) {
      clearTokens();
      window.location.href = ROUTES.landing;
      return Promise.reject(error);
    }

    try {
      // 인터셉터 루프 방지를 위해 순수 axios로 refresh 요청
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });

      setTokens(data.access_token, data.refresh_token);
      apiClient.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;

      processPendingQueue(null, data.access_token);

      originalConfig.headers.Authorization = `Bearer ${data.access_token}`;
      return apiClient(originalConfig);
    } catch (refreshError) {
      processPendingQueue(refreshError as AxiosError, null);
      clearTokens();
      window.location.href = ROUTES.landing;
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
