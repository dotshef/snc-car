# Data Model: 003-custom-auth

**Date**: 2026-02-07
**Feature**: Supabase Auth 제거 및 커스텀 인증 시스템

## New Entity: users

### Schema

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,  -- bcrypt hash ($2a$10$... 형식)
  nickname   VARCHAR(50)  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT now(),
  updated_at TIMESTAMPTZ  DEFAULT now()
);
```

### Fields

| Field      | Type         | Constraints       | Description             |
|------------|-------------|-------------------|-------------------------|
| id         | SERIAL       | PK, auto-increment | 사용자 고유 ID          |
| username   | VARCHAR(50)  | UNIQUE, NOT NULL  | 로그인용 사용자명       |
| password   | VARCHAR(255) | NOT NULL          | bcrypt 해시된 비밀번호  |
| nickname   | VARCHAR(50)  | NOT NULL          | 표시용 닉네임           |
| created_at | TIMESTAMPTZ  | DEFAULT now()     | 생성 시각               |
| updated_at | TIMESTAMPTZ  | DEFAULT now()     | 수정 시각               |

### Validation Rules

- `username`: 1~50자, 영문 소문자/숫자/언더스코어만 허용, 중복 불가
- `password`: bcrypt 해시 저장 (평문 저장 절대 불가)
- `nickname`: 1~50자

### Relationships

- 다른 테이블과 FK 관계 없음 (독립 엔티티)
- 기존 테이블(manufacturers, sale_cars, released_cars)에 영향 없음

## Session (비 DB 엔티티)

세션은 DB에 저장하지 않고 서명된 쿠키로 관리한다.

### Cookie Structure

| Attribute | Value                              |
|-----------|-------------------------------------|
| Name      | `admin-session`                     |
| Value     | `{user_id}.{username}.{signature}`  |
| HttpOnly  | `true`                              |
| Secure    | `true` (production) / `false` (dev) |
| SameSite  | `Lax`                               |
| Path      | `/admin`                            |
| MaxAge    | `86400` (24시간)                    |

- `signature`: HMAC-SHA256(`{user_id}.{username}`, secret_key)
- 검증: 쿠키의 signature와 재계산한 signature 비교
