# Tasks: 메인 페이지 실데이터 연동

**Input**: Design documents from `/specs/006-main-page-db/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/public-api.md

**Tests**: 테스트 미요청 - 수동 테스트 및 빌드 검증만 수행

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프론트엔드 타입을 DB 기반 snake_case로 전환하고 next.config에 이미지 도메인 설정

- [x] T001 [P] Update Manufacturer type to DB-based fields (manufacturer_id, code, name, logo_url, category, sort_order) in src/types/manufacturer.ts
- [x] T002 [P] Update SaleCar type to DB-based fields (sale_car_id, manufacturer_id, name, description, thumbnail_url, rent_price, lease_price, badges, manufacturer) in src/types/saleCar.ts
- [x] T003 [P] Update ReleasedCar type to DB-based fields (released_car_id, car_name, thumbnail_url, released_at) in src/types/releasedCar.ts
- [x] T004 Add Supabase Storage domain to images.remotePatterns in next.config.ts (for Next.js Image component support)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: useCarFilter 훅의 타입 참조를 새 DB 타입에 맞게 업데이트

**⚠️ CRITICAL**: Phase 1 완료 후 진행. US1/US2가 이 훅에 의존함

- [x] T005 Update useCarFilter hook to use new DB-based Manufacturer and SaleCar types (manufacturer_id, category references) in src/hooks/useCarFilter.ts

**Checkpoint**: 타입과 훅이 업데이트되어 user story 구현 준비 완료

---

## Phase 3: User Story 2 - 제조사 필터 실데이터 표시 (Priority: P1)

**Goal**: 메인 페이지 제조사 필터에 DB의 실제 제조사 목록이 로고와 함께 표시된다

**Independent Test**: DB에 제조사를 등록하고 메인 페이지에서 제조사 필터에 해당 제조사가 로고와 함께 sort_order 순으로 표시되는지 확인

### Implementation for User Story 2

- [x] T006 [US2] Create GET /api/public/manufacturers endpoint - query is_visible=true, order by sort_order asc, transform logo_path to public URL via getPublicImageUrl() in src/app/api/public/manufacturers/route.ts
- [x] T007 [US2] Update ManufacturerFilter component to render manufacturer logo images from logo_url, handle null logo_url with placeholder in src/components/filters/ManufacturerFilter.tsx

**Checkpoint**: 제조사 필터가 DB 데이터 기반으로 로고와 함께 표시됨

---

## Phase 4: User Story 1 - 판매차량 목록 실데이터 표시 (Priority: P1)

**Goal**: 메인 페이지 판매차량 섹션에서 DB의 실제 차량 데이터가 표시되고, 국산/수입 탭·제조사 필터·검색이 동작한다

**Independent Test**: DB에 판매차량과 제조사를 등록한 뒤 메인 페이지에서 DB 데이터가 표시되고 필터/검색이 정상 동작하는지 확인

**Depends on**: US2 (제조사 API 및 필터 컴포넌트)

### Implementation for User Story 1

- [x] T008 [US1] Create GET /api/public/sale-cars endpoint - query is_visible=true with manufacturers relation (manufacturer_id, name, category), transform thumbnail_path to public URL in src/app/api/public/sale-cars/route.ts
- [x] T009 [P] [US1] Update SaleCarCard component for DB types (thumbnail_url image rendering, manufacturer.name display, null thumbnail placeholder) in src/components/cards/SaleCarCard.tsx
- [x] T010 [US1] Update SaleCarSection to fetch from /api/public/sale-cars and /api/public/manufacturers instead of mock services, wire up with useCarFilter in src/components/sections/SaleCarSection.tsx

**Checkpoint**: 판매차량 섹션이 DB 데이터 기반으로 표시되고 필터/검색 동작

---

## Phase 5: User Story 3 - 출고차량 목록 실데이터 표시 (Priority: P2)

**Goal**: 메인 페이지 출고차량 섹션에서 DB의 최근 출고 차량이 최신순으로 최대 6건 표시된다

**Independent Test**: DB에 출고차량을 등록하고 메인 페이지에서 최신순으로 최대 6건이 표시되는지 확인

### Implementation for User Story 3

- [x] T011 [US3] Create GET /api/public/released-cars endpoint - query is_visible=true, order by released_at desc, limit 6, transform thumbnail_path to public URL in src/app/api/public/released-cars/route.ts
- [x] T012 [P] [US3] Update ReleasedCarCard component for DB types (thumbnail_url image rendering, car_name, null thumbnail placeholder) in src/components/cards/ReleasedCarCard.tsx
- [x] T013 [US3] Update ReleasedCarSection to fetch from /api/public/released-cars instead of mock service, handle empty state in src/components/sections/ReleasedCarSection.tsx

**Checkpoint**: 출고차량 섹션이 DB 데이터 기반으로 최신순 최대 6건 표시

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Mock 서비스 정리 및 빌드 검증

- [x] T014 Remove unused mock service imports and files (manufacturer.service.ts, saleCar.service.ts, releasedCar.service.ts) from src/data/services/ + mock data files from src/data/mocks/
- [x] T015 Build verification with npm run build - ensure no TypeScript errors or broken imports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 types update - BLOCKS all user stories
- **US2 (Phase 3)**: Depends on Foundational - manufacturer API + filter component
- **US1 (Phase 4)**: Depends on US2 - sale car section uses manufacturer filter and data
- **US3 (Phase 5)**: Depends on Foundational only - independent of US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 1 (P1)**: Depends on US2 (manufacturer API and filter component must exist)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Fully independent of US1/US2

### Within Each User Story

- API endpoint before component updates
- Component updates before section integration
- All components for a story before section wiring

### Parallel Opportunities

- T001, T002, T003 can run in parallel (different type files)
- T006 (manufacturers API) and T011 (released-cars API) can run in parallel after Phase 2
- T009 (SaleCarCard) and T012 (ReleasedCarCard) can run in parallel (different files)
- US2 (Phase 3) and US3 (Phase 5) can run in parallel after Phase 2

---

## Parallel Example: After Foundational Complete

```text
# US2 and US3 can start simultaneously:
Stream A (US2): T006 → T007
Stream B (US3): T011 → T012 → T013

# After US2 completes, US1 can start:
Stream A (US1): T008 → T009 + T010
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Phase 1: Setup (types + config)
2. Complete Phase 2: Foundational (useCarFilter)
3. Complete Phase 3: US2 (manufacturer filter)
4. Complete Phase 4: US1 (sale cars)
5. **STOP and VALIDATE**: 판매차량 섹션이 DB 데이터 기반으로 완전히 동작하는지 확인

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US2 → 제조사 필터 동작 확인
3. Add US1 → 판매차량 전체 섹션 동작 확인 (MVP!)
4. Add US3 → 출고차량 섹션 동작 확인
5. Polish → Mock 제거, 빌드 검증

---

## Notes

- 기존 DB 스키마 변경 없음 - 공개 API만 추가
- Admin API 패턴(src/app/api/admin/)을 참고하되 인증 체크 제거
- 이미지 URL 변환에 기존 getPublicImageUrl() 헬퍼 재사용
- 필터링은 기존 useCarFilter 훅의 클라이언트 사이드 방식 유지
- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
