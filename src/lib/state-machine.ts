import { DeviceStatus } from '@/types/wathiq';

export interface StateTransitionRule {
  from: DeviceStatus;
  allowedTo: DeviceStatus[];
  description: string;
}

export const STATE_TRANSITIONS: Record<DeviceStatus, DeviceStatus[]> = {
  EXPECTED: ['RECEIVED', 'SCRAPPED'],
  RECEIVED: ['QUARANTINE', 'DIAGNOSTICS', 'SCRAPPED'],
  QUARANTINE: ['DIAGNOSTICS', 'SCRAPPED', 'RECYCLED'],
  DIAGNOSTICS: ['DATA_WIPE', 'REPAIR_REQUIRED', 'SCRAPPED'],
  DATA_WIPE: ['REPAIR_REQUIRED', 'REFURBISHMENT', 'QA', 'FAILED_QA'],
  REPAIR_REQUIRED: ['REFURBISHMENT', 'SCRAPPED'],
  REFURBISHMENT: ['QA', 'REWORK'],
  QA: ['CERTIFIED', 'FAILED_QA'],
  FAILED_QA: ['REPAIR_REQUIRED', 'REWORK', 'SCRAPPED'],
  REWORK: ['REFURBISHMENT', 'QA'],
  CERTIFIED: ['READY_FOR_SALE'],
  READY_FOR_SALE: ['RESERVED', 'SOLD'],
  RESERVED: ['READY_FOR_SALE', 'SOLD', 'PACKED'],
  SOLD: ['PACKED', 'READY_FOR_SALE'], // Can return to ready if cancelled before pack
  PACKED: ['SHIPPED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['WARRANTY', 'RETURNED', 'RECOVERY'],
  RETURNED: ['QUARANTINE', 'DIAGNOSTICS', 'RECOVERY'],
  WARRANTY: ['DIAGNOSTICS', 'REPAIR_REQUIRED', 'RECOVERY', 'DELIVERED'],
  RECOVERY: ['DIAGNOSTICS', 'DATA_WIPE', 'REWORK', 'RECYCLED', 'SCRAPPED'],
  RELISTED: ['READY_FOR_SALE'],
  RECYCLED: [], // Terminal state
  SCRAPPED: [], // Terminal state
};

export interface StateMetadata {
  label: string;
  badgeColor: string;
  textColor: string;
  category: 'intake' | 'processing' | 'quality' | 'commercial' | 'fulfillment' | 'lifecycle' | 'terminal';
  description: string;
}

export const STATE_METADATA: Record<DeviceStatus, StateMetadata> = {
  EXPECTED: {
    label: 'Expected Intake',
    badgeColor: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
    textColor: 'text-slate-700 dark:text-slate-300',
    category: 'intake',
    description: 'Inbound shipment or client ITAD batch scheduled for intake.',
  },
  RECEIVED: {
    label: 'Received at Dock',
    badgeColor: 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    category: 'intake',
    description: 'Physical unit scanned and checked into warehouse dock.',
  },
  QUARANTINE: {
    label: 'Quarantine Area',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-300',
    category: 'intake',
    description: 'Isolated due to suspected bios-lock, physical damage or pending security verification.',
  },
  DIAGNOSTICS: {
    label: 'Under Diagnostics',
    badgeColor: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    category: 'processing',
    description: '17-point automated and technician hardware test in progress.',
  },
  DATA_WIPE: {
    label: 'Secure Data Wipe',
    badgeColor: 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    category: 'processing',
    description: 'NIST 800-88 / Blancco erasure pass ongoing.',
  },
  REPAIR_REQUIRED: {
    label: 'Repair Required',
    badgeColor: 'bg-orange-50 dark:bg-orange-950/50 border-orange-300 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
    category: 'processing',
    description: 'Component failure flagged (keyboard, battery, screen, etc.). Repair ticket opened.',
  },
  REFURBISHMENT: {
    label: 'Refurbishment Bench',
    badgeColor: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-300 dark:border-cyan-800',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    category: 'processing',
    description: 'Technician replacing parts, repasting thermals, cleaning, and reassembling.',
  },
  QA: {
    label: 'QA Inspection',
    badgeColor: 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-300',
    category: 'quality',
    description: 'Final quality control verification against strict standard checklist.',
  },
  FAILED_QA: {
    label: 'Failed QA',
    badgeColor: 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800',
    textColor: 'text-rose-700 dark:text-rose-300',
    category: 'quality',
    description: 'Defect spotted during QA. Must be routed back to rework.',
  },
  CERTIFIED: {
    label: 'Wathiq Certified',
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    category: 'quality',
    description: 'All 17 QA points passed. Tamper-evident certificate issued.',
  },
  READY_FOR_SALE: {
    label: 'Ready for Sale',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400 dark:border-emerald-700',
    textColor: 'text-emerald-800 dark:text-emerald-200',
    category: 'commercial',
    description: 'Stocked in finished goods bin, priced and available in B2B catalog.',
  },
  RESERVED: {
    label: 'Reserved (B2B/Order)',
    badgeColor: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    category: 'commercial',
    description: 'Allocated to an accepted B2B quote or pending purchase order.',
  },
  SOLD: {
    label: 'Sold',
    badgeColor: 'bg-green-100 dark:bg-green-950 border-green-400 dark:border-green-800',
    textColor: 'text-green-800 dark:text-green-200',
    category: 'commercial',
    description: 'Payment captured or purchase agreement confirmed.',
  },
  PACKED: {
    label: 'Packed & Barcoded',
    badgeColor: 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800',
    textColor: 'text-sky-700 dark:text-sky-300',
    category: 'fulfillment',
    description: 'Protective packaging applied, warranty sticker sealed, manifest attached.',
  },
  SHIPPED: {
    label: 'Dispatched / In Transit',
    badgeColor: 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-700',
    textColor: 'text-blue-800 dark:text-blue-200',
    category: 'fulfillment',
    description: 'Handed over to carrier (CTM / Aramex / Wathiq Fleet) for client delivery.',
  },
  DELIVERED: {
    label: 'Delivered',
    badgeColor: 'bg-green-50 dark:bg-green-950/50 border-green-300 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    category: 'fulfillment',
    description: 'Delivered to client. 12-month warranty clock active.',
  },
  RETURNED: {
    label: 'Returned (RMA)',
    badgeColor: 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-300',
    category: 'lifecycle',
    description: 'Customer return received at returns intake for inspection.',
  },
  WARRANTY: {
    label: 'Warranty Service',
    badgeColor: 'bg-violet-50 dark:bg-violet-950/50 border-violet-300 dark:border-violet-800',
    textColor: 'text-violet-700 dark:text-violet-300',
    category: 'lifecycle',
    description: 'Warranty claim opened. Device undergoing diagnosis or repair.',
  },
  RECOVERY: {
    label: 'End-of-Contract Recovery',
    badgeColor: 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700',
    textColor: 'text-stone-700 dark:text-stone-300',
    category: 'lifecycle',
    description: 'Buyback, lease return or trade-in unit entering second lifecycle.',
  },
  REWORK: {
    label: 'Rework Station',
    badgeColor: 'bg-amber-100 dark:bg-amber-900 border-amber-400 dark:border-amber-700',
    textColor: 'text-amber-800 dark:text-amber-200',
    category: 'processing',
    description: 'Corrective action being performed following failed QA inspection.',
  },
  RELISTED: {
    label: 'Relisted (Lifecycle 2+)',
    badgeColor: 'bg-teal-100 dark:bg-teal-900 border-teal-400 dark:border-teal-700',
    textColor: 'text-teal-800 dark:text-teal-200',
    category: 'commercial',
    description: 'Reconditioned after recovery and re-entering the commercial pipeline.',
  },
  RECYCLED: {
    label: 'Environmentally Recycled',
    badgeColor: 'bg-emerald-950 text-white border-emerald-900',
    textColor: 'text-emerald-400',
    category: 'terminal',
    description: 'Decommissioned to licensed e-waste recovery partner in Morocco.',
  },
  SCRAPPED: {
    label: 'Harvested for Parts / Scrapped',
    badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    textColor: 'text-zinc-400',
    category: 'terminal',
    description: 'Stripped for reusable components (screws, brackets, RAM). Core chassis scrapped.',
  },
};

export function canTransition(current: DeviceStatus, target: DeviceStatus): boolean {
  if (current === target) return true;
  const allowed = STATE_TRANSITIONS[current];
  return Boolean(allowed && allowed.includes(target));
}

export function getNextValidStates(current: DeviceStatus): DeviceStatus[] {
  return STATE_TRANSITIONS[current] || [];
}

export function getStateMetadata(state: DeviceStatus): StateMetadata {
  return STATE_METADATA[state] || {
    label: state,
    badgeColor: 'bg-gray-100 border-gray-300',
    textColor: 'text-gray-800',
    category: 'processing',
    description: 'State status',
  };
}
