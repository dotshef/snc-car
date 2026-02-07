# Feature Specification: Supabase Auth 제거 및 커스텀 인증 시스템

**Feature Branch**: `003-custom-auth`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "프로젝트의 reference/auth.md 에 따라서 supabase는 service role key 사용하는 방식으로 변경할 것이다. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 가 주어진다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 관리자 로그인 (Priority: P1)

관리자가 Admin CMS에 접근하기 위해 사용자명(username)과 비밀번호(password)를 입력하여 로그인한다. 로그인에 성공하면 Admin 대시보드로 진입하고, 실패하면 오류 메시지를 확인한다.

**Why this priority**: 인증이 되지 않으면 Admin CMS의 어떤 기능도 사용할 수 없으므로 가장 핵심적인 기능이다.

**Independent Test**: 로그인 페이지에서 올바른 자격 증명을 입력하여 Admin 대시보드에 접근할 수 있는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 등록된 관리자 계정이 존재하고 로그인 페이지에 접속한 상태, **When** 올바른 username과 password를 입력하고 로그인 버튼을 클릭, **Then** Admin 대시보드(`/admin`)로 이동한다
2. **Given** 로그인 페이지에 접속한 상태, **When** 잘못된 username 또는 password를 입력하고 로그인 버튼을 클릭, **Then** "아이디 또는 비밀번호가 올바르지 않습니다" 오류 메시지를 표시한다
3. **Given** 로그인 페이지에 접속한 상태, **When** username 또는 password를 비워둔 채 로그인 버튼을 클릭, **Then** 필수 입력 항목임을 안내한다

---

### User Story 2 - 비인증 사용자 접근 차단 (Priority: P1)

로그인하지 않은 사용자가 Admin 페이지(`/admin/*`)에 접근하면 자동으로 로그인 페이지로 리다이렉트된다. 이미 로그인된 사용자가 로그인 페이지에 접근하면 Admin 대시보드로 리다이렉트된다.

**Why this priority**: 인증되지 않은 사용자의 관리 기능 접근을 차단하는 것은 보안의 기본이므로 P1이다.

**Independent Test**: 세션 쿠키 없이 `/admin` URL에 직접 접근하여 로그인 페이지로 리다이렉트되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 로그인하지 않은 상태, **When** `/admin` 또는 `/admin` 하위 경로에 접근, **Then** `/admin/login`으로 리다이렉트된다
2. **Given** 이미 로그인한 상태, **When** `/admin/login`에 접근, **Then** `/admin`으로 리다이렉트된다
3. **Given** 로그인하지 않은 상태, **When** Admin API 엔드포인트를 직접 호출, **Then** 401 Unauthorized 응답을 받는다

---

### User Story 3 - 관리자 로그아웃 (Priority: P2)

로그인된 관리자가 로그아웃 버튼을 클릭하면 세션이 종료되고 로그인 페이지로 이동한다.

**Why this priority**: 로그인 이후 세션 종료 기능은 보안상 필요하지만, 로그인 자체보다는 후순위이다.

**Independent Test**: 로그인 상태에서 로그아웃 후 Admin 페이지에 접근이 차단되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 로그인한 상태에서 Admin 대시보드에 있을 때, **When** 로그아웃 버튼을 클릭, **Then** 세션 쿠키가 삭제되고 `/admin/login`으로 이동한다
2. **Given** 로그아웃한 직후, **When** 브라우저 뒤로가기로 Admin 페이지에 접근, **Then** `/admin/login`으로 리다이렉트된다

---

### User Story 4 - Supabase 서버 전용 클라이언트 전환 (Priority: P1)

기존에 브라우저 클라이언트와 서버 클라이언트를 분리하여 사용하던 Supabase 접근 방식을, Service Role Key를 사용하는 서버 전용 클라이언트 하나로 통합한다. 모든 DB 및 Storage 작업은 API route(서버)에서만 수행된다.

**Why this priority**: 기존 Supabase Auth 코드를 제거하고 새로운 클라이언트 구조로 전환하는 것이 다른 모든 기능의 전제 조건이다.

**Independent Test**: 기존 Admin CRUD 기능(제조사, 판매차량, 출고차량)이 Service Role Key 기반 클라이언트로 정상 동작하는지 확인한다.

