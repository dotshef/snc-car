'use client';

import { useState } from 'react';
import type { QuickQuoteRequest } from '@/types/quote';
import { PHONE_TEL_LINK, PHONE_NUMBER } from '@/data/contact';

const KAKAO_URL = 'https://open.kakao.com/o/s1tj93hi';

export default function QuickQuoteWidget() {
  const [form, setForm] = useState({ name: '', phone: '', carName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

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
        body: JSON.stringify({ type: 'quickQuote', data }),
      });
      if (!res.ok) throw new Error('전송 실패');
      setIsDone(true);
    } catch {
      setError('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col w-52 shadow-xl rounded-l-xl overflow-hidden border border-border/50">
      {/* 헤더 */}
      <div className="bg-primary px-4 py-3 text-white text-center font-bold text-sm">
        빠른 견적 문의
      </div>

      {/* 폼 / 완료 */}
      {isDone ? (
        <div className="bg-white px-4 py-6 text-center">
          <p className="text-success font-semibold text-sm">✓ 신청 완료!</p>
          <p className="text-text-secondary text-xs mt-1">빠른 시간 내 연락드리겠습니다.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white px-3 py-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="성명"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary"
          />
          <input
            type="tel"
            placeholder="연락처"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="차량명"
            value={form.carName}
            onChange={e => setForm(f => ({ ...f, carName: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary"
          />
          {error && <p className="text-error text-xs">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {isSubmitting ? '전송 중...' : '빠른 견적 받기'}
          </button>
        </form>
      )}

      {/* 전화 버튼 */}
      <a
        href={PHONE_TEL_LINK}
        className="flex items-center justify-between bg-primary-dark px-4 py-3 text-white hover:bg-primary transition-colors"
      >
        <div>
          <div className="text-xs text-white/70">전화상담</div>
          <div className="text-sm font-bold">{PHONE_NUMBER}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>

      {/* 카카오 버튼 */}
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-[#FEE500] px-4 py-3 text-[#3C1E1E] hover:brightness-95 transition-all"
      >
        <div>
          <div className="text-xs text-[#3C1E1E]/60">빠르고 편한</div>
          <div className="text-sm font-bold">카카오톡 상담</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.72 1.6 5.12 4 6.56V21l3.52-2.08C10.3 19.3 11.14 19.4 12 19.4c5.52 0 10-3.48 10-8.4S17.52 3 12 3z"/>
        </svg>
      </a>
    </div>
  );
}
