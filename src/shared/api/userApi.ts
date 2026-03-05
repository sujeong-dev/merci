import { apiClient } from './instance';

type User = {
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
export async function getUserMe(): Promise<User> {
  const { data } = await apiClient.get('/users/me');
  return data;
}