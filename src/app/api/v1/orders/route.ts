import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { Order } from '@/types/wathiq';

export async function GET() {
  const orders = WathiqStore.getOrders();
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = WathiqStore.createOrder(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body as { orderId: string; status: Order['status'] };
    const ok = WathiqStore.updateOrderStatus(orderId, status);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
