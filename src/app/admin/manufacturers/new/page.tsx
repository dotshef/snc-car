'use client';

import { useRouter } from 'next/navigation';
import ManufacturerForm from '@/components/admin/ManufacturerForm';

export default function ManufacturerNewPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-bg-card rounded-xl shadow-sm p-6">
        <ManufacturerForm
          onSuccess={() => router.push('/admin/manufacturers')}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
