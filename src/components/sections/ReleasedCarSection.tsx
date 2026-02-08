'use client';

import { useEffect, useState } from 'react';
import ReleasedCarCard from '@/components/cards/ReleasedCarCard';
import type { ReleasedCar } from '@/types/releasedCar';

export default function ReleasedCarSection() {
  const [cars, setCars] = useState<ReleasedCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/public/released-cars');
        const json = await res.json();
        setCars(json.data ?? []);
      } catch (error) {
        console.error('Failed to load released cars:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section id="released-cars" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center text-text-muted">로딩 중...</div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
        <section id="released-cars" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* 섹션 헤더 */}
            <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
              최근 출고 내역
            </h2>

            <div className="text-center">
              <span className="text-gray-500">최근 출고 내역이 없습니다.</span>
            </div>
          </div>
        </section>
    );
  }

  return (
    <section id="released-cars" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 섹션 헤더 */}
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          최근 출고 내역
        </h2>

        {/* 출고 차량 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <ReleasedCarCard key={car.released_car_id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
