# WATHIQ DEVICE STATE MACHINE SPECIFICATION

## 1. STATE MACHINE PHILOSOPHY

A device's physical status must never be set arbitrarily. State changes represent validated operational milestones executed by authenticated personnel. Every transition emits an append-only audit event.

---

## 2. STATE DEFINITIONS (23 DISCRETE STATES)

| State | Category | Operational Meaning |
| :--- | :--- | :--- |
| `EXPECTED` | Intake | Scheduled inbound shipment or client ITAD batch |
| `RECEIVED` | Intake | Physical unit scanned and docked at warehouse |
| `QUARANTINE` | Intake | Isolated for security lock, BIOS lock, or physical assessment |
| `DIAGNOSTICS` | Processing | 17-point component diagnostic test underway |
| `DATA_WIPE` | Processing | NIST 800-88 / Blancco cryptographic sanitization pass |
| `REPAIR_REQUIRED` | Processing | Defect flagged; repair ticket opened with parts requirement |
| `REFURBISHMENT` | Processing | Hardware repair, thermal repaste, cleaning, and assembly |
| `QA` | Quality | Quality audit against mandatory checklist |
| `FAILED_QA` | Quality | QA defect spotted; automatically routed to rework station |
| `CERTIFIED` | Quality | All mandatory QA gates passed; certificate issued |
| `READY_FOR_SALE` | Commercial | Stocked in finished goods bin; listed in catalog/B2B inventory |
| `RESERVED` | Commercial | Allocated to an approved B2B quote or pending PO |
| `SOLD` | Commercial | Payment captured or contract finalized |
| `PACKED` | Fulfillment | Unit placed in protective packaging; warranty seal applied |
| `SHIPPED` | Fulfillment | Dispatched with courier carrier across Morocco |
| `DELIVERED` | Fulfillment | Client receipt confirmed; 12-month warranty active |
| `RETURNED` | Lifecycle | Customer return intake for warranty or trial RMA |
| `WARRANTY` | Lifecycle | Undergoing repair or replacement under active warranty |
| `RECOVERY` | Lifecycle | Enterprise lease return, buyback, or trade-in unit |
| `REWORK` | Processing | Corrective action following failed QA inspection |
| `RELISTED` | Commercial | Reconditioned after recovery; re-entering commercial pool |
| `RECYCLED` | Terminal | Decommissioned to certified Moroccan e-waste partner |
| `SCRAPPED` | Terminal | Harvested for parts (screws, brackets, RAM); chassis recycled |

---

## 3. PERMITTED TRANSITION MATRIX

```text
EXPECTED        ──► RECEIVED, SCRAPPED
RECEIVED        ──► QUARANTINE, DIAGNOSTICS, SCRAPPED
QUARANTINE      ──► DIAGNOSTICS, SCRAPPED, RECYCLED
DIAGNOSTICS     ──► DATA_WIPE, REPAIR_REQUIRED, SCRAPPED
DATA_WIPE       ──► REPAIR_REQUIRED, REFURBISHMENT, QA, FAILED_QA
REPAIR_REQUIRED ──► REFURBISHMENT, SCRAPPED
REFURBISHMENT   ──► QA, REWORK
QA              ──► CERTIFIED, FAILED_QA
FAILED_QA       ──► REPAIR_REQUIRED, REWORK, SCRAPPED
REWORK          ──► REFURBISHMENT, QA
CERTIFIED       ──► READY_FOR_SALE
READY_FOR_SALE  ──► RESERVED, SOLD
RESERVED        ──► READY_FOR_SALE, SOLD, PACKED
SOLD            ──► PACKED, READY_FOR_SALE (if order cancelled)
PACKED          ──► SHIPPED
SHIPPED         ──► DELIVERED, RETURNED
DELIVERED       ──► WARRANTY, RETURNED, RECOVERY
RETURNED        ──► QUARANTINE, DIAGNOSTICS, RECOVERY
WARRANTY        ──► DIAGNOSTICS, REPAIR_REQUIRED, RECOVERY, DELIVERED
RECOVERY        ──► DIAGNOSTICS, DATA_WIPE, REWORK, RECYCLED, SCRAPPED
RELISTED        ──► READY_FOR_SALE
RECYCLED        ──► [Terminal]
SCRAPPED        ──► [Terminal]
```

---

## 4. AUDIT TRAIL DATA SCHEMA
Every state transition creates a `DeviceEvent` containing:
* `id`: Unique event ID (`EVT-[TIMESTAMP]-[RAND]`)
* `deviceId`: Target physical unit
* `fromState`: Previous state
* `toState`: Target state
* `operatorId`: User ID of technician or supervisor
* `operatorName`: Human-readable name
* `role`: Authenticated role
* `timestamp`: ISO-8601 UTC timestamp
* `notes`: Operational reason or diagnostic reference
