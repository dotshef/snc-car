# Data Model: 메인 페이지 실데이터 연동

**Feature**: 006-main-page-db
**Date**: 2026-02-08

> 기존 DB 스키마 변경 없음. 이 문서는 공개 API의 응답 타입과 기존 테이블 구조의 매핑을 정의한다.

## 기존 DB 테이블 (변경 없음)

### manufacturers

| 컬럼 | 타입 | 설명 |
|------|------|------|
| manufacturer_id | INT (PK) | 고유 ID |
| code | TEXT | 제조사 코드 (hyundai, bmw 등) |
| name | TEXT | 제조사명 |
| logo_path | TEXT (nullable) | Storage 내 로고 경로 |
| category | TEXT | DOMESTIC / IMPORT |
| sort_order | INT | 정렬 순서 |
| is_visible | BOOLEAN | 노출 여부 |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 수정일 |

### sale_cars

| 컬럼 | 타입 | 설명 |
|------|------|------|
| sale_car_id | INT (PK) | 고유 ID |
| manufacturer_id | INT (FK) | 제조사 참조 |
| name | TEXT | 차량명 |
| description | TEXT (nullable) | 설명 |
| thumbnail_path | TEXT (nullable) | Storage 내 썸네일 경로 |
| rent_price | INT (nullable) | 렌트 가격 (원) |
| lease_price | INT (nullable) | 리스 가격 (원) |
| badges | TEXT[] | 뱃지 배열 |
| is_visible | BOOLEAN | 노출 여부 |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 수정일 |

### released_cars

| 컬럼 | 타입 | 설명 |
|------|------|------|
| released_car_id | INT (PK) | 고유 ID |
| car_name | TEXT | 차량명 |
| thumbnail_path | TEXT (nullable) | Storage 내 썸네일 경로 |
| released_at | DATE | 출고일 |
| is_visible | BOOLEAN | 노출 여부 |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 수정일 |

## 공개 API 응답 타입

### 제조사 목록 응답

```typescript
// GET /api/public/manufacturers
interface PublicManufacturerResponse {
  data: {
    manufacturer_id: number;
    code: string;
    name: string;
    logo_path: string | null;  // 공개 URL로 변환됨
    category: 'DOMESTIC' | 'IMPORT';
    sort_order: number;
  }[];
}
```

### 판매차량 목록 응답

```typescript
// GET /api/public/sale-cars
interface PublicSaleCarResponse {
  data: {
    sale_car_id: number;
    manufacturer_id: number;
    name: string;
    description: string | null;
    thumbnail_path: string | null;  // 공개 URL로 변환됨
    rent_price: number | null;
    lease_price: number | null;
    badges: string[];
    manufacturers: { name: string; category: 'DOMESTIC' | 'IMPORT' } | null;
  }[];
}
```

### 출고차량 목록 응답

```typescript
// GET /api/public/released-cars
interface PublicReleasedCarResponse {
  data: {
    released_car_id: number;
    car_name: string;
    thumbnail_path: string | null;  // 공개 URL로 변환됨
    released_at: string;
  }[];
}
```

## 관계도

```
manufacturers (1) ────< (N) sale_cars   (manufacturer_id FK)
```

- released_cars는 독립 엔티티 (FK 없음)
