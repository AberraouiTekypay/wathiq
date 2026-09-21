# WATHIQ (واثق) — Technical & Operational Documentation Suite

> **The Trusted Device Lifecycle and Recommerce Operating System for Morocco**  
> An **EM300.co** Company.

Welcome to the comprehensive technical and operational documentation repository for **Wathiq (واثق)**. This suite provides in-depth specifications, architectural blueprints, state machine definitions, standard operating procedures (SOPs), financial accounting formulas, and compliance runbooks governing serialized device recommerce operations.

---

## Documentation Index

| # | Document | File | Description |
|---|---|---|---|
| 01 | **Master Technical Compendium** | [`MASTER_DOCUMENTATION.md`](./MASTER_DOCUMENTATION.md) | Executive brief, strategic mandate, full system architecture, state transitions, and executive CTO summary. |
| 02 | **System Architecture** | [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Modular monolith architecture, Next.js App Router layer, BFF design, persistence strategy, and data flow diagrams. |
| 03 | **23-State Lifecycle Engine** | [`DEVICE_STATE_MACHINE.md`](./DEVICE_STATE_MACHINE.md) | Complete finite state machine governing physical device transitions, valid transitions, and strict quality gatekeepers. |
| 04 | **Domain Model & Data Schema** | [`DOMAIN_MODEL.md`](./DOMAIN_MODEL.md) | Relational entity schemas, referential integrity rules, primary keys, foreign keys, and indexes for PostgreSQL 17. |
| 05 | **True Unit Economics Engine** | [`UNIT_ECONOMICS.md`](./UNIT_ECONOMICS.md) | Landed cost formulas ($\text{Acquisition} + \text{Logistics} + \text{Customs} + \text{Parts} + \text{Labor}$), margin analysis, and 20% Moroccan TVA calculations. |
| 06 | **B2B ITAD & Fleet Liquidation** | [`B2B_ITAD_AND_FLEET.md`](./B2B_ITAD_AND_FLEET.md) | Corporate IT asset disposition protocols, batch intake manifests, chain of custody logs, and ESG environmental $\text{CO}_2$ offset reporting. |
| 07 | **Security & Compliance** | [`SECURITY_AND_COMPLIANCE.md`](./SECURITY_AND_COMPLIANCE.md) | NIST 800-88 Rev 1 data sanitization, cryptographic verification hashes, and Moroccan CNDP Law 09-08 personal data protection compliance. |
| 08 | **REST API v1 Specification** | [`API_SPECIFICATION.md`](./API_SPECIFICATION.md) | Full endpoint documentation (`/api/v1/*`), request/response JSON contracts, and error code handling. |
| 09 | **Standard Operating Manual** | [`OPERATING_MANUAL.md`](./OPERATING_MANUAL.md) | Step-by-step SOPs (1 through 9) for warehouse intake, technician diagnostics, repair ticketing, data erasure, and QA grading. |
| 10 | **Technical Runbook & Deployment** | [`SYSTEM_RUNBOOK.md`](./SYSTEM_RUNBOOK.md) | Environment prerequisites, local setup, build commands, conflict resolution, and cloud deployment guides. |

---

## System Architecture Diagram

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

## 23-State Device Lifecycle Summary

```text
EXPECTED ──► RECEIVED ──► QUARANTINE (if flagged)
    │             │
    └─────────────┴──► DIAGNOSTICS (17-point test runner)
                            │
                            ├──► REPAIR_REQUIRED ──► REFURBISHMENT
                            │                              │
                            └──► DATA_WIPE (NIST 800-88) ◄─┘
                                    │
                                    ▼
                                   QA ──► FAILED_QA ──► REWORK
                                    │
                                    ▼
                                CERTIFIED
                                    │
                                    ▼
                             READY_FOR_SALE
                                    │
                       ┌────────────┴────────────┐
                       ▼                         ▼
                    RESERVED                   SOLD
                       │                         │
                       ▼                         ▼
                  ALLOCATED                  DISPATCHED
                       │                         │
                       ▼                         ▼
                   DELIVERED                 DELIVERED
                       │                         │
                       ▼                         ▼
                WARRANTY_ACTIVE           WARRANTY_ACTIVE
                       │
                       ├──► RMA_PENDING ──► RMA_IN_PROGRESS ──► RETURNED_TO_INVENTORY
                       │                                    └──► SCRAPPED
                       └──► HARVEST_PARTS / SCRAPPED / DONATED
```

---

## Interactive In-App Documentation

All specifications are also browsable live inside the running application:
* Navigate to **[`/docs`](http://localhost:3000/docs)** in the browser.
* Switch between interactive tabs for Architecture, State Machine, Domain Model, Unit Economics, ITAD & Fleet, Security, API, SOPs, and Runbook.
