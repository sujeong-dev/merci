import axios from 'axios';
import { apiClient } from './instance';

export interface MemoryImageResponse {
  id: string;
  image_url: string;
  sort_order: number;
}

export interface MemoryResponse {
  id: string;
  group_id: string;
  title: string;
  images: MemoryImageResponse[];
  year: number;
  location: string;
  people: string;
  story: string;
  voice_url: string | null;
  created_by: string;
  created_at: string;
  has_badge: boolean;
  has_quiz: boolean;
  quiz_score: number | null;
  category: string;
}

export interface ListMemoriesParams {
  from_date?: string; // YYYY-MM-DD
  to_date?: string;   // YYYY-MM-DD
  created_by?: string; // user_id (uuid)
  category?: string;
}

export interface CategoryResponse {
  value: string;
  label: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  object_key: string;
}

export interface MemoryCreateRequest {
  title: string;
  image_keys: string[];
  year: number;
  location: string;
  people: string;
  story: string;
  voice_key?: string;
  category?: string;
}

export interface MemoryUpdateRequest {
  title?: string;
  add_image_keys?: string[];
  remove_image_ids?: string[];
  year?: number;
  location?: string;
  people?: string;
  story?: string;
  voice_key?: string | null;
  category?: string;
}

/** 추억 목록 조회 — 그룹 추억 리스트 (필터 옵션: 기간, 작성자, 카테고리) */
export async function listMemories(params?: ListMemoriesParams): Promise<MemoryResponse[]> {
  const { data } = await apiClient.get<MemoryResponse[]>('/memories', { params });
  return data;
}

/** 추억 상세 조회 */
export async function getMemory(memoryId: string): Promise<MemoryResponse> {
  const { data } = await apiClient.get<MemoryResponse>(`/memories/${memoryId}`);
  return data;
}

/** 파일 업로드용 Presigned URL 발급 */
export async function getPresignedUrl(
  fileType: 'image' | 'voice',
  contentType: string,
): Promise<PresignedUrlResponse> {
  const { data } = await apiClient.post<PresignedUrlResponse>('/uploads/presigned-url', {
    file_type: fileType,
    content_type: contentType,
  });
  return data;
}

/**
 * Presigned URL로 파일 직접 업로드 (PUT)
 * Authorization 헤더를 포함하면 R2가 SignatureDoesNotMatch 오류를 반환하므로
 * apiClient를 사용하지 않고 별도 axios 인스턴스를 사용합니다.
 */
export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: Blob,
  contentType: string,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { 'Content-Type': contentType },
  });
}

/** 추억 등록 */
export async function createMemory(params: MemoryCreateRequest): Promise<MemoryResponse> {
  const { data } = await apiClient.post<MemoryResponse>('/memories', params);
  return data;
}

/** 추억 수정 (PATCH) */
export async function updateMemory(
  memoryId: string,
  params: MemoryUpdateRequest,
): Promise<MemoryResponse> {
  const { data } = await apiClient.patch<MemoryResponse>(`/memories/${memoryId}`, params);
  return data;
}

/** 추억 삭제 (DELETE 204) */
export async function deleteMemory(memoryId: string): Promise<void> {
  await apiClient.delete(`/memories/${memoryId}`);
}

export interface MemoryCategoryListResponse {
  categories: CategoryResponse[];
}

/** 카테고리 목록 조회 */
export async function listCategories(): Promise<CategoryResponse[]> {
  const { data } = await apiClient.get<MemoryCategoryListResponse>('/memories/categories');
  return data.categories;
}
