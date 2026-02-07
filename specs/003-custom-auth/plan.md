# Implementation Plan: Supabase Auth 제거 및 커스텀 인증 시스템

**Branch**: `003-custom-auth` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-custom-auth/spec.md`

## Summary

Supabase Auth를 완전히 제거하고, Supabase Postgres에 `users` 테이블을 생성하여 커스텀 인증 시스템으로 교체한다. Supabase 접근은 Service Role Key 기반 서버 전용 클라이언트로 통합하며, 세션은 서명된 HttpOnly 쿠키로 관리한다. 기존 Admin CRUD 기능은 변경 없이 유지한다.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x, Next.js 16.x (App Router)
**Primary Dependencies**: `@supabase/supabase-js` (DB/Storage), `bcryptjs` (비밀번호 해싱), TailwindCSS v4
**Storage**: Supabase Postgres (DB) + Supabase Storage (이미지)
**Testing**: 수동 테스트 (기존 프로젝트 패턴 유지)
**Target Platform**: Web (Admin CMS)
**Project Type**: Web application (Next.js fullstack)
**Performance Goals**: 로그인 5초 이내 완료
**Constraints**: Service Role Key 클라이언트 미노출, 비밀번호 bcrypt 해싱 필수
**Scale/Scope**: 단일 관리자, 단일 역할

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution이 기본 템플릿 상태(미설정)이므로 프로젝트별 gate 없음. 통과.

## Project Structure

### Documentation (this feature)

```text
specs/003-custom-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-api.md      # Auth API contracts
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # 유지
│   │   ├── page.tsx                # 유지
│   │   └── login/
│   │       └── page.tsx            # 유지
│   └── api/admin/
│       ├── auth/
│       │   ├── login/route.ts      # 신규: 로그인 API
│       │   └── logout/route.ts     # 신규: 로그아웃 API
│       ├── manufacturers/
│       │   ├── route.ts            # 수정: 인증 체크 변경
│       │   └── [id]/route.ts       # 수정: 인증 체크 변경
│       ├── sale-cars/
│       │   ├── route.ts            # 수정: 인증 체크 변경
│       │   └── [id]/route.ts       # 수정: 인증 체크 변경
│       └── released-cars/
│           ├── route.ts            # 수정: 인증 체크 변경
│           └── [id]/route.ts       # 수정: 인증 체크 변경
├── components/admin/
│   ├── LoginForm.tsx               # 수정: fetch 기반으로 변경
│   ├── ManufacturerList.tsx        # 수정: API fetch로 변경
│   ├── SaleCarForm.tsx             # 수정: API fetch로 변경
│   ├── SaleCarList.tsx             # 수정: API fetch로 변경
│   ├── ReleasedCarForm.tsx         # 수정: API fetch로 변경
│   └── ReleasedCarList.tsx         # 수정: API fetch로 변경
├── lib/
│   ├── auth/
│   │   └── session.ts              # 신규: 세션 생성/검증 유틸
│   └── supabase/
│       ├── client.ts               # 삭제
│       ├── middleware.ts           # 삭제
│       ├── server.ts               # 재작성: Service Role Key 기반
│       └── storage.ts              # 수정: 환경변수명 변경
├── middleware.ts                    # 재작성: 쿠키 기반 세션 체크
└── types/
    └── admin.ts                    # 수정: UserRow 타입 추가
```

**Structure Decision**: 기존 Next.js App Router 구조를 유지. `src/lib/auth/` 디렉토리를 추가하여 인증 관련 유틸을 분리.

## Complexity Tracking

해당 없음. Constitution 위반 사항 없음.
