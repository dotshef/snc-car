export interface SaleCarManufacturer {
  manufacturer_id: number;
  name: string;
  category: 'DOMESTIC' | 'IMPORT';
  logo_url: string | null;
}

export interface SaleCar {
  sale_car_id: number;
  manufacturer_id: number;
  name: string;
  thumbnail_url: string | null;
  rent_price: number | null;
  lease_price: number | null;
  immediate: boolean;
  manufacturer: SaleCarManufacturer | null;
}
