'use client';

import type { SaleCar } from '@/types/saleCar';
import Image from "next/image";
import { useQuoteModal } from '@/hooks/useQuoteModal';

interface SaleCarCardProps {
  car: SaleCar;
}

export default function SaleCarCard({ car }: SaleCarCardProps) {
  const manufacturerName = car.manufacturer?.name ?? '';
  const { openModal } = useQuoteModal();

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-secondary transition-all duration-300 group">
      {/* 차량 이미지 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        <div className="absolute inset-5 flex items-center justify-center text-text-muted group-hover:scale-105 transition-transform duration-300">
          {car.thumbnail_url ? (
            <Image
              src={car.thumbnail_url}
              alt={car.name}
              fill
              className="object-contain"
            />
          ) : null}
        </div>

        {/* 즉시출고 뱃지 */}
        {car.immediate && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs text-white rounded bg-badge-immediate">
              즉시출고
            </span>
          </div>
        )}
      </div>

      {/* 차량 정보 */}
      <div className="p-4">

        {/* 차량명 */}
        <div className="flex items-center gap-2 mb-2">
          {car.manufacturer?.logo_url ? (
            <Image src={car.manufacturer.logo_url} alt={manufacturerName} width={32} height={20} className="object-contain shrink-0" />
          ) : (
            <span className="text-sm text-text-secondary shrink-0">{manufacturerName}</span>
          )}
          <h3 className="text-xl font-bold text-text-primary">{car.name}</h3>
        </div>

        {/* 가격 정보 */}
        <div className="space-y-1.5 mb-4">
          <p className="text-base flex justify-between">
            <span className="text-text-secondary">렌트</span>
            <span className="font-semibold text-text-primary">
              {car.rent_price !== null ? `${car.rent_price.toLocaleString()}원` : '비용문의'}
            </span>
          </p>
          <p className="text-base flex justify-between">
            <span className="text-text-secondary">리스</span>
            <span className="font-semibold text-text-primary">
              {car.lease_price !== null ? `${car.lease_price.toLocaleString()}원` : '비용문의'}
            </span>
          </p>
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={() => openModal({ name: car.name, manufacturerName })}
          className="relative w-full py-3 bg-primary text-white rounded-lg font-medium shadow-md overflow-hidden hover:bg-primary-dark transition-colors duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out flex items-center justify-center"
        >
          간편 상담 신청 &gt;
        </button>
      </div>
    </div>
  );
}
