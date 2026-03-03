'use client';

import { Button, Input, PageHeader } from '@/shared/ui';
import { AddPictureIcon, ChevronDownIcon, MicIcon } from '@/shared/ui/icons';

/**
 * 사진 등록 — 새로운 기억 담기
 *
 * Figma: 마씨 › 사진 등록 (node 6:796)
 * 레이아웃: 375×1854, bg: #FAFAFA
 *
 * ## 구조
 * 1. PageHeader (6:797): "새로운 기억 담기", sticky, h:56, y:44
 *    - bg rgba(250,250,250,0.95), backdrop-blur(12px)
 *    - 좌측: 뒤로가기 버튼 (ChevronLeft)
 *
 * 2. Main (6:802): col, px:20px, pt:24px, gap:40px
 *    2-1. 사진 선택 (6:804): col, gap:16px
 *         - 흰 박스 h:420px, rounded-10px
 *         - 빈 상태: 56×56 원형(#F3F4F6) + AddPictureIcon
 *           + "사진을 추가해주세요" (body-lg) + "소중한 순간의 한 장면" (body-sm)
 *    2-2. 사진 제목 (128:1458): col, gap:16px → Input (shadow, rounded-10px)
 *    2-3. 사진 연도 (6:822): col, gap:16px → pill 버튼 (white, border #E5E7EB, rounded-full)
 *    2-4. 사진 장소 (6:828): col, gap:16px → Input
 *    2-5. 함께한 인물 (6:834): col, gap:16px → Input
 *    2-6. 사진 이야기 (6:840): col, gap:16px → Textarea
 *         padding: pt:20px, pb:104px (Figma: 19.375px top / 104.5px bottom)
 *    2-7. 목소리 남기기 (6:846): col, gap:16px (선택)
 *         - 카드: row, p:20px, bg-white, shadow, rounded-10px
 *         - 마이크 버튼: 56×56, white, border #F3F4F6, rounded-full, shadow
 *         - 텍스트: "목소리로 들려주세요" (body-lg) + "버튼을 눌러 녹음을 시작하세요" (body-sm, #767676)
 *
 * 3. 저장하기 버튼 (120:867): w:full, bg:#333333, rounded-10px, py:16px
 *
 * ## 재사용된 공통 컴포넌트
 * - PageHeader — shared/ui (sticky 헤더, ChevronLeft 뒤로가기)
 * - Button (variant="primary" fullWidth) — shared/ui
 * - Input — shared/ui (사진 제목·장소·인물)
 * - AddPictureIcon, MicIcon, ChevronDownIcon — shared/ui/icons
 * - typography-h3, typography-body-lg/sm — globals.css
 */
