# Public API Contracts

**Feature**: 006-main-page-db
**Date**: 2026-02-08

> 모든 공개 API는 인증 없이 접근 가능하다. 응답 형태는 `{ data: T[] }`.

---

## GET /api/public/manufacturers

제조사 목록 조회. is_visible=true인 제조사를 sort_order 오름차순으로 반환.

### Request

```
GET /api/public/manufacturers
```

Query Parameters: 없음

### Response 200

```json
{
  "data": [
    {
      "manufacturer_id": 1,
      "code": "hyundai",
      "name": "현대",
      "logo_url": "https://{supabase-url}/storage/v1/object/public/public-media/manufacturers/xxx/logo.svg",
      "category": "DOMESTIC",
      "sort_order": 1
    }
  ]
}
```

### Response 500

```json
{
  "error": "Failed to fetch manufacturers"
}
```

### Notes
- `logo_path` → `logo_url`로 변환하여 반환 (Storage 공개 URL)
- `logo_path`가 null이면 `logo_url`도 null

---

## GET /api/public/sale-cars

판매차량 목록 조회. is_visible=true인 차량을 제조사 정보와 함께 반환.

### Request

```
GET /api/public/sale-cars
```

Query Parameters: 없음

### Response 200

```json
{
  "data": [
    {
      "sale_car_id": 1,
      "manufacturer_id": 1,
      "name": "아반떼",
      "description": "연비 좋은 세단",
      "thumbnail_url": "https://{supabase-url}/storage/v1/object/public/public-media/sale-cars/xxx/thumb.webp",
      "rent_price": 350000,
      "lease_price": 320000,
      "badges": ["PROMOTION"],
      "manufacturer": {
        "manufacturer_id": 1,
        "name": "현대",
        "category": "DOMESTIC"
      }
    }
  ]
}
```

### Response 500

```json
{
  "error": "Failed to fetch sale cars"
}
```

### Notes
- `thumbnail_path` → `thumbnail_url`로 변환하여 반환
- `manufacturer` 필드: 해당 차량의 제조사 정보 (JOIN 결과)
- Supabase의 foreign key relation을 이용하여 `manufacturers(manufacturer_id, name, category)` select

---

## GET /api/public/released-cars

출고차량 목록 조회. is_visible=true인 차량을 출고일 기준 최신순으로 최대 6건 반환.

### Request

```
GET /api/public/released-cars
```

Query Parameters: 없음

### Response 200

```json
{
  "data": [
    {
      "released_car_id": 1,
      "car_name": "GV80",
      "thumbnail_url": "https://{supabase-url}/storage/v1/object/public/public-media/released-cars/xxx/thumb.webp",
      "released_at": "2026-01-28"
    }
  ]
}
```

### Response 500

```json
{
  "error": "Failed to fetch released cars"
}
```

### Notes
- `thumbnail_path` → `thumbnail_url`로 변환하여 반환
- 최대 6건 (`limit(6)`)
- `released_at` 기준 내림차순 정렬
