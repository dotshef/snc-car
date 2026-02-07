'use client';

import { useEffect, useState } from 'react';
import type { ManufacturerRow } from '@/types/admin';

interface ManufacturerListProps {
  onEdit: (manufacturer: ManufacturerRow) => void;
  refreshKey: number;
}

export default function ManufacturerList({ onEdit, refreshKey }: ManufacturerListProps) {
  const [manufacturers, setManufacturers] = useState<ManufacturerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/manufacturers');
        const result = await res.json();
        if (res.ok && result.data) {
          setManufacturers(result.data);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchData();
  }, [refreshKey]);

  if (loading) {
    return <div className="text-center py-8 text-text-secondary">로딩 중...</div>;
  }

  if (manufacturers.length === 0) {
    return <div className="text-center py-8 text-text-secondary">등록된 제조사가 없습니다</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-3 px-4 font-medium text-text-secondary">로고</th>
            <th className="py-3 px-4 font-medium text-text-secondary">코드</th>
            <th className="py-3 px-4 font-medium text-text-secondary">이름</th>
            <th className="py-3 px-4 font-medium text-text-secondary">카테고리</th>
            <th className="py-3 px-4 font-medium text-text-secondary">정렬순서</th>
            <th className="py-3 px-4 font-medium text-text-secondary">노출</th>
            <th className="py-3 px-4 font-medium text-text-secondary">관리</th>
          </tr>
        </thead>
        <tbody>
          {manufacturers.map((m) => (
            <tr key={m.manufacturer_id} className="border-b border-border/50 hover:bg-bg-secondary/50">
              <td className="py-3 px-4">
                {m.logo_path ? (
                  <img
                    src={m.logo_path}
                    alt={m.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-bg-secondary rounded flex items-center justify-center text-text-muted text-xs">
                    N/A
                  </div>
                )}
              </td>
              <td className="py-3 px-4 font-mono text-xs text-text-secondary">{m.code}</td>
              <td className="py-3 px-4 font-medium text-text-primary">{m.name}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  m.category === 'DOMESTIC'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {m.category === 'DOMESTIC' ? '국산' : '수입'}
                </span>
              </td>
              <td className="py-3 px-4 text-text-secondary">{m.sort_order}</td>
              <td className="py-3 px-4">
                <span className={`w-2 h-2 rounded-full inline-block ${m.is_visible ? 'bg-green-500' : 'bg-gray-300'}`} />
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onEdit(m)}
                  className="text-accent hover:text-accent-dark text-sm font-medium"
                >
                  수정
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
