export enum SaleCarBadge {
  IMMEDIATE = '즉시출고',
  PROMOTION = '프로모션',
}

export interface SaleCarManufacturer {
  manufacturer_id: number;
  name: string;
  category: 'DOMESTIC' | 'IMPORT';
}

export interface SaleCar {
  sale_car_id: number;
  manufacturer_id: number;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  rent_price: number | null;
  lease_price: number | null;
  badges: string[];
  manufacturer: SaleCarManufacturer | null;
}
