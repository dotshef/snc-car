'use client';

import { useRouter } from 'next/navigation';
import ReleasedCarForm from '@/components/admin/ReleasedCarForm';

export default function ReleasedCarNewPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-bg-card rounded-xl shadow-sm p-6">
        <ReleasedCarForm
          onSuccess={() => router.push('/admin/released-cars')}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
