'use client';

import { useState } from 'react';
import type { QuickQuoteRequest } from '@/types/quote';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickQuoteMobileModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', carName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.carName) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const data: QuickQuoteRequest = {
        ...form,
        submittedAt: new Date().toLocaleString('ko-KR'),
      };
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quote', data }),
      });
      if (!res.ok) throw new Error('전송 실패');
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        setForm({ name: '', phone: '', carName: '' });
        onClose();
      }, 2000);
    } catch {
      setError('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 배경 overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 바텀 시트 */}
      <div className="relative w-full bg-white rounded-t-2xl px-6 py-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text-primary">빠른 견적 문의</h2>
          <button
            onClick={onClose}
            className="text-text-muted text-2xl leading-none w-8 h-8 flex items-center justify-center"
          >
            &times;
          </button>
        </div>

        {isDone ? (
          <div className="py-8 text-center">
            <p className="text-success font-semibold text-base">✓ 신청 완료!</p>
            <p className="text-text-secondary text-sm mt-1">빠른 시간 내 연락드리겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary text-base"
            />
            <input
              type="tel"
              placeholder="연락처"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary text-base"
            />
            <input
              type="text"
              placeholder="차량명"
              value={form.carName}
              onChange={e => setForm(f => ({ ...f, carName: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary text-base"
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 mt-1"
            >
              {isSubmitting ? '전송 중...' : '빠른 견적 받기'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
