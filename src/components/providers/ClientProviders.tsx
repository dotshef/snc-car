'use client';

import type { ReactNode } from 'react';
import { QuoteModalProvider } from '@/hooks/useQuoteModal';
import QuoteModal from '@/components/modals/QuoteModal';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QuoteModalProvider>
      {children}
      <QuoteModal />
    </QuoteModalProvider>
  );
}
