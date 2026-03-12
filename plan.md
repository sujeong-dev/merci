# 회상퀴즈 구현 계획

## 구현 범위

회상퀴즈 전체 플로우: API → 상태관리 훅 → 퀴즈 페이지 + 공유 UI 컴포넌트

---

## 1. 파일 구조 (신규 8개 + 수정 5개)

### 신규 파일
```
src/shared/api/quizApi.ts                    # 퀴즈 API 타입 & 함수
src/features/quiz-play/model/useQuizPlay.ts  # 퀴즈 상태관리 훅
src/pages/quiz-play/ui/QuizPlayPage.tsx      # 퀴즈 플레이 페이지
src/shared/ui/QuizOptionButton.tsx           # 객관식 선택지 버튼
app/photo-detail/[id]/quiz/page.tsx          # Next.js 라우트 진입점
```

### 수정 파일
```
src/shared/config/routes.ts                  # quizPlay 라우트 추가
src/shared/api/index.ts                      # quiz API export 추가
src/shared/ui/index.ts                       # QuizOptionButton export
src/pages/photo-detail/ui/PhotoDetailPage.tsx # 버튼 onClick 연결
```

---

## 2. API 레이어: `src/shared/api/quizApi.ts`

### 타입 정의

```typescript
export type QuizQuestionType = 'WHEN' | 'WHERE' | 'WHO' | 'WHAT';
export type QuizDifficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface QuizQuestion {
  question_type: QuizQuestionType;
  difficulty: QuizDifficulty;
  question: string;
  options: string[] | null;      // null → 주관식, string[4] → 객관식
  correct_answer: string;
}

export interface QuizGenerateResponse {
  memory_id: string;
  questions: QuizQuestion[];     // 4문항: WHEN, WHERE, WHO, WHAT
}

export interface QuizSubmitRequest {
  score_1: number;  // WHEN (0 | 1)
  score_2: number;  // WHERE (0 | 1)
  score_3: number;  // WHO (0 | 1 | 3)
  score_4: number;  // WHAT (0 | 2 | 5)
}

export interface QuizSubmitResponse {
  session_id: string;
  total_score: number;
  score_breakdown: Record<QuizQuestionType, number>;
}
```

### API 함수
```typescript
generateQuiz(memoryId: string): Promise<QuizGenerateResponse>
// → GET /memories/{memoryId}/quiz

submitQuiz(memoryId: string, scores: QuizSubmitRequest): Promise<QuizSubmitResponse>
// → POST /memories/{memoryId}/quiz/submit
```

---

## 3. 라우트: `src/shared/config/routes.ts`

```typescript
quizPlay: (id: string) => `/photo-detail/${id}/quiz`,
```

---

## 4. 상태관리 훅: `src/features/quiz-play/model/useQuizPlay.ts`

### 상태
```typescript
{
  questions: QuizQuestion[];           // API 응답
  currentIndex: number;                // 0~3
  selectedOptions: (string | null)[];  // 객관식 선택값
  isChecked: boolean[];                // 객관식 정답확인 여부
  ratings: (SubjectiveRating | null)[]; // 주관식 자기평가
  isGenerating: boolean;
  isSubmitting: boolean;
}

type SubjectiveRating = 'perfect' | 'similar' | 'different';
```

### 핸들러
- `handleGenerate()` — 마운트 시 퀴즈 생성 API 호출
- `handleSelectOption(option)` — 객관식 선택지 클릭
- `handleCheckAnswer()` — "정답 보기" 클릭 → isChecked[i] = true
- `handleSelectRating(rating)` — 주관식 평가 버튼 클릭
- `handleNext()` — "다음 >" or "제출" 클릭
- `handlePrev()` — "< 이전" 클릭

### 파생값
- `currentQuestion` — questions[currentIndex]
- `isMultipleChoice` — currentQuestion.options !== null
- `isCorrect` — 객관식 정답여부
- `canProceed` — 다음 이동 가능 여부 (객관식: isChecked, 주관식: rating 선택됨)
- `isLastQuestion` — currentIndex === 3
- `progress` — (currentIndex + 1) / 4 * 100

### 채점 로직
```
Q1 (WHEN, EASY):   정답=1, 오답=0
Q2 (WHERE, EASY):  정답=1, 오답=0
Q3 (WHO, NORMAL):  완벽=3, 비슷=1, 달라=0
Q4 (WHAT, HARD):   완벽=5, 비슷=2, 달라=0
```

