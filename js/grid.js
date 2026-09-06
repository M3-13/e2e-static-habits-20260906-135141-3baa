// js/grid.js — 30-Tage-Raster einer Gewohnheit.
//
// renderHabitGrid(container, habit) zeichnet die letzten 30 Kalendertage als
// Zellen, markiert in habit.checks enthaltene Tage und bindet je Zelle einen
// Klick, der store.toggleCheck(habit.id, datum) aufruft.

import { toggleCheck } from "./store.js";

const DAYS = 30;

function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function renderHabitGrid(container, habit) {
  container.replaceChildren();

  const checks = new Set(habit.checks);

  const grid = document.createElement("div");
  grid.className = "habit-grid";
  grid.setAttribute("role", "group");
  grid.setAttribute("aria-label", "30-Tage-Raster");

  const today = new Date();
  const todayStr = toLocalDateString(today);

  for (let offset = DAYS - 1; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dateStr = toLocalDateString(date);
    const checked = checks.has(dateStr);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "habit-grid__cell";
    if (checked) cell.classList.add("is-checked");
    if (dateStr === todayStr) cell.classList.add("is-today");
    cell.dataset.date = dateStr;
    cell.setAttribute("aria-pressed", checked ? "true" : "false");
    cell.setAttribute("aria-label", dateStr);
    cell.title = dateStr;
    if (checked) {
      cell.textContent = "\u2713";
    }

    cell.addEventListener("click", () => {
      toggleCheck(habit.id, dateStr);
    });

    grid.appendChild(cell);
  }

  container.appendChild(grid);
}