export function PhotoUploadPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-base">

      {/* ── Header ────────────────────────────────────────────────
          피그마 (6:797): row, h:56, y:44, px:20, blur bg
          PageHeader: sticky top-0, h-14, bg rgba(250,250,250,0.95), backdrop-blur */}
      <PageHeader title="새로운 기억 담기" />

      {/* ── Main ──────────────────────────────────────────────────
          피그마 (6:802): col, px:20px, pt:24px, gap:40px         */}
      <main className="flex flex-col gap-10 px-5 pt-6 pb-10">

        {/* ── 사진 선택 (6:804) ────────────────────────────────────
            col, gap:16px, height:464.75px (label + 420px box)    */}
        <section className="flex flex-col gap-4">

          {/* 섹션 라벨 (6:805 Heading 2): typography/h3, px:4px */}
          <h2 className="typography-h3 text-text-primary px-1">사진 선택</h2>

          {/* 사진 영역 (6:807 Background): fill, h:420px, white, rounded-10px
              빈 상태 컨텐츠: x:103.81, y:149.25 → flex center   */}
          <div className="flex h-[420px] w-full items-center justify-center rounded-[10px] bg-white">

            {/* 빈 상태 (6:811 Container): col, center */}
            <div className="flex flex-col items-center">

              {/* 아이콘 원형 (6:812 Background): 56×56, #F3F4F6, rounded-full */}
              <div className="flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]">
                <AddPictureIcon size={24} className="text-text-tertiary" />
              </div>

              {/* 텍스트 (6:815 Margin → 6:816 Container): pt:16px, gap:4px */}
              <div className="pt-4 flex flex-col items-center gap-1">
                <p className="typography-body-lg text-text-primary">
                  사진을 추가해주세요
                </p>
                <p className="typography-body-sm text-text-tertiary">
                  소중한 순간의 한 장면
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ── 사진 제목 (128:1458) ──────────────────────────────────
            col, gap:16px → Input (padding:24px 20px, shadow, rounded-10px) */}
        <section className="flex flex-col gap-4">
          <h2 className="typography-h3 text-text-primary px-1">사진 제목</h2>
          <Input placeholder="예: 봄나들이" />
        </section>

        {/* ── 사진 연도 (6:822) ────────────────────────────────────
            col, gap:16px, h:96px
            pill 버튼 (120:703): row center, gap:6px, py:8px px:16px,
            white, border #E5E7EB, rounded-full                    */}
        <section className="flex flex-col gap-4">
          <h2 className="typography-h3 text-text-primary px-1">사진 연도</h2>
          <button
            type="button"
            className="flex w-fit items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 py-2"
          >
            <span className="typography-body-lg text-text-primary">2025년</span>
            <ChevronDownIcon className="text-text-primary" />
          </button>
        </section>

        {/* ── 사진 장소 (6:828) ────────────────────────────────────*/}
        <section className="flex flex-col gap-4">
          <h2 className="typography-h3 text-text-primary px-1">사진 장소</h2>
          <Input placeholder="예: 경복궁 앞" />
        </section>

        {/* ── 함께한 인물 (6:834) ──────────────────────────────────*/}
        <section className="flex flex-col gap-4">
          <h2 className="typography-h3 text-text-primary px-1">함께한 인물</h2>
          <Input placeholder="예: 큰아들, 며느리" />
        </section>

        {/* ── 사진 이야기 (6:840) ──────────────────────────────────
            col, gap:16px
            Textarea (6:843): padding top:19px, horizontal:20px, bottom:104px
            shadow: 0px 2px 8px 0px rgba(0,0,0,0.04), rounded-10px */}
        <section className="flex flex-col gap-4">
          <h2 className="typography-h3 text-text-primary px-1">사진 이야기</h2>
          <textarea
            placeholder="누구와 어디에서 찍은 사진인가요? 따뜻한 기억을 글로 남겨주세요."
            className="w-full resize-none rounded-[10px] bg-white px-5 pt-5 pb-[104px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] typography-body-sm text-text-primary outline-none placeholder:text-[#C7C7CC]"
          />
        </section>

        {/* ── 목소리 남기기 (6:846) ────────────────────────────────
            col, gap:16px
            라벨 (layout_XPVNZB): row, center, gap:4px, px:4px    */}
        <section className="flex flex-col gap-4">

          {/* 라벨: "목소리 남기기" + "(선택)" */}
          <div className="flex items-center gap-1 px-1">
            <h2 className="typography-h3 text-text-primary">목소리 남기기</h2>
            <span className="typography-body-sm text-[#767676]">(선택)</span>
          </div>

          {/* 카드 (6:851 Background+Shadow): row, center, p:20px,
              white, shadow:0px 1px 2px 0px rgba(0,0,0,0.05), rounded-10px */}
          <div className="flex items-center rounded-[10px] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">

            {/* 마이크 버튼 (120:1092): 56×56, white,
                border #F3F4F6, rounded-full, shadow:0px 2px 8px rgba(0,0,0,0.06) */}
            <button
              type="button"
              aria-label="녹음 시작"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]"
            >
              <MicIcon size={24} className="text-text-primary" />
            </button>

            {/* 텍스트 섹션 (6:855 Margin): pl:20px */}
            <div className="flex flex-col pl-5">
              <span className="typography-body-lg text-text-primary">
                목소리로 들려주세요
              </span>
              <span className="typography-body-sm text-[#767676]">
                버튼을 눌러 녹음을 시작하세요
              </span>
            </div>

          </div>
        </section>

        {/* ── 저장하기 버튼 (120:867) ──────────────────────────────
            피그마: w:335, x:20, y:1734, bg:#333333, rounded-10px, py:16px
            Button primary: bg-primary-soft(#333333), w-full             */}
        <Button type="button" variant="primary" fullWidth>
          저장하기
        </Button>

      </main>

    </div>
  );
}
