'use client';

import { Button, Input, PageHeader } from '@/shared/ui';
import { AddPictureIcon, ChevronDownIcon, MicIcon } from '@/shared/ui/icons';

/**
 * 사진 등록 — 새로운 기억 담기
 *
 * Figma: 마씨 › 사진 등록 (node 6:796)
 * 레이아웃: 375×1854, bg: #FAFAFA
 *
 * ## 섹션 라벨 통일 규칙
 * - Input 기반 필드: <Input label="..." /> → 내부적으로 typography-body-sm-bold pl-1 text-text-subtle
 * - 비 Input 필드: <label> 또는 <span> className="typography-body-sm-bold pl-1 text-text-subtle"
 * - 섹션 내부 gap: gap-3 (Input 컴포넌트 label-input 간격 기준)
 *
 * ## 재사용된 공통 컴포넌트
 * - PageHeader — shared/ui
 * - Button (variant="primary" fullWidth) — shared/ui
 * - Input (label prop) — shared/ui (사진 제목·장소·인물)
 * - AddPictureIcon, MicIcon, ChevronDownIcon — shared/ui/icons
 */
export function PhotoUploadPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-base">

      {/* ── Header (6:797) ───────────────────────────────────────*/}
      <PageHeader title="새로운 기억 담기" />

      {/* ── Main (6:802): col, px:20px, pt:24px, gap:40px ────────*/}
      <main className="flex flex-col gap-10 px-5 pt-6 pb-32">

        {/* ── 사진 선택 (6:804) ────────────────────────────────────
            col, gap:3 (Input label 간격 기준)                     */}
        <div className="flex flex-col gap-3">

          <span className="typography-body-sm-bold pl-1 text-text-subtle">
            사진 선택
          </span>

          {/* 사진 영역 (6:807): fill, h:420px, white, rounded-10px */}
          <div className="flex h-[420px] w-full items-center justify-center rounded-[10px] bg-white">

            {/* 빈 상태 (6:811): col, center */}
            <div className="flex flex-col items-center">

              {/* 아이콘 원형 (6:812): 56×56, #F3F4F6, rounded-full */}
              <div className="flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]">
                <AddPictureIcon size={24} className="text-text-tertiary" />
              </div>

              {/* 텍스트 (6:815 → 6:816): pt:16px, gap:4px */}
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

        </div>

        {/* ── 사진 제목 (128:1458) ─────────────────────────────────
            Input label prop → typography-body-sm-bold pl-1 text-text-subtle */}
        <Input
          id="photo-title"
          label="사진 제목"
          placeholder="예: 봄나들이"
        />

        {/* ── 사진 연도 (6:822) ────────────────────────────────────
            col, gap:3 / pill 버튼: white, border #E5E7EB, rounded-full */}
        <div className="flex flex-col gap-3">

          <span className="typography-body-sm-bold pl-1 text-text-subtle">
            사진 연도
          </span>

          <button
            type="button"
            className="flex w-fit items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 py-2"
          >
            <span className="typography-body-lg text-text-primary">2025년</span>
            <ChevronDownIcon className="text-text-primary" />
          </button>

        </div>

        {/* ── 사진 장소 (6:828) ────────────────────────────────────*/}
        <Input
          id="photo-location"
          label="사진 장소"
          placeholder="예: 경복궁 앞"
        />

        {/* ── 함께한 인물 (6:834) ──────────────────────────────────*/}
        <Input
          id="photo-people"
          label="함께한 인물"
          placeholder="예: 큰아들, 며느리"
        />

        {/* ── 사진 이야기 (6:840) ──────────────────────────────────
            col, gap:3
            textarea (6:843): pt:20px pb:104px px:20px, white, shadow, rounded-10px */}
        <div className="flex flex-col gap-3">

          <label
            htmlFor="photo-story"
            className="typography-body-sm-bold pl-1 text-text-subtle"
          >
            사진 이야기
          </label>

          <textarea
            id="photo-story"
            placeholder="누구와 어디에서 찍은 사진인가요? 따뜻한 기억을 글로 남겨주세요."
            className="w-full resize-none rounded-[10px] bg-white px-5 pt-5 pb-[104px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] typography-body-sm text-text-primary outline-none placeholder:text-[#C7C7CC]"
          />

        </div>

        {/* ── 목소리 남기기 (6:846) ────────────────────────────────
            col, gap:3                                              */}
        <div className="flex flex-col gap-3">

          {/* 라벨: "목소리 남기기" + "(선택)" (6:847 Label row) */}
          <div className="flex items-center gap-1 pl-1">
            <span className="typography-body-sm-bold text-text-subtle">
              목소리 남기기
            </span>
            <span className="typography-body-sm text-[#767676]">(선택)</span>
          </div>

          {/* 카드 (6:851): row, center, p:20px, white, shadow, rounded-10px */}
          <div className="flex items-center rounded-[10px] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">

            {/* 마이크 버튼 (120:1092): 56×56, white, border #F3F4F6, rounded-full */}
            <button
              type="button"
              aria-label="녹음 시작"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]"
            >
              <MicIcon size={24} className="text-text-primary" />
            </button>

            {/* 텍스트 (6:855 Margin): pl:20px */}
            <div className="flex flex-col pl-5">
              <span className="typography-body-lg text-text-primary">
                목소리로 들려주세요
              </span>
              <span className="typography-body-sm text-[#767676]">
                버튼을 눌러 녹음을 시작하세요
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* ── 저장하기 버튼 (120:867) ──────────────────────────────
          fixed, max-w-app 중앙 정렬 (create-group 패턴 동일)    */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-app bg-bg-base px-6 pb-11 pt-3">
        <Button type="button" variant="primary" fullWidth className="h-[60px]">
          저장하기
        </Button>
      </div>

    </div>
  );
}
