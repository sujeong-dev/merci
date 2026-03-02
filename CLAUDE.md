# 마씨 (Merci) 프로젝트 가이드

> 이 파일은 Claude가 세션 시작 시 자동으로 읽습니다.
> 새 마크업 작업 전 반드시 이 파일과 `src/shared/ui/` 폴더를 확인하세요.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 폰트 | Pretendard Variable (jsDelivr CDN) |

---

## 디자인 토큰

피그마 토큰은 Tokens Studio로 관리하며, `tokens/tokens.json`에 저장됩니다.

```bash
pnpm tokens   # tokens/tokens.json → app/design-tokens.css 재생성
```

| 파일 | 역할 |
|------|------|
| `tokens/tokens.json` | 피그마 원본 (Tokens Studio export) |
| `scripts/generate-tokens.mjs` | 변환 스크립트 |
| `app/design-tokens.css` | 자동생성 CSS 변수 (`--dt-` 접두사) — 직접 수정 금지 |
| `app/globals.css` | Tailwind `@theme` 매핑 + `@utility` 타이포그래피 |

### CSS 변수 네이밍

- `--dt-color-text-primary` → Tailwind: `text-text-primary`
- `--dt-color-bg-surface` → Tailwind: `bg-bg-surface`
- `--dt-color-border-default` → Tailwind: `border-border-default`
- `typography-*` → 피그마 타이포그래피 composite 유틸리티

### cn() 헬퍼

```ts
import { cn } from '@/shared/lib/utils';
```

---

## 아키텍처: FSD (Feature-Sliced Design)

레이어 의존 방향: `app → pages → widgets → features → entities → shared`
상위 레이어만 하위 레이어를 참조할 수 있습니다. 역방향 참조 금지.

> **Next.js App Router + FSD 폴더 구조 안내**
> - `app/`은 Next.js App Router 전용으로 루트에 위치합니다. (Next.js 요구사항)
> - FSD 레이어(shared, entities, features, widgets)는 `src/` 하위에 위치합니다.
> - FSD **pages 레이어**는 `src/pages/` 에 위치합니다. Next.js Pages Router가 아닙니다.
> - `tsconfig.json`의 `@/*`는 `./src/*`로 설정되어 있습니다. (`@/shared/ui/...` → `src/shared/ui/...`)

```
merci/
├── app/              # Next.js App Router (루트 고정, 라우팅 진입점만)
│   ├── page.tsx           # → src/pages/landing/ui/LandingPage.tsx import
│   ├── [route]/page.tsx   # → src/pages/[route]/ui/[Route]Page.tsx import
│   ├── layout.tsx
│   ├── globals.css
│   └── design-tokens.css   # 자동생성, 수정 금지
│
├── src/              # FSD 레이어 루트 (@/* alias 기준)
│   ├── pages/        # FSD pages 레이어 (실제 페이지 마크업 위치)
│   │   └── [page-name]/
│   │       └── ui/
│   │           └── [PageName]Page.tsx
│   │
│   ├── shared/
│   │   ├── ui/       # 디자인 시스템 기본 단위 컴포넌트
│   │   └── lib/      # 유틸리티 (utils.ts 등)
│   │
│   ├── entities/     # 도메인 객체 (user, group, album 등)
│   │   └── [entity-name]/
│   │       ├── ui/   # 읽기 전용 표현 컴포넌트
│   │       └── model/ # 순수 비즈니스 로직 + 타입
│   │
│   ├── features/     # 단일 사용자 액션 단위 (로그인, 그룹생성 등)
│   │   └── [feature-name]/
│   │       ├── ui/
│   │       ├── model/
│   │       └── api/
│   │
│   └── widgets/      # 여러 feature/entity를 조합한 독립 UI 블록
│       └── [widget-name]/
│           └── ui/
│
├── tokens/           # 피그마 디자인 토큰 원본
│   └── tokens.json
│
├── scripts/          # 빌드/코드젠 스크립트
│   └── generate-tokens.mjs
│
└── public/           # 정적 파일
```

### 페이지 마크업 규칙 ⚠️

**실제 페이지 마크업은 반드시 `src/pages/`에 위치해야 합니다.**

`app/` 디렉토리의 `page.tsx`는 라우팅 진입점 역할만 하며, `src/pages/`의 페이지 컴포넌트를 import하여 렌더링합니다.

```tsx
// ✅ app/page.tsx (진입점만)
import { LandingPage } from '@/pages/landing/ui/LandingPage';
export default function Page() {
  return <LandingPage />;
}

// ✅ src/pages/landing/ui/LandingPage.tsx (실제 마크업)
export function LandingPage() {
  return <main>...</main>;
}

// ❌ app/page.tsx에 직접 마크업 금지
```

**파일 경로 규칙:**
- 페이지 컴포넌트: `src/pages/[페이지명]/ui/[페이지명]Page.tsx`
- Next.js 진입점: `app/[라우트]/page.tsx` → import만 함

---

### 레이어별 핵심 규칙

**`shared/ui/`** (현재 활성)
- ✅ 이벤트 핸들러 props 수신 가능
- ✅ 스타일 props 수신 가능
- ✅ 도메인 지식 없는 순수 UI만

**`entities/`**
- ✅ 순수 함수만 (같은 입력 = 같은 출력)
- ❌ 사이드이펙트, 상태관리 금지

**`features/`**
- ✅ 단일 사용자 액션
- ✅ 비즈니스 로직은 훅으로 분리
- ❌ 이벤트 핸들러를 props로 받지 않음
