import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';

export async function GET() {
  const analytics = WathiqStore.getAnalytics();
  return NextResponse.json({ success: true, data: analytics });
}