---

## 5. 공유 UI: `src/shared/ui/QuizOptionButton.tsx`

피그마 디자인 분석 결과:

### Props
```typescript
interface QuizOptionButtonProps {
  index: number;          // 1~4 (표시용 번호)
  label: string;          // 선택지 텍스트
  state: 'default' | 'selected' | 'correct' | 'wrong';
  disabled?: boolean;
  onClick?: () => void;
}
```

### 시각 상태 (피그마 기반)
| 상태 | 배경 | 테두리 | 번호 원 | 텍스트 |
|------|------|--------|---------|--------|
| default | 투명 | `#E5E7EB` 1px | `#F3F4F6` 테두리 원, 어두운 번호 | `typography-body-lg` |
| selected | `#F3F4F6` | `#767676` 2px | `#111827` 채움 원, 흰색 번호 | `typography-body-lg-bold` |
| correct | `#E8F5E9` | `#4CAF50` 2px | `#4CAF50` 채움 원, 흰색 번호 + ✓ | `typography-body-lg-bold` |
| wrong (본인선택 오답) | `#F3F4F6` | `#767676` 2px | `#111827` 채움, 흰색 번호 | `typography-body-lg-bold` (selected 유지) |

- 각 옵션: `rounded-[16px]`, `p-5`, row layout
- 번호 원: 24x24, `rounded-full`, 12px Bold 중앙정렬
- 정답 옵션에 체크마크 SVG 아이콘 (오른쪽 끝)

---

## 6. 퀴즈 페이지: `src/pages/quiz-play/ui/QuizPlayPage.tsx`

### 레이아웃 구조

```
div.min-h-dvh.flex.flex-col.bg-bg-base
  PageHeader(title="회상 퀴즈")

  main.flex-1.flex.flex-col.px-5.pt-6.pb-10
    // 로딩: Spinner + "퀴즈를 준비하고 있어요..."

    // 퀴즈 카드 (흰색, rounded-[10px], p-5, gap-8)
      // 상단: 배지 "질문 {n}/4" (bg-[#E5E7EB], rounded-full, px-4 py-1.5)
      //        typography-body-sm-bold, text-[#767676]

      // 질문 텍스트: typography-section-title, text-[#111827]

      // ── 객관식 (options !== null) ──
      // 선택지 4개: QuizOptionButton (gap-3)
      // 피드백 영역 (isChecked 이후):
      //   정답: bg-[#E8F5E9] rounded-[12px] p-4, "잘 하셨어요! 정답이에요!" (#4CAF50)
      //   오답: bg-[#E8F5E9] rounded-[12px] p-4, "아쉽지만 괜찮아요!\n천천히 다시 되짚어보세요!" (#4CAF50)

      // ── 주관식 (options === null) ──
      // 정답 카드: bg-[#F3F4F6] rounded-[10px] p-5
      //   "정답" 라벨 + correct_answer 텍스트
      // 자기평가: "어르신의 대답과 비교해보세요"
      //   3버튼 행: '완벽해요' | '비슷해요' | '달라요'

      // 하단 버튼 행 (3열: flex gap-5)
      //   "< 이전" — Button outlined (첫 문제에서는 숨김)
      //   "정답 보기" — Button gray (객관식 전용, 선택지 고른 후 활성)
      //   "다음 >" / "제출" — Button primary
```

---

## 7. PhotoDetailPage 수정

두 버튼에 `onClick` 추가:
```tsx
onClick={() => router.push(ROUTES.quizPlay(memoryId))}
```

---

## 8. 구현 순서

| 단계 | 파일 | 의존성 |
|------|------|--------|
| 1 | `quizApi.ts` + `api/index.ts` export | 없음 |
| 2 | `routes.ts` 라우트 추가 | 없음 |
| 3 | `QuizOptionButton.tsx` + `ui/index.ts` export | 없음 |
| 4 | `useQuizPlay.ts` 훅 | 1에 의존 |
| 5 | `QuizPlayPage.tsx` 페이지 | 2,3,4에 의존 |
| 6 | `app/.../quiz/page.tsx` 진입점 | 5에 의존 |
| 7 | `PhotoDetailPage.tsx` 버튼 연결 | 2에 의존 |
