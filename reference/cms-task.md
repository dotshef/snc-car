# 역할 (Role)

너는 **시니어 풀스택 엔지니어**다.  
Next.js(App Router) + Supabase 기반의 **Admin CMS 기능**을 설계 명세에 맞게 구현해야 한다.

본 프로젝트는 **이미 메인(공개) 페이지 구현이 완료**되어 있으며,  
**Admin 페이지 + DB 연동 + 이미지 업로드 CRUD**만 구현 대상이다.

---

# 기술 스택 (고정)

- Next.js (App Router)
- TypeScript
- Supabase
- `@supabase/ssr` **만 사용**
    - ❌ `@supabase/supabase-js` 직접 사용 금지
- ORM ❌ (Prisma / Drizzle / etc 사용 금지)
- DB: Supabase Postgres
- Storage: Supabase Storage (public bucket)
- Auth: Supabase Auth (email/password)
- UI: Client Component + Tailwind, 테마는 메인페이지의 테마를 존중하여 구현

---

# 핵심 설계 원칙 (매우 중요)

1. **route.ts 사용**
    - 모든 쓰기 작업(DB insert/update/delete, 이미지 업로드/삭제)은 route.ts에서만 처리
2. **이미지 → DB insert 순서**
    - 이미지 업로드 성공 후 DB insert
    - DB insert 실패 시 **반드시 Storage에서 이미지 삭제 (보상 로직)**
3. **임시 업로드 없음**
    - Client에서는 이미지 파일을 blob 상태로 유지
    - 저장 버튼 클릭 시 route.ts로 multipart 전송
4. **DB는 저장소 역할만**
    - enum ❌
    - trigger ❌
    - index ❌
    - 모든 검증/로직은 route.ts에서 수행
5. **단일 관리자**
    - role 테이블 ❌
    - 로그인 성공 = 관리자
    - route.ts에서 `auth.getUser()`로 로그인 여부만 확인
6. **정렬 정책**
    - manufacturers: `sort_order ASC`
    - sale_cars / released_cars: `created_at DESC` 
7. **대표 이미지 1장만**
    - SaleCar / ReleasedCar 모두 thumbnail 1장만 허용

---

# 데이터 모델 (이미 DB에 생성되어 있음)

## manufacturers
- manufacturer_id (BIGINT, PK, auto increment)
- code (text, unique)
- name (text)
- logo_path (text)
- category (text: 'DOMESTIC' | 'IMPORT')
- sort_order (int)
- is_visible (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)

## sale_cars
- sale_car_id (BIGINT, PK)
- manufacturer_id (BIGINT, FK, ON DELETE RESTRICT)
- name (text)
- description (text)
- thumbnail_path (text)
- rent_price (int, nullable)
- lease_price (int, nullable)
- badges (text[])
- is_visible (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)

## released_cars
- released_car_id (BIGINT, PK)
- car_name (text)
- thumbnail_path (text)
- released_at (date)
- is_visible (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)

---

# Storage 규칙

- public bucket 사용
- DB에는 **URL이 아니라 path만 저장**
- 경로 규칙:
    - manufacturers/{manufacturerId}/logo.svg
    - sale-cars/{saleCarId}/thumb.webp
    - released-cars/{releasedCarId}/reete.png
- 버킷명은 SUPABASE_STORAGE_BUCKET 로 환경변수로 주입 중임

---

# 구현 대상 기능

## 1. Admin 인증
- `/admin/login`
- Supabase Auth (email/password)
- 로그인 성공 시 `/admin` 접근 가능
- 미로그인 상태에서 admin 접근 시 로그인 페이지로 리다이렉트

---

## 2. Admin 페이지 구조

- `/admin`
    - 탭 3개:
        - 제조사 관리
        - 판매차량 관리
        - 출고차량 관리

### 제조사 관리
- 목록 조회 (sort_order ASC)
- 등록 / 수정
- 삭제 불가 (UI에서도 삭제 버튼 없음)
- logo 업로드 포함

### 판매차량 관리
- 목록 조회 (created_at DESC)
- 등록 / 수정 / 삭제
- 등록 시 제조사 선택 필수 (manufacturers 테이블 참조)
- thumbnail 업로드 포함

### 출고차량 관리
- 목록 조회 (created_at DESC)
- 등록 / 수정 / 삭제
- thumbnail 업로드 포함

---

## 3. route.ts API (반드시 서버에서 처리)

### 예시 엔드포인트
- POST `/api/admin/manufacturers`
- PUT `/api/admin/manufacturers/{id}`
- POST `/api/admin/sale-cars`
- PUT `/api/admin/sale-cars/{id}`
- DELETE `/api/admin/sale-cars/{id}`
- POST `/api/admin/released-cars`
- PUT `/api/admin/released-cars/{id}`
- DELETE `/api/admin/released-cars/{id}`

### 공통 규칙
- `auth.getUser()`로 로그인 검증
- multipart/form-data 처리
- DB 실패 시 Storage rollback 필수
- `updated_at`은 route.ts에서 명시적으로 갱신
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 사용하여 supabase sdk 연결

---

# 산출물 요구

1. Admin 페이지 폴더 구조
2. Supabase client 생성 코드 (browser / server)
3. route.ts API 코드 (이미지 + DB insert + rollback)
4. Admin 페이지 기본 CRUD 화면
5. 타입 반영 (`types/*.ts`)

---

# 목표

- “동작하는 최소한의 Admin CMS”
- 설계 위반 없는 **정석적인 구조**
- 이후 기능 확장이 쉬운 코드

작업을 단계적으로 나누어 진행하되,  
각 단계마다 **왜 그렇게 구현했는지 간단한 설명을 포함**하라.
