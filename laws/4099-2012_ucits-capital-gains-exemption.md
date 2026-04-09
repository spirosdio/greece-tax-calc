# Law ν.4099/2012 + UCITS Directive 2009/65/EC — Capital Gains Exemption on UCITS ETFs

## Greek law: ν.4099/2012

**Official title:** Νόμος 4099/2012 — Transposition of UCITS IV Directive into Greek law  
**Scope:** Regulation of UCITS (Undertakings for Collective Investment in Transferable Securities) in Greece  
**Relevant provision:** Capital gains realised by Greek retail investors from the sale of UCITS-compliant fund units (including ETFs) are **exempt from capital gains tax** in Greece.

## EU framework: UCITS Directive 2009/65/EC

**Official title:** Directive 2009/65/EC of the European Parliament and of the Council (UCITS IV)  
**Scope:** Harmonises the rules for UCITS funds across EU member states, enabling cross-border passporting.

VUAA (Vanguard FTSE All-World UCITS ETF, accumulating, USD-denominated, Dublin-domiciled) is a UCITS-compliant fund and therefore qualifies for the Greek exemption under ν.4099/2012.

## Practical consequence

| Event | Tax treatment for Greek resident |
|-------|----------------------------------|
| Sale of VUAA shares (capital gain) | **0%** — exempt under ν.4099/2012 |
| Dividends from VUAA (accumulating) | N/A — gains are reinvested inside the fund |

This **0% exit tax** is the core structural advantage of the VUAA strategy vs. unit-linked products (which pay 5–20% exit tax under N.5078/2023).

## How this is used in the calculator

- `src/js/tax.js` → `simulateAll()` — the VUAA strategy applies **no exit tax** at any point.
- The 0% rate is hardcoded as the baseline; all comparisons against UL products measure the net advantage of UL's pre-tax compounding vs. VUAA's zero exit tax.

## Caveats / open questions

- The exemption covers capital gains; **dividend income** from distributing share classes would be taxed as income.
- Always verify the fund's UCITS status with your broker or the HCMC (Hellenic Capital Market Commission).
- Tax treatment can change; verify against the current year's AADE guidance.

## Source / reference

- FEK (Government Gazette) publication of ν.4099/2012
- EUR-Lex: Directive 2009/65/EC — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009L0065
- HCMC (Επιτροπή Κεφαλαιαγοράς): https://www.hcmc.gr
