# WATHIQ PLATFORM ARCHITECTURE

## 1. EXECUTIVE OVERVIEW

**Wathiq is the trusted device lifecycle and recommerce operating system for Morocco.**
We acquire, refurbish, certify, sell, finance, recover and resell electronics.

The core technology foundation rests on one fundamental architectural principle:

> **Every physical device must have a persistent digital identity throughout its complete lifecycle.**
> The system does not treat refurbished electronics as conventional SKU-based e-commerce inventory.
> **Device Entity > SKU Entity.**

A Lenovo ThinkPad T14 is a product SKU.
A specific ThinkPad T14 with serial number `PF-2947A890`, battery health 91%, SSD health 98%, cosmetic grade A, replaced FR/AR keyboard, NIST 800-88 erasure certificate, and 12-month warranty is an **individual Physical Device Entity (`WTH-26-LPT-000184`)**.

---

## 2. HIGH-LEVEL ARCHITECTURAL DESIGN

```text
                    WEB / MOBILE PWA
                         │
              ┌──────────┴──────────┐
              │                     │
        ADMIN / OPS             COMMERCE & VERIFY
              │                     │
              └──────────┬──────────┘
                         │
                   API / BFF LAYER
                   (/api/v1/...)
                         │
              ┌──────────┴──────────┐
              │                     │
          APPLICATION           AUTH & RBAC
          ENGINE LAYER           (Role Matrix)
              │
 ┌────────────┼──────────────────────────┐
 │            │          │               │
DEVICE      INVENTORY   SALES           ITAD
REGISTRY    & WAREHOUSE & QUOTES        BATCHES
 │            │          │               │
17-PT       LOCATIONS   ORDERS        CERTIFICATES
DIAGNOSTICS & BINS      & FULFILL     & PUBLIC HASH
 │            │          │               │
REPAIRS     MOVEMENTS   WARRANTY      REPORTING
& PARTS     AUDIT       & RMA         & ANALYTICS
 └────────────┼──────────┘
              │
         DATA LAYER
    (PostgreSQL / Store)
              │
     ┌────────┼─────────┐
     │        │         │
 Immutable  Search    Redis Queue
 Audit Log  Index     (Workers)
```

---

## 3. CORE ARCHITECTURAL MODULES

### 3.1 Authentication & Role-Based Access Control (RBAC)
Supported personas:
* **Super Admin**: Complete administrative oversight and configuration.
* **CEO / Executive**: High-level economic and quality analytics.
* **Operations Manager**: Process gatekeeping and exception handling.
* **Warehouse Operative**: High-throughput barcode scanning, bin allocation, pick/pack.
* **Technician**: 17-point component diagnostics, repair ticketing, parts installation.
* **QA Inspector**: Strict checklist gatekeeper and structured cosmetic grading.
* **Sales Lead**: CRM account management, opportunity pipeline, quote generator.
* **Finance**: Unit economics audit, pricing rules, landed cost ledger.
* **B2B Customer**: Fleet visibility, quote approvals, warranty claims.
* **Customer Service**: Rapid serial lookup, RMA returns triage.

### 3.2 Device Registry & Digital Passport
* Every device receives a permanent ID formatted: `WTH-[YY]-[CATEGORY]-[INDEX]`, e.g. `WTH-26-LPT-000184`.
* Serial Number and IMEI uniqueness are enforced strictly. Duplicate intake attempts are rejected.
* Complete digital passport displays hardware vitals (battery %, SSD health), repair histories, diagnostic logs, wipe hashes, and 12-month warranty details.

### 3.3 State Machine Engine
* 23 explicit lifecycle states with strict transition validation (`canTransition(from, to)`).
* Destructive/arbitrary state jumps are programmatically impossible.
* Every material state change appends an immutable record to the `DeviceEvent` log.

### 3.4 True Unit Economics Engine
Unlike retail commerce which relies on nominal gross margin, Wathiq calculates **true landed refurbished cost**:
$$\text{Landed Cost} = \text{Acquisition} + \text{Transport} + \text{Customs} + \text{Cert} + \text{Parts} + \text{Labor} + \text{Packaging} + \text{Direct}$$
$$\text{Gross Profit} = \text{Selling Price} - \text{Landed Cost}$$
$$\text{Contribution Margin} = \text{Gross Profit} - (\text{Warranty Reserve} + \text{Payment Fees} + \text{Shipping Subsidy} + \text{Return Risk})$$

### 3.5 B2B ITAD & Corporate Buyback
* Management of large enterprise asset disposal batches (e.g. Bank of Africa, OCP Group).
* Full chain of custody manifests.
* Automated calculation of avoided carbon emissions ($\approx 150\,\text{kg CO}_2$ per refurbished laptop).

---

## 4. DEPLOYMENT & SCALABILITY ROADMAP
* Built as a clean modular monolith using **Next.js 15+ App Router** and **TypeScript**.
* Direct RESTful API under `/api/v1/` allowing external warehouse scanner devices, mobile tablets, and third-party ERP integration.
* Zero external cloud lock-in: supports PostgreSQL on cloud providers (Supabase, AWS RDS, Scaleway) and Docker containers.
