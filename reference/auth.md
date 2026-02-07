# 인증 시스템 변경: Supabase Auth 제거 → 커스텀 인증

## 목표

Supabase Auth를 완전히 제거하고, 커스텀 `users` 테이블 기반 자체 인증으로 교체한다.
Supabase는 **서버 사이드 DB + Storage 엔진**으로만 사용한다.

## Supabase 클라이언트 변경

### 환경변수

```
# 기존 (제거)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 신규 (서버 전용)
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=public-media
```

- `NEXT_PUBLIC_` 접두사 제거 → 클라이언트에 키 노출 차단
- Service Role Key 사용 → RLS 우회, 서버에서만 사용

### Supabase 클라이언트 구조

- `src/lib/supabase/client.ts` (브라우저 클라이언트) → **삭제**
- `src/lib/supabase/server.ts` → Service Role Key 기반 서버 전용 클라이언트로 교체
  - `createClient()` from `@supabase/supabase-js` 사용 (SSR 쿠키 핸들링 불필요)
  - 쿠키 관련 로직 전부 제거
- `src/lib/supabase/middleware.ts` → **삭제** (Supabase Auth 세션 갱신 로직)
- `src/lib/supabase/storage.ts` → 유지 (이미지 URL 생성)

## DDL

```sql
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,  -- bcrypt hash
  nickname   VARCHAR(50)  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT now(),
  updated_at TIMESTAMPTZ  DEFAULT now()
);
```

## 인증 구현

### 비밀번호

- `bcryptjs`로 해싱 (Edge Runtime 호환)

### 세션 (쿠키 기반)

- 쿠키 이름: `admin-session`
- HttpOnly, Secure(production), SameSite=Lax, Path=/admin
- 만료: 24시간

### API 엔드포인트

- `POST /api/admin/auth/login` — username/password 검증 → 세션 쿠키 설정
- `POST /api/admin/auth/logout` — 세션 쿠키 삭제

### 미들웨어 (`src/middleware.ts`)

- `/admin/login` — 세션 있으면 `/admin`으로 리다이렉트
- `/admin/*` — 세션 없으면 `/admin/login`으로 리다이렉트

### API route 인증

- 기존 `supabase.auth.getUser()` 전부 제거
- 쿠키 기반 세션 검증 유틸 함수로 대체: `getSessionUser(): Promise<UserRow | null>`

### LoginForm

- `supabase.auth.signInWithPassword()` 제거
- `/api/admin/auth/login`에 `fetch POST`로 변경

## 제거 대상 요약

| 파일 | 조치 |
|------|------|
| `src/lib/supabase/client.ts` | 삭제 |
| `src/lib/supabase/middleware.ts` | 삭제 |
| `src/lib/supabase/server.ts` | Service Role Key 전용으로 재작성 |
| `src/components/admin/LoginForm.tsx` | fetch 기반으로 수정 |
| `src/middleware.ts` | 쿠키 기반 세션 체크로 재작성 |
| 모든 API route의 `auth.getUser()` | `getSessionUser()` 유틸로 교체 |
| `.env` | `NEXT_PUBLIC_*` 제거, `SUPABASE_SERVICE_ROLE_KEY` 추가 |

## 제약 사항

- 역할(role) 구분 없음 — 단일 관리자
- 회원가입 UI 없음 — 사용자는 DB 직접 INSERT 또는 시드 스크립트로 생성
- 비밀번호는 반드시 bcrypt 해싱 저장
