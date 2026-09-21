export type DeviceStatus =
  | 'EXPECTED'
  | 'RECEIVED'
  | 'QUARANTINE'
  | 'DIAGNOSTICS'
  | 'DATA_WIPE'
  | 'REPAIR_REQUIRED'
  | 'REFURBISHMENT'
  | 'QA'
  | 'FAILED_QA'
  | 'CERTIFIED'
  | 'READY_FOR_SALE'
  | 'RESERVED'
  | 'SOLD'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'RETURNED'
  | 'WARRANTY'
  | 'RECOVERY'
  | 'REWORK'
  | 'RELISTED'
  | 'RECYCLED'
  | 'SCRAPPED';

export type DeviceGrade = 'A+' | 'A' | 'B' | 'C' | 'D';

export type DeviceCategory =
  | 'Laptop'
  | 'Desktop'
  | 'Smartphone'
  | 'Tablet'
  | 'Monitor'
  | 'Networking'
  | 'Peripheral';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'CEO'
  | 'OPERATIONS_MANAGER'
  | 'WAREHOUSE'
  | 'TECHNICIAN'
  | 'QA'
  | 'SALES'
  | 'FINANCE'
  | 'B2B_CUSTOMER'
  | 'CUSTOMER_SERVICE';

// -------------------------------------------------------------
// VERIFICATION & SOURCE TRUST MODEL (§2, §8, §10, §11)
// -------------------------------------------------------------
export type VerificationCheckStatus =
  | 'VERIFIED'
  | 'NO_MATCH_FOUND'
  | 'NOT_CHECKED'
  | 'UNKNOWN'
  | 'CONFLICT'
  | 'FLAGGED'
  | 'REVIEW_REQUIRED';

export type SourceTrustLevel =
  | 'OFFICIAL' // Government, Customs, Regulatory (ANRT), OEM Authoritative
  | 'AUTHORIZED' // GSMA Blacklist, Licensed Telecom, Carrier partner
  | 'COMMERCIAL' // Paid database provider, commercial ledger
  | 'PARTNER' // Contracted enterprise client, Bank, BPO
  | 'USER_PROVIDED' // Seller declaration, intake customer
  | 'INTERNAL' // Wathiq bench technician, QA Inspector
  | 'UNKNOWN';

export type OverallTrustStatus =
  | 'WATHIQ_VERIFIED'
  | 'WATHIQ_PARTIALLY_VERIFIED'
  | 'WATHIQ_FLAGGED'
  | 'WATHIQ_UNVERIFIED';

export type ProvenanceCheckType =
  | 'IDENTITY_OEM'
  | 'IMEI_BLACKLIST'
  | 'STOLEN_LOST_REGISTRY'
  | 'FINANCING_LEASE_LIEN'
  | 'IMPORT_CUSTOMS_DECLARATION'
  | 'ANRT_HOMOLOGATION'
  | 'OWNERSHIP_CHAIN_OF_CUSTODY'
  | 'SERIAL_CONSISTENCY'
  | 'DATA_WIPE_NIST80088'
  | 'QA_CERTIFICATION';

export interface ProvenanceCheck {
  id: string;
  checkType: ProvenanceCheckType;
  label: string;
  sourceName: string;
  sourceTrustLevel: SourceTrustLevel;
  sourceReference?: string;
  requestedAt: string;
  completedAt: string;
  status: VerificationCheckStatus;
  resultSummary: string; // "No blacklist match found in the available data sources as of 2026-09-18"
  confidence: number; // 0.0 - 1.0
  operatorOrSystem: string;
  rawResponseReference?: string;
  expiresAt?: string;
}

export interface ProvenanceDocument {
  id: string;
  docType:
    | 'CUSTOMS_DECLARATION'
    | 'PURCHASE_INVOICE'
    | 'ITAD_MANIFEST'
    | 'ANRT_CERTIFICATE'
    | 'DATA_WIPE_CERTIFICATE'
    | 'QA_REPORT'
    | 'OWNERSHIP_AFFIDAVIT'
    | 'WATHIQ_PASSPORT_CERTIFICATE';
  title: string;
  documentHash: string; // SHA-256
  hashAlgorithm: 'SHA-256';
  storageRef: string;
  issuedBy: string;
  issuedAt: string;
  sourceTrustLevel: SourceTrustLevel;
}

export interface DeviceProvenanceProfile {
  countryOfOrigin?: string;
  importerIdentity?: string;
  customsDeclarationNumber?: string;
  importStatus: VerificationCheckStatus;
  anrtHomologationStatus: VerificationCheckStatus;
  blacklistStatus: VerificationCheckStatus;
  financingLienStatus: VerificationCheckStatus;
  ownershipChainStatus: VerificationCheckStatus;
  overallTrustStatus: OverallTrustStatus;
  checks: ProvenanceCheck[];
  documents: ProvenanceDocument[];
  lastVerifiedAt: string;
}

