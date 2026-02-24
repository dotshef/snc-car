'use client';

import { useState } from 'react';
import { PHONE_NUMBER, PHONE_TEL_LINK } from '@/data/contact';
import QuickQuoteMobileModal from '@/components/modals/QuickQuoteMobileModal';

export default function MobileBottomBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-border safe-area-bottom">
        <div className="flex">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white font-semibold text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            견적 신청
          </button>
          <a
            href={PHONE_TEL_LINK}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary-dark text-white font-semibold text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {PHONE_NUMBER}
          </a>
        </div>
      </div>

      <QuickQuoteMobileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
