'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import type { ReleasedCarRow } from '@/types/admin';

interface ReleasedCarFormProps {
  releasedCar?: ReleasedCarRow | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReleasedCarForm({ releasedCar, onSuccess, onCancel }: ReleasedCarFormProps) {
  const isEdit = !!releasedCar;
  const [carName, setCarName] = useState('');
  const [releasedAt, setReleasedAt] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (releasedCar) {
      setCarName(releasedCar.car_name);
      setReleasedAt(releasedCar.released_at);
      setIsVisible(releasedCar.is_visible);
    } else {
      setCarName('');
      setReleasedAt('');
      setIsVisible(true);
    }
    setThumbnailFile(null);
    setError(null);
  }, [releasedCar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && !thumbnailFile) {
      setError('썸네일 이미지를 첨부해주세요');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('car_name', carName);
    formData.append('released_at', releasedAt);
    formData.append('is_visible', String(isVisible));
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    const url = isEdit
      ? `/api/admin/released-cars/${releasedCar.released_car_id}`
      : '/api/admin/released-cars';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || '저장에 실패했습니다');
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">
          {isEdit ? '출고차량 수정' : '출고차량 등록'}
        </h3>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {loading ? '저장 중...' : isEdit ? '저장' : '등록'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-border text-text-secondary rounded-lg hover:bg-bg-secondary transition-colors text-sm"
          >
            취소
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">차량명 *</label>
          <input
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            required
            placeholder="현대 그랜저"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">출고일 *</label>
          <input
            type="date"
            value={releasedAt}
            onChange={(e) => setReleasedAt(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rc_is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="rc_is_visible" className="text-sm text-text-primary">메인페이지 노출</label>
      </div>

      <ImageUpload
        onChange={setThumbnailFile}
        currentImageUrl={releasedCar?.thumbnail_path ?? null}
        accept=".webp,.png,.jpg,.jpeg"
        label="썸네일 이미지 *"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

    </form>
  );
}
