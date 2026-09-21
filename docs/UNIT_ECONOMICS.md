# WATHIQ COST ACCOUNTING & TRUE UNIT ECONOMICS ENGINE

## 1. Executive Summary

A critical error made by early-stage refurbished electronics businesses is relying solely on **nominal gross margin** ($\text{Selling Price} - \text{Acquisition Cost}$).

In refurbished electronics, physical handling, transport, component repairs, technician bench labor, certification, packaging, warranty claims, and return allowances represent massive direct cost centers.

Wathiq implements **True Unit Economics Tracking**: every cost is linked directly to the individual physical device (`Device.costs`).

---

## 2. Landed Refurbished Cost Formula

The **Landed Refurbished Cost** ($\text{LRC}$) of an individual physical device is calculated as:

$$\text{LRC} = C_{\text{acq}} + C_{\text{trans}} + C_{\text{cust}} + C_{\text{cert}} + C_{\text{parts}} + C_{\text{labor}} + C_{\text{pack}} + C_{\text{direct}}$$

Where:
* **$C_{\text{acq}}$ (Acquisition Cost):** Purchase price paid to ITAD client, buyback customer, or auction.
* **$C_{\text{trans}}$ (Inbound Transport):** Direct freight, courier, or collection van expense per unit.
* **$C_{\text{cust}}$ (Customs / Import Taxes):** Cross-border tariffs (if imported from Europe/North America).
* **$C_{\text{cert}}$ (Diagnostic & Certification Fee):** Cost of automated burn-in tooling, Blancco data-wipe license, and QA audit.
* **$C_{\text{parts}}$ (Replacement Components):** Direct cost of all replacement hardware installed on the unit (keyboards, batteries, screens, fans, SSDs, RAM).
* **$C_{\text{labor}}$ (Technician Bench Labor):** Measured technician bench time multiplied by standard labor rate:
  $$C_{\text{labor}} = \text{Labor Hours} \times \text{Labor Rate per Hour}$$
* **$C_{\text{pack}}$ (Packaging & Accessories):** Specialized anti-static box, custom foam inserts, charger, and power cable.
* **$C_{\text{direct}}$ (Other Direct Costs):** Thermal paste, asset tagging labels, and cleaning consumables.

---

## 3. Real Example: ThinkPad T14 Gen 2 (`WTH-26-LPT-000184`)

| Cost Component | Details | Cost (MAD) |
| :--- | :--- | :--- |
| **Acquisition** | Bank of Africa ITAD Bulk Buyback | 3,200 |
| **Transport** | Insured van collection from Casablanca Nearshore | 120 |
| **Customs** | Local acquisition (0% tariff) | 0 |
| **Certification & Wipe** | Blancco NIST 800-88 erasure pass + QA audit | 150 |
| **Parts** | New OEM French/Arabic Backlit Keyboard | 450 |
| **Labor** | 1.5 technician hours @ 186.60 MAD/hr | 280 |
| **Packaging** | Anti-static custom box + 65W USB-C Charger | 65 |
| **Consumables** | Arctic MX-4 thermal compound + QR labels | 40 |
| **TOTAL LANDED COST** | **True Cost to Stock** | **4,305 MAD** |

---

## 4. Gross Margin vs Contribution Margin

### 4.1 Nominal Gross Profit & Margin
$$\text{Gross Profit} = \text{Selling Price} - \text{Landed Cost}$$
$$\text{Gross Margin \%} = \left(\frac{\text{Selling Price} - \text{Landed Cost}}{\text{Selling Price}}\right) \times 100$$

For device `WTH-26-LPT-000184`:
* Selling Price: **5,900 MAD** (~€549)
* Landed Cost: **4,305 MAD** (~€400)
* **Gross Profit:** $5,900 - 4,305 =$ **1,595 MAD**
* **Gross Margin:** $1,595 / 5,900 =$ **27.0%**

---

### 4.2 Contribution Margin (The True Measure of Profitability)
To ensure long-term solvency, Wathiq reserves variable post-sale deductions against every unit sold:

$$\text{Contribution Margin} = \text{Gross Profit} - (R_{\text{warr}} + F_{\text{pay}} + S_{\text{ship}} + R_{\text{ret}})$$

Where:
* **$R_{\text{warr}}$ (Warranty Reserve):** Actuarial reserve held for 12-month hardware care claims (typically 3-5% of Landed Cost = **215 MAD**).
* **$F_{\text{pay}}$ (Payment Gateway & Invoicing Fees):** Credit card or banking collection charges (**60 MAD**).
* **$S_{\text{ship}}$ (Outbound Shipping Subsidy):** Subsidized courier express delivery across Morocco (**50 MAD**).
* **$R_{\text{ret}}$ (Expected Return & Restocking Risk):** Provision for 14-day trial returns and restocking (**80 MAD**).

$$\text{Contribution Margin} = 1,595 - (215 + 60 + 50 + 80) = \mathbf{1,190\text{ MAD}}$$
$$\text{Contribution Margin \%} = \frac{1,190}{5,900} = \mathbf{20.2\%}$$

---

## 5. Pricing Engine Algorithm

Wathiq implements a four-tiered pricing matrix:

```text
       ┌────────────────────────────────────────────────┐
       │   Market Price (Competitors / Gray Market)     │ e.g. 6,500 MAD
       ├────────────────────────────────────────────────┤
       │   Selling Price (Current Listing)              │ e.g. 5,900 MAD
       ├────────────────────────────────────────────────┤
       │   Recommended Price (Algorithmically Computed) │ e.g. 5,900 MAD
       ├────────────────────────────────────────────────┤
       │   Minimum Price (Floor: Landed Cost + Margin)  │ e.g. 4,800 MAD
       └────────────────────────────────────────────────┘
```

### 5.1 Minimum Floor Price
No sales representative may discount a unit below the Minimum Floor Price without VP approval:
$$\text{Minimum Price} = \text{Landed Cost} \times (1 + \text{Target Margin Floor})$$
$$\text{Minimum Price} = 4,305 \times 1.115 = \mathbf{4,800\text{ MAD}}$$

### 5.2 Recommended Price Calculation
The pricing engine computes the recommended selling price based on:
1. **Cosmetic Grade Multiplier:** Grade A+ ($+15\%$), Grade A (Baseline), Grade B ($-12\%$), Grade C ($-25\%$).
2. **Battery Health Bonus:** Units with battery capacity $\ge 90\%$ command a $+5\%$ premium.
3. **Aging Inventory Penalty:** If days in inventory $> 45\text{ days}$, the system gradually recommends discounts down towards the minimum price floor.
4. **Market Benchmark:** Anchored against new OEM price (typically $50-60\%$ discount off new retail).
