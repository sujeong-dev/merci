import { AddPictureIcon } from '@/shared/ui/icons';

/**
 * 사진 목록 — 목록 없음 (빈 상태)
 *
 * Figma: 마씨 › 사진 목록_목록 없음 (node 114:511)
 * - 배경: bg-bg-base (#FAFAFA), full-screen
 * - 컨텐츠: 화면 중앙 정렬
 *
 * ## 컨텐츠 구조 (114:594 Container)
 * - 아이콘 영역: 56×56 원형 배경 (#F3F4F6), AddPictureIcon 24px
 * - pt-4 (16px) 간격
 * - 텍스트 영역: col, gap-1 (4px)
 *   - "앨범이 비었어요"       → typography/body-lg, text-text-primary
 *   - "소중한 순간을 떠올려보세요" → typography/body-sm, text-text-tertiary
 *
 * ## 재사용된 공통 컴포넌트
 * - AddPictureIcon — shared/ui/icons (기존 아이콘 재사용)
 * - typography-body-lg, typography-body-sm — globals.css
 * - text-text-primary (#111827), text-text-tertiary (#9CA3AF) — 디자인 토큰
 */
export function PhotoListPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg-base">

      {/* ── 빈 상태 컨텐츠 ─────────────────────────────────────
          피그마 (114:594 Container): col, center, hug×hug        */}
      <div className="flex flex-col items-center">

        {/* 아이콘 원형 배경
            피그마 (114:595 Background): 56×56, #F3F4F6, border-radius: 9999px
            size-14 = 56px, rounded-full = 9999px                 */}
        <div className="flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]">
          <AddPictureIcon size={24} className="text-text-tertiary" />
        </div>

        {/* 텍스트 섹션
            피그마 (114:598 Margin): pt-16px
            피그마 (114:599 Container): col, gap-4px              */}
        <div className="pt-4 flex flex-col items-center gap-1">

          {/* 앨범이 비었어요 — typography/body-lg, #111827 */}
          <p className="typography-body-lg text-text-primary">
            앨범이 비었어요
          </p>

          {/* 소중한 순간을 떠올려보세요 — typography/body-sm, #9CA3AF */}
          <p className="typography-body-sm text-text-tertiary">
            소중한 순간을 떠올려보세요
          </p>

        </div>

      </div>

    </div>
  );
}
