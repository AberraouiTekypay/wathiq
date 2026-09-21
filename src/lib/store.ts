import {
  Device,
  DeviceStatus,
  DeviceEvent,
  UserRole,
  DiagnosticsRecord,
  DataWipeRecord,
  QARecord,
  RepairRecord,
  Pricing,
  LocationDetail,
  B2BAccount,
  B2BContact,
  Opportunity,
  B2BQuote,
  ITADBatch,
  Order,
  WarrantyClaim,
  RMAInspection,
  InventoryMovement,
  ProvenanceCheck,
  ProvenanceCheckType,
  ApiClient,
  DeviceValuation,
} from '@/types/wathiq';
import {
  INITIAL_DEVICES,
  INITIAL_EVENTS,
  INITIAL_ACCOUNTS,
  INITIAL_CONTACTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_QUOTES,
  INITIAL_ITAD_BATCHES,
  INITIAL_ORDERS,
  INITIAL_WARRANTY_CLAIMS,
  INITIAL_RMA,
  INITIAL_MOVEMENTS,
} from './initial-data';
import { canTransition } from './state-machine';
import {
  runProvenanceChecks,
  calculateTransparentTrustStatus,
} from './provenance/engine';
import { computeDeviceValuation } from './valuation/engine';
import { INITIAL_API_CLIENTS } from './api-gateway/auth';

declare global {
  // eslint-disable-next-line no-var
  var __WATHIQ_STORE__: {
    devices: Device[];
    events: DeviceEvent[];
    accounts: B2BAccount[];
    contacts: B2BContact[];
    opportunities: Opportunity[];
    quotes: B2BQuote[];
    itadBatches: ITADBatch[];
    orders: Order[];
    warrantyClaims: WarrantyClaim[];
    rmaInspections: RMAInspection[];
    movements: InventoryMovement[];
    apiClients: ApiClient[];
  } | undefined;
}

function getStore() {
  if (!global.__WATHIQ_STORE__) {
    global.__WATHIQ_STORE__ = {
      devices: [...INITIAL_DEVICES],
      events: [...INITIAL_EVENTS],
      accounts: [...INITIAL_ACCOUNTS],
      contacts: [...INITIAL_CONTACTS],
      opportunities: [...INITIAL_OPPORTUNITIES],
      quotes: [...INITIAL_QUOTES],
      itadBatches: [...INITIAL_ITAD_BATCHES],
      orders: [...INITIAL_ORDERS],
      warrantyClaims: [...INITIAL_WARRANTY_CLAIMS],
      rmaInspections: [...INITIAL_RMA],
      movements: [...INITIAL_MOVEMENTS],
      apiClients: [...INITIAL_API_CLIENTS],
    };
  }
  return global.__WATHIQ_STORE__;
}

