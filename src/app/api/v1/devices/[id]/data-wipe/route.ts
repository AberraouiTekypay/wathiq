import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { DataWipeRecord, UserRole } from '@/types/wathiq';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { wipeData, operatorName, role } = body as {
      wipeData: DataWipeRecord;
      operatorName?: string;
      role?: UserRole;
    };

    const success = WathiqStore.recordDataWipe(
      id,
      wipeData,
      operatorName || 'Data Sanitization Officer',
      role || 'OPERATIONS_MANAGER'
    );

    if (!success) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Data wipe certificate recorded successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
