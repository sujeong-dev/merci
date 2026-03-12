import { useState, useCallback, useEffect } from 'react';
import { generateQuiz, submitQuiz, QuizQuestion, QuizSubmitResponse } from '@/shared/api/quizApi';

export type SubjectiveRating = 'perfect' | 'similar' | 'different';

interface UseQuizPlayParams {
  memoryId: string;
  onComplete?: (result: QuizSubmitResponse) => void;
}

export const useQuizPlay = ({ memoryId, onComplete }: UseQuizPlayParams) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>([null, null, null, null]);
  const [isChecked, setIsChecked] = useState<boolean[]>([false, false, false, false]);
  const [ratings, setRatings] = useState<(SubjectiveRating | null)[]>([null, null, null, null]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = useCallback(async () => {
    try {
      setIsGenerating(true);
      const data = await generateQuiz(memoryId);
      // Ensure exactly 4 questions
      if (data.questions && data.questions.length === 4) {
        setQuestions(data.questions);
      } else {
        throw new Error('Invalid number of questions returned from API');
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [memoryId]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const currentQuestion = questions[currentIndex];
  // Guard against undefined question during loading
  const isMultipleChoice = currentQuestion ? currentQuestion.options !== null : false;
  const isLastQuestion = currentIndex === 3;
  const progress = ((currentIndex + 1) / 4) * 100;

  const handleSelectOption = (option: string) => {
    if (isChecked[currentIndex]) return;
    const newSelected = [...selectedOptions];
    newSelected[currentIndex] = option;
    setSelectedOptions(newSelected);
  };

  const handleCheckAnswer = () => {
    const newChecked = [...isChecked];
    newChecked[currentIndex] = true;
    setIsChecked(newChecked);
  };

  const handleSelectRating = (rating: SubjectiveRating) => {
    const newRatings = [...ratings];
    newRatings[currentIndex] = rating;
    setRatings(newRatings);
  };

  const isCorrect = isMultipleChoice && isChecked[currentIndex]
    ? selectedOptions[currentIndex] === currentQuestion?.correct_answer
    : null;

  const canProceed = isMultipleChoice
    ? isChecked[currentIndex]
    : ratings[currentIndex] !== null;

  const calculateScores = () => {
    const getScore = (index: number, q: QuizQuestion) => {
      const isMulti = q.options !== null;
      if (isMulti) {
        return selectedOptions[index] === q.correct_answer ? 1 : 0;
      } else {
        const rating = ratings[index];
        if (q.question_type === 'WHO') {
          return rating === 'perfect' ? 3 : rating === 'similar' ? 1 : 0;
        } else if (q.question_type === 'WHAT') {
          return rating === 'perfect' ? 5 : rating === 'similar' ? 2 : 0;
        }
        return 0; // Fallback
      }
    };

    return {
      score_1: getScore(0, questions[0]),
      score_2: getScore(1, questions[1]),
      score_3: getScore(2, questions[2]),
      score_4: getScore(3, questions[3]),
    };
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      try {
        setIsSubmitting(true);
        const scores = calculateScores();
        const result = await submitQuiz(memoryId, scores);
        onComplete?.(result);
      } catch (error) {
        console.error('Failed to submit quiz:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return {
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
  };
};