export const WathiqStore = {
  // Device Operations
  getDevices(filter?: { status?: DeviceStatus; category?: string; query?: string }): Device[] {
    const store = getStore();
    let list = [...store.devices];

    if (filter?.status) {
      list = list.filter((d) => d.status === filter.status);
    }
    if (filter?.category && filter.category !== 'ALL') {
      list = list.filter((d) => d.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.serialNumber.toLowerCase().includes(q) ||
          (d.imei && d.imei.includes(q)) ||
          d.model.toLowerCase().includes(q) ||
          d.brand.toLowerCase().includes(q) ||
          d.sku.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getDeviceById(idOrSerial: string): Device | undefined {
    const store = getStore();
    const query = idOrSerial.trim().toLowerCase();
    return store.devices.find(
      (d) =>
        d.id.toLowerCase() === query ||
        d.serialNumber.toLowerCase() === query ||
        (d.imei && d.imei.toLowerCase() === query)
    );
  },

  createDevice(
    deviceData: Omit<Device, 'id' | 'createdAt' | 'updatedAt' | 'costs' | 'repairs' | 'valuation'> & {
      acquisitionCost: number;
    },
    operatorName = 'System Operator',
    role: UserRole = 'WAREHOUSE'
  ): Device {
    const store = getStore();
    const count = store.devices.length + 1;
    const catCode =
      deviceData.category === 'Laptop'
        ? 'LPT'
        : deviceData.category === 'Desktop'
        ? 'DSK'
        : deviceData.category === 'Smartphone'
        ? 'PHN'
        : deviceData.category === 'Networking'
        ? 'NET'
        : 'DEV';

    const newId = `WTH-26-${catCode}-${String(count).padStart(6, '0')}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const landedCost = deviceData.acquisitionCost + 150 + 100 + 50;

    const partialDevice = {
      ...deviceData,
      id: newId,
      costs: {
        acquisitionCost: deviceData.acquisitionCost,
        transport: 150,
        customs: 0,
        certification: 100,
        parts: 0,
        labor: 100,
        packaging: 50,
        otherDirect: 0,
        landedCost,
        warrantyReserve: landedCost * 0.05,
        paymentFees: 50,
        shippingSubsidy: 50,
        expectedReturns: 50,
        contributionMargin: deviceData.pricing.sellingPrice - landedCost - 150,
      },
    };

    const valuation = computeDeviceValuation(partialDevice);

    const newDevice: Device = {
      ...partialDevice,
      valuation,
      repairs: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.devices.unshift(newDevice);

    this.recordEvent({
      deviceId: newId,
      eventType: 'DeviceReceived',
      fromState: 'EXPECTED',
      toState: newDevice.status,
      operatorId: 'USR-AUTO',
      operatorName,
      role,
      notes: `Device ${newId} (SN: ${newDevice.serialNumber}${newDevice.imei ? ' | IMEI: ' + newDevice.imei : ''}) registered.`,
    });

    return newDevice;
  },

  transitionDevice(
    deviceId: string,
    toState: DeviceStatus,
    operatorName = 'Operations Lead',
    role: UserRole = 'OPERATIONS_MANAGER',
    reason = ''
  ): { success: boolean; error?: string; device?: Device } {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);

    if (!device) {
      return { success: false, error: `Device ${deviceId} not found` };
    }

    if (!canTransition(device.status, toState)) {
      return {
        success: false,
        error: `Illegal state transition from ${device.status} to ${toState}. Follow Wathiq Lifecycle Engine rules.`,
      };
    }

    const previousState = device.status;
    device.status = toState;
    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.recordEvent({
      deviceId,
      eventType: `TransitionTo_${toState}`,
      fromState: previousState,
      toState,
      operatorId: 'USR-TRANS',
      operatorName,
      role,
      notes: reason || `Device transitioned from ${previousState} to ${toState}.`,
    });

    return { success: true, device };
  },

  // Provenance & Trust Engine (§7, §8, §9, §10, §11)
  async executeDeviceProvenanceChecks(
    deviceId: string,
    checkTypes: ProvenanceCheckType[] = [
      'IDENTITY_OEM',
      'IMEI_BLACKLIST',
      'IMPORT_CUSTOMS_DECLARATION',
      'ANRT_HOMOLOGATION',
      'OWNERSHIP_CHAIN_OF_CUSTODY',
    ]
  ): Promise<Device | undefined> {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return undefined;

    const newChecks = await runProvenanceChecks(device, checkTypes);
    const trustEvaluation = calculateTransparentTrustStatus(newChecks);

    device.provenance.checks = newChecks;
    device.provenance.overallTrustStatus = trustEvaluation.overallTrustStatus;
    device.provenance.lastVerifiedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    device.updatedAt = device.provenance.lastVerifiedAt;

    this.recordEvent({
      deviceId,
      eventType: 'ProvenanceChecksCompleted',
      operatorId: 'SYSTEM-PROVENANCE',
      operatorName: 'Wathiq Trust Engine',
      role: 'OPERATIONS_MANAGER',
      notes: `Executed ${newChecks.length} checks. Trust Status: ${trustEvaluation.overallTrustStatus}. ${trustEvaluation.explanation}`,
    });

    return device;
  },

  // Valuation Engine (§16, §17)
  recalculateValuation(deviceId: string): DeviceValuation | undefined {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return undefined;

    const val = computeDeviceValuation(device);
    device.valuation = val;
    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.recordEvent({
      deviceId,
      eventType: 'ValuationRecalculated',
      operatorId: 'SYSTEM-VALUATION',
      operatorName: 'Pricing & Valuation Engine',
      role: 'FINANCE',
      notes: `Updated valuation: Market Value ${val.marketValue} MAD, Trade-In ${val.tradeInValue} MAD, Retail ${val.recommendedRetailPrice} MAD.`,
    });

    return val;
  },

  recordDiagnostics(
    deviceId: string,
    diagnostics: DiagnosticsRecord,
    operatorName = 'Diagnostics Tech',
    role: UserRole = 'TECHNICIAN'
  ): boolean {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return false;

    device.diagnostics = diagnostics;
    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.recordEvent({
      deviceId,
      eventType: 'DiagnosticsRecorded',
      fromState: device.status,
      toState: device.status,
      operatorId: 'USR-TECH',
      operatorName,
      role,
      notes: `17-point diagnostics completed. Overall result: ${diagnostics.overallPass ? 'PASS' : 'FAIL'}`,
    });

    return true;
  },

  recordDataWipe(
    deviceId: string,
    wipeData: DataWipeRecord,
    operatorName = 'Security Operator',
    role: UserRole = 'OPERATIONS_MANAGER'
  ): boolean {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return false;

    device.dataWipe = wipeData;
    device.compliance.wipedNIST80088 = wipeData.result === 'PASSED';
    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.recordEvent({
      deviceId,
      eventType: 'DataWipeCompleted',
      fromState: device.status,
      toState: device.status,
      operatorId: 'USR-SEC',
      operatorName,
      role,
      notes: `Data sanitization executed via ${wipeData.software}. Cert Ref: ${wipeData.certificateRef}. Hash: ${wipeData.verificationHash.slice(0, 16)}...`,
    });

    return true;
  },

  recordRepair(
    deviceId: string,
    repair: RepairRecord,
    operatorName = 'Hardware Tech',
    role: UserRole = 'TECHNICIAN'
  ): boolean {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return false;

    device.repairs.push(repair);

    const partsCost = repair.partsUsed.reduce((sum, p) => sum + p.cost, 0);
    device.costs.parts += partsCost;
    device.costs.labor += repair.totalCost - partsCost;
    device.costs.landedCost =
      device.costs.acquisitionCost +
      device.costs.transport +
      device.costs.customs +
      device.costs.certification +
      device.costs.parts +
      device.costs.labor +
      device.costs.packaging +
      device.costs.otherDirect;

    device.costs.contributionMargin =
      device.pricing.sellingPrice -
      device.costs.landedCost -
      (device.costs.warrantyReserve +
        device.costs.paymentFees +
        device.costs.shippingSubsidy +
        device.costs.expectedReturns);

    // Update valuation after repair
    device.valuation = computeDeviceValuation(device);
    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.recordEvent({
      deviceId,
      eventType: 'RepairCompleted',
      fromState: device.status,
      toState: device.status,
      operatorId: 'USR-REP',
      operatorName,
      role,
      notes: `Repair ticket ${repair.ticketId} completed: ${repair.description}. Added parts cost: ${partsCost} MAD.`,
    });

    return true;
  },

  recordQA(
    deviceId: string,
    qa: QARecord,
    operatorName = 'QA Lead',
    role: UserRole = 'QA'
  ): boolean {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return false;

    device.qaInspection = qa;
    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.recordEvent({
      deviceId,
      eventType: 'QAInspectionFinished',
      fromState: device.status,
      toState: qa.overallResult === 'PASS' ? 'CERTIFIED' : 'FAILED_QA',
      operatorId: 'USR-QA',
      operatorName,
      role,
      notes: `QA Inspection: ${qa.overallResult}. Inspector: ${qa.inspector}`,
    });

    if (qa.overallResult === 'PASS') {
      device.status = 'CERTIFIED';
    } else {
      device.status = 'FAILED_QA';
    }

    return true;
  },

  updatePricing(
    deviceId: string,
    pricing: Partial<Pricing>,
    operatorName = 'Pricing Analyst',
    role: UserRole = 'FINANCE'
  ): boolean {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return false;

    device.pricing = { ...device.pricing, ...pricing };
    device.costs.contributionMargin =
      device.pricing.sellingPrice -
      device.costs.landedCost -
      (device.costs.warrantyReserve +
        device.costs.paymentFees +
        device.costs.shippingSubsidy +
        device.costs.expectedReturns);

    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.recordEvent({
      deviceId,
      eventType: 'PriceUpdated',
      operatorId: 'USR-FIN',
      operatorName,
      role,
      notes: `Selling price set to ${device.pricing.sellingPrice} ${device.pricing.currency}. Landed cost: ${device.costs.landedCost} MAD.`,
    });

    return true;
  },

  moveLocation(
    deviceId: string,
    toLocation: LocationDetail,
    operatorName = 'Warehouse Lead',
    reason = 'Location relocation'
  ): boolean {
    const store = getStore();
    const device = store.devices.find((d) => d.id === deviceId);
    if (!device) return false;

    const fromLocation = { ...device.location };
    device.location = toLocation;
    device.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const movement: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-6)}`,
      deviceId,
      fromLocation,
      toLocation,
      operator: operatorName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reason,
    };

    store.movements.unshift(movement);

    this.recordEvent({
      deviceId,
      eventType: 'InventoryMoved',
      operatorId: 'USR-WH',
      operatorName,
      role: 'WAREHOUSE',
      notes: `Relocated from ${fromLocation.zone} [${fromLocation.bin}] to ${toLocation.zone} [${toLocation.bin}]. Reason: ${reason}`,
    });

    return true;
  },

  recordEvent(eventData: Omit<DeviceEvent, 'id' | 'timestamp'>): DeviceEvent {
    const store = getStore();
    const event: DeviceEvent = {
      ...eventData,
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    store.events.unshift(event);
    return event;
  },

  getEvents(deviceId?: string): DeviceEvent[] {
    const store = getStore();
    if (!deviceId) return store.events;
    return store.events.filter((e) => e.deviceId === deviceId);
  },

  getMovements(deviceId?: string): InventoryMovement[] {
    const store = getStore();
    if (!deviceId) return store.movements;
    return store.movements.filter((m) => m.deviceId === deviceId);
  },

  // B2B CRM & Quotes
  getAccounts(): B2BAccount[] {
    return getStore().accounts;
  },

  getOpportunities(): Opportunity[] {
    return getStore().opportunities;
  },

  getQuotes(): B2BQuote[] {
    return getStore().quotes;
  },

  createQuote(quote: Omit<B2BQuote, 'id' | 'createdAt'>): B2BQuote {
    const store = getStore();
    const newQuote: B2BQuote = {
      ...quote,
      id: `QT-2026-${String(store.quotes.length + 90).padStart(3, '0')}`,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    store.quotes.unshift(newQuote);
    return newQuote;
  },

  updateQuoteStatus(quoteId: string, status: B2BQuote['status']): boolean {
    const store = getStore();
    const q = store.quotes.find((item) => item.id === quoteId);
    if (!q) return false;
    q.status = status;
    return true;
  },

  // ITAD
  getITADBatches(): ITADBatch[] {
    return getStore().itadBatches;
  },

  createITADBatch(batch: Omit<ITADBatch, 'id'>): ITADBatch {
    const store = getStore();
    const newBatch: ITADBatch = {
      ...batch,
      id: `ITAD-${String(store.itadBatches.length + 1).padStart(3, '0')}`,
    };
    store.itadBatches.unshift(newBatch);
    return newBatch;
  },

  // Orders
  getOrders(): Order[] {
    return getStore().orders;
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const store = getStore();
    const idNum = store.orders.length + 413;
    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${idNum}`,
      orderNumber: `WTH-ORD-2026-${idNum}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    store.orders.unshift(newOrder);

    orderData.items.forEach((item) => {
      const dev = store.devices.find((d) => d.id === item.deviceId);
      if (dev) {
        dev.status = 'SOLD';
        WathiqStore.recordEvent({
          deviceId: dev.id,
          eventType: 'DeviceSold',
          fromState: 'READY_FOR_SALE',
          toState: 'SOLD',
          operatorId: 'SYSTEM',
          operatorName: 'E-Commerce Engine',
          role: 'SALES',
          notes: `Allocated to order ${newOrder.orderNumber} for client ${newOrder.customerName}.`,
        });
      }
    });

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status']): boolean {
    const store = getStore();
    const ord = store.orders.find((o) => o.id === orderId);
    if (!ord) return false;
    ord.status = status;
    return true;
  },

  // Warranty & RMA
  getWarrantyClaims(): WarrantyClaim[] {
    return getStore().warrantyClaims;
  },

  createWarrantyClaim(claim: Omit<WarrantyClaim, 'id' | 'openedAt'>): WarrantyClaim {
    const store = getStore();
    const newClaim: WarrantyClaim = {
      ...claim,
      id: `CLM-26-${String(store.warrantyClaims.length + 43).padStart(4, '0')}`,
      openedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    store.warrantyClaims.unshift(newClaim);
    return newClaim;
  },

  // Multi-Tenancy & API Clients
  getApiClients(): ApiClient[] {
    return getStore().apiClients;
  },

  // Analytics Computation
  getAnalytics() {
    const store = getStore();
    const devices = store.devices;
    const orders = store.orders;

    const totalRevenueMAD = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenueMAD / totalOrders) : 0;

    const totalUnits = devices.length;
    const readyForSaleUnits = devices.filter((d) => d.status === 'READY_FOR_SALE').length;
    const inProcessingUnits = devices.filter((d) =>
      ['DIAGNOSTICS', 'DATA_WIPE', 'REPAIR_REQUIRED', 'REFURBISHMENT', 'QA'].includes(d.status)
    ).length;
    const totalInventoryValueMAD = devices
      .filter((d) => d.status === 'READY_FOR_SALE')
      .reduce((sum, d) => sum + d.pricing.sellingPrice, 0);
    const totalLandedCostMAD = devices.reduce((sum, d) => sum + d.costs.landedCost, 0);

    const passCount = devices.filter((d) => d.qaInspection?.overallResult === 'PASS').length;
    const totalInspected = devices.filter((d) => d.qaInspection !== undefined).length;
    const firstTimePassRate = totalInspected > 0 ? Math.round((passCount / totalInspected) * 100) : 96;

    const totalPotentialSellingPrice = devices.reduce((sum, d) => sum + d.pricing.sellingPrice, 0);
    const grossMarginMAD = totalPotentialSellingPrice - totalLandedCostMAD;
    const grossMarginPct =
      totalPotentialSellingPrice > 0
        ? Math.round((grossMarginMAD / totalPotentialSellingPrice) * 100)
        : 0;

    const verifiedTrustCount = devices.filter(
      (d) => d.provenance?.overallTrustStatus === 'WATHIQ_VERIFIED'
    ).length;

    return {
      commercial: {
        totalRevenueMAD,
        totalOrders,
        avgOrderValue,
        b2bPipelineValueMAD: store.opportunities.reduce((sum, o) => sum + o.value, 0),
      },
      inventory: {
        totalUnits,
        readyForSaleUnits,
        inProcessingUnits,
        totalInventoryValueMAD,
        avgDaysInInventory: 14,
      },
      refurbishment: {
        throughputThisMonth: 148,
        inRepairCount: devices.filter((d) => d.status === 'REFURBISHMENT' || d.status === 'REPAIR_REQUIRED').length,
        firstTimePassRate,
        dataWipeSanitizedCount: devices.filter((d) => d.compliance.wipedNIST80088).length,
      },
      trust: {
        verifiedDevicesCount: verifiedTrustCount,
        verifiedRatePct: Math.round((verifiedTrustCount / Math.max(1, totalUnits)) * 100),
      },
      financial: {
        totalLandedCostMAD,
        grossMarginMAD,
        grossMarginPct,
        cashTiedInInventoryMAD: devices
          .filter((d) => !['SOLD', 'DELIVERED', 'SCRAPPED', 'RECYCLED'].includes(d.status))
          .reduce((sum, d) => sum + d.costs.landedCost, 0),
      },
    };
  },
};
