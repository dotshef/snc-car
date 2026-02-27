'use client';

import { useEffect, useState } from 'react';
import ManufacturerFilter from '@/components/filters/ManufacturerFilter';
import SaleCarCard from '@/components/cards/SaleCarCard';
import type { Manufacturer, ManufacturerCategory } from '@/types/manufacturer';
import type { SaleCar } from '@/types/saleCar';
import FadeInUp from "@/components/animation/FadeInUp";

interface SaleCarSectionProps {
  sectionId: string;
  title: string;
  category?: ManufacturerCategory;
  immediateOnly?: boolean;
}

export default function SaleCarSection({ sectionId, title, category, immediateOnly }: SaleCarSectionProps) {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [cars, setCars] = useState<SaleCar[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [slideClass, setSlideClass] = useState('');

  const PAGE_SIZE = 8;

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

        // 카테고리에 해당하는 제조사만 필터링
        const filteredMfs = category
          ? allManufacturers.filter((m) => m.category === category)
          : allManufacturers;
        const validIds = filteredMfs.map((m) => m.manufacturer_id);

        setManufacturers(filteredMfs);

        let filteredCars = allCars.filter((car) => validIds.includes(car.manufacturer_id));
        if (immediateOnly) {
          filteredCars = filteredCars.filter((car) => car.immediate === true);
        }
        setCars(filteredCars);
      } catch (error) {
        console.error('[SaleCarSection] Failed to load sale cars:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [category, immediateOnly]);

  const handleManufacturerSelect = (id: number | null) => {
    setSelectedManufacturer((prev) => (prev === id ? null : id));
    setPage(0);
    setSlideClass('');
  };

  const goToPrev = () => {
    setSlideClass('slide-in-right');
    setPage((p) => p - 1);
  };

  const goToNext = () => {
    setSlideClass('slide-in-left');
    setPage((p) => p + 1);
  };

  const filteredCars = selectedManufacturer
    ? cars.filter((car) => car.manufacturer_id === selectedManufacturer)
    : cars;

  const totalPages = Math.ceil(filteredCars.length / PAGE_SIZE);
  const displayedCars = filteredCars.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section id={sectionId} className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-screen-2xl">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
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

            {/* 차량 그리드 */}
            <FadeInUp delay={200}>
              {displayedCars.length > 0 ? (
                <>
                  <div
                    key={page}
                    className={`grid grid-cols-2 lg:grid-cols-4 gap-6 ${slideClass}`}
                  >
                    {displayedCars.map((car) => (
                      <SaleCarCard key={car.sale_car_id} car={car} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={goToPrev}
                        disabled={page === 0}
                        className="flex-1 flex items-center justify-center gap-2 py-4 border border-border rounded-xl text-text-secondary font-medium hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="이전"
                      >
                        &#9664; 이전
                      </button>
                      <button
                        onClick={goToNext}
                        disabled={page === totalPages - 1}
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
