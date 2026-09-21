import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { DeviceStatus } from '@/types/wathiq';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as DeviceStatus | undefined;
  const category = searchParams.get('category') || undefined;
  const query = searchParams.get('q') || undefined;

  const devices = WathiqStore.getDevices({ status, category, query });
  return NextResponse.json({
    success: true,
    total: devices.length,
    data: devices,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceData, operatorName, role } = body;

    if (!deviceData || !deviceData.serialNumber || !deviceData.model) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: model and serialNumber are mandatory.' },
        { status: 400 }
      );
    }

    // Enforce Serial Number uniqueness
    const existing = WathiqStore.getDeviceById(deviceData.serialNumber);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `A physical device with Serial Number "${deviceData.serialNumber}" already exists (${existing.id}). Uniqueness is strictly enforced.`,
        },
        { status: 409 }
      );
    }

    const created = WathiqStore.createDevice(deviceData, operatorName, role);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create device' }, { status: 500 });
  }
}
