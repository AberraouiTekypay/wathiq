import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { B2BQuote } from '@/types/wathiq';

export async function GET() {
  const quotes = WathiqStore.getQuotes();
  return NextResponse.json({ success: true, data: quotes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = WathiqStore.createQuote(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create quote' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, status } = body as { quoteId: string; status: B2BQuote['status'] };
    const ok = WathiqStore.updateQuoteStatus(quoteId, status);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update quote' }, { status: 500 });
  }
}
