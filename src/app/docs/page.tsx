'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Layers,
  Cpu,
  ShieldCheck,
  Award,
  DollarSign,
  Briefcase,
  Terminal,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Database,
  Building2,
  Lock,
  Wrench,
} from 'lucide-react';

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState<
    | 'architecture'
    | 'state_machine'
    | 'domain_model'
    | 'unit_economics'
    | 'itad_fleet'
    | 'security_cndp'
    | 'api'
    | 'sop'
    | 'runbook'
    | 'brief'
  >('architecture');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
              WATHIQ PLATFORM DOCUMENTATION & MASTER SPECIFICATIONS
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            System Specifications & Master Operating Manual
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official technical architecture, 23-state lifecycle engine, domain models, true unit economics, and standard operating procedures.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold scrollbar-none">
          {[
            { id: 'architecture', label: '1. Architecture', icon: Layers },
            { id: 'state_machine', label: '2. State Machine', icon: Cpu },
            { id: 'domain_model', label: '3. Domain Model', icon: Database },
            { id: 'unit_economics', label: '4. Unit Economics', icon: DollarSign },
            { id: 'itad_fleet', label: '5. B2B & ITAD', icon: Building2 },
            { id: 'security_cndp', label: '6. Security & CNDP', icon: Lock },
            { id: 'api', label: '7. REST API (v1)', icon: Terminal },
            { id: 'sop', label: '8. Operating SOPs', icon: ShieldCheck },
            { id: 'runbook', label: '9. Technical Runbook', icon: Wrench },
            { id: 'brief', label: '10. CTO Brief', icon: Award },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSection(item.id as typeof selectedSection)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                selectedSection === item.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* TAB 1: ARCHITECTURE */}
          {selectedSection === 'architecture' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                1. Core Architectural Axiom: Device Entity &gt; SKU
              </h2>
              <p>
                Conventional e-commerce platforms model inventory as quantities of an abstract SKU. In refurbished electronics,
                this model fails catastrophically because two identical ThinkPad T14 laptops may have completely different battery health,
                cosmetic wear, diagnostic results, and warranty terms.
              </p>
              <p>
                In <strong>Wathiq</strong>, the primary domain entity is the <strong>Individual Physical Device</strong>. Every device is assigned
                a persistent identifier (e.g. <code>WTH-26-LPT-000184</code>), and all subsequent events (diagnostics, repairs, data sanitization,
                QA certificates, location movements, sales, and warranty claims) remain permanently attached to that specific identity.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border font-mono text-xs space-y-1">
                <div className="font-bold text-emerald-700 dark:text-emerald-400">
                  PRODUCT MODEL (e.g. ThinkPad T14 Gen 2)
                </div>
                <div className="pl-4">└── SKU (e.g. LEN-T14-G2-I5-16-512)</div>
                <div className="pl-8 text-slate-900 dark:text-white font-bold">
                  └── INDIVIDUAL PHYSICAL DEVICE (WTH-26-LPT-000184)
                </div>
                <div className="pl-12 text-slate-500">├── Hardware Diagnostics (17-Point burn-in pass)</div>
                <div className="pl-12 text-slate-500">├── Data Sanitization (NIST 800-88 Purge Cert)</div>
                <div className="pl-12 text-slate-500">├── Replacement Parts (OEM FR/AR Keyboard)</div>
                <div className="pl-12 text-slate-500">├── QA Gate &amp; Cosmetic Grade A Certification</div>
                <div className="pl-12 text-slate-500">├── True Unit Economics (Landed Cost 4,305 MAD)</div>
                <div className="pl-12 text-slate-500">└── 12-Month Replacement Warranty Claim Ledger</div>
              </div>
            </div>
          )}

          {/* TAB 2: STATE MACHINE */}
          {selectedSection === 'state_machine' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                2. Device State Machine &amp; Permitted Transitions (23 States)
              </h2>
              <p>
                To prevent warehouse anomalies and spreadsheet chaos, device status is strictly controlled by an explicit
                transition graph. Operators cannot arbitrarily set a device to <code>CERTIFIED</code> or <code>READY_FOR_SALE</code> without
                passing mandatory diagnostic and QA gates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { from: 'EXPECTED', to: 'RECEIVED, SCRAPPED' },
                  { from: 'RECEIVED', to: 'QUARANTINE, DIAGNOSTICS' },
                  { from: 'DIAGNOSTICS', to: 'DATA_WIPE, REPAIR_REQUIRED' },
                  { from: 'DATA_WIPE', to: 'REFURBISHMENT, QA' },
                  { from: 'REPAIR_REQUIRED', to: 'REFURBISHMENT, SCRAPPED' },
                  { from: 'REFURBISHMENT', to: 'QA, REWORK' },
                  { from: 'QA', to: 'CERTIFIED, FAILED_QA' },
                  { from: 'FAILED_QA', to: 'REWORK, REPAIR_REQUIRED' },
                  { from: 'CERTIFIED', to: 'READY_FOR_SALE' },
                  { from: 'READY_FOR_SALE', to: 'RESERVED, SOLD' },
                  { from: 'PACKED', to: 'SHIPPED' },
                  { from: 'SHIPPED', to: 'DELIVERED, RETURNED' },
                  { from: 'DELIVERED', to: 'WARRANTY, RECOVERY' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                    <div className="font-bold text-emerald-700">{item.from}</div>
                    <div className="text-slate-400 text-[10px] mt-1">allowed to:</div>
                    <div className="text-slate-800 dark:text-slate-200 font-semibold">{item.to}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOMAIN MODEL */}
          {selectedSection === 'domain_model' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                3. Database Domain Model &amp; Data Integrity
              </h2>
              <p>
                The schema enforces strict referential integrity. Primary entities include <code>Device</code>, <code>DeviceEvent</code>,
                <code>InventoryMovement</code>, <code>RepairRecord</code>, <code>B2BAccount</code>, and <code>ITADBatch</code>.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <strong>Uniqueness Constraints:</strong> <code>serialNumber</code> and <code>imei</code> are strictly unique.
                  Duplicate registration attempts are rejected with <code>409 Conflict</code>.
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <strong>Append-Only Audit Trail:</strong> Price modifications, repair line additions, and state transitions
                  are written permanently to the immutable event log with operator ID and timestamp.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UNIT ECONOMICS */}
          {selectedSection === 'unit_economics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                4. Cost Accounting &amp; True Landed Cost Model
              </h2>
              <p>
                Wathiq does not rely on nominal gross margin. True landed cost includes all direct expenditures incurred to bring
                the physical unit into certified stock:
              </p>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 font-mono text-xs space-y-2">
                <div><strong>Landed Refurbished Cost Formula:</strong></div>
                <div>LRC = Acquisition + Transport + Customs + Cert + Parts + Labor + Packaging + Direct</div>
                <div className="pt-2"><strong>Contribution Margin Formula:</strong></div>
                <div>CM = Gross Profit - (Warranty Reserve + Payment Fees + Shipping Subsidy + Return Risk)</div>
              </div>
            </div>
          )}

          {/* TAB 5: B2B & ITAD */}
          {selectedSection === 'itad_fleet' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                5. Morocco Enterprise B2B &amp; ITAD Infrastructure
              </h2>
              <p>
                Morocco hosts over 130,000 nearshore agents across Casablanca Nearshore, Tangier Med, and Rabat Technopolis.
                Wathiq provides corporate buyback, closed-loop chain of custody, and B2B fleet quotes with official Moroccan TVA (20%).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="font-bold text-emerald-700">Bank of Africa</div>
                  <div className="text-slate-500 mt-1">284 Units Collected</div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold mt-1">890,000 MAD Recovery</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="font-bold text-emerald-700">Webhelp Nearshore</div>
                  <div className="text-slate-500 mt-1">150 ThinkPad Fleet</div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold mt-1">718,500 MAD Value</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="font-bold text-emerald-700">Avoided Emissions</div>
                  <div className="text-slate-500 mt-1">150 kg CO2 / laptop</div>
                  <div className="text-emerald-700 font-bold mt-1">63.6 Metric Tons Saved</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & CNDP */}
          {selectedSection === 'security_cndp' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                6. Data Sanitization &amp; Moroccan CNDP Law 09-08 Compliance
              </h2>
              <p>
                Storage drives are sanitized in accordance with <strong>NIST SP 800-88 Revision 1 Purge</strong> specifications.
                Wathiq issues legal sanitization attestations compliant with the Moroccan Commission Nationale de contrôle de la
                protection des Données à caractère Personnel (CNDP) and European GDPR Article 17/32 requirements.
              </p>
            </div>
          )}

          {/* TAB 7: REST API */}
          {selectedSection === 'api' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                7. REST API v1 Specification
              </h2>
              <p>
                Wathiq exposes clean, versioned REST endpoints under <code>/api/v1/...</code> enabling seamless integration with handheld
                barcode scanners, mobile technician tablets, and corporate B2B portals.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold">GET /api/v1/devices</span> — List serialized units with status/category filters
                </div>
                <div className="p-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold">POST /api/v1/devices/:id/transition</span> — Advance state machine with audit event
                </div>
                <div className="p-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold">POST /api/v1/inventory/movements</span> — Bin-to-bin warehouse movement log
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SOPS */}
          {selectedSection === 'sop' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                8. Standard Operating Procedures (SOP 1–9)
              </h2>
              <div className="space-y-3 text-xs">
                <div><strong>SOP 1: Inbound Dock Scanning &amp; Chassis Labeling:</strong> Scanned on mobile/tablet, unique ID generated, 2x1&quot; QR label affixed.</div>
                <div><strong>SOP 2: 17-Point Diagnostics:</strong> Automated CPU/GPU stress, RAM memtest, panel uniformity, French/Arabic keyboard verification.</div>
                <div><strong>SOP 3: NIST 800-88 Purge:</strong> Blancco cryptographic sanitization pass generating immutable SHA-256 validation hash.</div>
                <div><strong>SOP 4: Component Repairs &amp; Parts:</strong> Replacement parts and technician bench hours logged directly into unit economics.</div>
                <div><strong>SOP 5: QA Engine &amp; Certification:</strong> Strict gatekeeper preventing certification without mandatory pass.</div>
              </div>
            </div>
          )}

          {/* TAB 9: RUNBOOK */}
          {selectedSection === 'runbook' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                9. Technical Runbook &amp; Production Deployment
              </h2>
              <p>
                Built using Node.js v22 LTS and Next.js 16. Development server runs via <code>npm run dev</code> on port 3000.
                Production builds are executed via <code>npm run build</code>.
              </p>
            </div>
          )}

          {/* TAB 10: CTO BRIEF */}
          {selectedSection === 'brief' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b pb-2">
                10. CTO Product &amp; Technology Brief Summary
              </h2>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                <div className="font-bold text-emerald-900 dark:text-emerald-300">
                  Target Positioning:
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  Wathiq is the trusted device lifecycle and recommerce infrastructure for Morocco.
                  Initial focus: B2B refurbished IT (Call Centers, SMEs, Corporates, Universities), supported by ITAD and corporate buyback.
                </div>
                <div className="font-bold text-emerald-900 dark:text-emerald-300 pt-2">
                  Key Strategic Asset:
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  The strategic technology asset is not the website. It is the <strong>persistent digital identity and lifecycle history of millions of physical devices</strong>.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
