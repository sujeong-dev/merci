import { apiClient } from '@/shared/api';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

/** 카카오 OAuth 인가 URL 조회 */
export async function getKakaoAuthorizeUrl(): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>('/auth/kakao/authorize');
  return data.url;
}

/** 카카오 인가 코드로 로그인 (토큰 발급) */
export async function kakaoLogin(code: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/kakao/login', { code });
  return data;
}

/** 네이버 OAuth 인가 URL + state 조회 */
export async function getNaverAuthorizeInfo(): Promise<{ url: string; state: string }> {
  const { data } = await apiClient.get<{ url: string; state: string }>('/auth/naver/authorize');
  return data;
}

/** 네이버 인가 코드 + state로 로그인 (토큰 발급) */
export async function naverLogin(code: string, state: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/naver/login', { code, state });
  return data;
}

/** Refresh Token으로 Access Token 재발급 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return data;
}

/** 로그아웃 (서버 측 Refresh Token 무효화) */
export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refresh_token: refreshToken });
}
