'use client';

import { useCreateGroup } from '@/features/create-group';
import { Button, Input, PageHeader } from '@/shared/ui';
import { GroupCreatedModal } from './GroupCreatedModal';

/**
 * 가족 그룹 만들기 — 어르신 성함 입력
 *
 * Figma: 마씨 › 가족 그룹 만들기 (node 6:657)
 * - 헤더: 뒤로가기 + 중앙 타이틀 (PageHeader)
 * - 본문: 안내 문구 + 성함 입력 필드 (Input)
 * - 하단: 확인 버튼 fixed (Button primary)
 * - 확인 버튼 → API 호출 → GroupCreatedModal 표시
 *
 * ## RSC 전략
 * useCreateGroup 훅으로 폼 + API + 모달을 제어하므로 Client Component입니다.
 */
export function CreateGroupPage() {
  const {
    elderName,
    setElderName,
    isPending,
    error,
    inviteCode,
    isModalOpen,
    handleSubmit,
    closeModal,
  } = useCreateGroup();

  const isDisabled = !elderName.trim() || isPending;

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
          value={elderName}
          onChange={(e) => setElderName(e.target.value)}
        />

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-3 pl-1 typography-body-sm text-status-danger">
            {error}
          </p>
        )}

      </main>

      {/* ── 하단 확인 버튼 (fixed) ────────────────────────────
          피그마 Container(6:678): 327×60px, x=24, y=708
          Button(6:679): fill #333333 (primary), radius 10px   */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-app bg-bg-base px-6 pb-11 pt-3">
        <Button
          type="button"
          variant="primary"
          fullWidth
          className="h-[60px]"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          {isPending ? '생성 중...' : '확인'}
        </Button>
      </div>

      {/* 그룹 생성 완료 모달 — node 6:1080 */}
      <GroupCreatedModal
        isOpen={isModalOpen}
        onClose={closeModal}
        inviteCode={inviteCode ?? ''}
      />

    </div>
  );
}
