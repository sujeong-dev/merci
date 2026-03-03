/**
 * 앱 라우트 상수
 *
 * 모든 페이지 경로는 이 파일에서 관리합니다.
 * 경로 변경 시 이 파일만 수정하면 앱 전체에 반영됩니다.
 *
 * @example
 * import { ROUTES } from '@/shared/config/routes';
 * <Link href={ROUTES.home}>홈으로</Link>
 * router.push(ROUTES.createGroup);
 */
export const ROUTES = {
  /** 랜딩 페이지 (로그인/시작) */
  landing: '/',

  /** 홈 — 그룹 진입 선택 */
  home: '/home',

  /** 가족 그룹 만들기 — 어르신 성함 입력 */
  createGroup: '/create-group',

  /** 사진 목록 — 그룹 앨범 사진 리스트 */
  photoList: '/photo-list',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
