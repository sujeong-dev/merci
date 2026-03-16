'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Accordion, CommentInput, PageHeader, ProgressBar, Button } from '@/shared/ui';
import { EditIcon, PlayIcon, PauseIcon, RememberIcon, UnfamiliarIcon, VagueIcon, QuizCompleteIcon } from '@/shared/ui/icons';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/config/routes';
import {
  getMemory,
  getComments,
  createComment,
  listCategories,
} from '@/shared/api';
import type { MemoryResponse, CommentResponse, ReactionType, CategoryResponse } from '@/shared/api';
import { QuizSection } from './QuizSection';

/**
 * 사진 상세 — 기억의 기록
 *
 * Figma: 마씨 › 사진 상세 (node 19:439)
 * Props: memoryId — 동적 라우팅(/photo-detail/[id])에서 전달
 */

const REACTIONS = [
  {
    key: '기억하심' as ReactionType,
    label: '기억하심',
    Icon: RememberIcon,
    selectedCard: 'bg-status-remember-bg border-status-remember',
    selectedText: 'text-status-remember',
  },
  {
    key: '가물가물' as ReactionType,
    label: '가물가물',
    Icon: VagueIcon,
    selectedCard: 'bg-status-vague-bg border-status-vague',
    selectedText: 'text-status-vague',
  },
  {
    key: '낯설어하심' as ReactionType,
    label: '낯설어하심',
    Icon: UnfamiliarIcon,
    selectedCard: 'bg-status-unfamiliar-bg border-status-unfamiliar',
    selectedText: 'text-status-unfamiliar',
  },
] as const;

