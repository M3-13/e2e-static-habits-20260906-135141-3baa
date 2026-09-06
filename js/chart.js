// js/chart.js — 8-Wochen-Diagramm auf Canvas.
// Zeichnet mit der Canvas-2D-API ein Balkendiagramm der letzten acht
// Kalenderwochen. Die Höhe jedes Balkens entspricht der Erfüllungsquote
// (erfüllte von verstrichenen Tagen) der jeweiligen Woche aus habit.checks.

const BAR_COUNT = 8;
const BAR_GAP = 8;
const MAX_BAR_WIDTH = 40;
const MIN_BAR_HEIGHT = 2;
const LABEL_HEIGHT = 18;
const TOP_PAD = 4;
const RADIUS = 6;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, n) {
  const r = new Date(date);
  r.setDate(r.getDate() + n);
  return r;
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Berechnet für die letzten acht Kalenderwochen (Montag als Wochenbeginn)
// jeweils { fulfilled, elapsed, label }. Index 0 = aktuelle Woche.
function computeWeeks(checks) {
  const today = startOfDay(new Date());
  // 0 = Montag … 6 = Sonntag
  const dayOfWeek = (today.getDay() + 6) % 7;
  const currentMonday = addDays(today, -dayOfWeek);

  const weeks = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const weekStart = addDays(currentMonday, -7 * i);
    const isCurrent = i === 0;
    const effectiveEnd = isCurrent ? today : addDays(weekStart, 6);
    const startStr = toISODate(weekStart);
    const endStr = toISODate(effectiveEnd);
    const elapsed = isCurrent ? dayOfWeek + 1 : 7;
    const fulfilled = checks.filter(
      (c) => c >= startStr && c <= endStr,
    ).length;
    const label = `${weekStart.getDate()}.${weekStart.getMonth() + 1}.`;
    weeks.push({ fulfilled, elapsed, label });
  }
  return weeks;
}

// Balken mit abgerundeten oberen Ecken (radius sm oben).
function drawBar(ctx, x, y, width, height, color) {
  if (height <= 0 || width <= 0) return;
  const r = Math.min(RADIUS, width / 2, height);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height);
  ctx.closePath();
  ctx.fill();
}

function drawChart(canvas, habit) {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 320;
  const cssHeight = canvas.clientHeight || 160;

  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const accent = cssVar("--color-accent") || "#16794b";
  const accentSoft = cssVar("--color-accent_soft") || "#dcf1e6";
  const gridColor = cssVar("--color-chart_grid") || "#e5e9e6";
  const muted = cssVar("--color-muted") || "#5f6b64";
  const fontFamily = cssVar("--font-family") || "sans-serif";

  const chartBottom = cssHeight - LABEL_HEIGHT;
  const chartHeight = chartBottom - TOP_PAD;
  const checks = Array.isArray(habit.checks) ? habit.checks : [];
  const weeks = computeWeeks(checks);

  // Gitterlinien bei 0 / 25 / 50 / 75 / 100 %.
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (const p of [0, 0.25, 0.5, 0.75, 1]) {
    const y = chartBottom - p * chartHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cssWidth, y);
    ctx.stroke();
  }

  // Balkenbreite: gleichmäßig verteilt, maximal MAX_BAR_WIDTH, zentriert.
  let slotWidth = (cssWidth - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
  slotWidth = Math.min(slotWidth, MAX_BAR_WIDTH);
  const totalWidth = slotWidth * BAR_COUNT + BAR_GAP * (BAR_COUNT - 1);
  const startX = (cssWidth - totalWidth) / 2;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `11px ${fontFamily}`;

  // Älteste Woche links, aktuelle Woche rechts.
  for (let i = 0; i < BAR_COUNT; i++) {
    const week = weeks[BAR_COUNT - 1 - i];
    const ratio = week.elapsed > 0 ? week.fulfilled / week.elapsed : 0;
    const clamped = Math.max(0, Math.min(1, ratio));
    const barHeight = Math.max(MIN_BAR_HEIGHT, clamped * chartHeight);
    const x = startX + i * (slotWidth + BAR_GAP);
    const y = chartBottom - barHeight;
    const isCurrent = i === BAR_COUNT - 1;
    const color = isCurrent ? accent : accentSoft;

    drawBar(ctx, x, y, slotWidth, barHeight, color);

    ctx.fillStyle = muted;
    ctx.fillText(week.label, x + slotWidth / 2, chartBottom + 12);
  }
}

export function drawHabitChart(canvas, habit) {
  if (!canvas || !habit) return;

  drawChart(canvas, habit);

  // Nach dem Layout (echte CSS-Größe, Theme-Wechsel, Resize) neu zeichnen.
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => drawChart(canvas, habit));
    observer.observe(canvas);
  }
}
