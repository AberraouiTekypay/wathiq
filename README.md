# WATHIQ (واثق) — Device Lifecycle & Recommerce Infrastructure

> **The Trusted Device Lifecycle and Recommerce Operating System for Morocco.**  
> An **EM300.co** Company.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)
[![Compliance](https://img.shields.io/badge/Compliance-NIST_800--88_%7C_CNDP_09--08-10B981)](#security--compliance)

---

## Table of Contents

1. [Executive Summary & Strategic Mandate](#1-executive-summary--strategic-mandate)
2. [Core Architectural Principle: Device > SKU](#2-core-architectural-principle-device--sku)
3. [Platform Modules & Interactive Routes](#3-platform-modules--interactive-routes)
4. [23-State Device Lifecycle State Machine](#4-23-state-device-lifecycle-state-machine)
5. [Hardware Diagnostics & Data Sanitization](#5-hardware-diagnostics--data-sanitization)
6. [True Unit Economics & Landed Cost Engine](#6-true-unit-economics--landed-cost-engine)
7. [Enterprise ITAD & B2B Quotations (20% TVA)](#7-enterprise-itad--b2b-quotations-20-tva)
8. [REST API v1 Specification](#8-rest-api-v1-specification)
9. [Getting Started & Local Development](#9-getting-started--local-development)
10. [Production Deployment (Vercel & Cloud)](#10-production-deployment-vercel--cloud)
11. [Documentation Suite Index](#11-documentation-suite-index)

---

## 1. Executive Summary & Strategic Mandate

Wathiq (واثق) is built to solve the foundational challenge of the refurbished electronics industry in Morocco and emerging markets: **the absence of persistent, verifiable physical device identity**.

Traditional e-commerce platforms (Shopify, Magento, WooCommerce) treat inventory as interchangeable quantities of an abstract SKU. In refurbished consumer electronics and enterprise IT assets, this approach causes systemic failure:
* Two identical laptop models have completely different battery cycles, cosmetic wear, component replacement histories, and remaining lifespans.
* Spreadsheets result in lost inventory, unverified data sanitization, and inaccurate margin calculations.
* Corporate IT departments hesitate to purchase refurbished units or liquidate retired fleets due to data leak fears and lack of enforceable warranty tracking.

Wathiq transforms pre-owned physical hardware into **digitally certified, tamper-evident assets** with an immutable audit trail and verifiable digital passport.

---

## 2. Core Architectural Principle: Device > SKU

$$\text{Physical Device Entity} > \text{Product Model / SKU}$$

In Wathiq:
* **The Individual Physical Device** is the primary domain entity with a unique identifier (e.g., `WTH-26-LPT-000184`).
* Serial numbers and IMEIs are strictly enforced unique.
* Every material operational event—intake, diagnostics, data sanitization, parts replacement, QA grading, warehouse bin moves, sales reservation, warranty claims—is permanently appended to that physical device's **Digital Passport**.

---

## 3. Platform Modules & Interactive Routes

Wathiq is architected as a high-performance modular system built with Next.js 16 (App Router) and Tailwind CSS v4:

| Route | Module | Purpose |
|---|---|---|
| **`/`** | **Public Landing Page** | High-converting commercial overview showcasing the certified recommerce infrastructure, value proposition, and B2B ITAD services. |
| **`/app`** | **Operations OS Cockpit** | Full operational console for warehouse operatives, technicians, QA inspectors, and sales leads. |
| **`/verify/[id]`** | **Device Digital Passport** | Tamper-proof public passport displaying hardware vitals, battery health %, SSD health, 17-point test runner results, NIST wipe certificate, and print-ready official certificate. |
| **`/catalog`** | **Certified Hardware Catalog** | Serialized catalog displaying exact physical units available in warehouse finished goods with real battery health and direct passport links. |
| **`/docs`** | **In-App Documentation Hub** | Interactive technical viewer for system architecture, state transitions, domain models, APIs, and operating procedures. |

### Operations OS Sub-Modules (`/app`)
* **Device Registry**: Searchable serialized inventory, duplicate protection, instant passport inspection.
* **Warehouse & Mobile Scanner**: Handheld/tablet scanner simulator with 1-click actions (`[MOVE BIN]`, `[RESERVE]`, `[PICK & PACK]`, `[PASSPORT]`) and 2x1" chassis QR label printing.
* **Technician Workbench**: 17-point component burn-in diagnostic test runner and repair ticketing with replacement parts inventory.
* **Data Erasure Lab**: NIST 800-88 Rev 1 and Blancco cryptographic sanitization runner generating immutable verification hashes.
* **QA Engine & Grading**: Mandatory quality gatekeeper and structured cosmetic grading calculator (A+, A, B, C, D).
* **True Unit Economics & Pricing**: Landed Cost ledger ($\text{Acquisition} + \text{Logistics} + \text{Customs} + \text{Cert} + \text{Parts} + \text{Labor} + \text{Packaging}$) and contribution margin analysis.
* **B2B CRM & Quotation**: Moroccan corporate accounts (Call Centers, SMEs, Universities), pipeline tracking, and formal printable quotation generator with 20% Moroccan TVA breakdown.
* **Enterprise ITAD**: Batch collection manifests, chain of custody logs, and ESG environmental $\text{CO}_2$ offset reporting.
* **Warranty & RMA**: Serial warranty lookup and reverse logistics re-routing into the device lifecycle.
* **Immutable Audit Trail**: Append-only operational event ledger.

---

## 4. 23-State Device Lifecycle State Machine

A device's physical status is strictly guarded by the transition engine (`canTransition`), preventing illegal lifecycle shortcuts:

```text
 1. EXPECTED        ──► Inbound consignment scheduled
 2. RECEIVED        ──► Physical dock barcode scan completed
 3. QUARANTINE      ──► Isolated for security or hardware damage assessment
 4. DIAGNOSTICS     ──► 17-point automated and bench burn-in underway
 5. DATA_WIPE       ──► NIST 800-88 / Blancco cryptographic sanitization
 6. REPAIR_REQUIRED ──► Component failure flagged; repair ticket opened
 7. REFURBISHMENT   ──► Replacement parts installed and thermals renewed
 8. QA              ──► Final quality assurance inspection against checklist
 9. FAILED_QA       ──► QA defect spotted; routed to rework
10. CERTIFIED       ──► All gates passed; tamper-evident certificate issued
11. READY_FOR_SALE  ──► Placed in finished goods bin; listed in catalog
12. RESERVED        ──► Allocated to approved B2B quote or pending PO
13. SOLD            ──► Payment captured or corporate contract executed
14. PICKED          ──► Retrieved from warehouse bin
15. PACKED          ──► Packaged with tamper-evident seal and accessories
16. DISPATCHED      ──► Handed to courier / freight carrier
17. DELIVERED       ──► Physical delivery confirmed by customer signature
18. WARRANTY_ACTIVE ──► 12-month coverage clock running
19. RMA_PENDING     ──► Customer claim filed; return authorized
20. RMA_IN_PROGRESS ──► Reverse logistics intake and triage
21. RETURNED_TO_INV ──► Repaired / re-certified and placed back into inventory
22. HARVEST_PARTS   ──► Disassembled for working spare parts
23. SCRAPPED        ──► Certified WEEE recycling; zero environmental landfill
```

---

## 5. Hardware Diagnostics & Data Sanitization

### 17-Point Diagnostic Gatekeeper
Before certification, devices undergo a strict hardware validation run:
1. **Display Matrix & Backlight** (Dead pixel test, color uniformity)
2. **Keyboard Matrix** (Every key tested for ghosting and response)
3. **Trackpad & Gestures** (Multi-touch, click sensors)
4. **Battery Health Benchmark** (Cycle count, full charge capacity vs. design capacity)
5. **SSD / NVMe SMART Vitals** (Wear rate, bad sectors, temperature)
6. **Thermal & CPU Stress Test** (Full load fan curve, throttling limits)
7. **RAM Memory Integrity** (MemTest burn-in pass)
8. **Wi-Fi 6 & Bluetooth Connectivity** (Packet loss, signal strength)
9. **Webcam & Microphone Array** (Audio clarity, sensor check)
10. **Internal Speakers** (Frequency sweep, distortion check)
11. **I/O Ports & Thunderbolt** (All USB-C, USB-A, HDMI, audio jacks)
12. **Biometric Security** (Fingerprint sensor, Windows Hello / Touch ID)
13. **Chassis & Hinge Structural Integrity** (Torque test, frame alignment)
14. **Power Delivery & Charging IC** (Wattage negotiation, heat profile)
15. **BIOS / UEFI Integrity** (MDM unenrollment, firmware unlock, Computrace clearance)
16. **GPU Stress Test** (VRAM integrity, DirectX / Metal benchmark)
17. **Cooling Fan Bearing** (RPM stability, acoustic decibel measurement)

### NIST 800-88 Rev 1 Data Sanitization
* **Purge / Clear Methods:** Cryptographic Erase (NVMe/SSD sanitize command) and multi-pass overwrite.
* **Verification:** Block-level cryptographic verification generating an immutable verification hash (SHA-256).
* **Compliance:** Fully compliant with Moroccan Law 09-08 (CNDP) and European GDPR erasure mandates.

---

## 6. True Unit Economics & Landed Cost Engine

Wathiq implements a complete unit-level landed cost ledger rather than gross inventory approximations:

$$\text{True Landed Cost} = \text{Acquisition} + \text{Inbound Freight} + \text{Customs/Import} + \text{Refurb Parts} + \text{Labor Cost} + \text{Packaging} + \text{Certification Overhead}$$

$$\text{Gross Margin (MAD)} = \text{Net Sale Price (excl. TVA)} - \text{True Landed Cost}$$

$$\text{Gross Margin (\%)} = \left( \frac{\text{Gross Margin (MAD)}}{\text{Net Sale Price (excl. TVA)}} \right) \times 100$$

All calculations support Moroccan fiscal accounting standards with automatic 20% TVA separation and net margin reporting.

---

## 7. Enterprise ITAD & B2B Quotations (20% TVA)

* **Enterprise Fleet Buyback**: Corporate IT asset retirement manifests with automated fair-market value grading.
* **Chain of Custody Tracking**: GPS-tracked secure transport, dual-custody dock receiving, and destruction/wipe certificates.
* **ESG Environmental Impact Reporting**: Calculation of avoided $\text{CO}_2$ emissions (typically ~240 kg $\text{CO}_2\text{e}$ per laptop compared to virgin manufacturing) and electronic waste diverted from landfills.
* **B2B Quotation Generator**: Formal printable quotations with customer ICE/IF/RC identifiers, payment terms (Net 30/60), and 20% Moroccan TVA breakdown.

---

## 8. REST API v1 Specification

Wathiq exposes a standardized, type-safe RESTful API under `/api/v1/`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/devices` | Query serialized devices with filters (brand, category, status, grade, min battery). |
| `POST` | `/api/v1/devices` | Inbound intake of a new physical device and automatic passport initialization. |
| `GET` | `/api/v1/devices/[id]` | Full device details, audit trail, diagnostic results, and digital passport. |
| `POST` | `/api/v1/devices/[id]/transition` | Execute a lifecycle state transition with validation against the 23-state machine. |
| `POST` | `/api/v1/devices/[id]/diagnostics` | Submit 17-point hardware diagnostic test results. |
| `POST` | `/api/v1/devices/[id]/data-wipe` | Submit NIST 800-88 cryptographic data wipe certificate. |
| `POST` | `/api/v1/devices/[id]/repair` | Log replacement parts, technician labor time, and repair notes. |
| `POST` | `/api/v1/devices/[id]/qa` | Submit final QA inspection checklist and assign cosmetic grade. |
| `GET` | `/api/v1/inventory/movements` | Query historical warehouse bin and storage movements. |
| `GET` | `/api/v1/quotes` | List B2B quotations, customer accounts, and totals. |
| `POST` | `/api/v1/quotes` | Create a new enterprise B2B quotation with line items and 20% TVA. |
| `GET` | `/api/v1/orders` | List customer and B2B fulfillment orders. |
| `GET` | `/api/v1/itad` | Retrieve enterprise ITAD batches, collection manifests, and ESG offsets. |
| `GET` | `/api/v1/analytics` | High-level operations analytics: total devices, certification rate, landed cost totals. |

---

## 9. Getting Started & Local Development

### Prerequisites
* **Node.js**: v20+ or v22+ LTS (Verified on `v22.15.0`)
* **npm**: v10+ or v11+ (Verified on `11.19.0`)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/AberraouiTekypay/wathiq.git
cd wathiq

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
* **Landing Page:** [http://localhost:3000](http://localhost:3000)
* **Operations OS:** [http://localhost:3000/app](http://localhost:3000/app)
* **Sample Digital Passport:** [http://localhost:3000/verify/WTH-26-LPT-000184](http://localhost:3000/verify/WTH-26-LPT-000184)
* **Certified Hardware Catalog:** [http://localhost:3000/catalog](http://localhost:3000/catalog)
* **Interactive Documentation:** [http://localhost:3000/docs](http://localhost:3000/docs)

### Building for Production
```bash
# Compile and verify TypeScript
npm run build

# Start production server
npm run start
```

---

## 10. Production Deployment (Vercel & Cloud)

Wathiq is optimized for seamless deployment on **Vercel** as a zero-configuration Next.js App Router application.

### Deploying via Vercel CLI
```bash
# Preview deployment
npx vercel

# Production deployment
npx vercel --prod
```

### Environment Variables
For production PostgreSQL persistence and external storage integrations:
```env
# Database (PostgreSQL 17)
DATABASE_URL="postgresql://wathiq_user:password@host:5432/wathiq_production"

# Application Settings
NEXT_PUBLIC_APP_URL="https://wathiq.vercel.app"
NODE_ENV="production"
```

---

## 11. Documentation Suite Index

For comprehensive technical deep dives, consult the dedicated specifications in [`/docs`](./docs/README.md):

* 📘 [**Master Documentation Compendium**](./docs/MASTER_DOCUMENTATION.md)
* 🏛️ [**System Architecture & Tech Stack**](./docs/ARCHITECTURE.md)
* 🔄 [**23-State Lifecycle Transition Engine**](./docs/DEVICE_STATE_MACHINE.md)
* 🗄️ [**Domain Model & PostgreSQL Schema**](./docs/DOMAIN_MODEL.md)
* 💰 [**True Unit Economics & Landed Cost Ledger**](./docs/UNIT_ECONOMICS.md)
* 🏢 [**B2B ITAD & Corporate Fleet Liquidation**](./docs/B2B_ITAD_AND_FLEET.md)
* 🔒 [**NIST 800-88 & CNDP Law 09-08 Compliance**](./docs/SECURITY_AND_COMPLIANCE.md)
* 🔌 [**REST API v1 Specification**](./docs/API_SPECIFICATION.md)
* 📋 [**Standard Operating Procedures (SOP 1–9)**](./docs/OPERATING_MANUAL.md)
* 🛠️ [**Production System Runbook & Recovery**](./docs/SYSTEM_RUNBOOK.md)

---

### Corporate Attribution
WATHIQ (واثق) is an **EM300.co** Company. All rights reserved.
