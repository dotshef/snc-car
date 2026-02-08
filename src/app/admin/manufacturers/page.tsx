'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/admin/Pagination';
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
        {loading ? (
          <div className="p-8 text-center text-text-secondary">로딩 중...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">등록된 제조사가 없습니다</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-primary-dark text-white text-sm">
                <th className="px-3 py-3 text-center font-medium w-20">정렬</th>
                <th className="px-4 py-3 text-left font-medium">이름</th>
                <th className="px-4 py-3 text-left font-medium">코드</th>
                <th className="px-4 py-3 text-left font-medium">카테고리</th>
                <th className="px-4 py-3 text-left font-medium">작성날짜</th>
                <th className="px-4 py-3 text-center font-medium">노출</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const isFirst = page === 1 && index === 0;
                const isLast = page === totalPages && index === data.length - 1;

                return (
                  <tr
                    key={item.manufacturer_id}
                    className="border-t border-border hover:bg-bg-secondary transition-colors"
                  >
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          disabled={isFirst || reordering}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(item.manufacturer_id, 'up');
                          }}
                          className={`p-1 rounded transition-colors ${
                            isFirst || reordering
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-text-secondary hover:text-primary hover:bg-bg-secondary'
                          }`}
                          title="위로 이동"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          disabled={isLast || reordering}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(item.manufacturer_id, 'down');
                          }}
                          className={`p-1 rounded transition-colors ${
                            isLast || reordering
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-text-secondary hover:text-primary hover:bg-bg-secondary'
                          }`}
                          title="아래로 이동"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                      </div>
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
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${item.is_visible ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </td>
                  </tr>
                );
              })}
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
