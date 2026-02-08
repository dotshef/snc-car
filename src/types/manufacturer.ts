export type ManufacturerCategory = 'DOMESTIC' | 'IMPORT';

export interface Manufacturer {
  manufacturer_id: number;
  code: string;
  name: string;
  logo_url: string | null;
  category: ManufacturerCategory;
  sort_order: number;
}
