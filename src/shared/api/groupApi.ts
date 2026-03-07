import { apiClient } from './instance';

export interface GroupMemberResponse {
  user_id: string;
  name: string;
  role: 'OWNER' | 'MEMBER';
  relation: string | null;
  joined_at: string;
}

export interface GroupResponse {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  members: GroupMemberResponse[];
}

/** 가족 그룹 생성 — 어르신 성함으로 그룹 생성 후 초대 코드 반환 */
export async function createGroup(name: string): Promise<string> {
  const { data } = await apiClient.post<{ invite_code: string }>('/groups', { name });
  return data.invite_code;
}

/** 초대 코드로 가족 그룹 참여 */
export async function joinGroup(inviteCode: string): Promise<void> {
  await apiClient.post('/groups/join', { invite_code: inviteCode });
}

/** 내 그룹 조회 — 그룹명 + 멤버 목록 반환 */
export async function getMyGroup(): Promise<GroupResponse> {
  const { data } = await apiClient.get<GroupResponse>('/groups/me');
  return data;
}

/** 어르신과의 관계 수정 */
export async function updateRelation(relation: string): Promise<void> {
  await apiClient.patch('/groups/me/relation', { relation });
}

/** 가족 초대 코드 조회 */
export async function getInviteCode(): Promise<string> {
  const { data } = await apiClient.get<{ invite_code: string }>('/groups/me/invite-code');
  return data.invite_code;
}
