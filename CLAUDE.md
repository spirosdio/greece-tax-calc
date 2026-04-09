# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build Greece investment tax calculator comparing VUAA direct investing vs unit-linked (UL) insurance vs employer pension matching. Live at https://spirosdio.github.io/greece-tax-calc/

## Local development

No build step. Serve with any static server (ES modules require HTTP, not `file://`):

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Running tests

No test suite exists yet. To add one:

```bash
npm init -y && npm install --save-dev vitest
# then: npx vitest run
```

`tax.js` exports pure functions — import them directly in test files.

## Architecture

All tax logic lives in `src/js/tax.js` — pure ES module functions, no DOM dependency. Every HTML page imports from it. Changes there affect all pages automatically.

`src/js/charts.js` contains Chart.js helpers and formatters used by the HTML pages.

The four HTML pages (`index.html`, `calculator.html`, `matching.html`, `sensitivity.html`) each own their own UI and charts, importing from the two JS modules.

## Tax law reference

The `laws/` directory contains the source laws as markdown notes:
- `laws/5246-2025_income-tax-brackets.md` — income brackets used in `BRACKETS` in tax.js
- `laws/5078-2023_ul-pension-exit-tax.md` — UL exit tax rates in `ulExitTaxRate()`
- `laws/EFKA-2025_social-security-rates.md` — SS rates (`EE_SS_RATE`, `ER_SS_RATE`)
- `laws/4099-2012_ucits-capital-gains-exemption.md` — why VUAA has 0% exit tax

## Key tax.js exports

| Function | Purpose |
|----------|---------|
| `incomeTax(gross)` | Greek income tax after SS deduction and €777 credit |
| `netSalary(gross)` | Take-home after SS + income tax |
| `marginalRate(gross)` | Marginal rate at gross salary |
| `ulExitTaxRate(years, lump, early)` | N.5078/2023 exit tax rate |
| `simulateAll(params)` | Year-by-year simulation of all strategies |
| `optimalExitYear(params)` | Brute-force optimal UL exit year |

## Deploy

Pushing to `master` auto-deploys via `.github/workflows/deploy.yml` to GitHub Pages.
