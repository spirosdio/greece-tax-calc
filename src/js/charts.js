/**
 * charts.js — shared Chart.js helpers and formatting utilities
 */

export const PALETTE = {
  savings:      '#64748B',
  vuaa:         '#3B82F6',
  ulLump:       '#F59E0B',
  ulPeriodic:   '#10B981',
  matchLump:    '#EC4899',
  matchPeriodic:'#8B5CF6',
  neutral:      '#6B7280',
};

export const DASH = {
  solid:      [],
  dash:       [6, 3],
  dot:        [3, 3],
  longDash:   [10, 4],
  dashDot:    [8, 3, 2, 3],
};

/** Format euros — compact for large numbers */
export function fmt(v) {
  const abs = Math.abs(Math.round(v));
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000) return sign + '€' + (abs / 1_000_000).toFixed(1) + 'M';
  if (abs >= 1_000)     return sign + '€' + (abs / 1_000).toFixed(0) + 'k';
  return sign + '€' + abs.toLocaleString();
}

/** Full euro format with commas */
export function fmtFull(v) {
  return (v < 0 ? '-' : '') + '€' + Math.abs(Math.round(v)).toLocaleString();
}

/** Percentage format */
export function fmtPct(v, decimals = 1) {
  return (v * 100).toFixed(decimals) + '%';
}

/** Build Chart.js default options matching the site theme */
export function baseChartOptions(overrides = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,15,20,0.92)',
        titleColor: '#e5e7eb',
        bodyColor: '#d1d5db',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: ctx => '  ' + ctx.dataset.label + ': ' + fmtFull(ctx.raw),
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', font: { size: 11 } },
        grid:  { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 11 }, callback: v => fmt(v) },
        grid:  { color: 'rgba(255,255,255,0.05)' },
      },
    },
    ...overrides,
  };
}

/** Build a standard line dataset */
export function lineDS(label, data, color, dash = []) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color + '18',
    borderWidth: 2,
    borderDash: dash,
    pointRadius: 0,
    tension: 0.35,
    fill: false,
  };
}

/** Build a standard bar dataset */
export function barDS(label, data, color) {
  return {
    label,
    data,
    backgroundColor: color + 'cc',
    borderRadius: 4,
    borderSkipped: false,
  };
}

/** Render an HTML legend block */
export function renderLegend(containerId, entries) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = entries.map(([color, dash, label]) => {
    const style = dash.length
      ? `border-top: 2px dashed ${color}; width:18px; height:0; border-dash: ${dash.join(',')};`
      : `background:${color}; width:18px; height:3px;`;
    return `<span class="leg-item"><span class="leg-swatch" style="${style}"></span>${label}</span>`;
  }).join('');
}

/** Destroy and recreate a chart */
export function makeChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  if (canvas._chartInstance) canvas._chartInstance.destroy();
  const inst = new Chart(canvas, config);
  canvas._chartInstance = inst;
  return inst;
}

/** Slider widget helper — sync input+display, call onChange */
export function bindSlider(id, displayId, format, onChange) {
  const input = document.getElementById(id);
  const display = document.getElementById(displayId);
  if (!input || !display) return;
  const update = () => {
    display.textContent = format(+input.value);
    onChange(+input.value);
  };
  input.addEventListener('input', update);
  update();
}

/** Read all slider values from a form into an object */
export function readSliders(ids) {
  const out = {};
  for (const [key, id] of Object.entries(ids)) {
    const el = document.getElementById(id);
    out[key] = el ? +el.value : 0;
  }
  return out;
}
