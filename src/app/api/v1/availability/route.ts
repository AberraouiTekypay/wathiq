import { NextResponse } from 'next/server';
import { WathiqStore } from '@/lib/store';
import { validateApiKey, hasScope } from '@/lib/api-gateway/auth';

/**
 * WATHIQ INVENTORY AVAILABILITY API (§14)
 * GET /api/v1/availability
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const grade = searchParams.get('grade') || undefined;
    const requestedQty = parseInt(searchParams.get('quantity') || '1', 10);

    const allDevices = WathiqStore.getDevices({
      status: 'READY_FOR_SALE',
      category,
    });

    let filtered = allDevices;
    if (brand) {
      filtered = filtered.filter((d) => d.brand.toLowerCase() === brand.toLowerCase());
    }
    if (grade) {
      filtered = filtered.filter((d) => d.grade === grade);
    }

    const availableCount = filtered.length;
    const canFulfill = availableCount >= requestedQty;

    return NextResponse.json({
      success: true,
      query: {
        category: category || 'ALL',
        brand: brand || 'ALL',
        grade: grade || 'ALL',
        requested_quantity: requestedQty,
      },
      available_units_in_stock: availableCount,
      can_fulfill_quantity: canFulfill,
      available_devices: filtered.slice(0, requestedQty).map((d) => ({
        device_id: d.id,
        serial_number: d.serialNumber,
        model: d.model,
        grade: d.grade,
        battery_health: d.batteryHealth,
        selling_price_mad: d.pricing.sellingPrice,
        location_bin: d.location.bin,
      })),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error checking availability' },
      { status: 500 }
    );
  }
}
