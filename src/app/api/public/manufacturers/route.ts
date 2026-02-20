import { createClient } from '@/lib/supabase/server';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('manufacturers')
    .select('manufacturer_id, code, name, logo_path, category, sort_order')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
  }

  const transformed = (data ?? []).map((row) => ({
    manufacturer_id: row.manufacturer_id,
    code: row.code,
    name: row.name,
    logo_url: getPublicImageUrl(row.logo_path),
    category: row.category,
    sort_order: row.sort_order,
  }));

  return NextResponse.json({ data: transformed });
}
