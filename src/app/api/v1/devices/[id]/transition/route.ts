import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { DeviceStatus, UserRole } from '@/types/wathiq';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { toState, operatorName, role, reason } = body as {
      toState: DeviceStatus;
      operatorName?: string;
      role?: UserRole;
      reason?: string;
    };

    if (!toState) {
      return NextResponse.json(
        { success: false, error: 'Target toState is required.' },
        { status: 400 }
      );
    }

    const result = WathiqStore.transitionDevice(
      id,
      toState,
      operatorName || 'Operations Operator',
      role || 'OPERATIONS_MANAGER',
      reason || ''
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 422 });
    }

    return NextResponse.json({ success: true, data: result.device });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
