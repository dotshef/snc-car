# Auth API Contracts

## POST /api/admin/auth/login

관리자 로그인. username/password 검증 후 세션 쿠키 발급.

### Request

```
Content-Type: application/json

{
  "username": "admin",
  "password": "plain-text-password"
}
```

### Response — 성공 (200)

```
Set-Cookie: admin-session={user_id}.{username}.{signature}; HttpOnly; Secure; SameSite=Lax; Path=/admin; Max-Age=86400

{
  "success": true
}
```

### Response — 실패 (401)

```json
{
  "success": false,
  "error": "아이디 또는 비밀번호가 올바르지 않습니다"
}
```

### Response — 유효성 오류 (400)

```json
{
  "success": false,
  "error": "아이디와 비밀번호를 입력해주세요"
}
```

---

## POST /api/admin/auth/logout

세션 쿠키 삭제.

### Request

```
(No body required)
```

### Response — 성공 (200)

```
Set-Cookie: admin-session=; HttpOnly; Secure; SameSite=Lax; Path=/admin; Max-Age=0

{
  "success": true
}
```

---

## 기존 API 인증 변경

모든 기존 Admin API 엔드포인트의 인증 체크 변경:

### Before (Supabase Auth)

```
Authorization: Bearer <supabase-jwt>
→ supabase.auth.getUser()
```

### After (Cookie Session)

```
Cookie: admin-session={user_id}.{username}.{signature}
→ getSessionUser() 유틸 함수
```

### 미인증 응답 (변경 없음)

```
Status: 401

{
  "error": "Unauthorized"
}
```

---

## 미들웨어 동작

| 경로 | 세션 있음 | 세션 없음 |
|------|----------|----------|
| `/admin/login` | → 302 `/admin` | → 통과 (로그인 페이지 표시) |
| `/admin/*` | → 통과 | → 302 `/admin/login` |
| `/api/admin/*` | → route handler에서 검증 | → route handler에서 401 |
