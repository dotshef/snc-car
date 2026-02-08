# S&C 신차 장기 렌트 리스 Development Guidelines

Auto-generated from all feature plans. **Last updated**: 2026-02-08

## Active Technologies
- TypeScript 5.x + React 18.x, Next.js 14.x (App Router), TailwindCSS (1-snc-landing)
- Mock data (추후 Supabase 연동 대비 구조) (1-snc-landing)
- TypeScript 5.x, React 19.x, Next.js 16.x (App Router) + `@supabase/ssr` (Supabase 클라이언트), TailwindCSS v4 (002-admin-cms)
- Supabase Postgres (DB) + Supabase Storage (이미지, public bucket: `public-media`) (002-admin-cms)
- TypeScript 5.x, React 19.x, Next.js 16.x (App Router) + `@supabase/supabase-js` (DB/Storage), `bcryptjs` (비밀번호 해싱), TailwindCSS v4 (003-custom-auth)
- Supabase Postgres (DB) + Supabase Storage (이미지) (003-custom-auth)
- TypeScript 5.x, React 19.x, Next.js 16.x (App Router) + `@supabase/supabase-js` ^2.95.3, `bcryptjs` ^3.0.3, TailwindCSS v4 (005-admin-refactor)
- Supabase Postgres (DB) + Supabase Storage (`public-media` bucket) (005-admin-refactor)
- TypeScript 5.x, React 19.x, Next.js 16.x (App Router) + `@supabase/supabase-js` ^2.95.3, TailwindCSS v4 (006-main-page-db)

- TypeScript 5.x, React 18.x + Next.js 14.x (App Router), TailwindCSS (1-snc-landing)

## Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   ├── sections/
│   └── modals/
├── data/
│   ├── services/
│   └── mocks/
├── types/
├── utils/
└── hooks/

tests/
├── unit/
└── integration/

public/
└── images/
```

## Commands

```bash
npm run dev       # 개발 서버 실행
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 실행
npm run lint      # ESLint 실행
npm run test      # Jest 테스트 실행
```

## Code Style

TypeScript + React:
- 컴포넌트는 함수형 컴포넌트 사용
- Props 타입은 interface로 정의
- enum은 대문자 snake_case 값 사용 (SaleCarBadge)
- 파일명: PascalCase (컴포넌트), camelCase (유틸, 훅)

TailwindCSS:
- 커스텀 컬러: `snc-gray-*`, `snc-navy`, `snc-navy-light`, `snc-navy-dark`
- 반응형: `md:` (768px+), `lg:` (1024px+)

## Recent Changes
- 006-main-page-db: Added TypeScript 5.x, React 19.x, Next.js 16.x (App Router) + `@supabase/supabase-js` ^2.95.3, TailwindCSS v4
- 005-admin-refactor: Added TypeScript 5.x, React 19.x, Next.js 16.x (App Router) + `@supabase/supabase-js` ^2.95.3, `bcryptjs` ^3.0.3, TailwindCSS v4
- 003-custom-auth: Added TypeScript 5.x, React 19.x, Next.js 16.x (App Router) + `@supabase/supabase-js` (DB/Storage), `bcryptjs` (비밀번호 해싱), TailwindCSS v4


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
