import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { RepairRecord, UserRole } from '@/types/wathiq';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { repair, operatorName, role } = body as {
      repair: RepairRecord;
      operatorName?: string;
      role?: UserRole;
    };

    const success = WathiqStore.recordRepair(
      id,
      repair,
      operatorName || 'Hardware Technician',
      role || 'TECHNICIAN'
    );

    if (!success) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Repair ticket saved and costs rolled up into unit economics' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
