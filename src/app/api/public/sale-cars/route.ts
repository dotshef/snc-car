import { createClient } from '@/lib/supabase/server';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('sale_cars')
    .select('sale_car_id, manufacturer_id, name, description, thumbnail_path, rent_price, lease_price, badges, manufacturers(manufacturer_id, name, category)')
    .eq('is_visible', true);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch sale cars' }, { status: 500 });
  }

  const transformed = (data ?? []).map((row) => ({
    sale_car_id: row.sale_car_id,
    manufacturer_id: row.manufacturer_id,
    name: row.name,
    description: row.description,
    thumbnail_url: row.thumbnail_path ? getPublicImageUrl(row.thumbnail_path) : null,
    rent_price: row.rent_price,
    lease_price: row.lease_price,
    badges: row.badges ?? [],
    manufacturer: row.manufacturers ?? null,
  }));

  return NextResponse.json({ data: transformed });
}
