import { Button, QuizOptionButton, Spinner } from '@/shared/ui';
import { SpeakerIcon } from '@/shared/ui/icons';
import { useQuizPlay } from '@/features/quiz-play/model/useQuizPlay';
import { useTTS } from '@/shared/lib/hooks/useTTS';
import { useEffect } from 'react';

interface QuizSectionProps {
  memoryId: string;
  onComplete: (totalScore: number) => void;
}

export function QuizSection({ memoryId, onComplete }: QuizSectionProps) {
  const {
    questions,
    currentIndex,
    currentQuestion,
    selectedOptions,
    isChecked,
    ratings,
    isGenerating,
    isSubmitting,
    isMultipleChoice,
    isCorrect,
    canProceed,
    isLastQuestion,
    progress,
    handleSelectOption,
    handleCheckAnswer,
    handleSelectRating,
    handleNext,
    handlePrev,
  } = useQuizPlay({
    memoryId,
    onComplete: (result) => onComplete(result.total_score),
  });

  const { play, stop, isPlaying } = useTTS();

  // Stop TTS when question changes or component unmounts
  useEffect(() => {
    stop();
  }, [currentQuestion, stop]);

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-white rounded-[10px] p-5 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]">
        <Spinner />
        <p className="mt-6 typography-body-sm text-text-primary text-center">
          퀴즈를 준비하고 있어요...<br />잠시만 기다려주세요.
        </p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col flex-1 bg-white rounded-[10px] p-5 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]">
      {/* Header Badge */}
      <div className="self-start px-4 py-1.5 bg-[#E5E7EB] rounded-full mb-6">
        <span className="typography-body-sm-bold text-[#767676]">
          질문 {currentIndex + 1}/4
        </span>
      </div>

      {/* Question Text */}
      <div className="flex items-start gap-2 mb-6">
        <h2 className="typography-body-lg-bold text-[#111827] whitespace-pre-line break-keep flex-1">
          {currentQuestion.question}
        </h2>
        {currentQuestion.audio_url && (
          <button
            type="button"
            aria-label="문제 듣기"
            onClick={() => play(currentQuestion.audio_url)}
            className={`flex size-10 items-center justify-center shrink-0 rounded-full transition-colors ${
              isPlaying ? 'bg-primary-soft text-white' : 'bg-[#F3F4F6] text-text-tertiary'
            }`}
          >
            <SpeakerIcon size={20} />
          </button>
        )}
      </div>

      {/* Options & Feedback */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {isMultipleChoice ? (
            <>
              {currentQuestion.options?.map((opt, i) => {
                let state: 'default' | 'selected' | 'correct' = 'default';
                if (isChecked[currentIndex]) {
                  if (opt === currentQuestion.correct_answer) state = 'correct';
                  else if (opt === selectedOptions[currentIndex]) state = 'selected';
                } else {
                  if (opt === selectedOptions[currentIndex]) state = 'selected';
                }

                return (
                  <QuizOptionButton
                    key={opt}
                    index={i + 1}
                    label={opt}
                    state={state}
                    disabled={isChecked[currentIndex]}
                    onClick={() => handleSelectOption(opt)}
                  />
                );
              })}

              {isChecked[currentIndex] && (
                <div className="mt-5 bg-status-unfamiliar-bg rounded-[12px] p-4 text-status-unfamiliar typography-body-sm-bold whitespace-pre-line text-center">
                  {isCorrect
                    ? '정답이에요!\n정말 잘 기억하고 계시네요!'
                    : '아쉽지만 괜찮아요!\n천천히 다시 되짚어보세요!'}
                </div>
              )}
            </>
          ) : (
            // Subjective Question
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <p className="typography-body-sm text-[#767676] text-left">
                 어르신의 답변이 사진의 내용과 얼마나 일치하나요?<br/>답변을 듣고 적절한 반응에 선택해주세요.
                </p>
                  </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  {(['perfect', 'similar', 'different'] as const).map((rating) => {
                    const labels = {
                      perfect: '완벽해요',
                      similar: '비슷해요',
                      different: '달라요',
                    };
                    return (
                      <Button
                        key={rating}
                        variant={ratings[currentIndex] === rating ? 'green' : 'outlined'}
                        onClick={() => handleSelectRating(rating)}
                        className="flex-1 h-[48px] px-0 typography-body-sm-bold"
                      >
                        {labels[rating]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 행 */}
        <div className="flex gap-3 mt-8">
          {currentIndex > 0 ? (
            <Button
              variant="outlined"
              onClick={handlePrev}
              className="shrink-0 w-[80px] h-[52px]"
            >
              {'< 이전'}
            </Button>
          ) : null}

          {isMultipleChoice && !isChecked[currentIndex] ? (
            <Button
              variant="gray"
              fullWidth
              disabled={selectedOptions[currentIndex] === null}
              onClick={handleCheckAnswer}
              className="h-[52px]"
            >
              정답 보기
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              disabled={!canProceed || isSubmitting}
              onClick={handleNext}
              className="h-[52px]"
            >
              {isSubmitting ? <Spinner /> : isLastQuestion ? '제출' : '다음 >'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
