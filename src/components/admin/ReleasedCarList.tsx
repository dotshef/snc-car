'use client';

import { useEffect, useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import type { ReleasedCarRow } from '@/types/admin';

interface ReleasedCarListProps {
  onEdit: (releasedCar: ReleasedCarRow) => void;
  onDeleted: () => void;
  refreshKey: number;
}

export default function ReleasedCarList({ onEdit, onDeleted, refreshKey }: ReleasedCarListProps) {
  const [releasedCars, setReleasedCars] = useState<ReleasedCarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ReleasedCarRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/released-cars');
        const result = await res.json();
        if (res.ok && result.data) {
          setReleasedCars(result.data);
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
      const res = await fetch(`/api/admin/released-cars/${deleteTarget.released_car_id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteTarget(null);
        onDeleted();
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-text-secondary">로딩 중...</div>;
  }

  if (releasedCars.length === 0) {
    return <div className="text-center py-8 text-text-secondary">등록된 출고차량이 없습니다</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 px-4 font-medium text-text-secondary">이미지</th>
              <th className="py-3 px-4 font-medium text-text-secondary">차량명</th>
              <th className="py-3 px-4 font-medium text-text-secondary">출고일</th>
              <th className="py-3 px-4 font-medium text-text-secondary">노출</th>
              <th className="py-3 px-4 font-medium text-text-secondary">관리</th>
            </tr>
          </thead>
          <tbody>
            {releasedCars.map((car) => (
              <tr key={car.released_car_id} className="border-b border-border/50 hover:bg-bg-secondary/50">
                <td className="py-3 px-4">
                  {car.thumbnail_path ? (
                    <img
                      src={car.thumbnail_path}
                      alt={car.car_name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-bg-secondary rounded flex items-center justify-center text-text-muted text-xs">
                      N/A
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-text-primary">{car.car_name}</td>
                <td className="py-3 px-4 text-text-secondary">{car.released_at}</td>
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
        itemName={deleteTarget?.car_name || ''}
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
