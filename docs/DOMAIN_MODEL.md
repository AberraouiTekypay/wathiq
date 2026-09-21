# WATHIQ DOMAIN MODEL & ENTITY RELATIONSHIPS

## 1. Domain Modeling Philosophy: Device Entity > SKU

In conventional e-commerce, the primary entity is a generic SKU with a stock counter:
```text
Product (Lenovo ThinkPad T14) ──► SKU (T14-i5-16GB) ──► Quantity: 24
```
In **Wathiq**, because physical devices undergo individual wear, component replacement, diagnostics, and multiple ownership cycles, **the primary domain entity is the Individual Physical Device**:

```text
                                  PRODUCT
                                     │
                                     ▼
                                    SKU
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
DEVICE ENTITY 001             DEVICE ENTITY 002             DEVICE ENTITY 003
(WTH-26-LPT-000184)           (WTH-26-LPT-000185)           (WTH-26-LPT-000186)
 ├── Serial: PF-2947A890       ├── Serial: C02GK98NMD6R      ├── Serial: DL-8M29Q14
 ├── Battery Health: 91%       ├── Battery Health: 95%       ├── Battery Health: 84%
 ├── SSD Health: 98%           ├── SSD Health: 99%           ├── SSD Health: 94%
 ├── 17-pt Diagnostics         ├── 17-pt Diagnostics         ├── 17-pt Diagnostics
 ├── NIST 800-88 Purge         ├── Apple DFU Purge           ├── Pending Wipe
 ├── Replaced FR/AR Keyboard   ├── Zero Repairs              ├── Pending Tech Bay
 ├── Landed Cost: 4,305 MAD    ├── Landed Cost: 8,805 MAD    ├── Landed Cost: 2,880 MAD
 ├── Grade A Certified         ├── Grade A+ Certified        ├── Under Diagnostics
 └── 12-Month Care Warranty    └── 12-Month Apple Care       └── Pending Warranty
```

---

## 2. Core Entities Specification

### 2.1 `Device` (Physical Unit)
The root operational entity representing a physical asset.
* **`id`** (`string`, PK): Unique Wathiq ID, formatted `WTH-[YY]-[CAT]-[INDEX]` (e.g., `WTH-26-LPT-000184`).
* **`sku`** (`string`, FK): Product model reference (e.g., `LEN-T14-G2-I5-16-512`).
* **`category`** (`enum`): `Laptop`, `Desktop`, `Smartphone`, `Tablet`, `Monitor`, `Networking`, `Peripheral`.
* **`brand`** (`string`): Brand manufacturer (e.g., `Lenovo`, `Apple`, `Dell`, `HP`, `Cisco`).
* **`model`** (`string`): Full commercial model name (e.g., `ThinkPad T14 Gen 2`).
* **`modelNumber`** (`string`): Manufacturer part number (e.g., `20W0004NUS`).
* **`serialNumber`** (`string`, Unique Index): Enforced unique physical serial number.
* **`imei`** / **`imei2`** (`string`, Optional): For cellular devices and smartphones.
* **`macAddress`** (`string`, Optional): Physical network interface MAC address.
* **`specs`** (`JSON`):
  * `cpu`: Processor specification, clock speed, and core topology.
  * `ram`: Installed memory size, frequency, and type.
  * `storage`: Storage capacity, bus type (NVMe/SATA), and form factor.
  * `display`: Screen diagonal, resolution, panel type (IPS/OLED), and nits.
  * `gpu`: Discrete or integrated graphics accelerator.
  * `color`: Chassis finish and colorway.
  * `os`: Pre-installed and activated operating system.
* **`batteryHealth`** (`integer`, 0-100): Measured battery capacity relative to design capacity.
* **`batteryCycles`** (`integer`): Battery charge discharge cycles.
* **`ssdHealth`** (`integer`, 0-100): SMART percentage life remaining and sector health.
* **`acquisitionSource`** (`string`): Upstream provenance (e.g., `Bank of Africa ITAD Batch 2026-014`).
* **`acquisitionDate`** (`date`): Date acquired at dock.
* **`costs`** (`UnitEconomics`): True direct cost breakdown.
* **`pricing`** (`Pricing`): Minimum, recommended, market, and selling price.
* **`grade`** (`enum`): Overall certified grade (`A+`, `A`, `B`, `C`, `D`).
* **`detailedGrading`** (`JSON`): Sub-scores for Screen, Chassis, Keyboard, Battery, and Functional tests.
* **`status`** (`DeviceStatus`): Current lifecycle milestone in the 23-state machine.
* **`location`** (`LocationDetail`): Warehouse, Zone, Shelf, and Bin slot.
* **`warranty`** (`JSON`): Terms, duration (months), start date, end date, and certificate number.
* **`compliance`** (`JSON`): NIST 800-88 compliance, CE marking, and e-waste compliance flags.
* **`createdAt`** / **`updatedAt`** (`timestamp`).

---

