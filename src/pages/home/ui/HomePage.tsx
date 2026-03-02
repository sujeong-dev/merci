import Image from 'next/image';

/**
 * 홈 페이지 — 그룹 진입 선택
 *
 * Figma: 마씨 › 홈 (node 6:865)
 * - 상단: 인사 타이틀 + 부제목
 * - 카드 버튼 2개: 가족 그룹 만들기 / 초대 코드 입력
 * - 하단: 서비스 소개 캡션
 */
export function HomePage() {
  return (
    <main className="min-h-dvh bg-bg-base">
      {/* 피그마 Main (0BR55I): pt-16(64px) + px-5(20px) */}
      <div className="px-5 pt-16">

        {/* ── 헤더 섹션 ───────────────────────────────────
            피그마 Margin(XLLY6R): pb-12(48px)
            Container(DJF7OO): column, gap-[15px]          */}
        <div className="flex flex-col gap-[15px] pb-12">
          {/* 피그마: typography/h1 — 26px Bold, lh 160%, ls -0.52px */}
          <h1 className="typography-h1 text-text-primary">
            반갑습니다!
            <br />
            어떻게 시작할까요?
          </h1>
          {/* 피그마: typography/body-lg — 16px Medium, #4B5563 */}
          <p className="typography-body-lg text-text-body">
            가족과 함께 소중한 기억을 모으는 공간,
            <br />
            따뜻한 대화를 시작해보세요.
          </p>
        </div>

        {/* ── 카드 버튼 + 캡션 ────────────────────────────
            피그마 Container(FTAKVO): column, stretch, gap-4(16px) */}
        <div className="flex flex-col gap-4">

          {/* 카드 1: 가족 그룹 만들기
              피그마 Button(2PIFDJ): row, gap-4, p-6, rounded-2xl,
              bg-white, border #F3F4F6, shadow-sm              */}
          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-6 text-left shadow-sm transition-opacity active:opacity-75"
          >
            {/* 아이콘 52×52 (배경 + 아이콘 포함 SVG) */}
            <Image
              src="/images/home-icon-group.svg"
              alt=""
              width={52}
              height={52}
              className="shrink-0"
            />

            {/* 텍스트 — fill remaining space */}
            <div className="flex flex-1 flex-col">
              {/* 피그마 style_OPM5OG ≈ typography-h3: 20px Bold, lh 140%, ls -0.5px */}
              <span className="typography-h3 text-text-primary">가족 그룹 만들기</span>
              {/* 피그마 typography/body-sm: 14px Regular, lh 150%, #4B5563 */}
              <span className="typography-body-sm text-text-body">새로운 앨범 시작하기</span>
            </div>

            {/* 피그마 우측 chevron 8×12, #D1D5DB */}
            <Image
              src="/images/home-card-group.svg"
              alt=""
              width={8}
              height={12}
              className="shrink-0"
            />
          </button>

          {/* 카드 2: 초대 코드 입력 */}
          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-6 text-left shadow-sm transition-opacity active:opacity-75"
          >
            {/* 아이콘 52×52 (파란 배경 + 인물 아이콘 SVG) */}
            <Image
              src="/images/home-icon-invite.svg"
              alt=""
              width={52}
              height={52}
              className="shrink-0"
            />

            <div className="flex flex-1 flex-col">
              {/* 피그마 style_ZT2QPG ≈ typography-h3: 20px Bold */}
              <span className="typography-h3 text-text-primary">초대 코드 입력</span>
              {/* 피그마 style_UBKVBY ≈ typography-body-sm: 14px Regular */}
              <span className="typography-body-sm text-text-body">기존 그룹에 참여하기</span>
            </div>

            <Image
              src="/images/home-card-group.svg"
              alt=""
              width={8}
              height={12}
              className="shrink-0"
            />
          </button>

          {/* 서비스 소개 캡션
              피그마 Container(UO7R3S): column, center, stretch, opacity-80 */}
          <div className="flex flex-col items-center opacity-80">
            {/* 피그마: typography/caption — 12px Regular, lh 140%, #9CA3AF, center */}
            <p className="typography-caption text-center text-text-tertiary">
              마씨(Merci)는 치매 환자와 가족이 사진과 목소리를 통해
              <br />
              더 가까워질 수 있도록 돕습니다.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
