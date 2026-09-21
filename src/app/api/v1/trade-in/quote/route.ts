import { NextResponse } from 'next/server';
import { validateApiKey, hasScope } from '@/lib/api-gateway/auth';
import { computeDeviceValuation } from '@/lib/valuation/engine';
import { DeviceGrade } from '@/types/wathiq';

/**
 * WATHIQ TRADE-IN VALUATION API (§16)
 * POST /api/v1/trade-in/quote
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('X-API-Key');
    const authResult = validateApiKey(authHeader);

    if (!authResult.valid || !authResult.client) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!hasScope(authResult.client, 'tradein:quote')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: API key lacks required scope "tradein:quote"' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { category, brand, model, grade, batteryHealth, baseNewPrice } = body as {
      category?: string;
      brand?: string;
      model?: string;
      grade?: DeviceGrade;
      batteryHealth?: number;
      baseNewPrice?: number;
    };

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Field "model" is required for trade-in quote valuation.' },
        { status: 400 }
      );
    }

    const valuation = computeDeviceValuation(
      {
        category: (category as any) || 'Laptop',
        brand: brand || 'Generic',
        model,
        grade: grade || 'A',
        batteryHealth: batteryHealth !== undefined ? batteryHealth : 88,
      },
      baseNewPrice
    );

    const expiryDate = new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10);

    return NextResponse.json({
      success: true,
      quote_id: `TIQ-2026-${Date.now().toString().slice(-6)}`,
      device: {
        category: category || 'Laptop',
        brand: brand || 'Generic',
        model,
        grade: grade || 'A',
        battery_health_pct: batteryHealth || 88,
      },
      valuation: {
        estimated_market_value: valuation.marketValue,
        trade_in_value: valuation.tradeInValue,
        recommended_offer: valuation.tradeInValue,
        wholesale_value: valuation.wholesaleValue,
        expected_residual_value_12m: valuation.expectedResidualValue12m,
        currency: valuation.currency,
        basis: valuation.valuationBasis,
      },
      valid_until: expiryDate,
      issued_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error computing trade-in quote' },
      { status: 500 }
    );
  }
}
