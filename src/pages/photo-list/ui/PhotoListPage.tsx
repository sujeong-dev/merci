'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Select } from '@/shared/ui';
import { PlusIcon, SettingsIcon, WarningIcon } from '@/shared/ui/icons';
import { ROUTES } from '@/shared/config/routes';

/**
 * 사진 목록 — 목록 없음 (빈 상태)
 *
 * Figma: 마씨 › 사진 목록_목록 없음 (node 114:511)
 * 레이아웃: 375×812, bg-bg-base (#FAFAFA)
 *
 * ## 구조
 * 1. Status bar (y:0, h:44) — 브라우저/OS 처리
 * 2. <header> — 앱 수준 요소 (로고 + 설정 버튼)
 *    피그마 (9:234): row, space-between, padding 24px 20px
 *    pb-6 = 기존 header gap-6 역할 (로고↔그룹명 간격 24px)
 * 3. <main> — 페이지 컨텐츠
 *    3-1. 그룹명 + 필터 (9:240): col, gap-16px, px-20px
 *         pb-6 = 기존 header pb-6 역할 (필터↔빈상태 간격 24px)
 *         - 그룹명 "심복자 어르신네" (typography/h2)
 *         - 필터 pills: [기간 ▾] [작성자 ▾]
 *           pill: white, border #E5E7EB, rounded-full, py-2 px-4
 *    3-2. 빈 상태 컨텐츠 (114:594): flex-1, center
 *         - 56×56 원형 bg (#F3F4F6) + AddPictureIcon 24px
 *         - "앨범이 비었어요" (typography/body-lg)
 *         - "소중한 순간을 떠올려보세요" (typography/body-sm)
 *
 * ## 재사용된 공통 컴포넌트
 * - AddPictureIcon, SettingsIcon, ChevronDownIcon — shared/ui/icons
 * - typography-h2-logo, typography-h2, typography-body-lg/sm — globals.css
 * - text-text-primary/tertiary, bg-bg-base — 디자인 토큰
 */
export function PhotoListPage() {
  const [period, setPeriod] = useState('');
  const [author, setAuthor] = useState('');

  return (
    <div className='flex min-h-dvh flex-col bg-bg-base'>
      {/* ── Header — 앱 수준 요소만 ───────────────────────────────
          피그마 (9:234): row, space-between, padding 24px 20px
          pb-6(24px) = 로고↔그룹명 간격 (기존 col gap-6 역할)       */}
      <header className='flex items-center justify-between px-5 py-2'>
        {/* "마씨(Merci)" 로고 — typography/h2-logo (#111827) */}
        <span className='typography-h2-logo text-text-primary'>
          마씨(Merci)
        </span>

        {/* 설정 버튼 (9:237): 40×40, white, border #F3F4F6, shadow, rounded-full */}
        <Link
          href={ROUTES.settings}
          aria-label='설정'
          className='flex size-10 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
        >
          <SettingsIcon size={20} className='text-text-primary' />
        </Link>
      </header>

      {/* ── Main ──────────────────────────────────────────────────*/}
      <main className='flex flex-1 flex-col pt-8 mx-5'>
        {/* 그룹명 + 필터 (9:240): col, gap-16px
            pb-6(24px) = 필터↔빈상태 간격 (기존 header pb-6 역할)   */}
        <div className='flex flex-col gap-4 pb-6'>
          {/* 그룹명 (9:242) — typography/h2 (#111827) */}
          <h1 className='typography-h2 text-text-primary'>심복자 어르신네</h1>

          {/* 필터 pills (9:243): row, gap-8px */}
          <div className='flex items-center gap-2'>
            <Select
              options={[]}
              value={period}
              placeholder='기간'
              onChange={setPeriod}
            />
            <Select
              options={[]}
              value={author}
              placeholder='작성자'
              onChange={setAuthor}
            />
          </div>
        </div>

        {/* 빈 상태 영역: 나머지 공간 채우며 중앙 정렬
            피그마 (114:512, layout_JA5S82): col, center, y:246     */}
        <div className='flex flex-1 items-center justify-center px-5'>
          {/* 빈 상태 컨텐츠 (114:594 Container): col, center */}
          <div className='flex flex-col items-center'>
            {/* 아이콘 원형 배경
                피그마 (114:595 Background): 56×56, #F3F4F6, rounded-full */}
            <div className='flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]'>
              <WarningIcon size={24} className='text-text-tertiary' />
            </div>

            {/* 텍스트 섹션
                피그마 (114:598 Margin): pt-16px
                피그마 (114:599 Container): col, gap-4px              */}
            <div className='pt-4 flex flex-col items-center gap-1'>
              <p className='typography-body-lg text-text-primary'>
                앨범이 비었어요
              </p>
              <p className='typography-body-sm text-text-tertiary'>
                소중한 순간을 떠올려보세요
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── FAB — 사진 등록 버튼 ─────────────────────────────────
          fixed 우하단, 56×56, bg-primary-soft(#333333), rounded-full */}
      <Link
        href={ROUTES.photoUpload}
        aria-label='사진 등록'
        className='fixed bottom-8 right-6 flex size-14 items-center justify-center rounded-full bg-primary-soft shadow-lg transition-opacity active:opacity-70'
      >
        <PlusIcon size={24} className='text-white' />
      </Link>
    </div>
  );
}
