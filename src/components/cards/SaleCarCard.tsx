'use client';

import { SaleCarBadge, type SaleCar } from '@/types/saleCar';
import type { Manufacturer } from '@/types/manufacturer';
import { useQuoteModal } from '@/hooks/useQuoteModal';

interface SaleCarCardProps {
  car: SaleCar;
  manufacturers: Manufacturer[];
}

function getBadgeColor(badge: SaleCarBadge): string {
  switch (badge) {
    case SaleCarBadge.IMMEDIATE:
      return 'bg-badge-immediate';
    case SaleCarBadge.PROMOTION:
      return 'bg-badge-promotion';
    default:
      return 'bg-secondary';
  }
}

export default function SaleCarCard({ car, manufacturers }: SaleCarCardProps) {
  const { openModal } = useQuoteModal();

  const manufacturer = manufacturers.find((m) => m.id === car.manufacturerId);
  const manufacturerName = manufacturer?.name ?? '';

  const handleConsultClick = () => {
    openModal({
      name: car.name,
      manufacturerName,
    });
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-secondary transition-all duration-300 group">
      {/* 차량 이미지 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-text-muted group-hover:scale-105 transition-transform duration-300">
          {/* TODO 썸네일 이미지 주입 */}
        </div>

        {/* 뱃지 */}
        {car.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {car.badges.map((badge) => (
              <span
                key={badge}
                className={`px-2 py-1 text-xs text-white rounded ${getBadgeColor(badge)}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 차량 정보 */}
      <div className="p-4">
        {/* 제조사 로고/이름 */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-bg-secondary rounded-full flex items-center justify-center">
            {/* TODO 제조사 로고 주입 */}
          </div>
          <span className="text-sm text-text-secondary">{manufacturerName}</span>
        </div>

        {/* 차량명 */}
        <h3 className="text-lg font-bold text-text-primary mb-1">{car.name}</h3>

        {/* 차량 설명 */}
        <p className="text-xs text-text-secondary mb-3 line-clamp-2">{car.description}</p>

        {/* 가격 정보 */}
        <div className="space-y-1 mb-4">
          <p className="text-sm">
            <span className="text-text-secondary">렌트</span>{' '}
            <span className="font-semibold text-text-primary">
              {car.rentPrice !== null ? `${car.rentPrice.toLocaleString()}원` : '비용문의'}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">리스</span>{' '}
            <span className="font-semibold text-text-primary">
              {car.leasePrice !== null ? `${car.leasePrice.toLocaleString()}원` : '비용문의'}
            </span>
          </p>
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={handleConsultClick}
          className="relative w-full py-3 bg-primary text-white rounded-lg font-medium shadow-md overflow-hidden hover:bg-primary-dark transition-colors duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out"
        >
          간편 상담 신청 &gt;
        </button>
      </div>
    </div>
  );
}
