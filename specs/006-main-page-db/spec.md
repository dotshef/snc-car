# Feature Specification: 메인 페이지 실데이터 연동

**Feature Branch**: `006-main-page-db`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "이제 메인 페이지에 보일 정보를 mock data가 아니라 DB와 storage에서 가져와야한다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 판매차량 목록 실데이터 표시 (Priority: P1)

메인 페이지 방문자가 판매차량 섹션에서 DB에 등록된 실제 판매차량 데이터를 확인한다. 제조사 필터(국산/수입 탭, 개별 제조사 선택)와 검색 기능이 실데이터 기반으로 동작하며, 차량 썸네일은 Supabase Storage에서 로드된다.

**Why this priority**: 판매차량 섹션이 메인 페이지의 핵심 콘텐츠이며, 제조사 필터·검색과 함께 가장 많은 데이터 연동이 필요하다.

**Independent Test**: DB에 판매차량과 제조사 데이터를 등록한 뒤 메인 페이지를 방문하면, mock 데이터 대신 DB 데이터가 표시되고 필터/검색이 정상 동작하는지 확인한다.

**Acceptance Scenarios**:

1. **Given** DB에 is_visible=true인 판매차량이 존재할 때, **When** 메인 페이지를 방문하면, **Then** 해당 차량들이 판매차량 섹션에 표시된다
2. **Given** DB에 is_visible=false인 판매차량만 존재할 때, **When** 메인 페이지를 방문하면, **Then** 판매차량 섹션에 차량이 표시되지 않는다
3. **Given** 판매차량이 표시된 상태에서, **When** '국산' 또는 '수입' 탭을 선택하면, **Then** 해당 카테고리의 제조사에 속한 차량만 필터링된다
4. **Given** 판매차량이 표시된 상태에서, **When** 특정 제조사를 선택하면, **Then** 해당 제조사의 차량만 표시된다
5. **Given** 판매차량이 표시된 상태에서, **When** 검색어를 입력하면, **Then** 차량명에 해당 검색어가 포함된 차량만 표시된다
6. **Given** 판매차량의 썸네일이 Supabase Storage에 저장되어 있을 때, **When** 메인 페이지를 방문하면, **Then** 썸네일 이미지가 정상적으로 로드된다

---

### User Story 2 - 제조사 필터 실데이터 표시 (Priority: P1)

메인 페이지의 제조사 필터에 DB에 등록된 실제 제조사 목록이 표시된다. 제조사 로고는 Supabase Storage에서 로드되며, sort_order 기준으로 정렬된다.

**Why this priority**: 제조사 필터는 판매차량 섹션의 핵심 UX 요소이며, US1과 함께 동작해야 한다.

**Independent Test**: DB에 제조사를 등록하고 메인 페이지에서 제조사 필터에 해당 제조사가 로고와 함께 정상 표시되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** DB에 is_visible=true인 제조사가 존재할 때, **When** 메인 페이지를 방문하면, **Then** 제조사 필터에 해당 제조사들이 sort_order 순으로 표시된다
2. **Given** DB에 is_visible=false인 제조사가 있을 때, **When** 메인 페이지를 방문하면, **Then** 해당 제조사는 필터에 표시되지 않는다
3. **Given** 제조사 로고가 Supabase Storage에 저장되어 있을 때, **When** 필터를 렌더링하면, **Then** 로고 이미지가 정상적으로 표시된다

---

### User Story 3 - 출고차량 목록 실데이터 표시 (Priority: P2)

메인 페이지 방문자가 출고차량 섹션에서 DB에 등록된 최근 출고 차량을 확인한다. 출고일 기준 최신순으로 정렬되어 표시되며, 썸네일은 Supabase Storage에서 로드된다.

**Why this priority**: 출고차량 섹션은 독립적인 데이터 영역으로, 판매차량보다 구조가 단순하다.

