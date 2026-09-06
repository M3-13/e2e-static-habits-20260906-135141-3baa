// js/stats.js — Serien und Wochenquote einer Gewohnheit.
//
// renderHabitStats(container, habit) berechnet aus habit.checks die aktuelle
// Serie, die längste jemals erreichte Serie und die Wochenquote der laufenden
// Kalenderwoche und zeigt alle drei Werte als Badges an.

function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseLocalDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function dayDiff(a, b) {
  return Math.round((a - b) / MS_PER_DAY);
}

// Aufeinanderfolgende erfüllte Tage bis heute. Ist der heutige Tag noch nicht
// erfüllt, wird die Serie ab gestern gezählt — ein heute fehlendes Häkchen
// unterbricht die Serie noch nicht.
export function currentStreak(checks) {
  const set = new Set(checks);
  const today = new Date();
  const cursor = new Date(today);

  if (!set.has(toLocalDateString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (set.has(toLocalDateString(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Höchste jemals erreichte Zahl aufeinanderfolgender erfüllter Tage.
export function longestStreak(checks) {
  if (!checks || checks.length === 0) return 0;

  const sorted = [...new Set(checks)].sort();
  let longest = 0;
  let current = 0;
  let prev = null;

  for (const str of sorted) {
    const date = parseLocalDate(str);
    if (prev === null) {
      current = 1;
    } else {
      const diff = dayDiff(date, prev);
      if (diff === 1) {
        current += 1;
      } else {
        current = 1;
      }
    }
    if (current > longest) longest = current;
    prev = date;
  }

  return longest;
}

// Wochenquote der laufenden Kalenderwoche (Montag bis Sonntag): erfüllte von
// verstrichenen Tagen als gerundeter Prozentsatz.
export function weeklyQuota(checks) {
  const set = new Set(checks);
  const today = new Date();
  const dayIndex = (today.getDay() + 6) % 7; // 0 = Montag
  const elapsed = dayIndex + 1; // Tage von Montag bis heute (inklusive)

  let fulfilled = 0;
  for (let i = 0; i <= dayIndex; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (set.has(toLocalDateString(d))) fulfilled += 1;
  }

  return elapsed === 0 ? 0 : Math.round((fulfilled / elapsed) * 100);
}

function badge(label, value, stat) {
  const b = document.createElement("span");
  b.className = "habit-stats__badge";
  b.dataset.stat = stat;

  const l = document.createElement("span");
  l.className = "habit-stats__label";
  l.textContent = label;

  const v = document.createElement("span");
  v.className = "habit-stats__value";
  v.textContent = String(value);

  b.append(l, v);
  return b;
}

export function renderHabitStats(container, habit) {
  container.replaceChildren();

  const stats = document.createElement("div");
  stats.className = "habit-stats";

  stats.appendChild(
    badge("Aktuelle Serie", currentStreak(habit.checks), "current-streak"),
  );
  stats.appendChild(
    badge("Längste Serie", longestStreak(habit.checks), "longest-streak"),
  );
  stats.appendChild(
    badge("Wochenquote", `${weeklyQuota(habit.checks)}%`, "weekly-quota"),
  );

  container.appendChild(stats);
}
