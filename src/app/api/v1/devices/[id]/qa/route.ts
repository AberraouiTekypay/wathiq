import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { QARecord, UserRole } from '@/types/wathiq';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { qa, operatorName, role } = body as {
      qa: QARecord;
      operatorName?: string;
      role?: UserRole;
    };

    const success = WathiqStore.recordQA(
      id,
      qa,
      operatorName || 'QA Lead',
      role || 'QA'
    );

    if (!success) {
      return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `QA inspection completed. Status updated to ${qa.overallResult === 'PASS' ? 'CERTIFIED' : 'FAILED_QA'}.`,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
