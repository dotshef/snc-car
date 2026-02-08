'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/admin/Pagination';
import type { SaleCarWithManufacturer, PaginatedResponse } from '@/types/admin';

export default function SaleCarsListPage() {
  const router = useRouter();
  const [data, setData] = useState<SaleCarWithManufacturer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
        {loading ? (
          <div className="p-8 text-center text-text-secondary">로딩 중...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">등록된 판매차량이 없습니다</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-primary-dark text-white text-sm">
                <th className="px-4 py-3 text-left font-medium">차량명</th>
                <th className="px-4 py-3 text-left font-medium">제조사</th>
                <th className="px-4 py-3 text-left font-medium">작성날짜</th>
                <th className="px-4 py-3 text-center font-medium">노출</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.sale_car_id}
                  onClick={() => router.push(`/admin/sale-cars/${item.sale_car_id}`)}
                  className="border-t border-border hover:bg-bg-secondary cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {item.manufacturers?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${item.is_visible ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && data.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
