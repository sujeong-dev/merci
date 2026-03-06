'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Button, Input, PageHeader, Select, ProgressBar } from '@/shared/ui';
import { AddPictureIcon, MicIcon, StopIcon, PlayIcon, PauseIcon } from '@/shared/ui/icons';
import { usePhotoUpload, formatDuration } from '@/features/photo-upload/model/usePhotoUpload';

// 연도 옵션 (현재 연도 ~ 1900, 기본값은 현재 연도)
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
  const y = currentYear - i;
  return { label: `${y}년`, value: String(y) };
});

// 최대 녹음 시간 (5분)
const MAX_RECORDING_SECONDS = 300;

export function PhotoUploadPage() {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    title, setTitle,
    year, setYear,
    location, setLocation,
    people, setPeople,
    story, setStory,
    imageFile,
    imagePreviewUrl,
    handleImageSelect,
    recordingState,
    voiceDuration,
    recordingSeconds,
    isPlaying,
    handleStartRecording,
    handleStopRecording,
    handleTogglePlayVoice,
    handleDeleteVoice,
    isSubmitting,
    submitError,
    isValid,
    handleSubmit,
  } = usePhotoUpload();


  function onImageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
    // 같은 파일 재선택 허용을 위해 value 초기화
    e.target.value = '';
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-base">

      {/* ── Header ───────────────────────────────────────────── */}
      <PageHeader title="새로운 기억 담기" />

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="flex flex-col gap-10 px-5 pt-6 pb-32">

        {/* 사진 선택 */}
        <div className="flex flex-col gap-3">
          <span className="typography-body-sm-bold pl-1 text-text-subtle">사진 선택</span>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={onImageInputChange}
          />

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-[10px] bg-white"
          >
            {imageFile ? (
              /* 미리보기 */
              <Image
                src={imagePreviewUrl}
                alt="선택한 사진 미리보기"
                fill
                className="object-cover"
              />
            ) : (
              /* 빈 상태 */
              <div className="flex flex-col items-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]">
                  <AddPictureIcon size={24} className="text-text-tertiary" />
                </div>
                <div className="pt-4 flex flex-col items-center gap-1">
                  <p className="typography-body-lg text-text-primary">사진을 추가해주세요</p>
                  <p className="typography-body-sm text-text-tertiary">소중한 순간의 한 장면</p>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* 사진 제목 */}
        <Input
          id="photo-title"
          label="사진 제목"
          placeholder="예: 봄나들이"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 사진 연도 */}
        <div className="flex flex-col gap-3">
          <span className="typography-body-sm-bold pl-1 text-text-subtle">사진 연도</span>
          <Select
            options={YEAR_OPTIONS}
            value={year}
            onChange={setYear}
          />
        </div>

        {/* 사진 장소 */}
        <Input
          id="photo-location"
          label="사진 장소"
          placeholder="예: 경복궁 앞"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* 함께한 인물 */}
        <Input
          id="photo-people"
          label="함께한 인물"
          placeholder="예: 큰아들, 며느리"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />

        {/* 사진 이야기 */}
        <div className="flex flex-col gap-3">
          <label htmlFor="photo-story" className="typography-body-sm-bold pl-1 text-text-subtle">
            사진 이야기
          </label>
          <textarea
            id="photo-story"
            placeholder="누구와 어디에서 찍은 사진인가요? 따뜻한 기억을 글로 남겨주세요."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full resize-none rounded-[10px] bg-white px-5 pt-5 pb-[104px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] typography-body-sm text-text-primary outline-none placeholder:text-[#C7C7CC]"
          />
        </div>

        {/* 목소리 남기기 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 pl-1">
            <span className="typography-body-sm-bold text-text-subtle">목소리 남기기</span>
            <span className="typography-body-sm text-[#767676]">(선택)</span>
          </div>

          <div className="flex items-center rounded-[10px] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">

            {/* 마이크/정지/재생 버튼 */}
            {recordingState === 'idle' && (
              <button
                type="button"
                aria-label="녹음 시작"
                onClick={handleStartRecording}
                className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]"
              >
                <MicIcon size={24} className="text-text-primary" />
              </button>
            )}

            {recordingState === 'recording' && (
              <button
                type="button"
                aria-label="녹음 정지"
                onClick={handleStopRecording}
                className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-red-500 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]"
              >
                {/* pulse 애니메이션 */}
                <span className="absolute inset-0 rounded-full bg-gray-500 animate-ping opacity-30" />
                <StopIcon size={56} className="relative text-white" />
              </button>
            )}

            {recordingState === 'done' && (
              <button
                type="button"
                aria-label={isPlaying ? '일시정지' : '음성 재생'}
                onClick={handleTogglePlayVoice}
                className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]"
              >
                {isPlaying ? (
                  <PauseIcon size={56} className="text-text-primary" />
                ) : (
                  <PlayIcon size={56} className="text-text-primary" />
                )}
              </button>
            )}

            {/* 상태별 텍스트 / ProgressBar */}
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
                    <span className="typography-body-sm text-gray-500 tabular-nums">
                      {formatDuration(recordingSeconds)}
                    </span>
                  </div>
                  <ProgressBar
                    value={(recordingSeconds / MAX_RECORDING_SECONDS) * 100}
                  />
                </>
              )}

              {recordingState === 'done' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="typography-body-lg text-text-primary">
                      {isPlaying ? '재생 중...' : '녹음 완료'}
                    </span>
                    <span className="typography-body-sm text-text-tertiary tabular-nums">
                      {formatDuration(voiceDuration)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteVoice}
                    className="w-fit typography-body-sm text-red-500 underline decoration-red-500/50"
                  >
                    삭제하고 다시 녹음
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {submitError && (
          <p className="typography-body-sm text-red-500 text-center">{submitError}</p>
        )}

      </main>

      {/* ── 저장하기 버튼 (fixed) ──────────────────────────────── */}
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
          ) : (
            '저장하기'
          )}
        </Button>
      </div>

    </div>
  );
}
