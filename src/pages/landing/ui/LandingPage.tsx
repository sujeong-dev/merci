import Image from 'next/image';

import { SocialLoginButton } from '@/shared/ui';

/**
 * 랜딩페이지
 *
 * Figma: 마씨 › 랜딩페이지 (node 6:1017)
 * - 배경: bg-bg-base (#FAFAFA)
 * - 히어로: 캐릭터 이미지 + 앱 이름 + 부제목
 * - 소셜 로그인: 네이버 / 카카오
 */
export function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg-base px-5 py-10">
      {/* 콘텐츠 영역 — 피그마 기준 327px 너비, 60px 간격 */}
      <div className="flex w-full max-w-[327px] flex-col items-center gap-[60px]">

        {/* ── 히어로 섹션 ─────────────────────────────────── */}
        {/* 피그마: Container(EMQXDL) — column, space-between, h-327 */}
        <div className="flex h-[327px] w-full flex-col items-center justify-between">

          {/* 캐릭터 이미지 — 피그마: 176×196, 행 가운데 정렬 */}
          <div className="flex flex-1 items-center justify-center">
            <div className="relative h-[196px] w-[176px]">
              <Image
                src="/images/merci-character.png"
                alt="마씨 캐릭터"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* 앱 이름 + 부제목 — 피그마: column, gap-[11px] */}
          <div className="flex flex-col items-center gap-[11px]">
            {/* 피그마: typography/h2-logo — 24px Black, ls -1.44, lh 150% */}
            <h1 className="typography-h2-logo text-center text-text-primary">
              마씨 (Merci)
            </h1>
            {/* 피그마: typography/body-lg — 16px Medium, lh 160%, #767676 */}
            <p className="typography-body-lg text-center text-text-subtle">
              가족의 소중한 기억을 잇는
              <br />
              따뜻한 앨범 서비스
            </p>
          </div>
        </div>

        {/* ── 소셜 로그인 버튼 ────────────────────────────── */}
        {/* 피그마: Container(QW6FF2) — column, stretch, gap-3 */}
        <div className="flex w-full flex-col gap-3">
          <SocialLoginButton variant="naver">네이버로 시작하기</SocialLoginButton>
          <SocialLoginButton variant="kakao">카카오로 시작하기</SocialLoginButton>
        </div>

      </div>
    </main>
  );
}
