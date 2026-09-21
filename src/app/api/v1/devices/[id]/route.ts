import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const device = WathiqStore.getDeviceById(id);

  if (!device) {
    return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
  }

  const events = WathiqStore.getEvents(device.id);

  return NextResponse.json({
    success: true,
    data: {
      ...device,
      events,
    },
  });
}
