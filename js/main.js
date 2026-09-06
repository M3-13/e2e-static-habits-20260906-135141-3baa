// js/main.js — Einstiegspunkt: init() verdrahtet alle Feature-Module, refresh()
// rendert die sichtbaren Gewohnheits-Karten bzw. den leeren Zustand.

import { load, getFilter, subscribe } from "./store.js";
import { renderHabitGrid } from "./grid.js";
import { renderHabitStats } from "./stats.js";
import { drawHabitChart } from "./chart.js";
import { setupHabitUI } from "./habits.js";
import { setupArchiveUI } from "./archive.js";
import { setupTheme } from "./theme.js";
import { setupImportExport } from "./import-export.js";

export function init() {
  load();
  subscribe(refresh);

  const main = document.getElementById("main");
  setupHabitUI(main);
  setupArchiveUI(document.querySelector(".app-header__filter"));
  setupImportExport(document.querySelector(".app-header__actions"));
  setupTheme();

  refresh();
}

export function refresh() {
  const list = document.getElementById("habit-list");
  const emptyState = document.getElementById("empty-state");
  if (!list || !emptyState) return;

  const habits = load();
  const filter = getFilter();
  const visible = habits.filter((h) =>
    filter === "active" ? !h.archived : h.archived,
  );

  list.replaceChildren();

  if (visible.length === 0) {
    emptyState.hidden = false;
    list.hidden = true;
    return;
  }

  emptyState.hidden = true;
  list.hidden = false;
  for (const habit of visible) {
    list.appendChild(renderHabitCard(habit));
  }
}

export function renderHabitCard(habit) {
  const card = document.createElement("article");
  card.className = "habit-card";
  card.dataset.id = habit.id;

  const header = document.createElement("header");
  header.className = "habit-card__header";

  const name = document.createElement("h2");
  name.className = "habit-card__name";
  name.textContent = habit.name;
  header.appendChild(name);

  const actions = document.createElement("div");
  actions.className = "habit-card__actions";

  const renameBtn = document.createElement("button");
  renameBtn.type = "button";
  renameBtn.className = "button button--ghost";
  renameBtn.dataset.action = "rename";
  renameBtn.textContent = "Umbenennen";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "button button--ghost";
  deleteBtn.dataset.action = "delete";
  deleteBtn.textContent = "Löschen";

  const archiveBtn = document.createElement("button");
  archiveBtn.type = "button";
  archiveBtn.className = "button button--ghost";
  archiveBtn.dataset.action = "archive";
  archiveBtn.textContent = "Archivieren";

  actions.append(renameBtn, deleteBtn, archiveBtn);
  header.appendChild(actions);
  card.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "habit-card__grid";
  renderHabitGrid(grid, habit);

  const stats = document.createElement("div");
  stats.className = "habit-card__stats";
  renderHabitStats(stats, habit);

  const chart = document.createElement("canvas");
  chart.className = "habit-card__chart";
  drawHabitChart(chart, habit);

  card.append(grid, stats, chart);
  return card;
}
