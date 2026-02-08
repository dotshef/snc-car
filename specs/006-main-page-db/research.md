# Research: 메인 페이지 실데이터 연동

**Feature**: 006-main-page-db
**Date**: 2026-02-08

## R1: 공개 API vs 서버 컴포넌트 vs 서비스 레이어 직접 호출

**Decision**: 공개(인증 불필요) API 엔드포인트를 생성하여 클라이언트 컴포넌트에서 fetch

**Rationale**:
- 현재 SaleCarSection, ReleasedCarSection은 `'use client'` 컴포넌트로 useEffect + useState로 데이터를 로드
- useCarFilter 훅이 클라이언트 사이드 상태(categoryFilter, selectedManufacturer)를 관리하며 memoized 필터링 수행
- 이 패턴을 유지하면서 mock 서비스 호출만 fetch API 호출로 교체하는 것이 최소 변경
- 공개 API이므로 인증 체크(`getSessionUser()`) 불필요

**Alternatives considered**:
- Server Component 전환: useCarFilter 훅의 클라이언트 사이드 상태 관리를 재설계해야 하므로 변경 범위가 큼
- 서비스 레이어에서 직접 Supabase 호출: 클라이언트 컴포넌트에서 서버 전용 Supabase 클라이언트 사용 불가

## R2: 공개 API 엔드포인트 경로 설계

**Decision**: `/api/public/` 하위에 공개 API를 분리

**Rationale**:
- 기존 `/api/admin/` 경로는 인증 필수 (getSessionUser 체크)
- 공개 API는 인증 없이 접근 가능해야 하므로 명확히 분리
- 경로: `/api/public/manufacturers`, `/api/public/sale-cars`, `/api/public/released-cars`

**Alternatives considered**:
- `/api/manufacturers` (admin 접두사 없이): admin과 혼동 가능
- 쿼리 파라미터로 인증 여부 구분: 보안 측면에서 부적절

## R3: 프론트엔드 타입 전환 전략

**Decision**: 프론트엔드 타입(Manufacturer, SaleCar, ReleasedCar)을 DB Row 타입 기반으로 재정의하되, 컴포넌트 인터페이스는 최소 변경

**Rationale**:
- 현재 프론트엔드 타입은 `id: string`, `logoUrl: string` 등 mock 기반 필드명 사용
- DB Row 타입은 `manufacturer_id: number`, `logo_path: string | null` 등 snake_case
- API 응답에서 이미지 경로를 공개 URL로 변환하여 반환하면, 컴포넌트 수정을 최소화 가능
- 서비스 레이어 제거 후 컴포넌트에서 직접 API fetch → 타입을 API 응답 형태에 맞게 조정

**Alternatives considered**:
- 기존 프론트엔드 타입 유지 + API에서 camelCase 변환: 불필요한 변환 레이어 추가
- DB Row 타입을 그대로 컴포넌트에서 사용: snake_case를 그대로 사용하면 일관성 확보

## R4: 이미지 URL 처리

**Decision**: 공개 API에서 `logo_path`/`thumbnail_path`를 Supabase Storage 공개 URL로 변환하여 반환

**Rationale**:
- Admin API에서 이미 동일한 패턴을 사용 중 (`getPublicImageUrl()` 헬퍼)
- 클라이언트에서는 반환된 URL을 그대로 img src에 사용
- null인 경우 null 그대로 반환 → 컴포넌트에서 플레이스홀더 처리

## R5: 판매차량 필터링 방식

**Decision**: 공개 API에서 전체 데이터를 한번에 반환하고, 기존 useCarFilter 훅으로 클라이언트 사이드 필터링 유지

**Rationale**:
- 현재 판매차량은 20개 수준으로 데이터량이 적음
- useCarFilter 훅이 이미 카테고리/제조사/검색 필터링을 잘 처리하고 있음
- 서버 사이드 필터링으로 전환하면 UX가 느려질 수 있음 (매 필터 변경마다 API 호출)
- 향후 데이터가 크게 증가하면 서버 사이드 페이지네이션으로 전환 가능

## R6: Next.js Image 컴포넌트 외부 이미지 도메인 설정

**Decision**: next.config에 Supabase Storage 도메인을 이미지 허용 목록에 추가 필요

**Rationale**:
- Next.js Image 컴포넌트는 외부 도메인 이미지에 대해 명시적 허용이 필요
- Supabase Storage URL의 도메인을 `images.remotePatterns`에 추가해야 함
- 현재 컴포넌트의 일부가 img 태그, 일부가 Image 컴포넌트 사용 → 확인 필요
