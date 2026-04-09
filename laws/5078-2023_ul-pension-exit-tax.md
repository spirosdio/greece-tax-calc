# Law N.5078/2023 — Unit-Linked & Group Pension Exit Tax

**Official title:** Νόμος 5078/2023  
**Scope:** Taxation of payouts from unit-linked (UL) insurance products and group pension schemes  
**Effective from:** 1 January 2024

## Exit tax rates on accumulated capital

### Lump-sum withdrawal

| Membership years | Tax rate |
|-----------------|----------|
| ≤ 5             |   20%    |
| 6 – 10          |   15%    |
| 11 – 20         |   10%    |
| > 20            |    5%    |

### Periodic / pension drawdown

| Membership years | Tax rate |
|-----------------|----------|
| ≤ 5             |   10%    |
| 6 – 10          |  7.5%    |
| 11 – 20         |    5%    |
| > 20            |  2.5%    |

### Early-exit penalty (before age 60)

All rates above are multiplied by **1.5** when the beneficiary exits before reaching age 60.

## How this is used in the calculator

- `src/js/tax.js` → `ulExitTaxRate(years, lump, early)`
- The calculator models two exit strategies:
  - **ulLump** — lump-sum exit at `exitYear`, proceeds reinvested in VUAA
  - **ulPeriodic** — periodic/pension exit at `exitYear`, proceeds reinvested in VUAA
- The optimal exit year is found by sweeping all possible exit years and picking the one that maximises terminal wealth.

## Source / reference

- FEK (Government Gazette) publication of N.5078/2023
- AADE (Independent Authority for Public Revenue): https://www.aade.gr
