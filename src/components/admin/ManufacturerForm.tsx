'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { SaveButton, CancelButton } from './buttons';
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
  const [isVisible, setIsVisible] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (manufacturer) {
      setCode(manufacturer.code);
      setName(manufacturer.name);
      setCategory(manufacturer.category);
      setIsVisible(manufacturer.is_visible);
    } else {
      setCode('');
      setName('');
      setCategory('DOMESTIC');
      setIsVisible(true);
    }
    setLogoFile(null);
    setError(null);
  }, [manufacturer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && !logoFile) {
      setError('로고 이미지를 첨부해주세요');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('code', code);
    formData.append('name', name);
    formData.append('category', category);
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">
          {isEdit ? '제조사 수정' : '제조사 등록'}
        </h3>
        <div className="flex gap-3">
          <SaveButton loading={loading} isEdit={isEdit} />
          <CancelButton onClick={onCancel} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">코드</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="hyundai"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'DOMESTIC' | 'IMPORT')}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="DOMESTIC">국산</option>
            <option value="IMPORT">수입</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="is_visible" className="text-sm text-text-primary">메인페이지 노출</label>
      </div>

      <ImageUpload
        onChange={setLogoFile}
        currentImageUrl={manufacturer?.logo_path ?? null}
        label="로고 이미지 *"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

    </form>
  );
}
