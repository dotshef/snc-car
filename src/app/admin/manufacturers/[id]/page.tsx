'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ManufacturerRow } from '@/types/admin';

export default function ManufacturerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ManufacturerRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/manufacturers/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const result = await res.json();
        setItem(result.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-8 text-center text-text-secondary">로딩 중...</div>;
  }

  if (notFound || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-text-secondary mb-4">데이터를 찾을 수 없습니다</p>
        <button
          onClick={() => router.push('/admin/manufacturers')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-bg-card rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-text-primary">{item.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/admin/manufacturers/${id}/edit`)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              수정
            </button>
            <button
              onClick={() => router.push('/admin/manufacturers')}
              className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-bg-secondary transition-colors text-sm"
            >
              목록
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">코드</label>
            <p className="text-text-primary">{item.code}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">카테고리</label>
            <p className="text-text-primary">{item.category === 'DOMESTIC' ? '국산' : '수입'}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">정렬순서</label>
            <p className="text-text-primary">{item.sort_order}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">메인페이지 노출여부</label>
            <p className="text-text-primary">{item.is_visible ? '노출' : '숨김'}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">작성일</label>
            <p className="text-text-primary">
              {item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : '-'}
            </p>
          </div>
          {item.logo_path && (
            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-1">로고</label>
              <Image src={item.logo_path} alt={item.name} width={120} height={48} className="object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
