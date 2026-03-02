import { Button, Input, PageHeader } from '@/shared/ui';

/**
 * 가족 그룹 만들기 — 어르신 성함 입력
 *
 * Figma: 마씨 › 가족 그룹 만들기 (node 6:657)
 * - 헤더: 뒤로가기 + 중앙 타이틀 (PageHeader)
 * - 본문: 안내 문구 + 성함 입력 필드 (Input)
 * - 하단: 확인 버튼 fixed (Button primary)
 *
 * ## RSC 전략
 * 페이지는 Server Component로 유지합니다.
 * PageHeader가 'use client'로 내부적으로 router.back()을 처리하므로
 * 이 페이지에서 함수 prop을 넘길 필요가 없습니다.
 */
export function CreateGroupPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-base">

      {/* 헤더 — PageHeader가 내부적으로 router.back() 처리 */}
      <PageHeader title="가족 그룹 만들기" />

      {/* ── 본문 ─────────────────────────────────────────────
          피그마 Main(6:664): column, padding: 24px, y=100     */}
      <main className="flex-1 p-6 pb-32">

        {/* 안내 문구
            피그마 텍스트(6:671): style_T5MCRQ — 16px Medium, text-text-subtle
            피그마 Container(6:666): pb-40px                                     */}
        <div className="pb-10">
          <p className="typography-body-lg text-text-subtle">
            가족 앨범의 주인공이신<br />
            어르신의 성함을 알려주세요.
          </p>
        </div>

        {/* 성함 입력 필드
            피그마 Container(6:672): label(6:673) + input(6:674) */}
        <Input
          id="elder-name"
          label="어르신 성함"
          type="text"
          placeholder="성함을 입력해주세요"
        />

      </main>

      {/* ── 하단 확인 버튼 (fixed) ────────────────────────────
          피그마 Container(6:678): 327×60px, x=24, y=708
          Button(6:679): fill #333333 (primary), radius 10px   */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-11">
        <Button type="button" variant="primary" fullWidth className="h-[60px]">
          확인
        </Button>
      </div>

    </div>
  );
}