// -------------------------------------------------------------
// VALUATION & RESIDUAL PRICING ENGINE (§16, §17)
// -------------------------------------------------------------
export interface DeviceValuation {
  acquisitionValue: number; // What Wathiq acquired it for
  landedCost: number; // All direct refurbishment & transport costs
  marketValue: number; // Benchmark current retail market price
  tradeInValue: number; // Recommended instant buyback offer for consumers/SMEs
  wholesaleValue: number; // Bulk price for B2B fleet or resellers
  recommendedRetailPrice: number; // Current recommended listing price
  expectedResidualValue12m: number; // Projected worth in 12 months after contract
  valuationBasis: string; // Algorithmic explanation of valuation factors
  currency: 'MAD' | 'EUR';
  updatedAt: string;
}

// -------------------------------------------------------------
// MULTI-TENANCY & EXTERNAL API GATEWAY (§18, §19, §20, §21)
// -------------------------------------------------------------
export type ApiScope =
  | 'device:read'
  | 'device:verify'
  | 'device:certify'
  | 'inventory:read'
  | 'inventory:write'
  | 'warranty:read'
  | 'warranty:write'
  | 'tradein:quote'
  | 'orders:create'
  | 'orders:read'
  | 'webhooks:manage';

export interface ApiClient {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  apiKeyPrefix: string; // e.g. "wth_live_7x9..."
  scopes: ApiScope[];
  rateLimitPerMin: number;
  monthlyQuota: number;
  monthlyUsage: number;
  status: 'ACTIVE' | 'REVOKED' | 'RATE_LIMITED';
  createdAt: string;
}

export interface WebhookSubscription {
  id: string;
  organizationId: string;
  targetUrl: string;
  secret: string;
  subscribedEvents: string[]; // e.g. ["device.verified", "device.certified", "warranty.claimed"]
  status: 'ACTIVE' | 'FAILED' | 'PAUSED';
  createdAt: string;
}

// -------------------------------------------------------------
// PHYSICAL DEVICE SPECIFICATIONS & LEDGER
// -------------------------------------------------------------
export interface DeviceSpecs {
  cpu: string;
  ram: string;
  storage: string;
  display: string;
  gpu?: string;
  color: string;
  os: string;
}

export interface UnitEconomics {
  acquisitionCost: number;
  transport: number;
  customs: number;
  certification: number;
  parts: number;
  labor: number;
  packaging: number;
  otherDirect: number;
  landedCost: number;
  warrantyReserve: number;
  paymentFees: number;
  shippingSubsidy: number;
  expectedReturns: number;
  contributionMargin: number;
}

export interface Pricing {
  minimumPrice: number;
  recommendedPrice: number;
  marketPrice: number;
  sellingPrice: number;
  currency: 'MAD' | 'EUR';
  targetMarginPct: number;
}

export interface DetailedGrading {
  screen: DeviceGrade;
  body: DeviceGrade;
  keyboard: DeviceGrade;
  batteryScore: DeviceGrade;
  functionalScore: DeviceGrade;
  notes?: string;
}

export interface LocationDetail {
  warehouse: string;
  zone: string;
  shelf: string;
  bin: string;
}

export interface DiagnosticsRecord {
  cpu: boolean;
  ram: boolean;
  ssd: boolean;
  gpu: boolean;
  display: boolean;
  keyboard: boolean;
  trackpad: boolean;
  webcam: boolean;
  mic: boolean;
  speakers: boolean;
  usb: boolean;
  hdmi: boolean;
  usbC: boolean;
  wifi: boolean;
  bluetooth: boolean;
  battery: boolean;
  thermals: boolean;
  operator: string;
  timestamp: string;
  overallPass: boolean;
  notes?: string;
}

export interface DataWipeRecord {
  software: string;
  version: string;
  method: string;
  operator: string;
  date: string;
  certificateRef: string;
  result: 'PASSED' | 'FAILED';
  verificationHash: string;
}

export interface QACheckItem {
  id: string;
  name: string;
  passed: boolean;
  critical: boolean;
}

export interface QARecord {
  inspector: string;
  date: string;
  overallResult: 'PASS' | 'FAIL';
  checklist: QACheckItem[];
  notes?: string;
}

export interface PartUsed {
  partId: string;
  partName: string;
  partNumber: string;
  cost: number;
}

export interface RepairRecord {
  ticketId: string;
  description: string;
  partsUsed: PartUsed[];
  laborHours: number;
  laborRatePerHour: number;
  totalCost: number;
  technician: string;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
}

export interface DeviceEvent {
  id: string;
  deviceId: string;
  eventType: string;
  fromState?: DeviceStatus;
  toState?: DeviceStatus;
  operatorId: string;
  operatorName: string;
  role: UserRole;
  timestamp: string;
  metadata?: Record<string, unknown>;
  notes?: string;
}

