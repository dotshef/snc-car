'use client';

import { useEffect, useState } from 'react';
import ReleasedCarCard from '@/components/cards/ReleasedCarCard';
import { getReleasedCars } from '@/data/services/releasedCar.service';
import type { ReleasedCar } from '@/types/releasedCar';

export default function ReleasedCarSection() {
  const [cars, setCars] = useState<ReleasedCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getReleasedCars(6);
        setCars(data);
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
      <section id="released-cars" className="py-16 bg-bg-primary">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center text-text-muted">로딩 중...</div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return null; // 출고 내역이 없으면 섹션 숨김
  }

  return (
    <section id="released-cars" className="py-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* 섹션 헤더 */}
        <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
          최근 출고 내역
        </h2>

        {/* 출고 차량 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <ReleasedCarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
