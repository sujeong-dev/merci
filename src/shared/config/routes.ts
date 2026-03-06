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

  /** 사진 등록 — 새로운 기억 담기 */
  photoUpload: '/photo-upload',

  /** 사진 상세 — 기억의 기록 (동적: /photo-detail/{id}) */
  photoDetail: (id: string) => `/photo-detail/${id}`,

  /** 사진 수정 — 기억 수정하기 (동적: /photo-detail/{id}/edit) */
  photoEdit: (id: string) => `/photo-detail/${id}/edit`,

  /** 설정 — 어르신 관계 및 가족 초대 코드 */
  settings: '/settings',

  /** 카카오 로그인 OAuth 콜백 */
  authKakaoCallback: '/auth/kakao/callback',

  /** 네이버 로그인 OAuth 콜백 */
  authNaverCallback: '/auth/naver/callback',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
