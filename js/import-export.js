// js/import-export.js — JSON-Export und -Import (UI).

import { load, save, validateData, getFilter, setFilter } from "./store.js";

const MAX_IMPORT_SIZE = 1024 * 1024; // 1 MiB

let statusTimer = null;

export function setupImportExport(container) {
  const exportBtn = container.querySelector("#export-btn");
  const importBtn = container.querySelector("#import-btn");
  const importInput = container.querySelector("#import-input");

  if (!exportBtn || !importBtn || !importInput) return;

  exportBtn.addEventListener("click", () => {
    const json = JSON.stringify(load(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "habits.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener("click", () => importInput.click());

  importInput.addEventListener("change", async () => {
    const file = importInput.files && importInput.files[0];
    importInput.value = "";
    if (!file) return;

    if (file.size > MAX_IMPORT_SIZE) {
      showStatus(container, "Datei ist zu groß (max. 1 MiB).", "error");
      return;
    }

    let text;
    try {
      text = await file.text();
    } catch {
      showStatus(container, "Datei konnte nicht gelesen werden.", "error");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      showStatus(container, "Ungültige JSON-Datei.", "error");
      return;
    }

    const valid = validateData(parsed);
    replaceBestand(valid);
    showStatus(container, "Import abgeschlossen.", "success");
  });
}

function replaceBestand(valid) {
  const habits = load();
  habits.splice(0, habits.length, ...valid);
  save();
  // Der Store bietet keine öffentliche notify()-Funktion: den Filter unverändert
  // neu setzen, damit die Abonnenten (main.js refresh) neu rendern.
  setFilter(getFilter());
}

function showStatus(container, message, kind) {
  let el = container.querySelector(".import-status");
  if (!el) {
    el = document.createElement("span");
    el.className = "import-status";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    container.appendChild(el);
  }
  el.textContent = message;
  el.style.color =
    kind === "error" ? "var(--color-danger)" : "var(--color-muted)";
  el.style.fontSize = "14px";
  el.style.paddingLeft = "var(--space-1)";

  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    if (el.isConnected) el.remove();
  }, 4000);
}