**Independent Test**: DB에 출고차량을 등록하고 메인 페이지에서 최근 출고차량이 올바르게 표시되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** DB에 is_visible=true인 출고차량이 존재할 때, **When** 메인 페이지를 방문하면, **Then** 출고일 기준 최신순으로 최대 6건이 표시된다
2. **Given** DB에 is_visible=true인 출고차량이 6건을 초과할 때, **When** 메인 페이지를 방문하면, **Then** 최신 6건만 표시된다
3. **Given** DB에 출고차량이 없을 때, **When** 메인 페이지를 방문하면, **Then** 빈 상태(empty state) 메시지가 표시된다
4. **Given** 출고차량의 썸네일이 Storage에 저장되어 있을 때, **When** 메인 페이지를 방문하면, **Then** 썸네일이 정상적으로 로드된다

---

### Edge Cases

- DB 연결 실패 또는 API 오류 시 메인 페이지가 빈 목록을 표시하고, 페이지 자체는 정상 렌더링되어야 한다
- 제조사가 등록되어 있지만 해당 제조사의 판매차량이 없는 경우 필터 선택 시 빈 목록이 표시된다
- 이미지 경로가 null인 경우(로고 또는 썸네일 미등록) 기본 플레이스홀더 또는 빈 공간으로 처리한다
- 판매차량에 연결된 제조사가 is_visible=false인 경우에도 해당 차량은 독립적으로 표시 여부가 결정된다

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 메인 페이지의 판매차량 섹션은 DB에서 is_visible=true인 판매차량 데이터를 조회하여 표시해야 한다
- **FR-002**: 메인 페이지의 제조사 필터는 DB에서 is_visible=true인 제조사를 sort_order 오름차순으로 조회하여 표시해야 한다
- **FR-003**: 메인 페이지의 출고차량 섹션은 DB에서 is_visible=true인 출고차량을 출고일 기준 최신순으로 최대 6건 조회하여 표시해야 한다
- **FR-004**: 판매차량 썸네일, 제조사 로고, 출고차량 썸네일은 Supabase Storage의 공개 URL을 통해 로드해야 한다
- **FR-005**: 기존 국산/수입 탭 필터, 제조사 필터, 검색 기능이 실데이터 기반으로 동일하게 동작해야 한다
- **FR-006**: 기존 mock 데이터 의존성을 제거하고, 데이터 서비스 계층이 DB 조회로 교체되어야 한다
- **FR-007**: 데이터 조회 실패 시 에러가 전파되지 않고, 해당 섹션이 빈 상태로 표시되어야 한다
- **FR-008**: 판매차량 목록은 제조사 정보(제조사명, 카테고리)를 함께 조회하여 필터링에 활용해야 한다

### Key Entities

- **제조사(Manufacturer)**: 차량 브랜드. 코드, 이름, 로고, 카테고리(국산/수입), 정렬순서, 노출여부를 가진다. 판매차량과 1:N 관계이다.
- **판매차량(SaleCar)**: 판매 중인 차량. 차량명, 설명, 썸네일, 렌트가격, 리스가격, 뱃지, 노출여부를 가진다. 하나의 제조사에 속한다.
- **출고차량(ReleasedCar)**: 출고 완료된 차량. 차량명, 썸네일, 출고일, 노출여부를 가진다.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 관리자가 Admin CMS를 통해 등록·수정한 데이터가 메인 페이지에 즉시 반영된다
- **SC-002**: 메인 페이지의 모든 이미지(제조사 로고, 차량 썸네일)가 Storage에서 정상 로드된다
- **SC-003**: 기존 필터(국산/수입, 제조사별) 및 검색 기능이 실데이터에서도 동일하게 동작한다
- **SC-004**: DB에 데이터가 없는 경우에도 메인 페이지가 오류 없이 정상 렌더링된다
- **SC-005**: mock 데이터 파일이 더 이상 메인 페이지 렌더링에 사용되지 않는다

## Assumptions

- Supabase DB와 Storage는 이미 설정되어 있으며, admin CMS를 통해 데이터가 등록되고 있다
- 메인 페이지의 정적 섹션(HeroSection, StrengthSection, FAQSection)은 변경 범위에 포함되지 않는다
- 기존 프론트엔드 타입(Manufacturer, SaleCar, ReleasedCar)은 DB Row 타입에 맞게 조정될 수 있다
- 메인 페이지는 인증 없이 공개 접근 가능하므로, 공개 API 엔드포인트가 필요하다
- 판매차량 필터링(카테고리, 제조사, 검색)은 기존과 동일한 클라이언트 사이드 방식을 유지한다
