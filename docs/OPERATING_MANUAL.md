# WATHIQ STANDARD OPERATING PROCEDURES (SOP)

## 1. WAREHOUSE INTAKE & SCANNING (SOP-WH-01)
1. Inbound pallet or courier batch arrives at the Casablanca Central Hub loading dock.
2. Warehouse operator opens the **Wathiq Mobile Scan Station** on tablet or mobile device.
3. Operator scans the manufacturer barcode or physically types the serial number into the system.
4. The system validates whether the serial number already exists in Wathiq's database:
   * If new, the system generates a unique Device ID (e.g. `WTH-26-LPT-000184`).
   * A 2"x1" thermal chassis sticker containing the Wathiq ID and QR code is printed immediately and affixed to the chassis bottom.
5. Operator physically places the unit in the designated intake bin (e.g., `Dock Inbound / Bay 01 / Intake Bin 08`) and confirms location in Wathiq OS.

---

## 2. HARDWARE DIAGNOSTICS & REPAIRS (SOP-TC-02)
1. Technician retrieves device from intake bin and moves state from `RECEIVED` to `DIAGNOSTICS`.
2. Technician runs the 17-point component diagnostic suite:
   * CPU benchmark & thermal throttling test
   * RAM memtest
   * NVMe SMART health & IOPS test
   * Display backlight uniformity and dead pixel inspection
   * French/Arabic keyboard key matrix test
   * Battery cycle count and health percentage verification
   * IO ports, Wi-Fi, and Bluetooth test
3. If defects are identified (e.g., worn spacebar, pressure mark on screen):
   * Technician transitions device to `REPAIR_REQUIRED`.
   * A repair ticket is created specifying required parts (e.g. OEM FR/AR Backlit Keyboard) and labor hours.
   * Wathiq OS automatically calculates part costs and labor fees, rolling them directly into the device's **True Landed Cost**.
4. Following assembly and repasting with Arctic MX-4, the unit transitions to `REFURBISHMENT` and is prepped for Data Erasure.

---

## 3. DATA ERASURE & COMPLIANCE (SOP-SEC-03)
1. Device is connected to the sanitization bench and state is set to `DATA_WIPE`.
2. Approved software is initiated:
   * PC / Laptops: Blancco Drive Eraser v6.15 or NIST 800-88 Purge.
   * Apple Mac / iPhone: Apple DFU Hardware Clean Restore & MDM Unenrollment verification.
   * Networking: Cisco NVRAM & Flash 3-Pass Overwrite.
3. Upon 100% completion, the software outputs a cryptographic SHA-256 validation hash and certificate reference.
4. The operator records the certificate in Wathiq OS. The certificate becomes permanently immutable and accessible via the public Digital Passport.

---

## 4. QA ENGINE & CERTIFICATION (SOP-QA-04)
1. Lead QA Inspector receives unit at the Quality Lab and sets state to `QA`.
2. Inspector performs the mandatory gatekeeper checks:
   * [x] Display & panel uniformity verified under white and black screens
   * [x] Keyboard and trackpad 100% responsive
   * [x] Battery Health verified $\ge 80\%$ (or $\ge 90\%$ for Grade A+)
   * [x] NIST 800-88 Data Sanitization certificate present in database
   * [x] BIOS/UEFI administrative password cleared and Secure Boot activated
3. Structured Cosmetic Grading:
   * Screen condition assessed (A+, A, B, C)
   * Chassis and corners assessed (A+, A, B, C)
   * Keyboard and palm rest assessed (A+, A, B, C)
   * Overall Wathiq Grade computed by the grading engine.
4. If passed: QA Inspector clicks **Certify Device**. State transitions to `CERTIFIED` and official Wathiq Certificate is generated.
5. If failed: QA Inspector records defect notes. Unit transitions to `FAILED_QA` and is routed to the Rework Station.

---

## 5. B2B SALES & ORDER FULFILLMENT (SOP-SL-05)
1. B2B Sales Lead creates a customized quote for enterprise clients (Call Centers, SMEs, Universities).
2. Quotes include device grade, quantity, warranty tier, Moroccan TVA (20%), and optional image deployment fees.
3. When quote is accepted by the client:
   * Devices are transitioned to `RESERVED` and locked against other orders.
   * Warehouse receives automated picking slip.
   * Operator picks units from finished goods bins, verifies chassis serials, and seals with Wathiq tamper-evident warranty stickers.
   * Unit state transitions to `PACKED` then `SHIPPED` via CTM / Aramex / Wathiq fleet.
