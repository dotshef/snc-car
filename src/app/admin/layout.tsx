import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: 'S&C Admin',
  description: 'S&C 신차 장기 렌트/리스 관리자 페이지',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </div>
  );
}
