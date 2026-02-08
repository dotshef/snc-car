'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { EditButton, DeleteButton, ListButton, BackToListButton } from '@/components/admin/buttons';
import type { ReleasedCarRow } from '@/types/admin';

export default function ReleasedCarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ReleasedCarRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/released-cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/released-cars');
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
        <BackToListButton onClick={() => router.push('/admin/released-cars')} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-bg-card rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-text-primary">{item.car_name}</h1>
          <div className="flex gap-2">
            <EditButton onClick={() => router.push(`/admin/released-cars/${id}/edit`)} />
            <DeleteButton onClick={() => setShowDeleteModal(true)} disabled={deleting} />
            <ListButton onClick={() => router.push('/admin/released-cars')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">출고일</label>
            <p className="text-text-primary">{item.released_at}</p>
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
          {item.thumbnail_path && (
            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-1">썸네일</label>
              <Image src={item.thumbnail_path} alt={item.car_name} width={200} height={150} className="rounded-lg object-cover" />
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={item.car_name}
      />
    </div>
  );
}
