// js/store.js — Datenmodell Habit, In-Memory-Bestand, CRUD, PubSub und Filter-State.
//
// load()/save()/validateData() sind Stubs mit vollständiger Signatur und werden
// vom Persistenz-Ticket (#1) gefüllt. Der Rest ist hier vollständig implementiert.

let habits = [];
let filter = "active";
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn();
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return (
    "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2)
  );
}

// STUB -> Persistenz: lädt noch nicht aus LocalStorage.
export function load() {
  return habits;
}

// STUB -> Persistenz: schreibt noch nicht in LocalStorage.
export function save() {
  // no-op
}

// STUB -> Persistenz: prüft Schema/Typen, verwirft Ungültiges und weist
// Objekte mit __proto__/constructor/prototype zurück.
export function validateData(raw) {
  return [];
}

export function addHabit(name) {
  const habit = {
    id: createId(),
    name,
    checks: [],
    archived: false,
    createdAt: new Date().toISOString(),
  };
  habits.push(habit);
  notify();
  return habit;
}

export function renameHabit(id, name) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  habit.name = name;
  notify();
}

export function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  notify();
}

export function toggleCheck(id, dateString) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  const idx = habit.checks.indexOf(dateString);
  if (idx === -1) {
    habit.checks.push(dateString);
  } else {
    habit.checks.splice(idx, 1);
  }
  notify();
}

export function setArchived(id, archived) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  habit.archived = Boolean(archived);
  notify();
}

export function getFilter() {
  return filter;
}

export function setFilter(f) {
  filter = f === "archived" ? "archived" : "active";
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
