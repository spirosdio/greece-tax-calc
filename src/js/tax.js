/**
 * tax.js — Greece 2026 tax logic
 * All monetary values in EUR. Rates from Law 5246/2025, N.5078/2023.
 */

export const SS_CAP_ANNUAL = 7761.94 * 12; // €93,143.28
export const EE_SS_RATE    = 0.1387;
export const ER_SS_RATE    = 0.2179;

/** Progressive income tax brackets (employment/pension, 2026, no children) */
const BRACKETS = [
  [10_000, 0.09],
  [10_000, 0.20],
  [10_000, 0.26],
  [10_000, 0.34],
  [20_000, 0.39],
  [Infinity, 0.44],
];
const TAX_CREDIT = 777;

/** Employee SS on gross salary */
export function employeeSS(gross) {
  return Math.min(gross, SS_CAP_ANNUAL) * EE_SS_RATE;
}

/** Employer SS on gross salary */
export function employerSS(gross) {
  return Math.min(gross, SS_CAP_ANNUAL) * ER_SS_RATE;
}

/** Total employer cost (gross + employer SS) */
export function totalEmployerCost(gross) {
  return gross + employerSS(gross);
}

/** Income tax on gross salary (after employee SS deduction) */
export function incomeTax(gross) {
  const taxableIncome = gross - employeeSS(gross);
  let tax = 0;
  let remaining = Math.max(0, taxableIncome);
  for (const [width, rate] of BRACKETS) {
    const chunk = Math.min(remaining, width);
    tax += chunk * rate;
    remaining -= chunk;
    if (remaining <= 0) break;
  }
  return Math.max(0, tax - TAX_CREDIT);
}

/** Net take-home salary */
export function netSalary(gross) {
  return gross - employeeSS(gross) - incomeTax(gross);
}

/** Marginal income tax rate at a given gross salary */
export function marginalRate(gross) {
  const taxable = gross - employeeSS(gross);
  const thresholds = [10_000, 20_000, 30_000, 40_000, 60_000];
  const rates      = [0.09,   0.20,   0.26,   0.34,   0.39,   0.44];
  for (let i = 0; i < thresholds.length; i++) {
    if (taxable <= thresholds[i]) return rates[i];
  }
  return 0.44;
}

/**
 * Unit-linked / group pension exit tax rate (N.5078/2023, from 1/1/2024).
 * @param {number} years   - years of membership
 * @param {boolean} lump   - true = lump sum, false = periodic (pension drawdown)
 * @param {boolean} early  - true = early exit before 60 (+50% penalty)
 */
export function ulExitTaxRate(years, lump = true, early = false) {
  let rate;
  if      (years <= 5)  rate = lump ? 0.20 : 0.10;
  else if (years <= 10) rate = lump ? 0.15 : 0.075;
  else if (years <= 20) rate = lump ? 0.10 : 0.05;
  else                  rate = lump ? 0.05 : 0.025;
  if (early) rate *= 1.5;
  return rate;
}

/**
 * Simulate terminal wealth for each strategy at each year up to `totalYears`.
 *
 * Strategies modelled:
 *  - savings:     deposit post-tax contrib in bank account; interest taxed at 15% (Greek withholding)
 *  - vuaa:        invest post-tax contrib in VUAA, 0% exit tax always
 *  - ulLump:      invest full gross pre-tax in UL, exit lump-sum at exitYear, reinvest in VUAA
 *  - ulPeriodic:  same but periodic (pension) exit rate — lower tax
 *  - matchLump:   employer matching (no SS) + ulLump reinvest
 *  - matchPeriodic: employer matching + ulPeriodic reinvest
 *
 * @param {object} p
 * @param {number} p.gross         - gross annual salary
 * @param {number} p.contrib       - annual contribution budget (pre-tax)
 * @param {number} p.annualReturn  - decimal e.g. 0.10
 * @param {number} p.feeDrag       - decimal UL fee drag e.g. 0.015
 * @param {number} p.exitYear      - year at which UL is exited and reinvested
 * @param {number} p.matchRate     - employer match as fraction of gross e.g. 0.05
 * @param {number} p.savingsRate   - bank deposit interest rate e.g. 0.02
 * @param {number} p.totalYears    - simulation horizon
 * @returns {Array<SimYear>}
 */
