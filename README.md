# 마씨 (Merci) — 치매 예방을 위한 가족 추억 앨범

> 어르신의 인지 건강을 위해, 가족이 함께 추억을 기록하고 회상 퀴즈를 통해 기억력을 관리하는 모바일 웹 서비스입니다.

## 📖 프로젝트 소개

**마씨(Merci)** 는 치매 예방 및 인지 훈련을 목적으로 한 **가족 추억 앨범** 서비스입니다.  
가족 구성원이 어르신과의 추억을 사진·음성과 함께 기록하고, AI 기반 **회상 퀴즈**를 통해 어르신의 기억력 상태를 추적할 수 있습니다.

### 핵심 기능

| 기능 | 설명 |
|------|------|
| 🏠 **가족 그룹** | 초대 코드를 통해 가족 구성원이 하나의 그룹에 모여 추억을 공유합니다. |
| 📸 **추억 등록/수정** | 최대 10장의 사진과 음성 녹음을 포함한 추억을 등록·수정·삭제할 수 있습니다. |
| 🧠 **회상 퀴즈** | 등록된 추억을 기반으로 AI가 자동 생성한 4문항 퀴즈로 어르신의 기억력을 측정합니다. |
| 🏷️ **카테고리 필터** | 인물, 여행, 가족, 일상, 행사/기념일 등의 카테고리로 추억을 분류 및 필터링합니다. |
| 💬 **댓글** | 가족 구성원 간 추억에 대한 이야기를 나눌 수 있습니다. |
| 🔊 **음성 녹음 & TTS** | 추억에 어르신의 목소리를 녹음하거나, 퀴즈 질문을 음성으로 들을 수 있습니다. |

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4 |
| **State** | Zustand 5 (클라이언트 전역 상태) |
| **HTTP** | Axios (인터셉터 기반 인증/갱신) |
| **Storage** | Cloudflare R2 (Presigned URL 업로드) |
| **Auth** | OAuth 2.0 (카카오, 네이버) + JWT (Access/Refresh) |
| **Deploy** | Render.com (백엔드), Vercel (프론트엔드) |

---

## 🏗️ 아키텍처

### Feature-Sliced Design (FSD)

프로젝트는 **Feature-Sliced Design** 패턴을 기반으로 구성되어 있습니다.  
각 레이어는 명확한 책임을 가지며, 상위 레이어만 하위 레이어를 참조할 수 있습니다.

```
src/
├── pages/          # 페이지별 UI 컴포넌트 (라우트 단위)
│   ├── home/
│   ├── photo-list/
│   ├── photo-detail/
│   ├── photo-upload/
│   ├── photo-edit/
│   ├── settings/
│   ├── create-group/
│   ├── auth-kakao-callback/
│   ├── auth-naver-callback/
│   └── landing/
│
├── features/       # 비즈니스 로직 (도메인별 훅·모델)
│   ├── auth/              # 인증 상태 관리 (Zustand store)
│   ├── photo-upload/      # 사진 업로드 로직 (usePhotoUpload)
│   ├── memory-edit/       # 추억 수정 로직 (useMemoryEdit)
│   ├── memory-delete/     # 추억 삭제 확인 모달
│   ├── quiz-play/         # 퀴즈 플레이 로직 (useQuizPlay)
│   ├── create-group/      # 그룹 생성 로직
│   └── server-wake/       # 서버 웨이크업 체크
│
├── shared/         # 공통 모듈 (모든 레이어에서 참조 가능)
│   ├── api/               # API 클라이언트 & 도메인별 API 함수
│   │   ├── instance.ts    # Axios 인스턴스 (인터셉터, 토큰 갱신)
│   │   ├── memoryApi.ts   # 추억 CRUD, 카테고리 조회
│   │   ├── groupApi.ts    # 그룹 생성/참여/조회
│   │   ├── quizApi.ts     # 퀴즈 생성/제출
│   │   ├── commentApi.ts  # 댓글 CRUD
│   │   ├── recallApi.ts   # 회상 기록 조회/등록
│   │   └── userApi.ts     # 유저 프로필 조회
│   ├── ui/                # 공통 UI 컴포넌트 (20+)
│   ├── config/            # 라우트 상수
│   └── lib/               # 유틸 함수 & 커스텀 훅 (useTTS 등)
│
├── widgets/        # 조합형 위젯 컴포넌트
│   └── server-wake-guard/ # 서버 상태 체크 위젯
│
app/                # Next.js App Router 라우트 정의
├── layout.tsx      # 루트 레이아웃 (폰트, 전역 CSS)
├── page.tsx        # 랜딩 페이지 진입점
├── globals.css     # Tailwind CSS + 디자인 토큰
└── design-tokens.css  # 피그마 기반 디자인 토큰
```

### 인증 흐름

```
┌──────────────┐     OAuth Code     ┌──────────────┐     JWT     ┌──────────────┐
│   카카오/네이버  │ ───────────────> │   백엔드 API   │ ────────> │  Zustand Store │
│   OAuth 2.0   │                  │ /auth/login   │            │ accessToken   │
└──────────────┘                  └──────────────┘            │ refreshToken  │
                                                               └──────────────┘
                                                                      │
                                                                      ▼
                                                              Axios 인터셉터
                                                         (자동 헤더 첨부 & 401 갱신)
```

### 이미지 업로드 흐름

```
1. POST /uploads/presigned-url  →  upload_url + object_key 발급
2. PUT {upload_url}             →  Cloudflare R2에 직접 업로드 (서버 미경유)
3. POST /memories               →  object_key 전달하여 추억 등록
```

---

## 📁 주요 공통 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `Button` | 다양한 variant와 size를 지원하는 범용 버튼 |
| `Input` | 라벨과 에러 메시지를 포함하는 입력 필드 |
| `PageHeader` | 뒤로가기 버튼과 제목을 가진 페이지 헤더 |
| `ModalSheet` | 하단에서 올라오는 바텀시트 |
| `YearSelectSheet` | 10년 단위 탐색이 가능한 연도 선택 시트 |
| `AuthorSelectSheet` | 작성자 필터 바텀시트 |
| `CategorySelectSheet` | 카테고리 필터 바텀시트 |
| `FilterButton` | 필터 트리거 버튼 공통 컴포넌트 |
| `QuizOptionButton` | 퀴즈 선택지 버튼 |
| `Spinner` | 로딩 스피너 |
| `CommentInput` | 댓글 입력 컴포넌트 |

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 9+

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 환경 변수

`.env` 파일에 아래 환경 변수를 설정합니다:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
```

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트이며, 비공개 저장소로 관리됩니다.
