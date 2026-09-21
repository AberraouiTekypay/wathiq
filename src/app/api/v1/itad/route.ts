import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';

export async function GET() {
  const batches = WathiqStore.getITADBatches();
  return NextResponse.json({ success: true, data: batches });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = WathiqStore.createITADBatch(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create ITAD batch' }, { status: 500 });
  }
}
