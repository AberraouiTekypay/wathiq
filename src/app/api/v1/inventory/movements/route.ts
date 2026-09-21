import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { LocationDetail } from '@/types/wathiq';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId') || undefined;
  const movements = WathiqStore.getMovements(deviceId);
  return NextResponse.json({ success: true, data: movements });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceId, toLocation, operatorName, reason } = body as {
      deviceId: string;
      toLocation: LocationDetail;
      operatorName?: string;
      reason?: string;
    };

    if (!deviceId || !toLocation) {
      return NextResponse.json(
        { success: false, error: 'deviceId and toLocation are required.' },
        { status: 400 }
      );
    }

    const success = WathiqStore.moveLocation(
      deviceId,
      toLocation,
      operatorName || 'Warehouse Operative',
      reason || 'Physical relocation'
    );

    if (!success) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Device relocated successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
