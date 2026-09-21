# WATHIQ SECURITY, COMPLIANCE & DATA SANITIZATION

## 1. Data Sanitization Standards

Data sanitization is the single most sensitive legal concern for Moroccan corporate clients, banks, and multinational call centers. Wathiq enforces compliance with **NIST Special Publication 800-88 Revision 1** (*Guidelines for Media Sanitization*).

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    NIST 800-88 SANITIZATION LEVELS                      │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. CLEAR:   Logical overwrite of user-addressable storage locations.    │
│             Applies to devices reused internally within the same team.  │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. PURGE:   Executes low-level controller commands (Cryptographic Erase │
│             and block overwrite) rendering target data recovery        │
│             infeasible using state-of-the-art laboratory techniques.    │
│             ★ WATHIQ STANDARD FOR ALL REFURBISHED ASSETS.               │
├─────────────────────────────────────────────────────────────────────────┤
│ 3. DESTROY: Physical degaussing, shredding, or incineration.            │
│             Reserved for failed/damaged drives and terminal SCRAP units.│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Approved Sanitization Tooling Matrix

| Hardware Architecture | Approved Software Tooling | Method | Verification Output |
| :--- | :--- | :--- | :--- |
| **x86/x64 PC & Laptop (NVMe / SATA)** | **Blancco Drive Eraser v6.15** | NIST 800-88 Purge (Cryptographic Erase + Overwrite) | Digitally signed XML/PDF report + SHA-256 hash |
| **Apple Silicon (M1/M2/M3 Mac)** | **Apple Configurator 2 / DFU Restore** | Hardware Secure Enclave Cryptographic Key Destruction | Apple MDM unenrollment confirmation + clean macOS receipt |
| **Smartphones (iOS / Android)** | **PhoneCheck ADISA / NIST Purge** | Factory Firmware Erase + Overwrite Pass | ADISA Certificate of Sanitization |
| **Enterprise Networking (Cisco / Juniper)** | **Vendor IOS Flash Zeroization** | DoD 5220.22-M 3-Pass Flash Overwrite | NVRAM zero confirmation log |

---

## 3. Legal & Privacy Compliance

### 3.1 Moroccan Law 09-08 (CNDP)
Under Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data:
* Enterprise IT directors face severe criminal and financial liabilities if corporate devices bearing employee or customer records are liquidated without certified erasure.
* Wathiq provides the legal **Attestation de Destruction et d'Effacement Sécurisé des Données** required by CNDP auditors.

### 3.2 European GDPR Compatibility
The majority of contact centers in Casablanca and Rabat process European customer data (France, Spain, UK, Benelux):
* Under GDPR Article 17 (*Right to Erasure*) and Article 32 (*Security of Processing*), decommissioned hardware must be certified sanitized before secondary transfer.
* The Wathiq public verification passport (`verify.wathiq.ma/:id`) provides instant external audit proof for European data protection officers (DPOs).

---

## 4. Role-Based Access Control (RBAC) Matrix

Wathiq implements strict role separation. Operations that alter financial ledgers or certify quality cannot be executed by unauthorized staff.

| Action / Capability | Super Admin | Ops Mgr | Warehouse | Tech | QA | Sales | Finance | Customer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dock Inbound Device Scan** | ✓ | ✓ | **✓** | — | — | — | — | — |
| **Physical Bin Relocation** | ✓ | ✓ | **✓** | — | — | — | — | — |
| **17-Pt Hardware Diagnostics** | ✓ | ✓ | — | **✓** | — | — | — | — |
| **Create Repair Ticket & Parts** | ✓ | ✓ | — | **✓** | — | — | — | — |
| **Execute Data Wipe Cert** | ✓ | **✓** | — | — | — | — | — | — |
| **Certify Device (QA Gate)** | ✓ | ✓ | — | — | **✓** | — | — | — |
| **Audit True Unit Economics** | ✓ | ✓ | — | — | — | — | **✓** | — |
| **Create B2B Quote** | ✓ | ✓ | — | — | — | **✓** | — | — |
| **Manage ITAD Batches** | ✓ | **✓** | — | — | — | ✓ | — | — |
| **File Warranty Claim** | ✓ | ✓ | — | — | — | — | — | **✓** |

---

## 5. Non-Destructive Event Auditability

In compliance with corporate governance best practices:
* **No destructive updates:** Prices, acquisition costs, and repair invoices cannot be silently overwritten. Any retrospective adjustment must be recorded as an audit event with operator ID, reason, and timestamp.
* **Immutable Hash Chains:** Every issued Wathiq certificate contains a deterministic SHA-256 hash derived from the serial number, data wipe timestamp, QA inspector ID, and battery health at time of testing. Any post-issuance tampering invalidates the public verification check.
