'use client';

import { useState } from 'react';
import { Button, CommentInput, SocialLoginButton, Tab } from '@/shared/ui';
import { CopyIcon } from '@/shared/ui/icons';

/**
 * 설정 페이지
 *
 * Figma: 설정 (node 6:513)
 * 레이아웃: bg:#FAFAFA, column
 *   - Header: "김민수 님" h2, px:20 py:24
 *   - Main: column, gap:40px, px:20px
 *     - Section 1: 어르신과의 관계 (column, gap:20px)
 *       - Tab 버튼 2행 (row gap-1, col gap-2)
 *       - 기타 선택 시 입력창 (bg:#F3F4F6, px:20 py:12, rounded:10px)
 *     - Section 2: 가족 초대 코드 (white, shadow, rounded:10px, px:24 py:12)
 *       - 코드 카드 (bg:#FAFAFA, border:#F3F4F6, p:20px, rounded:10px)
 *   - Footer: 로그아웃 (caption, #9CA3AF, centered, absolute bottom)
 */

const RELATIONSHIPS = [
  '아들', '딸', '며느리', '사위',
  '손주', '형제', '자매', '기타',
] as const;

type Relationship = (typeof RELATIONSHIPS)[number];

export function SettingsPage() {
  const [selectedRelation, setSelectedRelation] = useState<Relationship | null>(null);
  const [customRelation, setCustomRelation] = useState('');

  return (
    <div className='relative min-h-screen bg-[#FAFAFA]'>
      {/* ── Header ────────────────────────────────────────────────*/}
      <header className='px-5 py-6'>
        <h1 className='typography-h2 text-text-primary'>김민수 님</h1>
      </header>

      {/* ── Main ──────────────────────────────────────────────────*/}
      <main className='flex flex-col gap-10 px-5'>
        {/* Section 1: 어르신과의 관계 */}
        <section className='flex flex-col gap-5'>
          <h2 className='typography-h3 text-left text-text-primary'>
            어르신과의 관계
          </h2>

          {/* Tab 버튼 — 모바일: 2줄, 태블릿(768px~): 1줄 flex-wrap */}
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            {RELATIONSHIPS.map((rel) => (
              <Tab
                key={rel}
                active={selectedRelation === rel}
                onClick={() => setSelectedRelation(rel)}
              >
                {rel}
              </Tab>
            ))}
          </div>

          {/* 기타 선택 시 입력창 */}
          {selectedRelation === '기타' && (
            <div className='rounded-b-input bg-bg-input-filled px-5 py-3'>
              <CommentInput
                showIcon={false}
                value={customRelation}
                onChange={setCustomRelation}
                onSubmit={() => {}}
                placeholder='직접 입력해 주세요 (예: 고모)'
                submitLabel='적용하기'
              />
            </div>
          )}
        </section>

        {/* Section 2: 가족 초대 코드 */}
        <section className='flex flex-col gap-4 rounded-[10px] bg-white px-6 py-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'>
          {/* 섹션 레이블 */}
          <span className='typography-caption text-[#767676]'>
            가족 초대 코드
          </span>

          {/* 코드 카드 */}
          <div className='flex flex-col items-center gap-4 rounded-[10px] border border-[#F3F4F6] bg-[#FAFAFA] p-5'>
            {/* 초대 코드 */}
            <span className='typography-h3 text-text-primary'>MC-8294-ZE</span>

            {/* 버튼 행 */}
            <div className='flex w-full items-center gap-2'>
              {/* 복사 버튼 */}
              <Button type={'button'} variant={'outlined'}>
                <div className='flex items-center gap-2'>
                  <CopyIcon size={12} />
                  복사
                </div>
              </Button>
              {/* 카카오톡 공유 버튼 */}
              <SocialLoginButton
                variant='kakao'
                className='flex-1 rounded-[10px] py-2'
                logoSize={12}
                textClassName='typography-caption'
              >
                카카오톡 공유
              </SocialLoginButton>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────*/}
      <footer className='absolute bottom-0 left-0 right-0 flex items-center justify-center py-14'>
        <button type='button' className='typography-caption text-[#9CA3AF]'>
          로그아웃
        </button>
      </footer>
    </div>
  );
}
