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

### 라우트 상수

모든 페이지 경로는 `src/shared/config/routes.ts`의 `ROUTES` 객체에서 관리합니다.
경로 문자열을 하드코딩하지 말고 반드시 `ROUTES` 상수를 사용하세요.

```ts
import { ROUTES } from '@/shared/config/routes';

// ✅ 상수 사용
<Link href={ROUTES.home} />
router.push(ROUTES.createGroup);

// ❌ 경로 하드코딩 금지
<Link href="/home" />
router.push('/create-group');
```

새 페이지 추가 시 `routes.ts`에 항목을 먼저 추가한 뒤 사용합니다.

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

---

### 컴포넌트 분리 지침 ⚠️

마크업 작업 중 **반복되는 구조**가 발견되면 FSD 레이어 기준에 맞게 컴포넌트로 즉시 분리합니다.

#### 분리 기준 판단 흐름

```
반복 구조 발견
    │
    ├─ 도메인 지식 없는 순수 UI?
    │       └─ YES → shared/ui/
    │
    ├─ 특정 도메인 데이터를 표시 (읽기 전용)?
    │       └─ YES → entities/[domain]/ui/
    │
    ├─ 사용자 액션이 포함된 단일 기능?
    │       └─ YES → features/[feature]/ui/
    │
    └─ 여러 feature/entity 조합?
            └─ YES → widgets/[widget]/ui/
```

#### shared/ui/ 컴포넌트 위치 규칙

| 종류 | 위치 | 예시 |
|------|------|------|
| 아이콘 SVG | `shared/ui/icons/[Name]Icon.tsx` | `ChevronRightIcon`, `PlusIcon` |
| 기본 UI 컴포넌트 | `shared/ui/[Name].tsx` | `Button`, `CardButton`, `Tab` |

**아이콘 규칙:**
- 파일명: `[Name]Icon.tsx` (PascalCase + Icon 접미사)
- Props 인터페이스: `size?: number`, `className?: string`
- 색상: `fill="currentColor"` 또는 `stroke="currentColor"` — className으로 색 제어
- 비정방형 아이콘: viewBox 비율에 맞게 `width`/`height` 계산 (e.g. 8:12 = `size * 8/12`)
- `icons/index.ts`에 반드시 export 추가
- 새 아이콘 추가 시 기존 아이콘 패턴 확인 후 일관성 유지

**컴포넌트 규칙:**
- 인라인 SVG가 2곳 이상 사용되면 `shared/ui/icons/`로 분리
- 동일 JSX 구조가 2곳 이상이면 컴포넌트로 추출
- `shared/ui/index.ts`에 반드시 export 추가 (named export)

#### 분리 예시

```tsx
// ❌ 인라인 SVG를 여러 곳에서 직접 사용
<svg width="8" height="12" viewBox="0 0 8 12">
  <path d="M4.6 6L0 1.4..." fill="#D1D5DB" />
</svg>

// ✅ shared/ui/icons/ChevronRightIcon.tsx 로 분리 후 사용
import { ChevronRightIcon } from '@/shared/ui/icons';
<ChevronRightIcon className="text-[#D1D5DB]" />
```

```tsx
// ❌ 동일 카드 버튼 구조 반복
<button className="flex w-full items-center gap-4 ...">
  <Image src="/icon-a.svg" ... />
  <div><span>타이틀 A</span><span>설명 A</span></div>
  <ChevronRightIcon />
</button>
<button className="flex w-full items-center gap-4 ...">
  <Image src="/icon-b.svg" ... />
  <div><span>타이틀 B</span><span>설명 B</span></div>
  <ChevronRightIcon />
</button>

// ✅ shared/ui/CardButton.tsx 로 분리 후 사용
import { CardButton } from '@/shared/ui';
<CardButton icon={<Image src="/icon-a.svg" ... />} title="타이틀 A" subtitle="설명 A" />
<CardButton icon={<Image src="/icon-b.svg" ... />} title="타이틀 B" subtitle="설명 B" />
```