export interface Device {
  id: string; // e.g. WTH-26-LPT-000184
  sku: string;
  category: DeviceCategory;
  brand: string;
  manufacturer: string;
  model: string;
  modelNumber: string;
  serialNumber: string; // Enforced unique
  imei?: string;
  imei2?: string;
  macAddress?: string;
  specs: DeviceSpecs;
  batteryHealth: number;
  batteryCycles: number;
  ssdHealth: number;
  acquisitionSource: string;
  acquisitionDate: string;
  costs: UnitEconomics;
  pricing: Pricing;
  valuation: DeviceValuation;
  provenance: DeviceProvenanceProfile;
  grade: DeviceGrade;
  detailedGrading: DetailedGrading;
  status: DeviceStatus;
  location: LocationDetail;
  warranty: {
    durationMonths: number;
    startDate?: string;
    endDate?: string;
    terms: string;
    certificateNumber: string;
  };
  diagnostics?: DiagnosticsRecord;
  dataWipe?: DataWipeRecord;
  qaInspection?: QARecord;
  repairs: RepairRecord[];
  photos: string[];
  ownership: string;
  compliance: {
    wipedNIST80088: boolean;
    ceMarked: boolean;
    eWasteCompliant: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  deviceId: string;
  fromLocation: LocationDetail;
  toLocation: LocationDetail;
  operator: string;
  timestamp: string;
  reason: string;
}

export interface B2BAccount {
  id: string;
  companyName: string;
  industry: string;
  employeeCount: number;
  fleetSize: number;
  procurementCycle: string;
  currentSupplier: string;
  annualItSpend: number;
  accountOwner: string;
  city: string;
  taxId: string;
  status: 'ACTIVE' | 'PROSPECT' | 'CHURNED';
}

export interface B2BContact {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsApp: string;
}

export type OpportunityStage =
  | 'LEAD'
  | 'QUALIFIED'
  | 'DISCOVERY'
  | 'QUOTE'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export interface Opportunity {
  id: string;
  accountId: string;
  accountName: string;
  title: string;
  value: number;
  currency: 'MAD' | 'EUR';
  stage: OpportunityStage;
  probability: number;
  expectedClose: string;
  unitsRequested: number;
  notes?: string;
}

export interface QuoteLineItem {
  id: string;
  sku: string;
  model: string;
  grade: DeviceGrade;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warrantyMonths: number;
}

export interface B2BQuote {
  id: string;
  quoteNumber: string;
  accountId: string;
  clientName: string;
  contactPerson: string;
  email: string;
  items: QuoteLineItem[];
  deploymentFee: number;
  deliveryFee: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: 'MAD' | 'EUR';
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  validUntil: string;
  notes?: string;
}

export interface ITADBatch {
  id: string;
  batchNumber: string;
  clientName: string;
  city: string;
  deviceCount: number;
  status: 'COLLECTED' | 'IN_PROCESSING' | 'WIPED' | 'REPORT_READY' | 'COMPLETED';
  collectionDate: string;
  manifestNumber: string;
  recoveryValuation: number;
  environmentalReductionCo2Kg: number;
  wipedCertCount: number;
}

export type OrderStatus =
  | 'CART'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'ALLOCATED'
  | 'PICKED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  deviceId: string;
  model: string;
  price: number;
  grade: DeviceGrade;
  serialNumber: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerType: 'B2B' | 'B2C';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: 'MAD' | 'EUR';
  status: OrderStatus;
  shippingAddress: string;
  city: string;
  paymentMethod: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'INVOICE_30D' | 'CASH_ON_DELIVERY';
  createdAt: string;
  trackingNumber?: string;
}

export interface WarrantyClaim {
  id: string;
  claimNumber: string;
  deviceId: string;
  customerName: string;
  customerEmail: string;
  issueDescription: string;
  status: 'OPEN' | 'DIAGNOSING' | 'REPAIRING' | 'REPLACED' | 'REFUNDED' | 'RESOLVED';
  resolutionNotes?: string;
  repairCost: number;
  openedAt: string;
  closedAt?: string;
}

export interface RMAInspection {
  id: string;
  rmaNumber: string;
  deviceId: string;
  customerName: string;
  reason: string;
  status: 'REQUEST' | 'APPROVED' | 'RETURNED' | 'INSPECTED' | 'REWORK' | 'CLOSED';
  inspectionResult?: 'NO_FAULT_FOUND' | 'HARDWARE_FAULT' | 'COSMETIC_DAMAGE' | 'REPAIR_REQUIRED';
  disposition?: 'RETURN_TO_STOCK' | 'ROUTE_TO_REWORK' | 'SCRAP' | 'REFUND';
  createdAt: string;
  updatedAt: string;
}
