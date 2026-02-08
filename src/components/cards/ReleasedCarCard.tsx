import type { ReleasedCar } from '@/types/releasedCar';
import { formatReleasedDate } from '@/utils/formatters';

interface ReleasedCarCardProps {
  car: ReleasedCar;
}

export default function ReleasedCarCard({ car }: ReleasedCarCardProps) {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-secondary transition-all duration-300 group">
      {/* 차량 이미지 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-text-muted group-hover:scale-105 transition-transform duration-300">
          {car.thumbnail_url ? (
            <img
              src={car.thumbnail_url}
              alt={car.car_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm">{car.car_name}</span>
          )}
        </div>
      </div>

      {/* 차량 정보 */}
      <div className="p-4">
        <h3 className="text-base font-bold text-text-primary mb-1 line-clamp-1">
          {car.car_name}
        </h3>
        <p className="text-sm text-text-secondary">
          {formatReleasedDate(car.released_at)}
        </p>
      </div>
    </div>
  );
}
