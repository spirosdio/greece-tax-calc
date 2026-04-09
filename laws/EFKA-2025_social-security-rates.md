# EFKA 2025 — Social Security Contribution Rates

**Authority:** EFKA (Ενιαίος Φορέας Κοινωνικής Ασφάλισης — Unified Social Security Entity)  
**Scope:** Mandatory social security contributions on employment income  
**Applicable year:** 2026 (monthly cap of €7,761.94 confirmed for 2026 per EFKA Circular 4/2026)

## Contribution rates

| Party    | Rate    | Applied to           |
|----------|---------|----------------------|
| Employee | 13.87%  | Gross salary (capped)|
| Employer | 21.79%  | Gross salary (capped)|

## Annual contribution cap

- Monthly ceiling: **€7,761.94**
- Annual ceiling: **€93,143.28** (12 × €7,761.94)

Contributions are not levied on the portion of gross salary above the annual cap.

## Key mechanics

- **Employee SS** reduces taxable income before income tax is applied (see Law 5246/2025).
- **Employer SS** is a cost on top of gross salary and is used to compute the true employer cost of each compensation euro — critical for the employer-matching arbitrage modelled in `matching.html`.

## How this is used in the calculator

- `src/js/tax.js` → `SS_CAP_ANNUAL`, `EE_SS_RATE`, `ER_SS_RATE`
- `employeeSS(gross)`, `employerSS(gross)`, `totalEmployerCost(gross)`
- The employer-matching page (`matching.html`) exploits the fact that pension/UL contributions can be structured to avoid employer SS, creating a net advantage vs. an equivalent salary raise.

## Source / reference

- EFKA official website: https://www.efka.gov.gr
- Ministerial decision setting 2025 contribution rates / monthly ceiling
