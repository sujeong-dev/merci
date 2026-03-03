'use client';

import { useState } from 'react';
import { Accordion, CommentInput, PageHeader, ProgressBar } from '@/shared/ui';
import { PlayIcon, RememberIcon, UnfamiliarIcon, VagueIcon } from '@/shared/ui/icons';
import { cn } from '@/shared/lib/utils';

/**
 * 사진 상세 — 기억의 기록
 *
 * Figma: 마씨 › 사진 상세 (node 19:439)
 * 레이아웃: 375×1749, bg: #FAFAFA
 *
 * ## 섹션 구성
 * 1. 사진 (420px, white card)
 * 2. 오디오 플레이어 (PlayIcon + ProgressBar + 시간)
 * 3. 추억 정보 — Accordion 토글 (연도·장소·인물·이야기)
 * 4. 어르신 반응 (3-option 선택 카드, RememberIcon/VagueIcon/UnfamiliarIcon)
 * 5. 가족들의 반응 (CommentIcon + 댓글 목록 + 입력창)
 *
 * ## 재사용된 공통 컴포넌트
 * - PageHeader (title="기억의 기록") — shared/ui
 * - Accordion (title="추억 정보") — shared/ui
 * - ProgressBar — shared/ui
 * - Button (variant="gray") — shared/ui
 * - PlayIcon, CommentIcon, RememberIcon, VagueIcon, UnfamiliarIcon — shared/ui/icons
 */

const REACTIONS = [
  {
    key: 'remember',
    label: '기억하심',
    Icon: RememberIcon,
    /** 선택=on (Figma 132:544): bg·border·text 모두 status-remember 토큰 */
    selectedCard: 'bg-status-remember-bg border-status-remember',
    selectedText: 'text-status-remember',
  },
  {
    key: 'vague',
    label: '가물가물',
    Icon: VagueIcon,
    selectedCard: 'bg-status-vague-bg border-status-vague',
    selectedText: 'text-status-vague',
  },
  {
    key: 'unfamiliar',
    label: '낯설어하심',
    Icon: UnfamiliarIcon,
    selectedCard: 'bg-status-unfamiliar-bg border-status-unfamiliar',
    selectedText: 'text-status-unfamiliar',
  },
] as const;

type ReactionKey = (typeof REACTIONS)[number]['key'];

const COMMENTS = [
  { id: 1, author: '김수지 (손녀)', time: '방금 전', text: '할머니가 한복 색깔까지 기억하셔서 정말 놀랐어요! 우리 다 같이 웃었네요. 🌸' },
  { id: 2, author: '김수지', time: '방금 전', text: '할머니가 한복 색깔까지 기억하셔서 정말 놀랐어요! 우리 다 같이 웃었네요. 🌸' },
];

const INFO_ROWS = [
  { label: '사진 연도', value: '1980년' },
  { label: '사진 장소', value: '서울 남산타워 앞' },
  { label: '함께한 인물', value: '김민수, 이영희, 박지민' },
  { label: '사진 이야기', value: '할머니와 함께 남산타워에 올라가서 찍은 사진이에요. 이때 날씨가 참 맑아서 멀리까지 다 보였던 기억이 나네요.' },
];

