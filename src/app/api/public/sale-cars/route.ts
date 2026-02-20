import { createClient } from '@/lib/supabase/server';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('sale_cars')
    .select('sale_car_id, manufacturer_id, name, description, thumbnail_path, rent_price, lease_price, immediate, manufacturers!inner(manufacturer_id, name, category, is_visible)')
    .eq('is_visible', true)
    .eq('manufacturers.is_visible', true);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch sale cars' }, { status: 500 });
  }

  const transformed = (data ?? []).map((row) => {
    const mf = row.manufacturers as unknown as { manufacturer_id: number; name: string; category: string } | null;
    return {
      sale_car_id: row.sale_car_id,
      manufacturer_id: row.manufacturer_id,
      name: row.name,
      description: row.description,
      thumbnail_url: getPublicImageUrl(row.thumbnail_path),
      rent_price: row.rent_price,
      lease_price: row.lease_price,
      immediate: row.immediate ?? false,
      manufacturer: mf ? { manufacturer_id: mf.manufacturer_id, name: mf.name, category: mf.category } : null,
    };
  });

  return NextResponse.json({ data: transformed });
}