### 2.2 `DeviceEvent` (Append-Only Event Sourcing)
Every material operational milestone generates an immutable event:
* **`id`** (`string`, PK): Unique event identifier (`EVT-[TIMESTAMP]-[RAND]`).
* **`deviceId`** (`string`, FK): Associated device.
* **`eventType`** (`string`): e.g. `DeviceReceived`, `DiagnosticsRecorded`, `DataWipeCompleted`, `RepairCompleted`, `QAPassedAndCertified`, `StatusChanged`, `InventoryMoved`.
* **`fromState`** (`DeviceStatus`, Optional): Pre-transition state.
* **`toState`** (`DeviceStatus`, Optional): Post-transition state.
* **`operatorId`** (`string`, FK): User who authorized or performed the action.
* **`operatorName`** (`string`): Human-readable name.
* **`role`** (`UserRole`): Role under which the event was authorized.
* **`timestamp`** (`timestamp`): UTC timestamp.
* **`metadata`** (`JSON`, Optional): Extended technical metrics or parameters.
* **`notes`** (`text`): Operational justification, repair notes, or inspection comments.

---

### 2.3 `InventoryMovement` (Location & Bin Traceability)
Tracks physical transfers between warehouses, zones, shelves, and bins:
* **`id`** (`string`, PK): Movement identifier (`MOV-[RAND]`).
* **`deviceId`** (`string`, FK): Associated device.
* **`fromLocation`** (`LocationDetail`): Origin Warehouse, Zone, Shelf, and Bin.
* **`toLocation`** (`LocationDetail`): Destination Warehouse, Zone, Shelf, and Bin.
* **`operator`** (`string`): Warehouse technician who moved the physical unit.
* **`timestamp`** (`timestamp`): Time of physical bin scan.
* **`reason`** (`string`): e.g., *Intake allocation*, *Moved to Repair bench*, *Stocked into Finished Goods*.

---

### 2.4 `RepairRecord` & `PartUsed`
Maintains hardware servicing history and rolls costs into Landed Cost:
* **`ticketId`** (`string`, PK): Ticket number (e.g., `REP-26-0034`).
* **`deviceId`** (`string`, FK): Physical device serviced.
* **`description`** (`text`): Description of servicing action.
* **`partsUsed`** (`PartUsed[]`):
  * `partId`: Internal part SKU.
  * `partName`: Component name (e.g., *ThinkPad T14 FR/AR Backlit Keyboard*).
  * `partNumber`: Manufacturer OEM part number.
  * `cost`: Unit acquisition cost of the part.
* **`laborHours`** (`float`): Bench time spent by technician.
* **`laborRatePerHour`** (`number`): Standardized bench labor rate.
* **`totalCost`** (`number`): $\text{Parts Cost} + (\text{Labor Hours} \times \text{Labor Rate})$.
* **`technician`** (`string`): Technician identifier.
* **`date`** (`date`).
* **`status`** (`enum`): `COMPLETED`, `IN_PROGRESS`.

---

### 2.5 `B2BAccount`, `Opportunity` & `B2BQuote`
Enterprise commercial relationships across Morocco:
* **`B2BAccount`**:
  * `id`: e.g. `ACC-001`.
  * `companyName`: Legal business name (e.g. *Webhelp Nearshore Morocco*).
  * `industry`: Call Center, BPO, Financial Institution, University, SME.
  * `fleetSize`: Total estimated fleet under corporate management.
  * `procurementCycle`: Refresh cadence (Quarterly, Bi-Annual, Annual).
  * `taxId`: Moroccan Identifiant Commun de l’Entreprise (**ICE**).
  * `annualItSpend`: Estimated budget in MAD.
* **`Opportunity`**:
  * Stages: `LEAD` ──► `QUALIFIED` ──► `DISCOVERY` ──► `QUOTE` ──► `NEGOTIATION` ──► `WON` / `LOST`.
* **`B2BQuote`**:
  * Line items with SKU, Model, Cosmetic Grade, Quantity, and Unit Price.
  * Deployment Fee (onsite asset tagging, custom OS image).
  * Delivery Fee (secure transport to client nearshore park).
  * Moroccan TVA calculation (20% standard rate).

---

### 2.6 `ITADBatch` (Enterprise Disposal & Buyback)
* **`id`** (`string`, PK): Batch identifier (e.g. `ITAD-CAS-2026-014`).
* **`batchNumber`** (`string`): Corporate disposal reference.
* **`clientName`** (`string`): Client enterprise (e.g. *Bank of Africa*).
* **`city`** (`string`): Collection depot (Casablanca, Rabat, Tangier, etc.).
* **`deviceCount`** (`integer`): Units collected under manifest.
* **`status`** (`enum`): `COLLECTED`, `IN_PROCESSING`, `WIPED`, `REPORT_READY`, `COMPLETED`.
* **`collectionDate`** (`date`).
* **`manifestNumber`** (`string`): Legal transfer of custody number.
* **`recoveryValuation`** (`number`): Net cash credit or residual value payable to client.
* **`environmentalReductionCo2Kg`** (`number`): Avoided carbon footprint (150 kg $\text{CO}_2$ per laptop).
