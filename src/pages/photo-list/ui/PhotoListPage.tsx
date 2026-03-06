'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Select } from '@/shared/ui';
import { PlusIcon, RememberIcon, SettingsIcon, WarningIcon } from '@/shared/ui/icons';
import { ROUTES } from '@/shared/config/routes';
import { getMyGroup, listMemories } from '@/shared/api';
import type { GroupMemberResponse, MemoryResponse } from '@/shared/api';
import { RecordingIcon } from '@/shared/ui/icons/Recording';

/**
 * 사진 목록 페이지
 *
 * Figma: 마씨 › 사진 목록 (node 9-210)
 * - GET /groups/me  → 그룹명 + 멤버 목록
 * - GET /memories   → 추억 목록 (기간/작성자 필터)
 */

// 연도 옵션 생성 함수 (최신순)
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
    const y = currentYear - i;
    return { label: `${y}년`, value: String(y) };
  });
  return [{ label: '전체 기간', value: '' }, ...years];
};

const YEAR_OPTIONS = getYearOptions();

export function PhotoListPage() {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [memories, setMemories] = useState<MemoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 필터 state
  const [year, setYear] = useState('');       // 선택한 연도 string (ex: '2026')
  const [authorId, setAuthorId] = useState(''); // 선택한 멤버의 user_id

  // ── 그룹 정보 로드 (마운트 시 1회) ──────────────────────────
  useEffect(() => {
    getMyGroup()
      .then((group) => {
        setGroupName(group.name);
        setMembers(group.members);
      })
      .catch(() => {
        // 에러 시 빈 상태 유지
      });
  }, []);

  // ── 추억 목록 로드 (마운트 + 필터 변경 시) ───────────────────
  const fetchMemories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listMemories({
        from_date: year ? `${year}-01-01` : undefined,
        to_date: year ? `${year}-12-31` : undefined,
        created_by: authorId || undefined,
      });
      setMemories(data);
    } catch {
      setMemories([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, authorId]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // 작성자 select options
  const authorOptions = [
    { label: '전체 작성자', value: '' },
    ...members.map((m) => ({
      label: m.name,
      value: m.user_id,
    })),
  ];

  return (
    <div className='flex min-h-dvh flex-col bg-bg-base'>
      {/* ── Header ──────────────────────────────────────────────
          피그마 (9:234): row, space-between, padding 24px 20px   */}
      <header className='flex items-center justify-between px-5 py-2'>
        <span className='typography-h2-logo text-text-primary'>마씨(Merci)</span>

        <Link
          href={ROUTES.settings}
          aria-label='설정'
          className='flex size-10 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
        >
          <SettingsIcon size={20} className='text-text-primary' />
        </Link>
      </header>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className='flex flex-1 flex-col pt-8 mx-5'>
        {/* 그룹명 + 필터 */}
        <div className='flex flex-col gap-4 pb-6'>
          {/* 그룹명: "{name} 어르신네" */}
          <h1 className='typography-h2 text-text-primary'>
            {groupName ? `${groupName} 어르신네` : '어르신네'}
          </h1>

          {/* 필터 pills */}
          <div className='flex items-center gap-2'>
            <Select
              options={YEAR_OPTIONS}
              value={year}
              onChange={setYear}
            />
            <Select
              options={authorOptions}
              value={authorId}
              onChange={setAuthorId}
            />
          </div>
        </div>

        {/* ── 콘텐츠 영역: 로딩 / 빈 상태 / 카드 목록 ────────── */}
        {isLoading ? (
          /* 로딩 중 */
          <div className='flex flex-1 items-center justify-center'>
            <div className='size-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-text-primary' />
          </div>
        ) : memories.length === 0 ? (
          /* 빈 상태 (피그마 114:594) */
          <div className='flex flex-1 items-center justify-center px-5'>
            <div className='flex flex-col items-center'>
              <div className='flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]'>
                <WarningIcon size={24} className='text-text-tertiary' />
              </div>
              <div className='pt-4 flex flex-col items-center gap-1'>
                <p className='typography-body-lg text-text-primary'>앨범이 비었어요</p>
                <p className='typography-body-sm text-text-tertiary'>소중한 순간을 떠올려보세요</p>
              </div>
            </div>
          </div>
        ) : (
          /* 추억 카드 목록 */
          <div className='flex flex-col gap-4 pb-24'>
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} members={members} />
            ))}
          </div>
        )}
      </main>

      {/* ── FAB — 사진 등록 버튼 ─────────────────────────────── */}
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

// ── 추억 카드 컴포넌트 ─────────────────────────────────────────
interface MemoryCardProps {
  memory: MemoryResponse;
  members: GroupMemberResponse[];
}

function MemoryCard({ memory, members }: MemoryCardProps) {
  return (
    <div className='overflow-hidden rounded-2xl bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]'>
      {/* 이미지 영역 */}
      <div className='relative aspect-[335/233] w-full'>
        <img
          src={memory.image_url}
          alt={memory.title}
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 335px'
        />

        {/* 기억하심 뱃지 */}
        {memory.has_badge && (
          <RememberIcon />
        )}

        {/* 음성 아이콘 */}
        {memory.voice_url && (
          <div className='absolute bottom-4 right-3'>
            <RecordingIcon size={24} className='text-text-primary' />
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className='px-4 py-3'>
        <div className='flex items-start justify-between gap-2'>
          <p className='typography-body-lg font-semibold text-text-primary line-clamp-1'>
            {memory.title}
          </p>
          <span className='shrink-0 typography-body-sm text-text-tertiary'>{memory.year}년</span>
        </div>
        <div className='mt-1 flex items-center gap-1'>
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-text-tertiary'
            aria-hidden='true'
          >
            <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
            <circle cx='12' cy='7' r='4' />
          </svg>
          <span className='typography-body-sm text-text-tertiary'>
            {members.find((m) => m.user_id === memory.created_by)?.name ?? '알 수 없음'}
          </span>
        </div>
      </div>
    </div>
  );
}
