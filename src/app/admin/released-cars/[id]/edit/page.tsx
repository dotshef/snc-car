'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReleasedCarForm from '@/components/admin/ReleasedCarForm';
import type { ReleasedCarRow } from '@/types/admin';

export default function ReleasedCarEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ReleasedCarRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/released-cars/${id}`);
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
          onClick={() => router.push('/admin/released-cars')}
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
        <ReleasedCarForm
          releasedCar={item}
          onSuccess={() => router.push(`/admin/released-cars/${id}`)}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
