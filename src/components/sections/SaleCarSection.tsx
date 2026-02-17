'use client';

import { useEffect, useState } from 'react';
import ManufacturerFilter from '@/components/filters/ManufacturerFilter';
import SaleCarCard from '@/components/cards/SaleCarCard';
import type { Manufacturer, ManufacturerCategory } from '@/types/manufacturer';
import type { SaleCar } from '@/types/saleCar';

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
  };

  const displayedCars = selectedManufacturer
    ? cars.filter((car) => car.manufacturer_id === selectedManufacturer)
    : cars;

  return (
    <section id={sectionId} className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 섹션 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
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
            <div className="mb-8">
              <ManufacturerFilter
                manufacturers={manufacturers}
                selectedCode={selectedManufacturer}
                onSelect={handleManufacturerSelect}
              />
            </div>

            {/* 차량 그리드 */}
            {displayedCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCars.slice(0, 6).map((car) => (
                  <SaleCarCard key={car.sale_car_id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted">
                조건에 맞는 차량이 없습니다.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
