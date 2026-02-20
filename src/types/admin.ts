export interface ManufacturerRow {
  manufacturer_id: number;
  code: string;
  name: string;
  logo_path: string;
  category: 'DOMESTIC' | 'IMPORT';
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaleCarRow {
  sale_car_id: number;
  manufacturer_id: number;
  name: string;
  description: string | null;
  thumbnail_path: string;
  rent_price: number | null;
  lease_price: number | null;
  immediate: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReleasedCarRow {
  released_car_id: number;
  car_name: string;
  thumbnail_path: string;
  released_at: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRow {
  id: number;
  username: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface SaleCarWithManufacturer extends SaleCarRow {
  manufacturers: { name: string } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
