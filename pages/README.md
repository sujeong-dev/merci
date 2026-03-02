# FSD pages 레이어

> ⚠️ 이 폴더는 **Next.js Pages Router가 아닙니다.**

## 역할

FSD(Feature-Sliced Design)의 **pages 레이어**입니다.
라우트 단위의 UI 조립을 담당하며, `app/` 라우트에서 렌더링됩니다.

## 구조

```
pages/
└── [page-name]/
    └── ui/
        └── [PageName]Page.tsx   # 페이지 루트 컴포넌트
```

## 규칙

- `widgets`, `features`, `entities`, `shared` 레이어를 조합해 페이지를 구성합니다.
- 페이지 자체의 비즈니스 로직은 최소화하고, 하위 레이어에 위임합니다.
- `app/[route]/page.tsx`는 Next.js 라우팅 진입점 역할만 하며, 실제 UI는 이 레이어에 위치합니다.
