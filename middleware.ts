import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'auth-session';

// 비로그인 전용 (로그인 상태면 홈으로)
const PUBLIC_ONLY_PATHS = ['/'];

// 로그인 필수 경로
const AUTH_REQUIRED_PATHS = [
  '/home',
  '/create-group',
  '/photo-list',
  '/photo-upload',
  '/photo-detail',
  '/settings',
];

// OAuth 콜백 — code 파라미터 없이 직접 접근 불가
const OAUTH_CALLBACK_PATHS = ['/auth/kakao/callback', '/auth/naver/callback'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isLoggedIn = !!request.cookies.get(SESSION_COOKIE)?.value;

  // ── OAuth 콜백 ────────────────────────────────────────────
  // code 파라미터가 없으면 주소창 직접 입력으로 간주 → 랜딩으로
  if (OAUTH_CALLBACK_PATHS.includes(pathname)) {
    if (!searchParams.has('code')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // ── 비로그인 전용 페이지 (랜딩) ──────────────────────────
  if (PUBLIC_ONLY_PATHS.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  // ── 로그인 필수 페이지 ────────────────────────────────────
  if (AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // _next 정적 파일, 이미지, favicon, public 이미지 폴더 제외
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
