# Research: 003-custom-auth

**Date**: 2026-02-07
**Feature**: Supabase Auth 제거 및 커스텀 인증 시스템

## Decision 1: Supabase 클라이언트 라이브러리

- **Decision**: `@supabase/supabase-js` (createClient) 사용, `@supabase/ssr` 제거
- **Rationale**: Service Role Key 기반 서버 전용 클라이언트는 쿠키/세션 핸들링이 불필요. `createClient`로 단순 생성하면 충분하다. `@supabase/ssr`은 Supabase Auth의 세션 관리를 위한 래퍼이므로 커스텀 인증에서는 불필요.
- **Alternatives considered**:
  - `@supabase/ssr` 유지: Auth 관련 코드가 대부분이라 불필요한 의존성
  - 직접 REST API 호출: Supabase JS SDK가 제공하는 타입 안전성과 편의성 상실

## Decision 2: 비밀번호 해싱 라이브러리

- **Decision**: `bcryptjs` 사용
- **Rationale**: 순수 JavaScript 구현으로 Edge Runtime, Node.js 모두 호환. Next.js의 Middleware와 API Route에서 모두 동작. `bcrypt` (native binding)은 Edge Runtime에서 사용 불가.
- **Alternatives considered**:
  - `bcrypt` (native): Edge Runtime 미지원, 빌드 시 native addon 필요
  - `argon2`: 더 강력하지만 native binding 필요, Edge Runtime 미지원
  - `scrypt` (Node.js built-in): Edge Runtime 미지원

## Decision 3: 세션 관리 방식

- **Decision**: 쿠키 기반 단순 세션 (서명된 값)
- **Rationale**: 단일 관리자 용도로 JWT 같은 복잡한 토큰 시스템은 과도함. `user_id:username`을 HMAC-SHA256으로 서명하여 쿠키에 저장하면 위변조 방지와 단순성을 모두 확보.
- **Alternatives considered**:
  - JWT: 단일 관리자 환경에서는 과도한 복잡성. 토큰 크기도 큼
  - DB 세션 테이블: 불필요한 DB 조회 추가. 단일 관리자라 세션 관리 테이블까지는 불필요
  - UUID 세션 + DB 저장: 세션 조회마다 DB 호출 필요

## Decision 4: 클라이언트 컴포넌트의 데이터 패칭

- **Decision**: 기존 직접 Supabase 호출을 API 엔드포인트 fetch로 변경
- **Rationale**: Service Role Key는 서버에서만 사용해야 하므로, 클라이언트 컴포넌트에서 직접 Supabase를 호출할 수 없음. 기존 API route가 이미 동일한 데이터를 반환하므로 이를 재사용.
- **Alternatives considered**:
  - Server Component로 전환: 기존 코드 구조 변경이 크고, 상태 관리가 필요한 컴포넌트들이라 적합하지 않음

## Decision 5: storage.ts 환경변수 변경

- **Decision**: `NEXT_PUBLIC_SUPABASE_URL` → `SUPABASE_URL`로 변경
- **Rationale**: `storage.ts`의 `getPublicImageUrl()`은 서버 사이드에서만 호출됨 (API route 내에서 DB 저장 경로로부터 public URL 생성). NEXT_PUBLIC 접두사 불필요.
- **Alternatives considered**: 없음. 단순 환경변수명 변경.
