'use client';

import { useState, useRef } from 'react';

const ALLOWED_TYPES = ['image/svg+xml', 'image/webp', 'image/png', 'image/jpeg'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
  accept?: string;
  label?: string;
}

export default function ImageUpload({
  onChange,
  currentImageUrl,
  accept = '.svg,.webp,.png,.jpg,.jpeg',
  label = '이미지 업로드',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('허용된 형식: SVG, WebP, PNG, JPG');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('파일 크기는 5MB 이하여야 합니다');
      e.target.value = '';
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const displayUrl = preview || currentImageUrl;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {displayUrl && (
          <div className="relative w-20 h-20 border border-border rounded-lg overflow-hidden bg-white">
            <img
              src={displayUrl}
              alt="미리보기"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="block w-full text-sm text-text-secondary
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-primary file:text-white
              file:cursor-pointer
              hover:file:bg-primary-dark
              cursor-pointer"
          />
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-1 text-xs text-red-500 hover:text-red-700"
            >
              제거
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
