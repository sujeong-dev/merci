import Image from 'next/image';
import { CardButton } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';

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
        <div className="flex flex-col gap-2 pb-12">
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

          {/* 카드 1: 가족 그룹 만들기 */}
          <CardButton
            href={ROUTES.createGroup}
            icon={
              <Image
                src="/images/home-icon-group.svg"
                alt=""
                width={52}
                height={52}
              />
            }
            title="가족 그룹 만들기"
            subtitle="새로운 앨범 시작하기"
          />

          {/* 카드 2: 초대 코드 입력 */}
          <CardButton
            icon={
              <Image
                src="/images/home-icon-invite.svg"
                alt=""
                width={52}
                height={52}
              />
            }
            title="초대 코드 입력"
            subtitle="기존 그룹에 참여하기"
          />

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
