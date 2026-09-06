VERDICT: APPROVED

## Sicherheitsbericht

**Scanner-Status:** Für dieses `web-static`-Projekt wurden keine Scanner ausgeführt. Das Fehlen von Scanner-Ergebnissen ist kein Beleg für eine Schwachstelle; die Bewertung erfolgt anhand der sichtbaren Quellcodeanalyse.

### Kompaktprüfung
| Bereich | Ergebnis |
|---|---|
| Secrets | Keine Hardcoded Keys, Passwörter, Tokens oder geheimnisvollen URLs gefunden. |
| Injection/XSS | AC-14 umgesetzt: Alle dynamischen Zeichenketten werden per `textContent` gesetzt; kein `innerHTML`, `insertAdjacentHTML` oder vergleichbarer HTML-Parser. |
| AuthN/AuthZ | Nicht zutreffend; keine Authentifizierung, keine Sessions, keine Zugriffskontrollen. |
| Dependencies | Keine externen Pakete oder Fremdbibliotheken; keine verwundbaren Abhängigkeiten erkennbar. |
| Konfiguration/Transport | Keine Netzwerkrequests (AC-20), Daten bleiben lokal im Browser. Importgröße auf 1 MiB begrenzt. |

---

### Feststellungen

#### 1. Niedrig — `longestStreak()` kann bei booleschen Häkchen aus validierten Importen abstürzen
- **Datei/Stelle:** `js/stats.js`, Funktion `longestStreak()` in Kombination mit `js/store.js`, `isValidCheck()`.
- **Problem:** `validateData()` akzeptiert gemäß AC-15 in `checks` sowohl ISO-Datumsstrings als auch boolesche Werte. `longestStreak()` führt jedoch `parseLocalDate(str)` aus, das `str.split("-")` aufruft. Bei einem booleschen Wert (`true`/`false`) gibt es `split` nicht, sodass eine unhandled `TypeError` ausgelöst wird. Das kann beim Rendern eines importierten Habits zum Abbruch führen (lokale DoS).
- **Konkreter Fix:** In der Statistik- und Diagrammberechnung nur Strings verwenden:
  ```js
  const dateChecks = checks.filter((c) => typeof c === "string");
  ```
  Alternativ: In `validateData()` boolesche Werte normalisieren oder verwerfen, falls intern ausschließlich Datumsstrings verwendet werden. Dann muss die Importdokumentation entsprechend angepasst werden.

#### 2. Niedrig — Fehlende Content-Security-Policy
- **Datei/Stelle:** `index.html`.
- **Problem:** Es ist kein CSP-Meta-Tag gesetzt. Da die Anwendung keine Netzwerkrequests ausführt und keine externen Ressourcen eingebunden werden, ist das Risiko gering; als statisches Webprodukt profitiert sie dennoch von einer CSP-Härtung.
- **Konkreter Fix (optional):**
  ```html
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none'; img-src 'self' data:; object-src 'none'">
  ```
  `'unsafe-inline'` für Styles ist erforderlich, weil `import-export.js` in `showStatus()` Inline-Style-Attribute setzt. Diese CSP lässt alle legitimen Produktressourcen weiterhin zu.

#### 3. Niedrig — Import begrenzt nur Dateigröße, nicht Anzahl der Einträge
- **Datei/Stelle:** `js/import-export.js`, `js/store.js` (`validateData()` / `replaceBestand()`).
- **Problem:** Eine Datei unter 1 MiB kann sehr viele kleine, gültige Habits enthalten. Das ungebremste DOM-Rendering (je Habit 30 Buttons plus Canvas) kann den Browser erheblich verlangsamen oder lokal einfrieren.
- **Konkreter Fix:** Nach `validateData()` eine maximale Eintragszahl durchsetzen, z. B.:
  ```js
  const MAX_HABITS = 500;
  if (valid.length > MAX_HABITS) {
    valid.length = MAX_HABITS; // oder Import ablehnen
  }
  ```

---

**Fazit:** Es wurden keine kritischen oder hohen Schwachstellen gefunden. Die drei Feststellungen sind niedrig eingestuft und betreffen lokale Robustheit sowie optionale Härtung; sie blockieren den Versand nicht.