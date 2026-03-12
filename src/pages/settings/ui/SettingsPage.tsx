'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CommentInput, PageHeader, SocialLoginButton, Tab } from '@/shared/ui';
import { CheckIcon, CopyIcon } from '@/shared/ui/icons';
import { getUserMe, updateRelation, getInviteCode } from '@/shared/api';
import { useAuthStore } from '@/features/auth/model/authStore';
import { ROUTES } from '@/shared/config/routes';
import { UserResponse } from '@/shared/api/userApi';
import { KakaoLogo, NaverLogo } from '@/shared/ui/SocialLoginButton';

/**
 * 설정 페이지
 *
 * Figma: 설정 (node 6:513)
 * 레이아웃: bg:#FAFAFA, column
 *   - Header: "이름 님" h2, px:20 py:24
 *   - Main: column, gap:40px, px:20px
 *     - Section 1: 어르신과의 관계 (column, gap:20px)
 *       - Tab 버튼 2행 (row gap-1, col gap-2)
 *       - 기타 선택 시 입력창 (bg:#F3F4F6, px:20 py:12, rounded:10px)
 *     - Section 2: 가족 초대 코드 (white, shadow, rounded:10px, px:24 py:12)
 *       - 코드 카드 (bg:#FAFAFA, border:#F3F4F6, p:20px, rounded:10px)
 *   - Footer: 로그아웃 (caption, #9CA3AF, centered, absolute bottom)
 *
 * ## 데이터 로딩
 * - getUserMe() → name(헤더), relation(탭 초기 선택)
 * - getInviteCode() → 초대 코드 카드 표시
 *
 * ## 관계 수정
 * - 미리 정의된 탭 클릭 → updateRelation() 즉시 호출
 * - 기타 선택 + 직접 입력 후 "적용하기" → updateRelation(customRelation) 호출
 *
 * ## 복사 버튼
 * 복사 클립보드 성공 → CopyIcon을 CheckIcon으로 교체 → 2초 후 원복
 *
 * ## 카카오톡 공유
 * GroupCreatedModal과 동일한 Kakao.Share.sendDefault() 패턴 사용
 */

const RELATIONSHIPS = [
  '아들', '딸', '며느리', '사위',
  '손주', '형제', '자매', '기타',
] as const;

type Relationship = (typeof RELATIONSHIPS)[number];

export function SettingsPage() {
  const router = useRouter();
  const clearTokens = useAuthStore((s) => s.clearTokens);

  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<Relationship | null>(null);
  const [customRelation, setCustomRelation] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // ── 초기 데이터 로딩 ──────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [user, code] = await Promise.all([getUserMe(), getInviteCode()]);

        setUserInfo(user);
        setInviteCode(code);

        // relation 초기 선택: 미리 정의된 항목이면 해당 탭, 아니면 기타 + customRelation
        if (user.relation) {
          const matched = RELATIONSHIPS.find((r) => r === user.relation);
          if (matched) {
            setSelectedRelation(matched);
          } else {
            setSelectedRelation('기타');
            setCustomRelation(user.relation);
          }
        }
      } catch {
        // 에러 시 빈 상태 유지
      }
    }

    loadData();
  }, []);

  // ── 관계 탭 클릭 ──────────────────────────────────────────────
  const handleRelationClick = async (rel: Relationship) => {
    setSelectedRelation(rel);

    // 기타는 직접 입력 후 적용하기에서 API 호출
    if (rel === '기타') return;

    try {
      await updateRelation(rel);
    } catch {
      // 실패 시 이전 상태로 롤백하지 않음 (UX 단순화)
    }
  };

  // ── 기타 관계 제출 ────────────────────────────────────────────
  const handleCustomRelationSubmit = async () => {
    if (!customRelation.trim()) return;

    try {
      await updateRelation(customRelation.trim());
    } catch {
      // 실패 시 무시
    }
  };

  // ── 초대 코드 복사 ────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // clipboard 권한 거부 등 실패 시 무시
    }
  };

  // ── 로그아웃 ──────────────────────────────────────────────────
  const handleLogout = () => {
    clearTokens();
    router.replace(ROUTES.landing);
  };

  // ── 카카오 공유 ───────────────────────────────────────────────
  const handleKakaoShare = () => {
    try {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        alert('카카오톡 공유 기능을 초기화하지 못했습니다.');
        return;
      }

      const shareUrl = window.location.origin;

      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: `마씨(Merci)에서 가족 그룹에 초대합니다!\n\n초대 코드: ${inviteCode}\n\n아래 링크에서 초대 코드를 입력하고 가족 앨범에 참여하세요.`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      });
    } catch (error) {
      alert(`카카오 공유 에러: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className='relative min-h-screen bg-[#FAFAFA]'>
      {/* ── 상단 헤더 ─────────────────────────────────────────────*/}
      <PageHeader title='설정' />

      {/* ── 유저 이름 ─────────────────────────────────────────────*/}
      <div className='px-5 py-6'>
        <h1 className='typography-h2 text-text-primary'>
          {userInfo?.name ? `${userInfo.name} 님` : ''}
        </h1>
        <div className='flex items-center gap-1 mt-1'>
          {userInfo?.provider === 'kakao' ? (
            <KakaoLogo size={16} />
          ) : <NaverLogo size={16} />}
          <span className='typography-body-sm text-text-subtle'>
            {userInfo?.email}
          </span>
        </div>
      </div>

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
                onClick={() => handleRelationClick(rel)}
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
                onSubmit={handleCustomRelationSubmit}
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
            <span className='typography-h3 text-text-primary'>{inviteCode}</span>

            {/* 버튼 행 */}
            <div className='flex w-full items-center gap-2'>
              {/* 복사 버튼 */}
              <Button
                type='button'
                variant='outlined'
                onClick={handleCopy}
                aria-label={isCopied ? '복사 완료' : '초대 코드 복사'}
              >
                <div className='flex items-center gap-2'>
                  {isCopied ? (
                    <CheckIcon size={12} className='text-text-primary' />
                  ) : (
                    <CopyIcon size={12} />
                  )}
                  복사
                </div>
              </Button>

              {/* 카카오톡 공유 버튼 */}
              <SocialLoginButton
                variant='kakao'
                className='flex-1 rounded-[10px] py-2'
                logoSize={12}
                textClassName='typography-caption'
                onClick={handleKakaoShare}
              >
                카카오톡 공유
              </SocialLoginButton>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────*/}
      <footer className='absolute bottom-0 left-0 right-0 flex items-center justify-center py-14'>
        <button
          type='button'
          className='typography-caption text-[#9CA3AF]'
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </footer>
    </div>
  );
}
