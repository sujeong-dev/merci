import { apiClient } from './instance';

/** 가족 그룹 생성 — 어르신 성함으로 그룹 생성 후 초대 코드 반환 */
export async function createGroup(name: string): Promise<string> {
  const { data } = await apiClient.post<{ invite_code: string }>('/groups', { name });
  return data.invite_code;
}

/** 초대 코드로 가족 그룹 참여 */
export async function joinGroup(inviteCode: string): Promise<void> {
  await apiClient.post('/groups/join', { invite_code: inviteCode });
}
