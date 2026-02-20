import { createClient } from '@/lib/supabase/server';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('released_cars')
    .select('released_car_id, car_name, thumbnail_path, released_at')
    .eq('is_visible', true)
    .order('released_at', { ascending: false })
    .limit(6);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch released cars' }, { status: 500 });
  }

  const transformed = (data ?? []).map((row) => ({
    released_car_id: row.released_car_id,
    car_name: row.car_name,
    thumbnail_url: getPublicImageUrl(row.thumbnail_path),
    released_at: row.released_at,
  }));

  return NextResponse.json({ data: transformed });
}
