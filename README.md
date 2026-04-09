# greece-tax-calc

Greece investment tax calculator — comparing VUAA direct investing vs unit-linked insurance vs employer pension matching.

**Live demo:** `https://<your-username>.github.io/greece-tax-calc/`

## Tax law used

| Law | What it covers |
|-----|---------------|
| Law 5246/2025 | Income tax brackets (2026) |
| N.5078/2023 | Group pension / UL exit tax rates (from 2024) |
| EFKA 2025 | Social security: 13.37% employee, 21.79% employer |
| ν.4099/2012 + UCITS Directive 2009/65/EC | 0% capital gains on UCITS ETFs in Greece |

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page, tax fact tables |
| `calculator.html` | VUAA vs UL with reinvestment after exit, optimal exit timing |
| `matching.html` | Employer matching vs salary raise — SS arbitrage |
| `sensitivity.html` | Return sweep, drag×return surface, advantage decomposition |

## Repo structure

```
greece-tax-calc/
├── index.html
├── calculator.html
├── matching.html
├── sensitivity.html
├── src/
│   ├── js/
│   │   ├── tax.js       ← all Greek tax logic, pure functions, ES module
│   │   └── charts.js    ← Chart.js helpers, formatters, legend builders
│   └── css/
│       └── main.css     ← design system, dark theme
└── README.md
```

## Local development

No build step needed. Just open with any static server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code: use Live Server extension
```

Then open `http://localhost:8080`.

> ⚠️ The pages use ES modules (`type="module"`) so you **cannot** open them as `file://` — you need a local server.

## Deploy to GitHub Pages

### Option A — root of `main` branch (simplest)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → branch `main`, folder `/` (root)
4. Save — GitHub will give you a URL in ~60 seconds

### Option B — GitHub Actions (auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then in **Settings → Pages**, set source to **GitHub Actions**.

### Option C — Netlify drag-and-drop

Zip the repo folder and drop it on [netlify.com/drop](https://netlify.com/drop). Done in 10 seconds.

## Extending

### Adding a new tax rule

All tax logic is in `src/js/tax.js` — pure functions, no DOM. Edit there, all pages pick it up automatically.

```js
// Example: add a new exit tax scenario
export function ulExitTaxRate(years, lump, early) {
  // ...
}
```

### Adding a new page

1. Copy `calculator.html` as a starting point
2. Add the nav link in all four HTML files
3. Import from `./src/js/tax.js` and `./src/js/charts.js`

### Unit testing the tax logic

Since `tax.js` is pure ES module:

```bash
npm init -y
npm install --save-dev vitest
```

```js
// tax.test.js
import { incomeTax, netSalary, marginalRate } from './src/js/tax.js'
import { expect, test } from 'vitest'

test('marginal rate at 100k is 39%', () => {
  expect(marginalRate(100_000)).toBe(0.39)
})

test('income tax on 100k gross', () => {
  // taxable = 100000 - 13370 (SS) = 86630
  // 9%×10k + 22%×10k + 28%×10k + 36%×10k + 39%×36630 - 777 = ~25k
  expect(incomeTax(100_000)).toBeGreaterThan(20_000)
})
```

```bash
npx vitest run
```

## Disclaimer

This tool is for informational purposes only. It does not constitute financial, legal, or tax advice. Tax law changes frequently — verify with a qualified Greek tax advisor before making investment decisions.

Sources: [minfin.gov.gr](https://minfin.gov.gr), [aade.gr](https://aade.gr), [ey.com/el_gr](https://ey.com/el_gr)
