# Tasks: Supabase Auth 제거 및 커스텀 인증 시스템

**Input**: Design documents from `/specs/003-custom-auth/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: 테스트 미요청. 수동 테스트로 검증.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (Next.js App Router)**: `src/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 의존성 변경 및 환경변수 설정

- [x] T001 Update `.env` — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `NEXT_PUBLIC_SUPABASE_URL` 설정
- [x] T002 Run `npm uninstall @supabase/ssr && npm install @supabase/supabase-js` to swap Supabase client library
- [x] T003 Run `npm install bcryptjs && npm install -D @types/bcryptjs` to add password hashing dependency

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Supabase 서버 클라이언트 교체 + 세션 유틸 + 타입 정의. 모든 User Story의 전제 조건.

- [x] T004 Rewrite Supabase server client in `src/lib/supabase/server.ts`
- [x] T005 Update `src/lib/supabase/storage.ts` — `NEXT_PUBLIC_SUPABASE_URL` 사용으로 변경
- [x] T006 Delete `src/lib/supabase/client.ts` (브라우저 클라이언트 삭제)
- [x] T007 Delete `src/lib/supabase/middleware.ts` (Supabase Auth 세션 갱신 로직 삭제)
- [x] T008 Add `UserRow` interface to `src/types/admin.ts`
- [x] T009 Create session utility in `src/lib/auth/session.ts`

---

## Phase 3: User Story 4 - Supabase 서버 전용 클라이언트 전환 (Priority: P1)

- [x] T010 [P] [US4] Update auth check in `src/app/api/admin/manufacturers/route.ts`
- [x] T011 [P] [US4] Update auth check in `src/app/api/admin/manufacturers/[id]/route.ts`
- [x] T012 [P] [US4] Update auth check in `src/app/api/admin/sale-cars/route.ts`
- [x] T013 [P] [US4] Update auth check in `src/app/api/admin/sale-cars/[id]/route.ts`
- [x] T014 [P] [US4] Update auth check in `src/app/api/admin/released-cars/route.ts`
- [x] T015 [P] [US4] Update auth check in `src/app/api/admin/released-cars/[id]/route.ts`
- [x] T016 [P] [US4] Update `src/components/admin/ManufacturerList.tsx` — API fetch로 변경
- [x] T017 [P] [US4] Update `src/components/admin/SaleCarForm.tsx` — API fetch로 변경
- [x] T018 [P] [US4] Update `src/components/admin/SaleCarList.tsx` — API fetch로 변경
- [x] T019 [P] [US4] Update `src/components/admin/ReleasedCarForm.tsx` — 변경 불필요 (createClient 미사용)
- [x] T020 [P] [US4] Update `src/components/admin/ReleasedCarList.tsx` — API fetch로 변경

---

## Phase 4: User Story 1 - 관리자 로그인 (Priority: P1)

- [x] T021 [US1] Create login API endpoint in `src/app/api/admin/auth/login/route.ts`
- [x] T022 [US1] Rewrite `src/components/admin/LoginForm.tsx` — fetch 기반으로 변경

---

## Phase 5: User Story 2 - 비인증 사용자 접근 차단 (Priority: P1)

- [x] T023 [US2] Rewrite `src/middleware.ts` — 쿠키 기반 세션 체크로 재작성

---

## Phase 6: User Story 3 - 관리자 로그아웃 (Priority: P2)

- [x] T024 [US3] Create logout API endpoint in `src/app/api/admin/auth/logout/route.ts`
- [x] T025 [US3] Add logout button to Admin dashboard in `src/app/admin/page.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T026 [P] Update `reference/ddl.md` — users 테이블 DDL 추가
- [x] T027 Run `npm run build` to verify no build errors after all changes
- [ ] T028 Run quickstart.md validation — 수동 테스트 필요 (로그인 → CRUD → 로그아웃 → 접근 차단)
