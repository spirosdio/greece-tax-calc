# Law 5246/2025 — Income Tax Brackets (effective 2026)

**Official title:** Νόμος 5246/2025  
**Scope:** Progressive income tax on employment / pension income for Greek tax residents  
**Effective from:** 1 January 2026

## Tax brackets (employment / pension, no children)

| Taxable income band (€) | Rate |
|------------------------|------|
| 0 – 10,000             |  9%  |
| 10,001 – 20,000        | 20%  |
| 20,001 – 30,000        | 26%  |
| 30,001 – 40,000        | 34%  |
| 40,001 – 60,000        | 39%  |
| > 60,000               | 44%  |

**Tax credit:** €777 (reduces final tax liability; phases out at higher incomes — simplified here as a flat deduction).

## Taxable income calculation

Taxable income = Gross salary − Employee social security contributions (EFKA)

## How this is used in the calculator

- `src/js/tax.js` → `BRACKETS`, `TAX_CREDIT`, `incomeTax()`, `marginalRate()`
- The marginal rate determines the post-tax cost of each euro contributed to VUAA vs. the pre-tax contribution routed through a unit-linked (UL) insurance product.

## Source / reference

- FEK (Government Gazette) publication of N.5246/2025
- Hellenic Ministry of Finance summary: https://www.minfin.gr
