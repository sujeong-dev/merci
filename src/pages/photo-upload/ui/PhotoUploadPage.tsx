'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button, Input, PageHeader, ProgressBar, YearSelectSheet, FilterButton, CategorySelectSheet } from '@/shared/ui';
import { AddPictureIcon, MicIcon, StopIcon, PlayIcon, PauseIcon, ChevronDownIcon, CloseIcon } from '@/shared/ui/icons';
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
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const {
    title, setTitle,
    year, setYear,
    location, setLocation,
    people, setPeople,
    story, setStory,
    category, setCategory,
    categories,
    imageFiles,
    imagePreviewUrls,
    handleImageSelect,
    handleRemoveImage,
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
    const files = e.target.files;
    if (files && files.length > 0) handleImageSelect(files);
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
          <div className="flex items-center justify-between pl-1">
            <span className="typography-body-sm-bold text-text-subtle">
              사진 선택 ({imageFiles.length}/10)
            </span>
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onImageInputChange}
          />

          {/* 가로 스크롤 미리보기 캐러셀 */}
          <div className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 gap-4 pb-2 scrollbar-hide">
            {/* 추가된 썸네일들 */}
            {imagePreviewUrls.map((url, i) => (
              <div key={url} className="relative flex h-[420px] w-full shrink-0 snap-center items-center justify-center overflow-hidden rounded-[10px] bg-white border border-[#E5E7EB]">
                <Image src={url} alt={`미리보기 ${i + 1}`} fill className="object-cover" />
                {i === 0 && (
                  <div className="absolute top-4 left-4 rounded-md bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    대표 사진
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            ))}

            {/* 사진 추가 버튼 (최대 10개 미만일 때만) */}
            {imageFiles.length < 10 && (
              <div className="relative flex h-[420px] w-full shrink-0 snap-center items-center justify-center overflow-hidden rounded-[10px] bg-white border border-dashed border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex h-full w-full flex-col items-center justify-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]">
                      <AddPictureIcon size={24} className="text-text-tertiary" />
                    </div>
                    <div className="pt-4 flex flex-col items-center gap-1">
                      <p className="typography-body-lg text-text-primary">
                        {imageFiles.length === 0 ? "사진을 추가해주세요" : "사진 추가하기"}
                      </p>
                      <p className="typography-body-sm text-text-tertiary">
                        {imageFiles.length === 0 ? "소중한 순간의 한 장면" : "추가 사진 등록"}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 사진 제목 */}
        <Input
          id="photo-title"
          label="사진 제목"
          placeholder="예: 봄나들이"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 사진 카테고리 */}
        <div className="flex flex-col gap-3">
          <span className="typography-body-sm-bold pl-1 text-text-subtle">사진 카테고리</span>
           <button
            type="button"
            onClick={() => setIsCategoryOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-border-default bg-white px-4 py-3 text-left transition-colors hover:bg-[#F9FAFB] active:bg-[#F3F4F6]"
          >
            <span className="typography-body-lg text-text-primary">
              {category ? `${category}` : '카테고리를 선택하세요'}
            </span>
            <ChevronDownIcon size={20} className="text-text-tertiary" />
          </button>
        </div>

        {/* 사진 연도 */}
        <div className="flex flex-col gap-3">
          <span className="typography-body-sm-bold pl-1 text-text-subtle">사진 연도</span>
          <button
            type="button"
            onClick={() => setIsYearOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-border-default bg-white px-4 py-3 text-left transition-colors hover:bg-[#F9FAFB] active:bg-[#F3F4F6]"
          >
            <span className="typography-body-lg text-text-primary">
              {year ? `${year}년` : '연도를 선택하세요'}
            </span>
            <ChevronDownIcon size={20} className="text-text-tertiary" />
          </button>
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

      <YearSelectSheet
        isOpen={isYearOpen}
        onClose={() => setIsYearOpen(false)}
        selectedYear={year}
        onSelect={setYear}
        showAllTime={false}
      />

      <CategorySelectSheet
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        categories={categories}
        selectedCategoryId={category}
        onSelect={setCategory}
        showAll={false}
      />
    </div>
  );
}
