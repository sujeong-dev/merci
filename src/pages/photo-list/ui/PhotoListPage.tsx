'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Select, YearSelectSheet, AuthorSelectSheet, FilterButton, CategorySelectSheet } from '@/shared/ui';
import { EditIcon, DeleteIcon, MoreIcon, PlusIcon, RememberIcon, SettingsIcon, WarningIcon, CopyIcon } from '@/shared/ui/icons';
import { ROUTES } from '@/shared/config/routes';
import { getMyGroup, listMemories, listCategories } from '@/shared/api';
import type { GroupMemberResponse, MemoryResponse, CategoryResponse } from '@/shared/api';
import { RecordingIcon } from '@/shared/ui/icons/Recording';
import { useRouter } from 'next/navigation';
import { DeleteConfirmModal } from '@/features/memory-delete/ui/DeleteConfirmModal';

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
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [memories, setMemories] = useState<MemoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 필터 state
  const [year, setYear] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // 삭제 모달 state
  const [deleteTarget, setDeleteTarget] = useState<MemoryResponse | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // ── 그룹 정보 로드 (마운트 시 1회) ──────────────────────────
  useEffect(() => {
    Promise.all([getMyGroup(), listCategories()])
      .then(([group, cats]) => {
        setGroupName(group.name);
        setMembers(group.members);
        setCategories(cats);
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
        from_date: year || undefined,
        to_date: year || undefined,
        created_by: authorId || undefined,
        category: categoryId || undefined,
      });
      setMemories(data);
    } catch {
      setMemories([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, authorId, categoryId]);

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
          <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1'>
            <FilterButton
              label={year ? YEAR_OPTIONS.find(o => o.value === year)?.label || year : '전체 기간'}
              onClick={() => setIsYearOpen(true)}
              isSelected={!!year}
              className="shrink-0"
            />
            <FilterButton
              label={authorId ? authorOptions.find(o => o.value === authorId)?.label || '작성자' : '전체 작성자'}
              onClick={() => setIsAuthorOpen(true)}
              isSelected={!!authorId}
              className="shrink-0"
            />
            <FilterButton
              label={categoryId ? categories.find(c => c.value === categoryId)?.label || '카테고리' : '전체 카테고리'}
              onClick={() => setIsCategoryOpen(true)}
              isSelected={!!categoryId}
              className="shrink-0"
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
            {memories.map((memory, index) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                members={members}
                isMenuOpen={openMenuId === memory.id}
                onMenuToggle={(id) => setOpenMenuId((prev) => (prev === id ? null : id))}
                onEdit={(m) => { setOpenMenuId(null); router.push(ROUTES.photoEdit(m.id)); }}
                onDelete={(m) => { setOpenMenuId(null); setDeleteTarget(m); }}
                priority={index === 0}
              />
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


      {/* ── 삭제 확인 모달 ───────────────────────────────────── */}
      {deleteTarget && (
        <DeleteConfirmModal
          memory={deleteTarget}
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => { setDeleteTarget(null); fetchMemories(); }}
        />
      )}

      {/* ── 바텀 시트 필터 ───────────────────────────────────── */}
      <YearSelectSheet
        isOpen={isYearOpen}
        onClose={() => setIsYearOpen(false)}
        selectedYear={year}
        onSelect={setYear}
        showAllTime
      />
      
      <AuthorSelectSheet
        isOpen={isAuthorOpen}
        onClose={() => setIsAuthorOpen(false)}
        options={authorOptions}
        selectedAuthor={authorId}
        onSelect={setAuthorId}
      />

      <CategorySelectSheet
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        categories={categories}
        selectedCategoryId={categoryId}
        onSelect={setCategoryId}
      />
    </div>
  );
}

// ── 추억 카드 컴포넌트 ─────────────────────────────────────────
interface MemoryCardProps {
  memory: MemoryResponse;
  members: GroupMemberResponse[];
  isMenuOpen: boolean;
  onMenuToggle: (id: string) => void;
  onEdit: (memory: MemoryResponse) => void;
  onDelete: (memory: MemoryResponse) => void;
  /** 첫 번째 카드 이미지에만 true — LCP 최적화 */
  priority?: boolean;
}

function MemoryCard({ memory, members, isMenuOpen, onMenuToggle, onEdit, onDelete, priority = false }: MemoryCardProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!isMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onMenuToggle(memory.id);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, memory.id, onMenuToggle]);

  return (
    <div className='relative overflow-hidden rounded-2xl bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]'>
      {/* 더보기 메뉴 — 카드 우측 상단 고정 */}
      <div ref={menuRef} className='absolute right-3 top-3 z-30'>
        <button
          type='button'
          aria-label='더보기'
          onClick={(e) => {
            e.preventDefault();
            onMenuToggle(memory.id);
          }}
          className='flex items-center justify-center'
        >
          <MoreIcon size={28} />
        </button>
        {isMenuOpen && (
          <div className='absolute right-0 top-8 z-20 flex flex-col rounded-xl bg-white py-1 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]'>
            <button
              type='button'
              onClick={() => onEdit(memory)}
              className='flex items-center gap-2 px-4 py-3 typography-body-sm text-text-primary hover:bg-[#F9FAFB] whitespace-nowrap'
            >
              <EditIcon size={14} />
              수정
            </button>
            <button
              type='button'
              onClick={() => onDelete(memory)}
              className='flex items-center gap-2 px-4 py-3 typography-body-sm text-red-500 hover:bg-[#FFF5F5] whitespace-nowrap'
            >
              <DeleteIcon size={14} />
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 이미지 영역 — Link로 감싸 상세페이지 이동 */}
      <Link href={ROUTES.photoDetail(memory.id)} className='block relative aspect-[335/233] w-full overflow-hidden'>
        <Image
          src={memory.images?.[0]?.image_url || '/images/quiz-character.png'}
          alt={memory.title}
          fill
          sizes="(max-width: 768px) 100vw, 335px"
          className='object-cover'
          priority={priority}
        />

        {/* 기억하심 뱃지 */}
        {memory.has_badge && (
          <div className='absolute top-4 left-4'>
            <div className='flex items-center gap-1 bg-status-remember-bg px-2 py-1 rounded-md border-2 border-status-remember'>
              <RememberIcon size={24} className='text-status-remember' />
              <span className='typography-body-xs-semibold text-status-remember'>기억하심</span>
            </div>
          </div>
        )}

        {/* 음성 아이콘 */}
        {memory.voice_url && (
          <div className='absolute bottom-4 right-4'>
            <RecordingIcon size={28} className='text-text-primary' />
          </div>
        )}
      </Link>

      {/* 텍스트 영역 */}
      <div className='px-4 py-3'>
        <div className='flex items-start justify-between gap-2'>
          <p className='typography-body-lg font-semibold text-text-primary line-clamp-1'>
            {memory.title}
          </p>
          <div className='flex items-center gap-2 shrink-0'>
            <span className='typography-body-sm text-text-tertiary'>{memory.year}년</span>
          </div>
        </div>
        <div className='mt-1 flex items-center gap-1'>
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='text-text-tertiary' aria-hidden='true'>
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
