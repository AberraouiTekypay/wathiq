# WATHIQ REST API SPECIFICATION (v1)

## Base URL
```text
https://api.wathiq.ma/api/v1
```

---

## 1. DEVICE REGISTRY ENDPOINTS

### 1.1 List Devices
* **Endpoint:** `GET /api/v1/devices`
* **Query Parameters:**
  * `status`: Filter by state (`READY_FOR_SALE`, `DIAGNOSTICS`, etc.)
  * `category`: Filter by category (`Laptop`, `Desktop`, `Smartphone`, etc.)
  * `q`: Search by Serial Number, Device ID, or Model
* **Response (200 OK):**
```json
{
  "success": true,
  "total": 48,
  "data": [
    {
      "id": "WTH-26-LPT-000184",
      "serialNumber": "PF-2947A890",
      "model": "ThinkPad T14 Gen 2",
      "grade": "A",
      "status": "READY_FOR_SALE",
      "batteryHealth": 91,
      "pricing": {
        "sellingPrice": 5900,
        "currency": "MAD"
      }
    }
  ]
}
```

### 1.2 Register Inbound Device
* **Endpoint:** `POST /api/v1/devices`
* **Payload:**
```json
{
  "deviceData": {
    "category": "Laptop",
    "brand": "Lenovo",
    "model": "ThinkPad T14 Gen 2",
    "serialNumber": "PF-2947A890",
    "acquisitionCost": 3000,
    "acquisitionSource": "Bank of Africa ITAD",
    "specs": {
      "cpu": "Intel Core i5-1145G7",
      "ram": "16GB",
      "storage": "512GB SSD",
      "display": "14\" FHD",
      "color": "Black",
      "os": "Windows 11 Pro"
    }
  },
  "operatorName": "Mohamed Tazi",
  "role": "WAREHOUSE"
}
```
* **Enforced Constraints:** Duplicate `serialNumber` returns `409 Conflict`.

### 1.3 Advance Lifecycle State
* **Endpoint:** `POST /api/v1/devices/:id/transition`
* **Payload:**
```json
{
  "toState": "DATA_WIPE",
  "operatorName": "Tarik Bensouda",
  "role": "TECHNICIAN",
  "reason": "Hardware diagnostics passed successfully"
}
```
* **Validation:** Returns `422 Unprocessable Entity` if illegal transition attempted.

---

## 2. REPAIR & DIAGNOSTIC ENDPOINTS

### 2.1 Record 17-Point Diagnostics
* **Endpoint:** `POST /api/v1/devices/:id/diagnostics`
* **Payload:**
```json
{
  "diagnostics": {
    "cpu": true, "ram": true, "ssd": true, "gpu": true,
    "display": true, "keyboard": true, "trackpad": true,
    "webcam": true, "mic": true, "speakers": true,
    "usb": true, "hdmi": true, "usbC": true,
    "wifi": true, "bluetooth": true, "battery": true, "thermals": true,
    "overallPass": true,
    "notes": "Thermals under 74C under full AIDA64 stress"
  },
  "operatorName": "Tarik Bensouda"
}
```

### 2.2 Record Data Wipe Certificate
* **Endpoint:** `POST /api/v1/devices/:id/data-wipe`
* **Payload:**
```json
{
  "wipeData": {
    "software": "Blancco Drive Eraser",
    "version": "v6.15",
    "method": "NIST 800-88 Rev 1 Purge",
    "operator": "Amina El Amrani",
    "certificateRef": "BLAN-WTH-2026-8914-NIST",
    "result": "PASSED",
    "verificationHash": "9e107d9d372bb6826bd81d3542a419d6"
  }
}
```

---

## 3. INVENTORY MOVEMENTS

* **Endpoint:** `POST /api/v1/inventory/movements`
* **Payload:**
```json
{
  "deviceId": "WTH-26-LPT-000184",
  "toLocation": {
    "warehouse": "Casablanca Central Hub",
    "zone": "Zone B - Finished Goods",
    "shelf": "Shelf 04",
    "bin": "Bin 18"
  },
  "operatorName": "Mohamed Tazi",
  "reason": "Moved to finished goods following QA certification"
}
```

---

## 4. B2B SALES & QUOTATION

* **Endpoint:** `POST /api/v1/quotes`
* **Payload:**
```json
{
  "accountId": "ACC-001",
  "clientName": "Webhelp Nearshore Morocco",
  "contactPerson": "Mehdi Bennani",
  "email": "m.bennani@webhelp.ma",
  "items": [
    {
      "sku": "LEN-T14-G2-I5-16-512",
      "model": "Lenovo ThinkPad T14 Gen 2",
      "grade": "A",
      "quantity": 50,
      "unitPrice": 4790,
      "warrantyMonths": 12
    }
  ],
  "deploymentFee": 10000,
  "deliveryFee": 3000,
  "taxRate": 0.20
}
```
