// js/habits.js — Gewohnheiten anlegen, umbenennen und löschen (UI).
//
// setupHabitUI(container) verdrahtet per Event-Delegation auf dem Container:
//  - Anlegen: Absenden des Empty-State-Formulars (Button oder Enter im Eingabefeld)
//    ruft store.addHabit.
//  - Umbenennen: Klick auf den Kartennamen (oder den Umbenennen-Button) ersetzt den
//    Namen durch ein Inline-Eingabefeld; Enter/Blur übernimmt per store.renameHabit,
//    Escape bricht ab.
//  - Löschen: Klick auf den Löschen-Button fragt per confirm() nach und ruft
//    store.deleteHabit.
//
// Alle aus Nutzereingaben stammenden Namen werden ausschließlich per textContent
// gesetzt, niemals per innerHTML (AC-14).

import { addHabit, renameHabit, deleteHabit } from "./store.js";

const STYLE_ID = "habits-style";

// index.html (Grundstruktur-Ticket) lädt nur css/base.css. Damit die hier
// gelieferten Stile tatsächlich greifen, wird das Stylesheet selbst eingebunden.
function ensureStylesheet() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement("link");
  link.id = STYLE_ID;
  link.rel = "stylesheet";
  link.href = "css/habits.css";
  document.head.appendChild(link);
}

function handleCreate() {
  const input = document.getElementById("habit-name-input");
  if (!input) return;
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  addHabit(name);
  input.value = "";
}

function startRename(card) {
  if (card.querySelector('[data-action="rename-input"]')) return;
  const nameEl = card.querySelector(".habit-card__name");
  if (!nameEl) return;
  const currentName = nameEl.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "habit-card__name-input";
  input.value = currentName;
  input.dataset.action = "rename-input";
  input.dataset.originalName = currentName;
  input.setAttribute("aria-label", "Name der Gewohnheit");
  input.autocomplete = "off";

  nameEl.replaceWith(input);
  input.focus();
  input.select();
}

// Übernimmt den eingegebenen Namen oder stellt bei leerer Eingabe den alten Namen
// wieder her. Das `handled`-Flag verhindert eine doppelte Verarbeitung, wenn das
// Entfernen des Eingabefelds zusätzlich ein focusout auslöst.
function finishRename(input) {
  if (input.dataset.handled === "true") return;
  input.dataset.handled = "true";

  const card = input.closest(".habit-card");
  const name = input.value.trim();

  if (name && card) {
    renameHabit(card.dataset.id, name);
    // renameHabit löst notify() → refresh() aus; die Karte wird neu gerendert und
    // das Eingabefeld dabei ersetzt.
  } else {
    const h2 = document.createElement("h2");
    h2.className = "habit-card__name";
    h2.textContent = input.dataset.originalName ?? "";
    input.replaceWith(h2);
  }
}

function cancelRename(input) {
  if (input.dataset.handled === "true") return;
  input.dataset.handled = "true";
  const h2 = document.createElement("h2");
  h2.className = "habit-card__name";
  h2.textContent = input.dataset.originalName ?? "";
  input.replaceWith(h2);
}

function handleDelete(card) {
  const nameEl = card.querySelector(".habit-card__name");
  const name = nameEl ? nameEl.textContent : "";
  if (confirm(`Gewohnheit "${name}" wirklich löschen?`)) {
    deleteHabit(card.dataset.id);
  }
}

function onClick(event) {
  const target = event.target;

  if (target.closest("#create-habit-btn")) {
    handleCreate();
    return;
  }

  const card = target.closest(".habit-card");
  if (!card) return;

  if (target.closest('[data-action="delete"]')) {
    handleDelete(card);
    return;
  }

  if (
    target.closest('[data-action="rename"]') ||
    target.closest(".habit-card__name")
  ) {
    startRename(card);
  }
}

function onKeydown(event) {
  const target = event.target;

  if (target.id === "habit-name-input" && event.key === "Enter") {
    event.preventDefault();
    handleCreate();
    return;
  }

  if (target.matches('[data-action="rename-input"]')) {
    if (event.key === "Enter") {
      event.preventDefault();
      finishRename(target);
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelRename(target);
    }
  }
}

function onFocusout(event) {
  const target = event.target;
  if (target.matches('[data-action="rename-input"]')) {
    finishRename(target);
  }
}

export function setupHabitUI(container) {
  ensureStylesheet();
  container.addEventListener("click", onClick);
  container.addEventListener("keydown", onKeydown);
  container.addEventListener("focusout", onFocusout);
}
