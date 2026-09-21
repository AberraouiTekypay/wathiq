import { ApiClient, ApiScope } from '@/types/wathiq';

/**
 * Multi-Tenant API Gateway Auth & Scopes (§18, §19, §20, §22)
 */

export const INITIAL_API_CLIENTS: ApiClient[] = [
  {
    id: 'CLI-001',
    organizationId: 'ORG-ELECTROPLANET',
    organizationName: 'Electroplanet Morocco (Retailer Partner)',
    name: 'Electroplanet POS & Trade-In Integration',
    apiKeyPrefix: 'wth_live_ep_849201',
    scopes: ['device:read', 'device:verify', 'tradein:quote', 'warranty:read'],
    rateLimitPerMin: 120,
    monthlyQuota: 10000,
    monthlyUsage: 1420,
    status: 'ACTIVE',
    createdAt: '2026-08-01',
  },
  {
    id: 'CLI-002',
    organizationId: 'ORG-WEBHELP',
    organizationName: 'Webhelp Nearshore Procurement',
    name: 'Webhelp IT Fleet Auto-Provisioning',
    apiKeyPrefix: 'wth_live_wh_339102',
    scopes: ['device:read', 'inventory:read', 'orders:create', 'warranty:read', 'warranty:write'],
    rateLimitPerMin: 60,
    monthlyQuota: 5000,
    monthlyUsage: 450,
    status: 'ACTIVE',
    createdAt: '2026-08-15',
  },
];

export function validateApiKey(apiKey?: string | null): {
  valid: boolean;
  client?: ApiClient;
  error?: string;
} {
  if (!apiKey) {
    return { valid: false, error: 'Missing Authorization header or X-API-Key' };
  }

  // Accept test development key or registered client
  if (apiKey === 'wth_dev_test_key_2026' || apiKey.startsWith('Bearer wth_')) {
    return {
      valid: true,
      client: {
        id: 'CLI-DEV',
        organizationId: 'ORG-DEVELOPER-SANDBOX',
        organizationName: 'Wathiq Developer Sandbox',
        name: 'Sandbox Test Client',
        apiKeyPrefix: 'wth_dev',
        scopes: [
          'device:read',
          'device:verify',
          'device:certify',
          'inventory:read',
          'tradein:quote',
          'warranty:read',
          'warranty:write',
        ],
        rateLimitPerMin: 500,
        monthlyQuota: 100000,
        monthlyUsage: 12,
        status: 'ACTIVE',
        createdAt: '2026-09-01',
      },
    };
  }

  const found = INITIAL_API_CLIENTS.find(
    (c) => c.apiKeyPrefix === apiKey || apiKey.includes(c.apiKeyPrefix)
  );

  if (!found) {
    return { valid: false, error: 'Invalid or revoked API Key' };
  }

  return { valid: true, client: found };
}

export function hasScope(client: ApiClient, requiredScope: ApiScope): boolean {
  return client.scopes.includes(requiredScope);
}
