# Quickstart: 메인 페이지 실데이터 연동

**Feature**: 006-main-page-db
**Date**: 2026-02-08

## Prerequisites

- Supabase 프로젝트 설정 완료 (DB + Storage)
- `.env.local`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 설정
- Admin CMS를 통해 제조사, 판매차량, 출고차량 데이터 등록 완료
- `public-media` Storage 버킷에 이미지 업로드 완료

## Implementation Order

### Step 1: 공개 API 엔드포인트 생성

```text
src/app/api/public/manufacturers/route.ts    → GET 제조사 목록
src/app/api/public/sale-cars/route.ts        → GET 판매차량 목록
src/app/api/public/released-cars/route.ts    → GET 출고차량 목록
```

각 API는:
- 인증 체크 없음 (공개)
- Supabase에서 `is_visible=true` 데이터 조회
- 이미지 경로를 `getPublicImageUrl()`로 공개 URL 변환
- `{ data: [...] }` 형태로 응답

### Step 2: 프론트엔드 타입 전환

기존 camelCase mock 타입을 DB snake_case 기반으로 교체:
- `Manufacturer`: `id` → `manufacturer_id`, `logoUrl` → `logo_url`
- `SaleCar`: `id` → `sale_car_id`, `thumbnailUrl` → `thumbnail_url`
- `ReleasedCar`: `id` → `released_car_id`, `thumbnailUrl` → `thumbnail_url`

### Step 3: 컴포넌트 데이터 로딩 교체

- `SaleCarSection`: mock 서비스 → `/api/public/sale-cars`, `/api/public/manufacturers` fetch
- `ReleasedCarSection`: mock 서비스 → `/api/public/released-cars` fetch
- `useCarFilter`: 타입 참조 업데이트

### Step 4: 이미지 렌더링

- `SaleCarCard`: `thumbnail_url`을 `<img>` src에 바인딩
- `ReleasedCarCard`: `thumbnail_url`을 `<img>` src에 바인딩
- `ManufacturerFilter`: `logo_url`을 `<img>` src에 바인딩
- null인 경우 플레이스홀더 유지

### Step 5: Mock 데이터 서비스 정리

- `src/data/services/` 내 mock 서비스 파일에서 메인 페이지 관련 import 제거
- 더 이상 사용되지 않는 서비스 함수 삭제

## Verification

```bash
npm run build    # 빌드 오류 없는지 확인
npm run dev      # 로컬 서버에서 메인 페이지 데이터 로드 확인
```

확인 항목:
1. 메인 페이지에서 DB 데이터가 표시되는지
2. 국산/수입 필터가 동작하는지
3. 제조사 필터가 동작하는지
4. 이미지(로고, 썸네일)가 로드되는지
5. 출고차량이 최신순 최대 6건 표시되는지
6. DB에 데이터 없을 때 빈 상태가 표시되는지
