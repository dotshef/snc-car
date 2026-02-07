'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import type { ManufacturerRow, SaleCarRow } from '@/types/admin';

const BADGE_OPTIONS = ['즉시출고', '프로모션'];

interface SaleCarFormProps {
  saleCar?: SaleCarRow | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SaleCarForm({ saleCar, onSuccess, onCancel }: SaleCarFormProps) {
  const isEdit = !!saleCar;
  const [manufacturers, setManufacturers] = useState<ManufacturerRow[]>([]);
  const [manufacturerId, setManufacturerId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [leasePrice, setLeasePrice] = useState('');
  const [badges, setBadges] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/manufacturers')
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setManufacturers(result.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (saleCar) {
      setManufacturerId(String(saleCar.manufacturer_id));
      setName(saleCar.name);
      setDescription(saleCar.description || '');
      setRentPrice(saleCar.rent_price !== null ? String(saleCar.rent_price) : '');
      setLeasePrice(saleCar.lease_price !== null ? String(saleCar.lease_price) : '');
      setBadges(saleCar.badges || []);
      setIsVisible(saleCar.is_visible);
    } else {
      setManufacturerId('');
      setName('');
      setDescription('');
      setRentPrice('');
      setLeasePrice('');
      setBadges([]);
      setIsVisible(true);
    }
    setThumbnailFile(null);
    setError(null);
  }, [saleCar]);

  const toggleBadge = (badge: string) => {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!manufacturerId) {
      setError('제조사를 선택해주세요');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('manufacturer_id', manufacturerId);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('rent_price', rentPrice);
    formData.append('lease_price', leasePrice);
    formData.append('badges', JSON.stringify(badges));
    formData.append('is_visible', String(isVisible));
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    const url = isEdit
      ? `/api/admin/sale-cars/${saleCar.sale_car_id}`
      : '/api/admin/sale-cars';
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
        {isEdit ? '판매차량 수정' : '판매차량 등록'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">제조사 *</label>
          <select
            value={manufacturerId}
            onChange={(e) => setManufacturerId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          >
            <option value="">선택해주세요</option>
            {manufacturers.map((m) => (
              <option key={m.manufacturer_id} value={m.manufacturer_id}>
                {m.name} ({m.category === 'DOMESTIC' ? '국산' : '수입'})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">차량명 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="아반떼 CN7"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">렌트 가격</label>
          <input
            type="number"
            value={rentPrice}
            onChange={(e) => setRentPrice(e.target.value)}
            placeholder="미입력 시 비용문의"
            min={0}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">리스 가격</label>
          <input
            type="number"
            value={leasePrice}
            onChange={(e) => setLeasePrice(e.target.value)}
            placeholder="미입력 시 비용문의"
            min={0}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="차량 설명을 입력하세요"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">배지</label>
        <div className="flex gap-2">
          {BADGE_OPTIONS.map((badge) => (
            <button
              key={badge}
              type="button"
              onClick={() => toggleBadge(badge)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                badges.includes(badge)
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-text-secondary border-border hover:border-accent'
              }`}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sc_is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <label htmlFor="sc_is_visible" className="text-sm text-text-primary">노출</label>
      </div>

      <ImageUpload
        onChange={setThumbnailFile}
        currentImageUrl={saleCar?.thumbnail_path ?? null}
        accept=".webp,.png,.jpg,.jpeg"
        label="썸네일 이미지"
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
