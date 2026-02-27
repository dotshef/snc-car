'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/admin/Pagination';
import ReorderButtons from '@/components/admin/ReorderButtons';
import { formatDate } from '@/utils/formatters';
import type { ManufacturerRow, PaginatedResponse } from '@/types/admin';

export default function ManufacturersListPage() {
  const router = useRouter();
  const [data, setData] = useState<ManufacturerRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/manufacturers?page=${p}&limit=10`);
      if (!res.ok) {
        setData([]);
        return;
      }
      const result: PaginatedResponse<ManufacturerRow> = await res.json();
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

  const handleReorder = async (manufacturerId: number, direction: 'up' | 'down') => {
    if (reordering) return;
    setReordering(true);
    try {
      const res = await fetch('/api/admin/manufacturers/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manufacturerId, direction }),
      });
      if (res.ok) {
        await fetchData(page);
      }
    } catch {
      // ignore
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">제조사 관리</h1>
        <button
          onClick={() => router.push('/admin/manufacturers/new')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          + 제조사 등록
        </button>
      </div>

      <div className="bg-bg-card rounded-xl shadow-sm overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-primary-dark text-white text-sm">
              <th className="px-3 py-3 text-center font-medium w-[8%]">정렬</th>
              <th className="px-4 py-3 text-left font-medium w-[28%]">이름</th>
              <th className="px-4 py-3 text-left font-medium w-[20%]">코드</th>
              <th className="px-4 py-3 text-left font-medium w-[16%]">카테고리</th>
              <th className="px-4 py-3 text-left font-medium w-[20%]">작성날짜</th>
              <th className="px-4 py-3 text-center font-medium w-[8%]">노출</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary">로딩 중...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary">등록된 제조사가 없습니다</td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isFirst = page === 1 && index === 0;
                const isLast = page === totalPages && index === data.length - 1;

                return (
                  <tr
                    key={item.manufacturer_id}
                    className="border-t border-border hover:bg-bg-secondary transition-colors"
                  >
                    <td className="px-3 py-3 text-center">
                      <ReorderButtons
                        onUp={(e) => { e.stopPropagation(); handleReorder(item.manufacturer_id, 'up'); }}
                        onDown={(e) => { e.stopPropagation(); handleReorder(item.manufacturer_id, 'down'); }}
                        disabledUp={isFirst || reordering}
                        disabledDown={isLast || reordering}
                      />
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-text-primary font-medium cursor-pointer"
                      onClick={() => router.push(`/admin/manufacturers/${item.manufacturer_id}`)}
                    >
                      {item.name}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-text-secondary cursor-pointer"
                      onClick={() => router.push(`/admin/manufacturers/${item.manufacturer_id}`)}
                    >
                      {item.code}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-text-secondary cursor-pointer"
                      onClick={() => router.push(`/admin/manufacturers/${item.manufacturer_id}`)}
                    >
                      {item.category === 'DOMESTIC' ? '국산' : '수입'}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-text-secondary cursor-pointer"
                      onClick={() => router.push(`/admin/manufacturers/${item.manufacturer_id}`)}
                    >
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${item.is_visible ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && data.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
