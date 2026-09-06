// js/theme.js — Dark Mode (UI).
// setupTheme() verdrahtet den Dark-Mode-Schalter, setzt data-theme auf <html>
// und speichert die Auswahl unter dem LocalStorage-Schlüssel 'theme'.
// Ohne gespeicherte Auswahl folgt das Theme prefers-color-scheme.

const THEME_KEY = "theme";

function systemPrefersDark() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function updateToggleLabel(theme) {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  const icon = toggle.querySelector("[aria-hidden='true']");
  if (icon) {
    icon.textContent = theme === "dark" ? "☾" : "◐";
  }
  toggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Hell-Modus umschalten" : "Dark Mode umschalten",
  );
}

export function setupTheme() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch (e) {
    savedTheme = null;
  }

  const initial =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : systemPrefersDark()
        ? "dark"
        : "light";

  applyTheme(initial);
  updateToggleLabel(initial);

  toggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    updateToggleLabel(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // Speichern fehlgeschlagen (z. B. private Mode) — Theme wirkt trotzdem.
    }
  });
}
