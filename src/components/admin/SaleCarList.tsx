'use client';

import { useEffect, useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import type { SaleCarRow } from '@/types/admin';

interface SaleCarWithManufacturer extends SaleCarRow {
  manufacturers: { name: string } | null;
}

interface SaleCarListProps {
  onEdit: (saleCar: SaleCarRow) => void;
  onDeleted: () => void;
  refreshKey: number;
}

export default function SaleCarList({ onEdit, onDeleted, refreshKey }: SaleCarListProps) {
  const [saleCars, setSaleCars] = useState<SaleCarWithManufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SaleCarWithManufacturer | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/sale-cars');
        const result = await res.json();
        if (res.ok && result.data) {
          setSaleCars(result.data as SaleCarWithManufacturer[]);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchData();
  }, [refreshKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/sale-cars/${deleteTarget.sale_car_id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteTarget(null);
        onDeleted();
      }
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return '비용문의';
    return price.toLocaleString() + '원';
  };

  if (loading) {
    return <div className="text-center py-8 text-text-secondary">로딩 중...</div>;
  }

  if (saleCars.length === 0) {
    return <div className="text-center py-8 text-text-secondary">등록된 판매차량이 없습니다</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 px-4 font-medium text-text-secondary">이미지</th>
              <th className="py-3 px-4 font-medium text-text-secondary">차량명</th>
              <th className="py-3 px-4 font-medium text-text-secondary">제조사</th>
              <th className="py-3 px-4 font-medium text-text-secondary">렌트</th>
              <th className="py-3 px-4 font-medium text-text-secondary">리스</th>
              <th className="py-3 px-4 font-medium text-text-secondary">배지</th>
              <th className="py-3 px-4 font-medium text-text-secondary">노출</th>
              <th className="py-3 px-4 font-medium text-text-secondary">관리</th>
            </tr>
          </thead>
          <tbody>
            {saleCars.map((car) => (
              <tr key={car.sale_car_id} className="border-b border-border/50 hover:bg-bg-secondary/50">
                <td className="py-3 px-4">
                  {car.thumbnail_path ? (
                    <img
                      src={car.thumbnail_path}
                      alt={car.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-bg-secondary rounded flex items-center justify-center text-text-muted text-xs">
                      N/A
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-text-primary">{car.name}</td>
                <td className="py-3 px-4 text-text-secondary">{car.manufacturers?.name || '-'}</td>
                <td className="py-3 px-4 text-text-secondary">{formatPrice(car.rent_price)}</td>
                <td className="py-3 px-4 text-text-secondary">{formatPrice(car.lease_price)}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1 flex-wrap">
                    {car.badges.map((badge, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-accent/10 text-accent">
                        {badge}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`w-2 h-2 rounded-full inline-block ${car.is_visible ? 'bg-green-500' : 'bg-gray-300'}`} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(car)}
                      className="text-accent hover:text-accent-dark text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setDeleteTarget(car)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name || ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-4 text-sm">삭제 중...</div>
        </div>
      )}
    </>
  );
}
