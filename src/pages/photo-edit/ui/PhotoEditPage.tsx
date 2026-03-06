'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, PageHeader, Select, ProgressBar, Spinner } from '@/shared/ui';
import { AddPictureIcon, MicIcon, StopIcon, PlayIcon, PauseIcon } from '@/shared/ui/icons';
import { useMemoryEdit, formatDuration } from '@/features/memory-edit/model/useMemoryEdit';
import { getMemory } from '@/shared/api';
import type { MemoryResponse } from '@/shared/api';
import { ROUTES } from '@/shared/config/routes';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
  const y = currentYear - i;
  return { label: `${y}년`, value: String(y) };
});

const MAX_RECORDING_SECONDS = 300;

export function PhotoEditPage() {
  const router = useRouter();
  const params = useParams();
  const memoryId = params?.id as string;

  const [memory, setMemory] = useState<MemoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    if (!memoryId) return;
    getMemory(memoryId)
      .then(setMemory)
      .catch((err) => {
        alert('추억 정보를 불러오는데 실패했습니다.');
        router.back();
      })
      .finally(() => setIsLoading(false));
  }, [memoryId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!memory) return null;

  return <EditForm memory={memory} />;
}

function EditForm({ memory }: { memory: MemoryResponse }) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    title, setTitle,
    year, setYear,
    location, setLocation,
    people, setPeople,
    story, setStory,
    imageFile, imagePreviewUrl, handleImageSelect,
    voiceState, recordingState, voiceBlob, voiceDuration, recordingSeconds,
    isPlaying, handleStartRecording, handleStopRecording,
    handleTogglePlayVoice, handleDeleteVoice, handleDeleteExistingVoice,
    isSubmitting, submitError, isValid, handleSubmit,
  } = useMemoryEdit({ 
    memory, 
    onSuccess: () => {
      // 수정 후 상세보기나 목록으로 이동 (여기서는 뒤로가기 혹은 상세로 이동)
      router.push(ROUTES.photoDetail(memory.id));
      router.refresh(); // 데이터 갱신을 위해
    } 
  });

  function onImageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
    e.target.value = '';
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-base">
      <PageHeader title="기억 수정하기" />

      <main className="flex flex-col gap-10 px-5 pt-6 pb-32">
        {/* 사진 선택 */}
        <div className="flex flex-col gap-3">
          <span className="typography-body-sm-bold pl-1 text-text-subtle">사진 선택</span>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onImageInputChange}
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-[10px] bg-white"
          >
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="사진 미리보기" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]">
                  <AddPictureIcon size={24} className="text-text-tertiary" />
                </div>
                <p className="mt-4 typography-body-lg text-text-primary">사진을 추가해주세요</p>
              </div>
            )}
          </button>
        </div>

        <Input id="edit-title" label="사진 제목" placeholder="예: 봄나들이" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className="flex flex-col gap-3">
          <span className="typography-body-sm-bold pl-1 text-text-subtle">사진 연도</span>
          <Select options={YEAR_OPTIONS} value={year} onChange={setYear} />
        </div>

        <Input id="edit-location" label="사진 장소" placeholder="예: 경복궁 앞" value={location} onChange={(e) => setLocation(e.target.value)} />

        <Input id="edit-people" label="함께한 인물" placeholder="예: 큰아들, 며느리" value={people} onChange={(e) => setPeople(e.target.value)} />

        <div className="flex flex-col gap-3">
          <label htmlFor="edit-story" className="typography-body-sm-bold pl-1 text-text-subtle">사진 이야기</label>
          <textarea
            id="edit-story"
            placeholder="누구와 어디에서 찍은 사진인가요?"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full resize-none rounded-[10px] bg-white px-5 pt-5 pb-[104px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] typography-body-sm text-text-primary outline-none placeholder:text-[#C7C7CC]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 pl-1">
            <span className="typography-body-sm-bold text-text-subtle">목소리 남기기</span>
            <span className="typography-body-sm text-[#767676]">(선택)</span>
          </div>

          <div className="flex items-center rounded-[10px] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {voiceState === 'keep' && (
              <>
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]">
                  <MicIcon size={24} className="text-text-tertiary" />
                </div>
                <div className="flex flex-1 flex-col pl-5 gap-2">
                  <span className="typography-body-lg text-text-primary">기존 음성 있음</span>
                  <button type="button" onClick={handleDeleteExistingVoice} className="w-fit typography-body-sm text-red-500 underline decoration-red-500/50">
                    삭제하고 다시 녹음
                  </button>
                </div>
              </>
            )}

            {(voiceState === 'record' || voiceState === 'delete') && (
              <>
                {recordingState === 'idle' && (
                  <button type="button" onClick={handleStartRecording} className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]">
                    <MicIcon size={24} className="text-text-primary" />
                  </button>
                )}
                {recordingState === 'recording' && (
                  <button type="button" onClick={handleStopRecording} className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-red-500 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]">
                    <span className="absolute inset-0 rounded-full bg-gray-500 animate-ping opacity-30" />
                    <StopIcon size={56} className="relative text-white" />
                  </button>
                )}
                {recordingState === 'done' && (
                  <button type="button" onClick={handleTogglePlayVoice} className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]">
                    {isPlaying ? <PauseIcon size={56} className="text-text-primary" /> : <PlayIcon size={56} className="text-text-primary" />}
                  </button>
                )}
                <div className="flex flex-1 flex-col pl-5 gap-2">
                  {recordingState === 'idle' && (
                    <>
                      <span className="typography-body-lg text-text-primary">목소리로 들려주세요</span>
                      <span className="typography-body-sm text-[#767676]">버튼을 눌러 녹음을 시작하세요</span>
                    </>
                  )}
                  {recordingState === 'recording' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="typography-body-lg text-text-primary">녹음 중...</span>
                        <span className="typography-body-sm text-gray-500 tabular-nums">{formatDuration(recordingSeconds)}</span>
                      </div>
                      <ProgressBar value={(recordingSeconds / MAX_RECORDING_SECONDS) * 100} />
                    </>
                  )}
                  {recordingState === 'done' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="typography-body-lg text-text-primary">{isPlaying ? '재생 중...' : '녹음 완료'}</span>
                        <span className="typography-body-sm text-text-tertiary tabular-nums">{formatDuration(voiceDuration)}</span>
                      </div>
                      <button type="button" onClick={handleDeleteVoice} className="w-fit typography-body-sm text-red-500 underline decoration-red-500/50">
                        삭제하고 다시 녹음
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {submitError && <p className="typography-body-sm text-red-500 text-center">{submitError}</p>}
      </main>

      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-app bg-bg-base px-6 pb-11 pt-3">
        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
          className="h-[60px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              저장 중...
            </span>
          ) : '저장하기'}
        </Button>
      </div>
    </div>
  );
}
