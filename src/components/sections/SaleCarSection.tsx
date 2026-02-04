'use client';

import { useEffect, useState } from 'react';
import { useCarFilter } from '@/hooks/useCarFilter';
import CategoryTabs from '@/components/filters/CategoryTabs';
import ManufacturerFilter from '@/components/filters/ManufacturerFilter';
import SearchInput from '@/components/filters/SearchInput';
import SaleCarCard from '@/components/cards/SaleCarCard';
import { getManufacturers } from '@/data/services/manufacturer.service';
import { getSaleCars } from '@/data/services/saleCar.service';
import type { Manufacturer } from '@/types/manufacturer';
import type { SaleCar } from '@/types/saleCar';

export default function SaleCarSection() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [cars, setCars] = useState<SaleCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    categoryFilter,
    selectedManufacturer,
    filteredManufacturers,
    filteredCars,
    setCategoryFilter,
    setSelectedManufacturer,
  } = useCarFilter(manufacturers, cars);

  useEffect(() => {
    async function loadData() {
      try {
        const [manufacturersData, carsData] = await Promise.all([
          getManufacturers(),
          getSaleCars(),
        ]);
        setManufacturers(manufacturersData);
        setCars(carsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section id="sale-cars" className="py-16 bg-bg-secondary">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center text-text-muted">로딩 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="sale-cars" className="py-16 bg-bg-secondary">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* 섹션 헤더 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-text-primary">판매 차량</h2>
          <SearchInput />
        </div>

        {/* 1차 필터: 카테고리 탭 */}
        <div className="mb-6">
          <CategoryTabs
            currentCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
        </div>

        {/* 2차 필터: 제조사 선택 */}
        <div className="mb-8">
          <ManufacturerFilter
            manufacturers={filteredManufacturers}
            selectedCode={selectedManufacturer}
            onSelect={setSelectedManufacturer}
          />
        </div>

        {/* 차량 그리드 */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCars.slice(0, 12).map((car) => (
              <SaleCarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted">
            조건에 맞는 차량이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
