import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const body = await request.json();
  const { manufacturerId, direction } = body as {
    manufacturerId: number;
    direction: 'up' | 'down';
  };

  if (!manufacturerId || !['up', 'down'].includes(direction)) {
    return NextResponse.json(
      { error: 'manufacturerId와 direction(up/down)이 필요합니다' },
      { status: 400 }
    );
  }

  // Get current manufacturer
  const { data: current, error: currentError } = await supabase
    .from('manufacturers')
    .select('manufacturer_id, sort_order')
    .eq('manufacturer_id', manufacturerId)
    .single();

  if (currentError || !current) {
    return NextResponse.json({ error: '제조사를 찾을 수 없습니다' }, { status: 404 });
  }

  // Find adjacent manufacturer based on direction
  const isUp = direction === 'up';
  let adjacentQuery = supabase
    .from('manufacturers')
    .select('manufacturer_id, sort_order');

  if (isUp) {
    adjacentQuery = adjacentQuery
      .lt('sort_order', current.sort_order)
      .order('sort_order', { ascending: false });
  } else {
    adjacentQuery = adjacentQuery
      .gt('sort_order', current.sort_order)
      .order('sort_order', { ascending: true });
  }

  const { data: adjacentItem, error: adjError } = await adjacentQuery
    .limit(1)
    .maybeSingle();

  if (adjError || !adjacentItem) {
    return NextResponse.json(
      { error: isUp ? '이미 최상단입니다' : '이미 최하단입니다' },
      { status: 400 }
    );
  }

  // Swap sort_order values
  const { error: updateError1 } = await supabase
    .from('manufacturers')
    .update({ sort_order: adjacentItem.sort_order, updated_at: new Date().toISOString() })
    .eq('manufacturer_id', current.manufacturer_id);

  if (updateError1) {
    return NextResponse.json({ error: '정렬 변경 실패' }, { status: 500 });
  }

  const { error: updateError2 } = await supabase
    .from('manufacturers')
    .update({ sort_order: current.sort_order, updated_at: new Date().toISOString() })
    .eq('manufacturer_id', adjacentItem.manufacturer_id);

  if (updateError2) {
    // Rollback first update
    await supabase
      .from('manufacturers')
      .update({ sort_order: current.sort_order, updated_at: new Date().toISOString() })
      .eq('manufacturer_id', current.manufacturer_id);
    return NextResponse.json({ error: '정렬 변경 실패' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