**Acceptance Scenarios**:

1. **Given** Service Role Key가 환경변수로 설정된 상태, **When** Admin API를 통해 제조사 목록을 조회, **Then** 정상적으로 데이터가 반환된다
2. **Given** Service Role Key 기반 클라이언트, **When** 이미지 업로드를 포함한 데이터 생성 요청, **Then** DB 저장과 Storage 업로드가 모두 성공한다
3. **Given** 브라우저에서 실행되는 코드, **When** 환경변수를 참조, **Then** `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`는 노출되지 않는다

---

### Edge Cases

- 세션 쿠키가 만료(24시간)된 후 Admin 페이지에 접근하면 어떻게 되는가? → 로그인 페이지로 리다이렉트
- 동일 계정으로 여러 브라우저/탭에서 동시 로그인하면 어떻게 되는가? → 각각 독립적인 세션으로 허용
- Service Role Key가 잘못 설정된 경우 API 호출 시 어떻게 되는가? → 500 에러와 함께 서버 로그에 기록
- 존재하지 않는 username으로 로그인 시도 시 → "아이디 또는 비밀번호가 올바르지 않습니다" (username 존재 여부를 노출하지 않음)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 `users` 테이블에 username, 해싱된 password, nickname을 저장해야 한다
- **FR-002**: 시스템은 비밀번호를 평문으로 저장하지 않고 반드시 bcrypt 해싱하여 저장해야 한다
- **FR-003**: 시스템은 username과 password를 통한 관리자 로그인 기능을 제공해야 한다
- **FR-004**: 시스템은 로그인 성공 시 HttpOnly 세션 쿠키를 발급해야 한다
- **FR-005**: 시스템은 로그인 실패 시 username 존재 여부를 구분할 수 없는 일관된 오류 메시지를 반환해야 한다
- **FR-006**: 시스템은 로그아웃 시 세션 쿠키를 삭제해야 한다
- **FR-007**: 시스템은 `/admin` 하위 모든 페이지에 대해 세션 쿠키가 없으면 로그인 페이지로 리다이렉트해야 한다
- **FR-008**: 시스템은 `/admin/login` 페이지에 세션 쿠키가 있으면 Admin 대시보드로 리다이렉트해야 한다
- **FR-009**: 시스템은 모든 Admin API 엔드포인트에서 세션을 검증하고, 미인증 요청에 401을 반환해야 한다
- **FR-010**: 시스템은 Supabase에 Service Role Key로만 접근하며, 키를 클라이언트(브라우저)에 노출하지 않아야 한다
- **FR-011**: 시스템은 기존 Supabase Auth 관련 코드(브라우저 클라이언트, Auth 미들웨어, `auth.getUser()` 호출)를 완전히 제거해야 한다
- **FR-012**: 시스템은 기존 Admin CRUD 기능(제조사, 판매차량, 출고차량)이 새로운 클라이언트 구조에서 정상 동작해야 한다

### Key Entities

- **User**: 관리자 사용자. id, username(고유), password(해시), nickname으로 구성. 회원가입 UI 없이 DB에서 직접 생성
- **Session**: 쿠키 기반 세션. 로그인 시 발급, 로그아웃 또는 만료(24시간) 시 삭제

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 관리자가 올바른 자격 증명으로 5초 이내에 로그인을 완료할 수 있다
- **SC-002**: 비인증 사용자의 Admin 페이지 접근이 100% 차단된다
- **SC-003**: 기존 Admin CRUD 기능(제조사/판매차량/출고차량 생성·수정·삭제·조회)이 클라이언트 전환 후에도 동일하게 동작한다
- **SC-004**: 브라우저 개발자 도구에서 Supabase Service Role Key가 노출되지 않는다
- **SC-005**: 비밀번호가 데이터베이스에 해싱된 형태로만 저장된다

## Assumptions

- 단일 관리자 역할만 존재하며, 역할(role) 기반 권한 구분은 필요하지 않다
- 관리자 계정은 DB에서 직접 생성하며, 회원가입 UI는 제공하지 않는다
- 세션 만료 시간은 24시간으로 설정한다
- 동시 로그인은 제한하지 않는다 (여러 브라우저/기기에서 동시 사용 가능)