export function PhotoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memoryId = params?.id as string;
  // ── 데이터 상태 ───────────────────────────────────────────────
  const [memory, setMemory] = useState<MemoryResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  // ── 음성 플레이어 상태 ────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0~100
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── 초기 데이터 로드 ──────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      getMemory(memoryId),
      getComments(memoryId),
    ]).then(([mem, cmts]) => {
      setMemory(mem);
      setComments(cmts);
    }).catch(() => {/* 에러 무시 */});
  }, [memoryId]);

  // ── 음성 플레이어 초기화 ──────────────────────────────────────
  useEffect(() => {
    if (!memory?.voice_url) return;

    // src 설정 전에 preload를 지정해야 브라우저가 올바른 전략으로 로딩을 시작함
    const audio = new Audio();
    audio.preload = 'auto';

    // MediaRecorder로 녹음된 WebM/Ogg는 헤더에 duration이 없어 Infinity로 반환됨.
    // 파일 끝으로 seek하면 브라우저가 실제 끝 위치로 snap하면서 duration이 확정됨.
    let measuringDuration = false;

    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      } else {
        measuringDuration = true;
        audio.currentTime = 1e10; // duration 측정용 seek
      }
    };

    audio.onseeked = () => {
      if (!measuringDuration) return;
      measuringDuration = false;
      if (isFinite(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
      audio.currentTime = 0; // 처음으로 복귀 (이 seek은 플래그 false라 무시됨)
    };

    audio.ondurationchange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      setAudioProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    audio.onended = () => setIsPlaying(false);

    audioRef.current = audio;
    audio.src = memory.voice_url;
    audio.load(); // preload='auto' 설정 후 명시적으로 로딩 트리거

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [memory?.voice_url]);

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = ratio * audio.duration;
  }, []);

  // ── 시간 포맷 ─────────────────────────────────────────────────
  function formatTime(seconds: number): string {
    if (!isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── 어르신 반응 도출 ──────────────────────────────────────────
  const getDerivedReaction = (): ReactionType | null => {
    if (!memory || memory.quiz_score === null) return null;
    if (memory.quiz_score >= 0 && memory.quiz_score <= 2) return '낯설어하심';
    if (memory.quiz_score >= 3 && memory.quiz_score <= 6) return '가물가물';
    if (memory.quiz_score >= 7 && memory.quiz_score <= 10) return '기억하심';
    return null; // fallback
  };

  const currentReaction = getDerivedReaction();

  // ── 댓글 제출 ─────────────────────────────────────────────────
  const handleCommentSubmit = useCallback(async () => {
    const trimmed = commentInput.trim();
    if (!trimmed || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await createComment(memoryId, trimmed);
      setCommentInput('');
      // 목록 재조회
      const updated = await getComments(memoryId);
      setComments(updated);
    } catch {
      // 에러 무시
    } finally {
      setIsSubmittingComment(false);
    }
  }, [memoryId, commentInput, isSubmittingComment]);

  // ── 추억 정보 rows ────────────────────────────────────────────
  const infoRows = memory
    ? [
        { label: '사진 카테고리', value: `${memory.category.label}` },
        { label: '사진 연도', value: `${memory.year}년` },
        { label: '사진 장소', value: memory.location },
        { label: '함께한 인물', value: memory.people },
        { label: '사진 이야기', value: memory.story },
      ]
    : [];

  return (
    <div className='flex min-h-dvh flex-col bg-bg-base'>
      {/* ── Header ─────────────────────────────────────────────── */}
      <PageHeader
        title='기억의 기록'
        right={
          <button
            type='button'
            aria-label='수정'
            onClick={() => router.push(ROUTES.photoEdit(memoryId))}
            className='flex size-10 items-center justify-center p-2 active:opacity-70'
          >
            <EditIcon size={20} className='text-text-primary' />
          </button>
        }
      />

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className='flex flex-col gap-5 px-5 pt-6 pb-10'>

        {/* 사진 */}
        <div className='pb-4'>
          <div className='flex snap-x snap-mandatory overflow-x-auto scrollbar-hide w-full gap-4'>
            {memory?.images?.map((image, i) => (
              <div
                key={image.id}
                className='shrink-0 relative h-[420px] w-full snap-center overflow-hidden rounded-[10px] bg-[#F3F4F6] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] block'
              >
                <Image
                  src={image.image_url}
                  alt={`${memory.title} 사진 ${i + 1}`}
                  fill
                  className='object-cover'
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority={i === 0}
                />
                {memory.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 font-semibold text-white text-xs backdrop-blur-sm">
                    {i + 1} / {memory.images.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 음성 플레이어 — voice_url이 있을 때만 표시 */}
        {memory?.voice_url && (
          <div className='flex items-center gap-4'>
            <button
              type='button'
              aria-label={isPlaying ? '일시정지' : '재생'}
              onClick={handleTogglePlay}
              className='flex size-10 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]'
            >
              {isPlaying ? (
                <PauseIcon size={56} className='text-text-primary' />
              ) : (
                <PlayIcon size={56} className='text-text-primary' />
              )}
            </button>

            <ProgressBar
              value={audioProgress}
              className='flex-1'
              onClick={handleSeek}
            />

            <span className='typography-caption-medium shrink-0 text-text-subtle'>
              {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
            </span>
          </div>
        )}

        {/* 회상 퀴즈 */}
        {memory && (
          <Accordion title='회상 퀴즈' defaultOpen>
            {isQuizStarted ? (
              <QuizSection
                memoryId={memoryId}
                onComplete={(totalScore) => {
                  setIsQuizStarted(false);
                  setMemory((prev) => (prev ? { ...prev, has_quiz: true, quiz_score: totalScore } : null));
                }}
              />
            ) : memory.has_quiz ? (
              /* ── 퀴즈 완료 상태 ─────────────────────────────── */
              <div className='flex flex-col items-center rounded-[10px] bg-white px-8 py-12 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]'>
                <QuizCompleteIcon size={64} />
                <h3 className='typography-body-lg-bold text-text-primary-soft pt-6 pb-2 text-center'>
                  회상 퀴즈를 완료하셨어요.
                </h3>
                <p className='typography-body-sm text-text-subtle pb-8 text-center'>
                  모든 퀴즈를 성공적으로 마쳤습니다.
                </p>
                <Button variant='primary' fullWidth onClick={() => setIsQuizStarted(true)}>
                  다시 풀어보기
                </Button>
              </div>
            ) : (
              /* ── 퀴즈 미완료 상태 ───────────────────────────── */
              <div className='flex flex-col items-center gap-6 rounded-md bg-white p-5'>
                <Image
                  src='/images/quiz-character.png'
                  alt='퀴즈 캐릭터'
                  width={96}
                  height={96}
                />
                <div className='flex flex-col gap-2 text-center'>
                  <h3 className='typography-body-lg-bold text-text-primary'>
                    어르신과 함께 퀴즈를 풀어볼까요?
                  </h3>
                  <p className='typography-body-sm text-text-tertiary'>
                    따뜻한 추억을 되새기며 즐거운 시간을 보내보세요.
                  </p>
                </div>
                <Button variant='primary' fullWidth onClick={() => setIsQuizStarted(true)}>
                  시작하기
                </Button>
              </div>
            )}
          </Accordion>
        )}

        {/* 추억 정보 Accordion */}
        <Accordion title='추억 정보' defaultOpen>
          <div className='flex flex-col gap-5 rounded-[10px] bg-[#F3F4F6] p-5'>
            {infoRows.map(({ label, value }) => (
              <div key={label} className='flex flex-col gap-1'>
                <span className='typography-body-sm-bold text-text-primary'>{label}</span>
                <span className='typography-body-sm text-text-primary'>{value}</span>
              </div>
            ))}
          </div>
        </Accordion>

        {/* 어르신 반응 */}
        <div>
          <h2 className='typography-body-sm-bold text-text-primary pb-4'>
            오늘 어르신의 반응은 어떠셨나요?
          </h2>

          <div className='flex gap-3'>
            {REACTIONS.map(({ key, label, Icon, selectedCard, selectedText }) => {
              const isSelected = currentReaction === key;
              return (
                <div
                  key={key}
                  className={cn(
                    'flex flex-1 flex-col items-center rounded-[24px] border bg-white px-1 py-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] transition-all',
                    isSelected ? selectedCard : 'border-transparent opacity-50 grayscale',
                  )}
                >
                  <span className='pb-3'>
                    <Icon size={48} />
                  </span>
                  <span
                    className={cn(
                      'typography-body-sm-bold',
                      isSelected ? selectedText : 'text-text-primary',
                    )}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 가족들의 반응 (댓글) */}
        <div className='pb-6'>
          <div className='flex flex-col rounded-[16px] bg-white px-4 py-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]'>
            <div className='pb-5'>
              <span className='typography-body-sm-bold text-text-primary'>
                가족들의 반응
              </span>
            </div>

            {/* 댓글 목록 */}
            {comments.length > 0 ? (
              <div className='flex flex-col gap-6'>
                {comments.map((c) => (
                  <div key={c.id} className='flex flex-1 flex-col gap-1'>
                    <div className='flex items-center justify-between'>
                      <span className='typography-body-xs-semibold text-text-primary'>
                        {c.author_name}
                        {c.relation && `(${c.relation})`}
                      </span>
                      <span className='typography-micro text-[#767676]'>
                        {new Date(c.created_at).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className='rounded-[16px] bg-[#FAFAFA] px-3 py-3'>
                      <p className='typography-body-xs text-text-primary'>{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='typography-body-sm text-text-tertiary text-center py-4'>
                아직 반응이 없어요. 첫 번째로 남겨보세요!
              </p>
            )}

            {/* 댓글 입력 */}
            <CommentInput
              value={commentInput}
              onChange={setCommentInput}
              onSubmit={handleCommentSubmit}
              placeholder='어르신의 반응을 공유해주세요'
              className='pt-6'
            />
          </div>
        </div>

        {/* 목록으로 이동 버튼 */}
        <div className='pt-4 pb-10'>
          <Button
            variant='gray'
            fullWidth
            onClick={() => router.push(ROUTES.photoList)}
            className='h-[52px] typography-body-sm-bold'
          >
            목록으로
          </Button>
        </div>
      </main>
    </div>
  );
}
