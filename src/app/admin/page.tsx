'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminTabs, { type AdminTab } from '@/components/admin/AdminTabs';
import ManufacturerList from '@/components/admin/ManufacturerList';
import ManufacturerForm from '@/components/admin/ManufacturerForm';
import SaleCarList from '@/components/admin/SaleCarList';
import SaleCarForm from '@/components/admin/SaleCarForm';
import ReleasedCarList from '@/components/admin/ReleasedCarList';
import ReleasedCarForm from '@/components/admin/ReleasedCarForm';
import type { ManufacturerRow, SaleCarRow, ReleasedCarRow } from '@/types/admin';

type ViewMode = 'list' | 'create' | 'edit';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('manufacturers');

  // Manufacturer state
  const [mfrMode, setMfrMode] = useState<ViewMode>('list');
  const [editingMfr, setEditingMfr] = useState<ManufacturerRow | null>(null);
  const [mfrRefreshKey, setMfrRefreshKey] = useState(0);

  // Sale car state
  const [scMode, setScMode] = useState<ViewMode>('list');
  const [editingSc, setEditingSc] = useState<SaleCarRow | null>(null);
  const [scRefreshKey, setScRefreshKey] = useState(0);

  // Released car state
  const [rcMode, setRcMode] = useState<ViewMode>('list');
  const [editingRc, setEditingRc] = useState<ReleasedCarRow | null>(null);
  const [rcRefreshKey, setRcRefreshKey] = useState(0);

  // Manufacturer handlers
  const handleMfrEdit = useCallback((m: ManufacturerRow) => {
    setEditingMfr(m);
    setMfrMode('edit');
  }, []);
  const handleMfrSuccess = useCallback(() => {
    setMfrMode('list');
    setEditingMfr(null);
    setMfrRefreshKey((k) => k + 1);
  }, []);
  const handleMfrCancel = useCallback(() => {
    setMfrMode('list');
    setEditingMfr(null);
  }, []);

  // Sale car handlers
  const handleScEdit = useCallback((s: SaleCarRow) => {
    setEditingSc(s);
    setScMode('edit');
  }, []);
  const handleScSuccess = useCallback(() => {
    setScMode('list');
    setEditingSc(null);
    setScRefreshKey((k) => k + 1);
  }, []);
  const handleScCancel = useCallback(() => {
    setScMode('list');
    setEditingSc(null);
  }, []);
  const handleScDeleted = useCallback(() => {
    setScRefreshKey((k) => k + 1);
  }, []);

  // Released car handlers
  const handleRcEdit = useCallback((r: ReleasedCarRow) => {
    setEditingRc(r);
    setRcMode('edit');
  }, []);
  const handleRcSuccess = useCallback(() => {
    setRcMode('list');
    setEditingRc(null);
    setRcRefreshKey((k) => k + 1);
  }, []);
  const handleRcCancel = useCallback(() => {
    setRcMode('list');
    setEditingRc(null);
  }, []);
  const handleRcDeleted = useCallback(() => {
    setRcRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">S&C Admin</h1>
          <p className="text-sm text-text-secondary mt-1">콘텐츠 관리 시스템</p>
        </div>
        <button
          onClick={async () => {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
          }}
          className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-bg-secondary transition-colors"
        >
          로그아웃
        </button>
      </div>

      <div className="bg-bg-card rounded-xl shadow-sm">
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6">
          {/* 제조사 관리 */}
          {activeTab === 'manufacturers' && (
            <div>
              {mfrMode === 'list' && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-text-primary">제조사 목록</h2>
                    <button
                      onClick={() => setMfrMode('create')}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm font-medium"
                    >
                      + 제조사 등록
                    </button>
                  </div>
                  <ManufacturerList onEdit={handleMfrEdit} refreshKey={mfrRefreshKey} />
                </>
              )}
              {(mfrMode === 'create' || mfrMode === 'edit') && (
                <ManufacturerForm
                  manufacturer={mfrMode === 'edit' ? editingMfr : null}
                  onSuccess={handleMfrSuccess}
                  onCancel={handleMfrCancel}
                />
              )}
            </div>
          )}

          {/* 판매차량 관리 */}
          {activeTab === 'sale-cars' && (
            <div>
              {scMode === 'list' && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-text-primary">판매차량 목록</h2>
                    <button
                      onClick={() => setScMode('create')}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm font-medium"
                    >
                      + 판매차량 등록
                    </button>
                  </div>
                  <SaleCarList onEdit={handleScEdit} onDeleted={handleScDeleted} refreshKey={scRefreshKey} />
                </>
              )}
              {(scMode === 'create' || scMode === 'edit') && (
                <SaleCarForm
                  saleCar={scMode === 'edit' ? editingSc : null}
                  onSuccess={handleScSuccess}
                  onCancel={handleScCancel}
                />
              )}
            </div>
          )}

          {/* 출고차량 관리 */}
          {activeTab === 'released-cars' && (
            <div>
              {rcMode === 'list' && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-text-primary">출고차량 목록</h2>
                    <button
                      onClick={() => setRcMode('create')}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm font-medium"
                    >
                      + 출고차량 등록
                    </button>
                  </div>
                  <ReleasedCarList onEdit={handleRcEdit} onDeleted={handleRcDeleted} refreshKey={rcRefreshKey} />
                </>
              )}
              {(rcMode === 'create' || rcMode === 'edit') && (
                <ReleasedCarForm
                  releasedCar={rcMode === 'edit' ? editingRc : null}
                  onSuccess={handleRcSuccess}
                  onCancel={handleRcCancel}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
