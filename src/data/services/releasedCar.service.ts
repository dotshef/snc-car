import { mockReleasedCars } from '../mocks/releasedCars';
import type { ReleasedCar } from '@/types/releasedCar';

/**
 * 최근 출고 차량 조회 (isVisible=true, 최대 limit개)
 * 정렬: releasedAt DESC, createdAt DESC
 */
export async function getReleasedCars(limit: number = 6): Promise<ReleasedCar[]> {
  return mockReleasedCars
    .filter((car) => car.isVisible)
    .sort((a, b) => {
      const releasedDiff =
        new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime();
      if (releasedDiff !== 0) {
        return releasedDiff;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);
}
