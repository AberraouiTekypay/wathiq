# WATHIQ (واثق) — MASTER TECHNICAL & OPERATIONAL COMPENDIUM

> **The Trusted Device Lifecycle & Recommerce Operating System for Morocco**  
> An **EM300.co** Company

---

## TABLE OF CONTENTS
1. [Executive Brief & Strategic Mandate](#1-executive-brief--strategic-mandate)
2. [Core Architectural Axiom: Device > SKU](#2-core-architectural-axiom-device--sku)
3. [Complete System Architecture](#3-complete-system-architecture)
4. [23-State Lifecycle State Machine](#4-23-state-lifecycle-state-machine)
5. [Database Domain Model & Referential Integrity](#5-database-domain-model--referential-integrity)
6. [Cost Accounting & True Unit Economics Engine](#6-cost-accounting--true-unit-economics-engine)
7. [Standard Operating Procedures (SOP 1–9)](#7-standard-operating-procedures-sop-19)
8. [Moroccan Enterprise B2B & ITAD Infrastructure](#8-moroccan-enterprise-b2b--itad-infrastructure)
9. [Security, NIST 800-88 & CNDP Compliance](#9-security-nist-800-88--cndp-compliance)
10. [REST API v1 Reference](#10-rest-api-v1-reference)
11. [Runbook & Production Deployment Guide](#11-runbook--production-deployment-guide)

---

## 1. Executive Brief & Strategic Mandate

Wathiq is built to solve the foundational challenge of the refurbished electronics industry in Morocco: **the absence of persistent, verifiable physical device identity**.

Conventional e-commerce platforms (Shopify, WooCommerce, Magento) treat inventory as abstract SKU quantities. In refurbished electronics, this produces severe operational failure:
* Two identical laptop models have vastly different battery wear, past component repairs, and cosmetic flaws.
* Spreadsheet-based management leads to lost inventory, unverified wipe compliance, and miscalculated margins.
* Corporate IT directors hesitate to buy refurbished or liquidate retired fleets due to data security and warranty enforcement risks.

Wathiq transforms physical refurbished hardware into **digitally certified, tamper-evident assets**.

---

## 2. Core Architectural Axiom: Device > SKU

In Wathiq:
$$\text{Physical Device Entity} > \text{Product Model / SKU}$$

Every physical device entering Wathiq’s custody is assigned a permanent identifier (`WTH-26-LPT-000184`). Throughout its physical lifespan (including secondary resale, lease return, or warranty repair), all diagnostic benchmarks, data wipe certificates, parts replacements, and ownership changes append permanently to that device’s **Digital Passport**.

---

## 3. Complete System Architecture

Wathiq is structured as a **Modular Monolith** using **Next.js 15/16 App Router**, **TypeScript**, and **Tailwind CSS v4**.

```text
                                WEB / TABLET PWA
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
              OPERATIONS OS                        COMMERCE & PASSPORT
           (Warehouse, Tech, QA,                 (Public Catalog, Buyer,
             Sales, Finance)                        Public Verification)
                    │                                     │
                    └──────────────────┬──────────────────┘
                                       ▼
                             RESTFUL API & BFF LAYER
                                 (/api/v1/...)
                                       │
 ┌─────────────────────────────────────┴─────────────────────────────────────┐
 │                         DOMAIN APPLICATION ENGINES                        │
 ├───────────────────┬───────────────────┬───────────────────┬───────────────┤
 │ DEVICE REGISTRY   │ INVENTORY & BINS  │ 17-PT DIAGNOSTICS │ REPAIRS & HW  │
 │ & QR LABELS       │ WAREHOUSE SCANNER │ BENCH TESTS       │ PARTS LEDGER  │
 ├───────────────────┼───────────────────┼───────────────────┼───────────────┤
 │ DATA ERASURE LAB  │ QA GATEKEEPER     │ TRUE UNIT         │ B2B CRM &     │
 │ NIST 800-88 PURGE │ STRUCTURED GRADE  │ LANDED COSTS      │ 20% TVA QUOTES│
 ├───────────────────┼───────────────────┼───────────────────┼───────────────┤
 │ ITAD DISPOSAL     │ WARRANTY CLAIMS   │ ORDER FULFILL     │ IMMUTABLE     │
 │ & ESG REPORTING   │ & RMA LOGISTICS   │ PICK / PACK / SHIP│ AUDIT TRAIL   │
 └───────────────────┴───────────────────┴───────────────────┴───────────────┘
                                       │
                                       ▼
                           DATA & PERSISTENCE LAYER
                (In-Memory Store / PostgreSQL 17 / JSON Cache)
```

---

## 4. 23-State Lifecycle State Machine

A device’s physical status is strictly guarded by the transition engine (`canTransition`):

```text
 1. EXPECTED        ──► Inbound consignment scheduled
 2. RECEIVED        ──► Physical dock barcode scan completed
 3. QUARANTINE      ──► Isolated for security or hardware damage assessment
 4. DIAGNOSTICS     ──► 17-point automated and bench burn-in underway
 5. DATA_WIPE       ──► NIST 800-88 / Blancco cryptographic sanitization
 6. REPAIR_REQUIRED ──► Component failure flagged; repair ticket opened
 7. REFURBISHMENT   ──► Replacement parts installed and thermals renewed
 8. QA              ──► Final quality assurance inspection against checklist
 9. FAILED_QA       ──► QA defect spotted; routed to Rework
10. CERTIFIED       ──► All gates passed; tamper-evident certificate issued
11. READY_FOR_SALE  ──► Placed in finished goods bin; listed in catalog
12. RESERVED        ──► Allocated to approved B2B quote or pending PO
13. SOLD            ──► Payment captured or corporate contract executed
14. PACKED          ──► Protective packaging applied; warranty sticker sealed
15. SHIPPED         ──► Handed over to courier (CTM / Aramex / Wathiq Fleet)
16. DELIVERED       ──► Client receipt confirmed; 12-month warranty clock active
17. RETURNED        ──► Customer RMA return received at dock
18. WARRANTY        ──► Service claim opened; undergoing repair or swap
19. RECOVERY        ──► Buyback or lease return unit entering 2nd lifecycle
20. REWORK          ──► Corrective action following failed QA inspection
21. RELISTED        ──► Reconditioned after recovery; re-entering catalog
22. RECYCLED        ──► [Terminal] Decommissioned to certified e-waste partner
23. SCRAPPED        ──► [Terminal] Stripped for spare parts; chassis scrapped
```

---

## 5. Database Domain Model & Referential Integrity

* **Uniqueness Constraints:** `serialNumber` and `imei` have enforced unique indexes. Duplicate intake attempts are rejected with `409 Conflict`.
* **Append-Only Logging:** Price alterations, component replacements, and state advances generate immutable `DeviceEvent` records.
* **Bi-directional Linking:**
  * Every `RepairRecord` links to specific `PartUsed` items and technician labor hours.
  * Every `Order` and `QuoteLineItem` maps directly to serialized `Device.id` units.

---

## 6. Cost Accounting & True Unit Economics Engine

Wathiq implements true direct-cost roll-up:

$$\text{Landed Cost} = \text{Acquisition} + \text{Transport} + \text{Customs} + \text{Cert} + \text{Parts} + \text{Labor} + \text{Packaging} + \text{Direct Consumables}$$

$$\text{Gross Profit} = \text{Selling Price} - \text{Landed Cost}$$

$$\text{Contribution Margin} = \text{Gross Profit} - (\text{Warranty Reserve} + \text{Payment Fees} + \text{Shipping Subsidy} + \text{Return Provision})$$

---

## 7. Standard Operating Procedures (SOP 1–9)

* **SOP 1 (Intake):** Handheld tablet scan, barcode validation, persistent ID generation, and thermal 2"x1" QR sticker application.
* **SOP 2 (Diagnostics):** 17-point component burn-in (CPU, RAM, SSD, Display, Keyboard, Battery, etc.).
* **SOP 3 (Sanitization):** NIST 800-88 Purge pass producing cryptographically signed SHA-256 certificate hashes.
* **SOP 4 (Servicing):** Parts requisition from inventory and technician labor hours logged directly to the unit's cost sheet.
* **SOP 5 (QA Audit):** Mandatory 5-point gatekeeper (Display, Keyboard, Battery $\ge 80\%$, NIST Cert, BIOS Unlocked) and structured grading (A+, A, B, C, D).
* **SOP 6 (Certification):** Certificate generation linked to public verification URL `verify.wathiq.ma/:id`.
* **SOP 7 (Sales & Quotes):** B2B Quote builder with Moroccan TVA (20%) and image deployment add-ons.
* **SOP 8 (ITAD):** Enterprise pickup manifests, custody transfer, recovery valuation, and avoided carbon reporting.
* **SOP 9 (Warranty):** Express hardware replacement and reverse logistics RMA intake.

---

## 8. Moroccan Enterprise B2B & ITAD Infrastructure

* Tailored for Call Centers in **Casablanca Nearshore Park**, **Rabat Technopolis**, and **Tangier Med**.
* Standardized French/Arabic backlit keyboards and 24-hour advance hardware swap SLA.
* Formal billing compliant with Moroccan Tax Law (ICE, IF, RC, Patente, and 20% TVA).

---

## 9. Security, NIST 800-88 & CNDP Compliance

* Fully compliant with **NIST SP 800-88 Rev 1 Purge** specifications.
* Meets Moroccan **Law 09-08 (CNDP)** requirements for certified data destruction.
* GDPR Article 17 (*Right to Erasure*) and Article 32 (*Security of Processing*) compliant for European offshore operations.

---

## 10. REST API v1 Reference

Standardized endpoints under `/api/v1/...`:
* `GET / POST /api/v1/devices`
* `GET /api/v1/devices/:id`
* `POST /api/v1/devices/:id/transition`
* `POST /api/v1/devices/:id/diagnostics`
* `POST /api/v1/devices/:id/data-wipe`
* `POST /api/v1/devices/:id/repair`
* `POST /api/v1/devices/:id/qa`
* `GET / POST /api/v1/inventory/movements`
* `GET / POST /api/v1/quotes`
* `GET / POST /api/v1/orders`
* `GET / POST /api/v1/itad`
* `GET /api/v1/analytics`

---

## 11. Runbook & Production Deployment Guide

* **Dev Server:** `npm run dev` (Runs locally on port 3000).
* **Production Build:** `npm run build` followed by `npm start`.
* **Zero Git Push:** As instructed, all files remain local pending final brand name consensus.

---
An **EM300.co** Company.
