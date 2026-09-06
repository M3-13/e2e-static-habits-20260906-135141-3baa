// js/archive.js — Archivieren/Wiederherstellen sowie Filtern (UI).
//
// setupArchiveUI(container) verdrahtet per Event-Delegation:
//  * die Archiv-/Wiederherstellen-Buttons der Habit-Karten
//    (data-action="archive" -> store.setArchived mit Umschalten),
//  * die Filter-Buttons im Header (data-filter="active"|"archived"
//    -> store.setFilter).
// Zusätzlich hält eine Subscriber-Funktion den sichtbaren Zustand der
// Filter-Buttons (aria-pressed) und der Karten-Beschriftung synchron.

import { load, setArchived, setFilter, getFilter, subscribe } from "./store.js";

let filterContainer = null;

function syncFilterButtons() {
  if (!filterContainer) return;
  const current = getFilter();
  const buttons = filterContainer.querySelectorAll("button[data-filter]");
  for (const btn of buttons) {
    btn.setAttribute("aria-pressed", String(btn.dataset.filter === current));
  }
}

function syncArchivedCards() {
  const list = document.getElementById("habit-list");
  if (!list) return;
  for (const card of list.querySelectorAll(".habit-card[data-id]")) {
    const habit = load().find((h) => h.id === card.dataset.id);
    if (!habit) continue;
    card.classList.toggle("habit-card--archived", habit.archived);
    const btn = card.querySelector("button[data-action='archive']");
    if (btn) {
      btn.textContent = habit.archived ? "Wiederherstellen" : "Archivieren";
    }
  }
}

function sync() {
  syncFilterButtons();
  syncArchivedCards();
}

export function setupArchiveUI(container) {
  filterContainer = container;

  if (container) {
    container.addEventListener("click", (event) => {
      const btn = event.target.closest
        ? event.target.closest("button[data-filter]")
        : null;
      if (!btn) return;
      setFilter(btn.dataset.filter);
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest("button[data-action='archive']");
    if (!btn) return;
    const card = btn.closest(".habit-card[data-id]");
    if (!card) return;
    const habit = load().find((h) => h.id === card.dataset.id);
    if (!habit) return;
    setArchived(habit.id, !habit.archived);
  });

  subscribe(sync);
  sync();
}
