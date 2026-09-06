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

const STORAGE_KEY = "habits";
const EXPECTED_KEYS = ["id", "name", "checks", "archived", "createdAt"];
const FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"];

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasForbiddenKey(obj) {
  return FORBIDDEN_KEYS.some((key) =>
    Object.prototype.hasOwnProperty.call(obj, key),
  );
}

function hasExactKeys(obj, keys) {
  const own = Object.keys(obj);
  return own.length === keys.length && keys.every((k) => own.includes(k));
}

function isValidIsoDate(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidCheck(value) {
  return typeof value === "boolean" || isValidIsoDate(value);
}

// load(): liest den Bestand unter 'habits' aus LocalStorage, validiert ihn und
// gibt ihn zurück. Korrupte oder schemafremde Inhalte werden wie leer behandelt.
export function load() {
  let raw = null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      raw = JSON.parse(stored);
    }
  } catch {
    raw = null;
  }
  habits = validateData(raw);
  return habits;
}

// save(): serialisiert den aktuellen Bestand und schreibt ihn in LocalStorage.
export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.error("Habits konnten nicht gespeichert werden:", err);
  }
}

// validateData(): prüft Struktur und Typen, verwirft ungültige Einträge und
// weist Objekte mit __proto__/constructor/prototype vollständig zurück.
export function validateData(raw) {
  if (!Array.isArray(raw)) return [];

  const result = [];
  for (const entry of raw) {
    if (!isPlainObject(entry)) continue;
    if (hasForbiddenKey(entry)) continue;
    if (!hasExactKeys(entry, EXPECTED_KEYS)) continue;
    if (typeof entry.id !== "string") continue;
    if (typeof entry.name !== "string" || entry.name.trim() === "") continue;
    if (!Array.isArray(entry.checks)) continue;
    if (typeof entry.archived !== "boolean") continue;
    if (typeof entry.createdAt !== "string") continue;

    result.push({
      id: entry.id,
      name: entry.name,
      checks: entry.checks.filter(isValidCheck),
      archived: entry.archived,
      createdAt: entry.createdAt,
    });
  }
  return result;
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
  save();
  notify();
  return habit;
}

export function renameHabit(id, name) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  habit.name = name;
  save();
  notify();
}

export function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  save();
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
  save();
  notify();
}

export function setArchived(id, archived) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  habit.archived = Boolean(archived);
  save();
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
