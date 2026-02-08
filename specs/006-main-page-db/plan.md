# Implementation Plan: 메인 페이지 실데이터 연동

**Branch**: `006-main-page-db` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-main-page-db/spec.md`

## Summary

메인 페이지의 판매차량, 제조사, 출고차량 섹션에서 mock 데이터 대신 Supabase DB 실데이터를 표시한다. 공개 API 엔드포인트(`/api/public/`)를 생성하고, 기존 클라이언트 컴포넌트의 서비스 호출을 API fetch로 교체한다. 기존 useCarFilter 훅의 클라이언트 사이드 필터링은 그대로 유지한다.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x, Next.js 16.x (App Router)
**Primary Dependencies**: `@supabase/supabase-js` ^2.95.3, TailwindCSS v4
**Storage**: Supabase Postgres (DB) + Supabase Storage (`public-media` bucket)
**Testing**: 수동 테스트 (npm run build 빌드 검증)
**Target Platform**: Web (SSR + CSR)
**Project Type**: Web application (Next.js fullstack)
**Performance Goals**: 메인 페이지 초기 로드 시 API 응답 < 500ms
**Constraints**: 공개 API (인증 불필요), 클라이언트 사이드 필터링 유지
**Scale/Scope**: 제조사 ~15개, 판매차량 ~20개, 출고차량 ~10개 (소규모)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution이 프로젝트 고유 원칙으로 설정되지 않음 (템플릿 상태). 기본 원칙 적용:
- 기존 패턴 일관성 유지 (admin API 패턴 재사용)
- 최소 변경 원칙 (컴포넌트 인터페이스 최소 수정)
- YAGNI (서버 사이드 필터링 불필요)

**GATE PASS**: 위반 사항 없음.

## Project Structure

### Documentation (this feature)

```text
specs/006-main-page-db/
├── plan.md              # This file
├── research.md          # Phase 0 output (완료)
├── data-model.md        # Phase 1 output (완료)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── public-api.md    # 공개 API 계약
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── api/
│   │   └── public/                    # [NEW] 공개 API 엔드포인트
│   │       ├── manufacturers/route.ts # GET 제조사 목록
│   │       ├── sale-cars/route.ts     # GET 판매차량 목록
│   │       └── released-cars/route.ts # GET 출고차량 목록
│   └── page.tsx                       # 메인 페이지 (변경 없음)
├── components/
│   ├── sections/
│   │   ├── SaleCarSection.tsx         # [MODIFY] fetch API 호출로 교체
│   │   └── ReleasedCarSection.tsx     # [MODIFY] fetch API 호출로 교체
│   ├── filters/
│   │   └── ManufacturerFilter.tsx     # [MODIFY] 로고 이미지 렌더링
│   └── cards/
│       ├── SaleCarCard.tsx            # [MODIFY] 썸네일 이미지, 타입 조정
│       └── ReleasedCarCard.tsx        # [MODIFY] 썸네일 이미지, 타입 조정
├── hooks/
│   └── useCarFilter.ts               # [MODIFY] 타입 조정
├── types/
│   ├── manufacturer.ts               # [MODIFY] DB 기반 타입으로 전환
│   ├── saleCar.ts                     # [MODIFY] DB 기반 타입으로 전환
│   └── releasedCar.ts                # [MODIFY] DB 기반 타입으로 전환
├── data/
│   ├── services/                      # [DELETE] mock 서비스 제거
│   └── mocks/                         # [KEEP] 참조용 유지 (optional)
└── lib/
    └── supabase/
        └── storage.ts                 # 기존 getPublicImageUrl() 재사용
```

**Structure Decision**: 기존 Next.js App Router 구조를 유지하며, `/api/public/` 경로에 공개 API를 추가. Admin API 패턴(`/api/admin/`)과 동일한 구조를 따르되 인증 체크를 제거.

## Complexity Tracking

> 위반 사항 없음 - 기존 패턴을 따르는 단순한 데이터 소스 교체 작업.
