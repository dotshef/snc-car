'use client';

import { usePathname } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <>
      {!isLoginPage && <AdminHeader />}
      {children}
    </>
  );
}
