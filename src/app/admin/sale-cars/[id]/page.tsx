'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { SaleCarWithManufacturer } from '@/types/admin';

export default function SaleCarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<SaleCarWithManufacturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/sale-cars/${id}`);
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/sale-cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/sale-cars');
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-8 text-center text-text-secondary">로딩 중...</div>;
  }

  if (notFound || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-text-secondary mb-4">데이터를 찾을 수 없습니다</p>
        <button
          onClick={() => router.push('/admin/sale-cars')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return '비용문의';
    return `${price.toLocaleString()}원`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-bg-card rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-text-primary">{item.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/admin/sale-cars/${id}/edit`)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              수정
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
            >
              삭제
            </button>
            <button
              onClick={() => router.push('/admin/sale-cars')}
              className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-bg-secondary transition-colors text-sm"
            >
              목록
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">제조사</label>
            <p className="text-text-primary">{item.manufacturers?.name || '-'}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">메인페이지 노출여부</label>
            <p className="text-text-primary">{item.is_visible ? '노출' : '숨김'}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">렌트 가격</label>
            <p className="text-text-primary">{formatPrice(item.rent_price)}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">리스 가격</label>
            <p className="text-text-primary">{formatPrice(item.lease_price)}</p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">배지</label>
            <div className="flex gap-1">
              {item.badges && item.badges.length > 0 ? (
                item.badges.map((badge) => (
                  <span key={badge} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    {badge}
                  </span>
                ))
              ) : (
                <span className="text-text-secondary">-</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">작성일</label>
            <p className="text-text-primary">
              {item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : '-'}
            </p>
          </div>
          {item.description && (
            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-1">설명</label>
              <p className="text-text-primary whitespace-pre-wrap">{item.description}</p>
            </div>
          )}
          {item.thumbnail_path && (
            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-1">썸네일</label>
              <Image src={item.thumbnail_path} alt={item.name} width={200} height={150} className="rounded-lg object-cover" />
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={item.name}
      />
    </div>
  );
}
