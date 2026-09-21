import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { DiagnosticsRecord, UserRole } from '@/types/wathiq';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { diagnostics, operatorName, role } = body as {
      diagnostics: DiagnosticsRecord;
      operatorName?: string;
      role?: UserRole;
    };

    const success = WathiqStore.recordDiagnostics(
      id,
      diagnostics,
      operatorName || 'Diagnostics Tech',
      role || 'TECHNICIAN'
    );

    if (!success) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Diagnostics saved successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
