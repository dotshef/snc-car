'use client';

import { SaleCarBadge, type SaleCar } from '@/types/saleCar';
import { useQuoteModal } from '@/hooks/useQuoteModal';

interface SaleCarCardProps {
  car: SaleCar;
}

function getBadgeColor(badge: string): string {
  switch (badge) {
    case SaleCarBadge.IMMEDIATE:
      return 'bg-badge-immediate';
    case SaleCarBadge.PROMOTION:
      return 'bg-badge-promotion';
    default:
      return 'bg-secondary';
  }
}

export default function SaleCarCard({ car }: SaleCarCardProps) {
  const { openModal } = useQuoteModal();

  const manufacturerName = car.manufacturer?.name ?? '';

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
          {car.thumbnail_url ? (
            <img
              src={car.thumbnail_url}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          ) : null}
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
        {/* 제조사 이름 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-text-secondary">{manufacturerName}</span>
        </div>

        {/* 차량명 */}
        <h3 className="text-lg font-bold text-text-primary mb-1">{car.name}</h3>

        {/* 차량 설명 */}
        {car.description && (
          <p className="text-xs text-text-secondary mb-3 line-clamp-2">{car.description}</p>
        )}

        {/* 가격 정보 */}
        <div className="space-y-1 mb-4">
          <p className="text-sm">
            <span className="text-text-secondary">렌트</span>{' '}
            <span className="font-semibold text-text-primary">
              {car.rent_price !== null ? `${car.rent_price.toLocaleString()}원` : '비용문의'}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">리스</span>{' '}
            <span className="font-semibold text-text-primary">
              {car.lease_price !== null ? `${car.lease_price.toLocaleString()}원` : '비용문의'}
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
