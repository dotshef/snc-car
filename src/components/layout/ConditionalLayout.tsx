'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import MobileBottomBar from './MobileBottomBar';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <div className="pb-[60px] md:pb-0">{children}</div>}
      {isAdmin && children}
      {!isAdmin && <MobileBottomBar />}
    </>
  );
}