export function simulateAll({ gross, contrib, annualReturn, feeDrag, exitYear, matchRate = 0, savingsRate = 0, totalYears = 30 }) {
  const mr          = marginalRate(gross);
  const postTax     = contrib * (1 - mr);       // what gets invested in VUAA after tax
  const ulReturn    = annualReturn - feeDrag;
  const matchAmt    = gross * matchRate;
  // Greek withholding tax on deposit interest is 15% (final)
  const netSavingsR = savingsRate * (1 - 0.15);

  let savingsV = 0;
  let vuaaV = 0;
  let ulV   = 0;
  let matchV = 0;

  // Post-exit VUAA positions (seeded at exit, compound thereafter)
  let ulLumpPost = 0, ulPerPost = 0;
  let mLumpPost  = 0, mPerPost  = 0;
  let exited = false;

  const results = [];

  for (let y = 1; y <= totalYears; y++) {
    // --- accumulation ---
    savingsV = (savingsV + postTax) * (1 + netSavingsR);
    vuaaV = (vuaaV + postTax) * (1 + annualReturn);

    if (!exited) {
      ulV    = (ulV    + contrib)  * (1 + ulReturn);
      matchV = (matchV + matchAmt) * (1 + ulReturn);
    }

    // --- exit event ---
    if (!exited && y === exitYear) {
      exited = true;
      ulLumpPost = ulV    * (1 - ulExitTaxRate(y, true,  false));
      ulPerPost  = ulV    * (1 - ulExitTaxRate(y, false, false));
      mLumpPost  = matchV * (1 - ulExitTaxRate(y, true,  false));
      mPerPost   = matchV * (1 - ulExitTaxRate(y, false, false));
    } else if (exited) {
      ulLumpPost *= (1 + annualReturn);
      ulPerPost  *= (1 + annualReturn);
      mLumpPost  *= (1 + annualReturn);
      mPerPost   *= (1 + annualReturn);
    }

    // --- snapshot ---
    const ulLump  = exited ? vuaaV + ulLumpPost : vuaaV + ulV * (1 - ulExitTaxRate(y, true,  false));
    const ulPer   = exited ? vuaaV + ulPerPost  : vuaaV + ulV * (1 - ulExitTaxRate(y, false, false));
    const mLump   = exited ? vuaaV + mLumpPost  : vuaaV + matchV * (1 - ulExitTaxRate(y, true,  false));
    const mPer    = exited ? vuaaV + mPerPost   : vuaaV + matchV * (1 - ulExitTaxRate(y, false, false));

    results.push({
      year: y,
      exited,
      savings:       Math.round(savingsV),
      vuaa:          Math.round(vuaaV),
      ulLump:        Math.round(ulLump),
      ulPeriodic:    Math.round(ulPer),
      matchLump:     Math.round(mLump),
      matchPeriodic: Math.round(mPer),
      ulGross:       Math.round(ulV),
      matchGross:    Math.round(matchV),
    });
  }

  return results;
}

/**
 * Find the UL exit year that maximises terminal wealth at totalYears.
 * Returns { year, terminalWealth }
 */
export function optimalExitYear({ gross, contrib, annualReturn, feeDrag, matchRate = 0, totalYears = 30, strategy = 'ulPeriodic' }) {
  let best = { year: 1, terminalWealth: -Infinity };
  for (let ey = 1; ey <= totalYears; ey++) {
    const rows = simulateAll({ gross, contrib, annualReturn, feeDrag, exitYear: ey, matchRate, totalYears });
    const tw = rows[totalYears - 1][strategy];
    if (tw > best.terminalWealth) best = { year: ey, terminalWealth: tw };
  }
  return best;
}
