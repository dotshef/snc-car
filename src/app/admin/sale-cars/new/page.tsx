'use client';

import { useRouter } from 'next/navigation';
import SaleCarForm from '@/components/admin/SaleCarForm';

export default function SaleCarNewPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-bg-card rounded-xl shadow-sm p-6">
        <SaleCarForm
          onSuccess={() => router.push('/admin/sale-cars')}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
