import { apiClient } from './instance';

/** 서버 상태 확인 — 무료 배포 환경에서 서버를 깨우는 용도로 사용 */
export async function checkHealth(): Promise<void> {
  await apiClient.get('/health');
}
