'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import type { ManufacturerRow } from '@/types/admin';

interface ManufacturerFormProps {
  manufacturer?: ManufacturerRow | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ManufacturerForm({ manufacturer, onSuccess, onCancel }: ManufacturerFormProps) {
  const isEdit = !!manufacturer;
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'DOMESTIC' | 'IMPORT'>('DOMESTIC');
  const [sortOrder, setSortOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (manufacturer) {
      setCode(manufacturer.code);
      setName(manufacturer.name);
      setCategory(manufacturer.category);
      setSortOrder(manufacturer.sort_order);
      setIsVisible(manufacturer.is_visible);
    } else {
      setCode('');
      setName('');
      setCategory('DOMESTIC');
      setSortOrder(0);
      setIsVisible(true);
    }
    setLogoFile(null);
    setError(null);
  }, [manufacturer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('code', code);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('sort_order', String(sortOrder));
    formData.append('is_visible', String(isVisible));
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    const url = isEdit
      ? `/api/admin/manufacturers/${manufacturer.manufacturer_id}`
      : '/api/admin/manufacturers';
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
      <h3 className="text-lg font-bold text-text-primary">
        {isEdit ? '제조사 수정' : '제조사 등록'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">코드</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="hyundai"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="현대"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'DOMESTIC' | 'IMPORT')}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          >
            <option value="DOMESTIC">국산</option>
            <option value="IMPORT">수입</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">정렬순서</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            min={0}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <label htmlFor="is_visible" className="text-sm text-text-primary">노출</label>
      </div>

      <ImageUpload
        onChange={setLogoFile}
        currentImageUrl={manufacturer?.logo_path ?? null}
        label="로고 이미지"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {loading ? '저장 중...' : isEdit ? '수정' : '등록'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-border text-text-secondary rounded-lg hover:bg-bg-secondary transition-colors text-sm"
        >
          취소
        </button>
      </div>
    </form>
  );
}
