'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/admin/Pagination';
import { formatDate } from '@/utils/formatters';
import type { SaleCarWithManufacturer, PaginatedResponse } from '@/types/admin';

export default function SaleCarsListPage() {
  const router = useRouter();
  const [data, setData] = useState<SaleCarWithManufacturer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState<number | null>(null);

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sale-cars?page=${p}&limit=10`);
      if (!res.ok) {
        setData([]);
        return;
      }
      const result: PaginatedResponse<SaleCarWithManufacturer> = await res.json();
      setData(result.data ?? []);
      setTotalPages(result.totalPages ?? 1);
      setTotal(result.total ?? 0);
      setPage(result.page ?? 1);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  const handleReorder = async (
    e: React.MouseEvent,
    saleCarId: number,
    direction: 'up' | 'down'
  ) => {
    e.stopPropagation();
    setReordering(saleCarId);
    try {
      const res = await fetch('/api/admin/sale-cars/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleCarId, direction }),
      });
      if (res.ok) {
        await fetchData(page);
      }
    } finally {
      setReordering(null);
    }
  };

  const isFirst = (index: number) => page === 1 && index === 0;
  const isLast = (index: number) => page === totalPages && index === data.length - 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">판매차량 관리</h1>
        <button
          onClick={() => router.push('/admin/sale-cars/new')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          + 판매차량 등록
        </button>
      </div>

      <div className="bg-bg-card rounded-xl shadow-sm overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-primary-dark text-white text-sm">
              <th className="px-3 py-3 text-center font-medium w-[12%]">순서</th>
              <th className="px-4 py-3 text-left font-medium w-[28%]">차량명</th>
              <th className="px-4 py-3 text-left font-medium w-[20%]">제조사</th>
              <th className="px-4 py-3 text-center font-medium w-[10%]">즉시출고</th>
              <th className="px-4 py-3 text-left font-medium w-[20%]">작성날짜</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary">로딩 중...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-secondary">등록된 판매차량이 없습니다</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.sale_car_id}
                  onClick={() => router.push(`/admin/sale-cars/${item.sale_car_id}`)}
                  className="border-t border-border hover:bg-bg-secondary cursor-pointer transition-colors"
                >
                  <td className="px-3 py-3 text-sm text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => handleReorder(e, item.sale_car_id, 'up')}
                        disabled={isFirst(index) || reordering === item.sale_car_id}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-text-secondary"
                        title="위로"
                      >
                        ▲
                      </button>
                      <button
                        onClick={(e) => handleReorder(e, item.sale_car_id, 'down')}
                        disabled={isLast(index) || reordering === item.sale_car_id}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-text-secondary"
                        title="아래로"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {item.manufacturers?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {item.immediate ? <span className="text-badge-immediate font-medium">해당</span> : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(item.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && total > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
