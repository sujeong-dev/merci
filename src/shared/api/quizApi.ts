import { apiClient } from './instance';

export type QuizQuestionType = 'WHEN' | 'WHERE' | 'WHO' | 'WHAT';
export type QuizDifficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface QuizQuestion {
  question_type: QuizQuestionType;
  difficulty: QuizDifficulty;
  question: string;
  options: string[] | null;      // null → 주관식, string[4] → 객관식
  correct_answer: string;
  audio_url?: string | null;     // 생성된 TTS 오디오 파일 URL
}

export interface QuizGenerateResponse {
  memory_id: string;
  questions: QuizQuestion[];     // 4문항: WHEN, WHERE, WHO, WHAT
}

export interface QuizSubmitRequest {
  score_1: number;  // WHERE (0 | 1)
  score_2: number;  // WHO (0 | 1)
  score_3: number;  // WHEN (0 | 1 | 3)
  score_4: number;  // WHAT (0 | 2 | 5)
}

export interface QuizSubmitResponse {
  session_id: string;
  total_score: number;
  score_breakdown: Record<QuizQuestionType, number>;
}

export const generateQuiz = async (memoryId: string): Promise<QuizGenerateResponse> => {
  const response = await apiClient.get<QuizGenerateResponse>(`/memories/${memoryId}/quiz`);
  return response.data;
};

export const submitQuiz = async (
  memoryId: string,
  scores: QuizSubmitRequest
): Promise<QuizSubmitResponse> => {
  const response = await apiClient.post<QuizSubmitResponse>(`/memories/${memoryId}/quiz/submit`, scores);
  return response.data;
};