export function PhotoDetailPage() {
  const [reaction, setReaction] = useState<ReactionKey | null>(null);
  const [comment, setComment] = useState('');

  return (
    <div className='flex min-h-dvh flex-col bg-bg-base'>
      {/* ── Header (120:800): sticky, h:56px, centered title ────────*/}
      <PageHeader title='기억의 기록' />

      {/* ── Main (19:441): col, gap:20px, px:20px ───────────────────*/}
      <main className='flex flex-col gap-5 px-5 pt-6 pb-10'>
        {/* ── 사진 (19:442): 420px, white, shadow, rounded-10 ─────────
            Section:margin wrapper pb:16px                          */}
        <div className='pb-4'>
          <div className='h-[420px] w-full rounded-[10px] bg-[#F3F4F6] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]' />
        </div>

        {/* ── 오디오 플레이어 (19:445): row, center, gap:16px ─────────
            Play(40×40) + ProgressBar(fill) + time                  */}
        <div className='flex items-center gap-4'>
          <button
            type='button'
            aria-label='재생'
            className='flex size-10 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]'
          >
            <PlayIcon size={20} className='text-text-primary' />
          </button>

          <ProgressBar value={30} className='flex-1' />

          <span className='typography-caption-medium shrink-0 text-text-subtle'>
            0:45
          </span>
        </div>

        {/* ── 추억 정보 (19:543): Accordion 토글 ─────────────────────
            펼치면 bg:#F3F4F6 카드, rounded-10, p:20px, gap:20px    */}
        <Accordion title='추억 정보' defaultOpen>
          <div className='flex flex-col gap-5 rounded-[10px] bg-[#F3F4F6] p-5'>
            {INFO_ROWS.map(({ label, value }) => (
              <div key={label} className='flex flex-col gap-1'>
                <span className='typography-body-sm-bold text-text-primary'>
                  {label}
                </span>
                <span className='typography-body-sm text-text-primary'>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Accordion>

        {/* ── 어르신 반응 (19:558) ────────────────────────────────────
            heading pb:16px + 3-column 선택 카드                    */}
        <div>
          <h2 className='typography-h3 pb-4 text-text-primary'>
            오늘 어르신의 반응은 어떠셨나요?
          </h2>

          {/* 반응 카드 3개 (120:985): row, gap:12px ─────────────────
              각 카드: col, center, rounded-24px, white, shadow, py:24px px:4px */}
          <div className='flex gap-3'>
            {REACTIONS.map(
              ({ key, label, Icon, selectedCard, selectedText }) => {
                const isSelected = reaction === key;
                return (
                  <button
                    key={key}
                    type='button'
                    onClick={() => setReaction(key)}
                    className={cn(
                      /* 선택=off: border 공간 미리 확보(transparent)해서 레이아웃 시프트 방지 */
                      'flex flex-1 flex-col items-center rounded-[24px] border border-transparent bg-white px-1 py-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] transition-all',
                      /* 선택=on: 반응별 bg·border-color 토큰 적용 */
                      isSelected && selectedCard,
                    )}
                  >
                    {/* 반응 아이콘 (48px, pb:12px) */}
                    <span className='pb-3'>
                      <Icon size={48} />
                    </span>
                    <span
                      className={cn(
                        'typography-body-sm-bold',
                        /* 선택=off: text-primary / 선택=on: 반응별 text 토큰 */
                        isSelected ? selectedText : 'text-text-primary',
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* ── 가족들의 반응 (19:479): pb:24px ────────────────────────*/}
        <div className='pb-6'>
          {/* 카드 (19:480): col, py:24px px:16px, white, shadow, rounded-16px */}
          <div className='flex flex-col rounded-[16px] bg-white px-4 py-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]'>
            {/* 헤더 (19:481): "가족들의 반응" pb:20px */}
            <div className='pb-5'>
              <span className='typography-body-sm-bold text-[#333333]'>
                가족들의 반응
              </span>
            </div>

            {/* 댓글 목록 (19:485): col, gap:24px */}
            <div className='flex flex-col gap-6'>
              {COMMENTS.map(({ id, author, time, text }) => (
                <div key={id} className='flex flex-1 flex-col gap-1'>
                  {/* 작성자 + 시간 */}
                  <div className='flex items-center justify-between'>
                    <span className='typography-body-xs-semibold text-text-primary'>
                      {author}
                    </span>
                    <span className='typography-micro text-[#767676]'>
                      {time}
                    </span>
                  </div>

                  {/* 말풍선 (19:494): bg:#FAFAFA, rounded-16px, px:12px py:11.56px */}
                  <div className='rounded-[16px] bg-[#FAFAFA] px-3 py-3'>
                    <p className='typography-body-xs text-text-primary'>
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 입력 영역 (19:506): pt:24px */}
            <CommentInput
              value={comment}
              onChange={setComment}
              onSubmit={() => setComment('')}
              placeholder='어르신의 반응을 공유해주세요'
              className='pt-6'
            />
          </div>
        </div>
      </main>
    </div>
  );
}
