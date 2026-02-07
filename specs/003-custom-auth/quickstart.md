# Quickstart: 003-custom-auth

## 사전 준비

### 1. 환경변수 설정

`.env` 파일:

```
SUPABASE_URL=https://yzyvgjermgquurfhjgag.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<Supabase Dashboard → Settings → API → service_role key>
SUPABASE_STORAGE_BUCKET=public-media
```

기존 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 제거.

### 2. 의존성 설치

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

`@supabase/ssr` 제거, `@supabase/supabase-js` 추가:

```bash
npm uninstall @supabase/ssr
npm install @supabase/supabase-js
```

### 3. DB 테이블 생성

Supabase SQL Editor에서 실행:

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  nickname   VARCHAR(50)  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT now(),
  updated_at TIMESTAMPTZ  DEFAULT now()
);
```

### 4. 초기 관리자 계정 생성

bcrypt 해시를 생성한 후 SQL로 INSERT:

```bash
# Node.js에서 해시 생성
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('원하는비밀번호', 10).then(h => console.log(h))"
```

```sql
INSERT INTO users (username, password, nickname)
VALUES ('admin', '$2a$10$생성된해시값', '관리자');
```

## 검증

1. `npm run dev`로 개발 서버 실행
2. `/admin` 접근 시 `/admin/login`으로 리다이렉트 확인
3. 생성한 계정으로 로그인
4. 제조사/판매차량/출고차량 CRUD 정상 동작 확인
5. 로그아웃 후 `/admin` 접근 차단 확인
