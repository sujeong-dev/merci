import { apiClient } from './instance';

export type UserResponse = {
  id: string;
  provider: string;
  email: string;
  name: string;
  nickname: string;
  created_at: string;
  group: Group;
  relation: string;
}

type Group = {
  id: string;
  name: string;
  invite_code: string;
}

/** 사용자 정보 조회 */
export async function getUserMe(): Promise<UserResponse> {
  const { data } = await apiClient.get('/users/me');
  return data;
}