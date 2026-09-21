# WATHIQ TECHNICAL RUNBOOK & DEPLOYMENT GUIDE

## 1. System Requirements & Environment

* **Runtime:** Node.js v20+ or v22+ LTS (Verified on `v22.15.0`)
* **Package Manager:** `npm` v10+ (Verified on `11.19.0`)
* **Framework:** Next.js 15+ / 16 (App Router, Turbopack)
* **Styling:** Tailwind CSS v4, Lucide React
* **QR Engine:** `qrcode` vector engine
* **Database / Store:** High-performance in-memory and JSON-persisted store with PostgreSQL 17 compatibility.

---

## 2. Local Setup & Execution

### 2.1 Initial Setup
```powershell
# 1. Clone or navigate to the repository directory
cd C:\refurb

# 2. Install all required dependencies
npm install

# 3. Launch development server with Turbopack
npm run dev
```

The application will listen on:
* **Local:** `http://localhost:3000`
* **Network / Mobile Scanner:** `http://[YOUR_LOCAL_IP]:3000`

### 2.2 Production Build
```powershell
# 1. Compile optimized production bundles and verify TypeScript
npm run build

# 2. Start production server
npm run start
```

---

## 3. Operations Runbook & Common Scenarios

### Scenario A: Warehouse Operator Scans a New Physical Device
1. Open `http://localhost:3000/app` and select the **Warehouse & Scanner** tab.
2. Align barcode with the viewfinder or type the chassis serial into the input.
3. If not registered:
   * Click **Register Inbound Device**.
   * Fill out the intake modal (Brand, Model, Serial Number, Acquisition Cost).
   * Wathiq OS assigns a persistent Device ID (e.g. `WTH-26-LPT-000185`).
   * Click **Print 2x1" Sticker** to affix the QR chassis label.

### Scenario B: Illegal State Transition Rejection
* **Symptom:** API returns `422 Unprocessable Entity`:
  `"Illegal state transition from EXPECTED to READY_FOR_SALE. Follow Wathiq Lifecycle Engine rules."`
* **Resolution:** Devices must follow the linear quality pipeline:
  `EXPECTED` ──► `RECEIVED` ──► `DIAGNOSTICS` ──► `DATA_WIPE` ──► `REFURBISHMENT` ──► `QA` ──► `CERTIFIED` ──► `READY_FOR_SALE`.
  Units cannot bypass diagnostic, sanitization, or QA inspection gates.

### Scenario C: Port 3000 Conflict Resolution
If port 3000 is occupied by another process on Windows:
```powershell
# Find PID occupying port 3000
netstat -ano | findstr :3000

# Kill process by PID (replace 1234 with actual PID)
taskkill /F /PID 1234
```

---

## 4. Production Cloud Deployment Roadmap

```text
                  Cloudflare / AWS Route 53
                             │
                             ▼
               Next.js App (Vercel / Docker)
                             │
       ┌─────────────────────┴─────────────────────┐
       ▼                                           ▼
Managed PostgreSQL 17                      S3 / MinIO Object Storage
(Supabase / AWS RDS / Scaleway)            (Chassis photos, certificates)
```

### 4.1 Automated Database Backups
```bash
# Automated daily PostgreSQL backup with timestamp
pg_dump -U wathiq_admin -h db.wathiq.ma -d wathiq_prod -Fc -f "/backup/wathiq_$(date +%Y%m%d_%H%M%S).dump"
```
* **Retention Policy:** Daily snapshots retained for 30 days; monthly snapshots retained for 7 years for CNDP / fiscal audit compliance.
* **Point-in-Time Recovery (PITR):** WAL archiving enabled with 5-minute RPO target.
