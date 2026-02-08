'use client';

import { useState, useMemo } from 'react';
import type { Manufacturer, ManufacturerCategory } from '@/types/manufacturer';
import type { SaleCar } from '@/types/saleCar';

export type CategoryFilter = 'ALL' | ManufacturerCategory;

export function useCarFilter(manufacturers: Manufacturer[], cars: SaleCar[]) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | null>(null);

  const filteredManufacturers = useMemo(() => {
    if (categoryFilter === 'ALL') {
      return manufacturers;
    }
    return manufacturers.filter((m) => m.category === categoryFilter);
  }, [manufacturers, categoryFilter]);

  const filteredCars = useMemo(() => {
    let result = cars;

    // 카테고리 필터 적용
    if (categoryFilter !== 'ALL') {
      const validIds = filteredManufacturers.map((m) => m.manufacturer_id);
      result = result.filter((car) => validIds.includes(car.manufacturer_id));
    }

    // 제조사 필터 적용
    if (selectedManufacturer) {
      result = result.filter((car) => car.manufacturer_id === selectedManufacturer);
    }

    return result;
  }, [cars, categoryFilter, selectedManufacturer, filteredManufacturers]);

  const handleCategoryChange = (category: CategoryFilter) => {
    setCategoryFilter(category);
    // 카테고리 변경 시 제조사 선택 초기화
    setSelectedManufacturer(null);
  };

  const handleManufacturerChange = (id: number | null) => {
    setSelectedManufacturer(id);
  };

  return {
    categoryFilter,
    selectedManufacturer,
    filteredManufacturers,
    filteredCars,
    setCategoryFilter: handleCategoryChange,
    setSelectedManufacturer: handleManufacturerChange,
  };
}
