import { apiClient } from './instance';

export interface MemoryResponse {
  id: string;
  group_id: string;
  title: string;
  image_url: string;
  year: number;
  location: string;
  people: string;
  story: string;
  voice_url: string | null;
  created_by: string;
  created_at: string;
  has_badge: boolean;
}

export interface ListMemoriesParams {
  from_date?: string; // YYYY-MM-DD
  to_date?: string;   // YYYY-MM-DD
  created_by?: string; // user_id (uuid)
}

/** 추억 목록 조회 — 그룹 추억 리스트 (필터 옵션: 기간, 작성자) */
export async function listMemories(params?: ListMemoriesParams): Promise<MemoryResponse[]> {
  const { data } = await apiClient.get<MemoryResponse[]>('/memories', { params });
  return data;
}
