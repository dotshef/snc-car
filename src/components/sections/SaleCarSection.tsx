'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ManufacturerFilter from '@/components/filters/ManufacturerFilter';
import SaleCarCard from '@/components/cards/SaleCarCard';
import type { Manufacturer, ManufacturerCategory } from '@/types/manufacturer';
import type { SaleCar } from '@/types/saleCar';
import FadeInUp from '@/components/animation/FadeInUp';
import DraggableTrack from '@/components/ui/DraggableTrack';

// ── 레이아웃 상수 ──────────────────────────────────────────────────
const ROWS = 2;
const COLS_LG = 4; // >= 1024px: 4열씩 이동
const COLS_SM = 2; // <  1024px: 2열씩 이동

function getColsPerPage(): number {
  if (typeof window === 'undefined') return COLS_LG;
  return window.innerWidth >= 1024 ? COLS_LG : COLS_SM;
}

// ── Props ──────────────────────────────────────────────────────────
interface SaleCarSectionProps {
  sectionId: string;
  title: string;
  category?: ManufacturerCategory;
  immediateOnly?: boolean;
}

export default function SaleCarSection({ sectionId, title, category, immediateOnly }: SaleCarSectionProps) {
  // ── 데이터 상태 ────────────────────────────────────────────────
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [cars, setCars] = useState<SaleCar[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── 슬라이더 상태 ──────────────────────────────────────────────
  const [pageIndex, setPageIndex] = useState(0);
  const [colsPerPage, setColsPerPage] = useState(COLS_LG);

  // ── 데이터 로드 ────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [mfRes, carsRes] = await Promise.all([
          fetch('/api/public/manufacturers'),
          fetch('/api/public/sale-cars'),
        ]);
        const [mfJson, carsJson] = await Promise.all([mfRes.json(), carsRes.json()]);

        const allManufacturers: Manufacturer[] = mfJson.data ?? [];
        const allCars: SaleCar[] = carsJson.data ?? [];

        const filteredMfs = category
          ? allManufacturers.filter((m) => m.category === category)
          : allManufacturers;
        const validIds = filteredMfs.map((m) => m.manufacturer_id);

        setManufacturers(filteredMfs);

        let filtered = allCars.filter((car) => validIds.includes(car.manufacturer_id));
        if (immediateOnly) filtered = filtered.filter((car) => car.immediate === true);
        setCars(filtered);
      } catch (error) {
        console.error('[SaleCarSection] Failed to load sale cars:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [category, immediateOnly]);

  // ── 리사이즈: colsPerPage 갱신 + pageIndex 리셋 ────────────────
  useEffect(() => {
    const update = () => {
      setColsPerPage(getColsPerPage());
      setPageIndex(0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── 필터 변경 시 처음으로 리셋 ────────────────────────────────
  useEffect(() => {
    setPageIndex(0);
  }, [selectedManufacturer]);

  // ── 파생 값 계산 ───────────────────────────────────────────────
  const filteredCars = selectedManufacturer
    ? cars.filter((car) => car.manufacturer_id === selectedManufacturer)
    : cars;

  // 실제 채워진 열 수
  const totalFilledCols = Math.ceil(filteredCars.length / ROWS);
  // 항상 colsPerPage의 배수 페이지 수 (빈 공간 포함)
  const totalPages = totalFilledCols > 0 ? Math.ceil(totalFilledCols / colsPerPage) : 0;
  // 트랙 전체 열 수 (빈 열 포함하여 정확히 페이지 배수)
  const totalTrackCols = totalPages * colsPerPage;

  // ── 네비게이션 ─────────────────────────────────────────────────
  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < totalPages - 1;

  // totalPages는 렌더마다 바뀔 수 있으므로 ref로 관리
  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  const handlePrev = useCallback(() => {
    setPageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    // 드래그로 호출될 수 있으므로 최신 totalPages로 clamp
    setPageIndex((prev) => Math.min(totalPagesRef.current - 1, prev + 1));
  }, []);

  // ── 트랙 위치 계산 ─────────────────────────────────────────────
  // 트랙 너비 = totalPages × 100% (뷰포트 기준)
  // translateX: 각 페이지 = 트랙의 1/totalPages 만큼 이동
  const trackWidth = totalPages > 0 ? `${totalPages * 100}%` : '100%';
  const translateXPct = totalPages > 0 ? -(pageIndex / totalPages) * 100 : 0;

  const handleManufacturerSelect = (id: number | null) => {
    setSelectedManufacturer((prev) => (prev === id ? null : id));
  };

  const showNav = totalPages > 1;

  return (
    <section id={sectionId} className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 섹션 헤더 */}
        <FadeInUp delay={0}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-text-primary">{title}</h2>
          </div>
        </FadeInUp>

        {isLoading ? (
          <>
            {/* 제조사 필터 스켈레톤 */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex gap-3 py-2 px-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-24 h-20 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* 카드 그리드 스켈레톤 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 제조사 필터 */}
            <FadeInUp delay={100}>
              <div className="mb-8">
                <ManufacturerFilter
                  manufacturers={manufacturers}
                  selectedCode={selectedManufacturer}
                  onSelect={handleManufacturerSelect}
                />
              </div>
            </FadeInUp>

            {/* 차량 슬라이더 */}
            <FadeInUp delay={200}>
              {filteredCars.length > 0 ? (
                <>
                  {/* 드래그 가능 슬라이딩 뷰포트 */}
                  <DraggableTrack onPrev={handlePrev} onNext={handleNext}>
                    {({ offset, isDragging }) => (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                          gridTemplateColumns: `repeat(${totalTrackCols}, 1fr)`,
                          gridAutoFlow: 'column',
                          width: trackWidth,
                          transform: `translateX(calc(${translateXPct}% + ${offset}px))`,
                          // 드래그 중: 즉각 반응 / 릴리스: 부드러운 슬라이드
                          transition: isDragging
                            ? 'none'
                            : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                          willChange: 'transform',
                        }}
                      >
                        {filteredCars.map((car) => (
                          <div key={car.sale_car_id} className="p-2">
                            <SaleCarCard car={car} />
                          </div>
                        ))}
                      </div>
                    )}
                  </DraggableTrack>

                  {/* 이전 / 다음 버튼 */}
                  {showNav && (
                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={handlePrev}
                        disabled={!canGoPrev}
                        className="flex-1 flex items-center justify-center gap-2 py-4 border border-border rounded-xl text-text-secondary font-medium hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="이전"
                      >
                        &#9664; 이전
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className="flex-1 flex items-center justify-center gap-2 py-4 border border-border rounded-xl text-text-secondary font-medium hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="다음"
                      >
                        다음 &#9654;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-text-muted">
                  조건에 맞는 차량이 없습니다.
                </div>
              )}
            </FadeInUp>
          </>
        )}
      </div>
    </section>
  );
}
