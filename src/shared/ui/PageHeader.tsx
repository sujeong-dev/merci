'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@/shared/ui/icons';

/**
 * 페이지 상단 헤더 컴포넌트 — Client Component
 *
 * ## RSC 경계 설계
 * PageHeader 자체가 'use client'이므로 useRouter를 내부적으로 사용합니다.
 * 덕분에 부모 페이지(Server Component)는 함수 prop을 넘기지 않아도 됩니다.
 *
 *   ✅ Server Component 페이지에서 사용 가능
 *   <PageHeader title="가족 그룹 만들기" />          → router.back() 자동
 *   <PageHeader title="가족 그룹 만들기" showBack={false} /> → 뒤로가기 없음
 *
 *   ⚠️ onBack으로 커스텀 동작이 필요한 경우, 호출하는 쪽이 'use client'여야 합니다.
 *   <PageHeader title="..." onBack={() => router.push('/home')} />
 *
 * ## 레이아웃
 * - sticky top-0, h-56px, bg rgba(250,250,250,0.95), backdrop-blur(12px)
 * - 좌측: 뒤로가기 버튼 (ChevronLeftIcon)
 * - 중앙: 타이틀 (absolute 정중앙 — 좌/우 버튼 위치와 완전히 독립)
 * - 우측: 선택적 액션 영역
 *
 * @example
 * // Server Component 페이지 — 함수 prop 불필요
 * <PageHeader title="가족 그룹 만들기" />
 *
 * // 뒤로가기 없음 (홈 등 루트 화면)
 * <PageHeader title="홈" showBack={false} />
 *
 * // 우측 액션 버튼 포함
 * <PageHeader title="앨범" right={<SettingsButton />} />
 */
interface PageHeaderProps {
  /** 중앙에 표시할 페이지 타이틀 */
  title: string;
  /**
   * 뒤로가기 버튼 표시 여부 (기본값: true)
   * false로 설정하면 좌측 spacer만 렌더링됩니다.
   */
  showBack?: boolean;
  /**
   * 뒤로가기 버튼 커스텀 핸들러
   * 미제공 시 router.back()이 기본 동작입니다.
   * ⚠️ 이 prop을 사용하는 경우, 부모 컴포넌트도 'use client'여야 합니다.
   */
  onBack?: () => void;
  /** 헤더 우측에 표시할 선택적 컨텐츠 (아이콘 버튼 등) */
  right?: React.ReactNode;
}

export function PageHeader({ title, showBack = true, onBack, right }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center px-5 bg-[rgba(250,250,250,0.95)] backdrop-blur-md">

      {/* 뒤로가기 버튼 — 기본 동작: router.back() */}
      {showBack ? (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBack ?? (() => router.back())}
          className="-ml-1 flex items-center justify-center p-2"
        >
          <ChevronLeftIcon size={16} className="text-text-primary" />
        </button>
      ) : (
        /* 타이틀 중앙 정렬을 위한 spacer */
        <div className="w-8" />
      )}

      {/* 타이틀 — absolute 정중앙 (뒤로가기/우측 액션과 완전히 독립) */}
      <div className="pointer-events-none absolute inset-x-0 flex justify-center">
        <span className="typography-h3 text-text-primary">{title}</span>
      </div>

      {/* 우측 액션 영역 — 미제공 시 빈 spacer로 타이틀 중앙 유지 */}
      <div className="ml-auto">{right ?? <div className="w-8" />}</div>

    </header>
  );
}
