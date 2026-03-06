import { apiClient } from './instance';

export type ReactionType = '기억하심' | '가물가물' | '낯설어하심';

export interface RecallResponse {
  id: string;
  memory_id: string;
  result: ReactionType;
  recorded_by: string;
  visited_at: string;
}

/** 추억 반응 목록 조회 */
export async function getRecalls(memoryId: string): Promise<RecallResponse[]> {
  const { data } = await apiClient.get<RecallResponse[]>(`/memories/${memoryId}/recalls`);
  return data;
}

/** 추억 반응 기록 */
export async function createRecall(
  memoryId: string,
  result: ReactionType,
): Promise<RecallResponse> {
  const { data } = await apiClient.post<RecallResponse>(`/memories/${memoryId}/recalls`, {
    result,
    visited_at: new Date().toISOString(),
  });
  return data;
}
