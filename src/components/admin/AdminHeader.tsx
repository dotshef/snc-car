'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: '제조사', href: '/admin/manufacturers' },
  { label: '판매차량', href: '/admin/sale-cars' },
  { label: '출고차량', href: '/admin/released-cars' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white via-gray-50 to-white border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 sm:h-20">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="S&C" width={100} height={40} className="sm:w-[120px]" />
          </Link>
          <nav className="flex items-center justify-center gap-1 sm:gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 sm:px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm sm:text-base font-medium text-text-secondary hover:text-primary transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
