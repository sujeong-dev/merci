import { apiClient } from './instance';

export interface CommentResponse {
  id: string;
  memory_id: string;
  content: string;
  author_name: string;
  created_at: string;
}

/** 댓글 목록 조회 */
export async function getComments(memoryId: string): Promise<CommentResponse[]> {
  const { data } = await apiClient.get<CommentResponse[]>(`/memories/${memoryId}/comments`);
  return data;
}

/** 댓글 작성 */
export async function createComment(
  memoryId: string,
  content: string,
): Promise<CommentResponse> {
  const { data } = await apiClient.post<CommentResponse>(`/memories/${memoryId}/comments`, {
    content,
  });
  return data;
}
