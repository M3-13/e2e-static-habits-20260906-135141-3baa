VERDICT: CHANGES_REQUESTED

Geprüft wurde der zusammengeführte Stand der statischen Web-App (öffentliche UI, LocalStorage, keine Netzwerkrequests, keine KI-Funktion). Es bestehen keine fundamentalen DSGVO-Verstöße, aber mehrere behebbare Marktreife- und Konformitätslücken.

---

## 1. Datenschutz / DSGVO / TTDSG

### Befund 1.1 — Datenschutzerklärung fehlt
**Schweregrad:** hoch

Die Anwendung verarbeitet lokal im Browser personenbeziehbare Daten: Gewohnheitsnamen, Häkchen-Verlauf und Theme-Präferenz im `localStorage` (`habits`, `theme`). Auch wenn kein Serverzugriff durch den Anbieter erfolgt, verlangt ein marktfähiger öffentlicher Webauftritt Transparenz über diese lokale Speicherung und die Rechtslage nach § 25 TTDSG.

**Konkrete Abhilfe:**
- Neue Datei `datenschutz.html` anlegen.
- In `index.html` einen Footer ergänzen und daraus verlinken.
- Textsinhalt sinngemäß:
  - „Alle Daten (Gewohnheiten, Häkchen, Darstellungspräferenz) werden ausschließlich lokal im Browser im LocalStorage verarbeitet und nicht an einen Server übertragen.“
  - „Die Speicherung im Endgerät ist für die Bereitstellung der vom Nutzer angeforderten Funktion technisch erforderlich (§ 25 Abs. 2 Nr. 2 TTDSG); eine Einwilligung ist daher nicht erforderlich.“
  - „Der Anbieter erhebt keine personenbezogenen Daten.“
  - Hinweis auf übliche Server-Logs des Hosting-Providers, sofern die Seite gehostet wird.
  - Hinweis, dass die Daten bis zur Löschung durch den Nutzer im Browser bleiben.
  - Hinweis, dass die Daten unverschlüsselt im Browser liegen und auf gemeinsam genutzten Geräten sichtbar sein können.

### Befund 1.2 — Keine globale Lösch-/Reset-Möglichkeit
**Schweregrad:** mittel

Der Nutzer kann einzelne Gewohnheiten löschen (`deleteHabit`, Datei `js/store.js`) und so zugehörige Häkchen entfernen. Es fehlt aber ein einfacher, datenschutzfreundlicher Weg, den gesamten lokalen Bestand zu löschen. Das schwächt die praktische Ausübung des Löschprinzips.

**Konkrete Abhilfe:**
- In `js/store.js` eine Funktion ergänzen, z. B.:
  ```js
  export function clearAllHabits() {
    habits = [];
    save();
    notify();
  }
  ```
- In der UI einen Button „Alle Daten löschen“ ergänzen, z. B. im Header oder Footer, mit `confirm()`-Rückfrage.
- Nach dem Löschen `refresh()` auslösen, damit der Leerzustand erscheint.

### Befund 1.3 — Speicherfehler werden dem Nutzer nicht angezeigt
**Schweregrad:** niedrig

`save()` in `js/store.js` fängt Schreibfehler nur mit `console.error`. Wenn LocalStorage voll, blockiert oder nicht verfügbar ist, arbeitet die App scheinbar normal, die Daten gehen aber beim Neuladen verloren.

**Konkrete Abhilfe:**
- In `js/store.js` statt nur `console.error` ein sichtbares Status-Element mit `role="status"` / `aria-live="polite"` befüllen.
- Alternativ ein kleines Event-System nutzen, das `main.js` abonniert und eine Meldung „Lokale Speicherung fehlgeschlagen“ anzeigt.

### Befund 1.4 — Import ersetzt Bestand ohne Vorwarnung
**Schweregrad:** niedrig

`replaceBestand()` in `js/import-export.js` überschreibt den gesamten aktuellen Bestand sofort nach erfolgreicher Validierung. Datenschutzrechtlich nicht verboten, aber aus Transparenzgründen unglücklich.

**Konkrete Abhilfe:**
- Vor dem Ersetzen eine sichtbare Bestätigung anzeigen: „Der aktuelle Bestand wird durch die Importdatei vollständig ersetzt. Fortfahren?“
- Erst nach Bestätigung `replaceBestand(valid)` ausführen.

### Positiv festgestellt
- AC-20 ist erfüllt: Es gibt keine Netzwerkrequests; Daten bleiben lokal.
- AC-19 ist erfüllt: `deleteHabit()` entfernt die gesamte Gewohnheit einschließlich aller Häkchen.
- AC-14 bis AC-18 sind im `js/store.js` und `js/import-export.js` sichtbar umgesetzt: `textContent` statt `innerHTML`, Importvalidierung, `__proto__`-/`constructor`-/`prototype`-Abwehr, 1-MiB-Limit, LocalStorage-Validierung.

---

## 2. EU Cyber Resilience Act (CRA)

### Befund 2.1 — Sicherheitseigenschaften und Schwachstellenkontakt fehlen
**Schweregrad:** mittel

Die sicherheitsrelevanten Eigenschaften sind im Code erkennbar (XSS-Abwehr, Importvalidierung, keine Drittanbieter), aber nicht als dokumentierte Sicherheitsinformation sichtbar. Für ein Produkt mit digitalen Elementen verlangt der CRA dokumentierte Sicherheitseigenschaften und einen Weg für Schwachstellenmeldungen.

**Konkrete Abhilfe:**
- Neue Datei `SECURITY.md` anlegen.
- Darin dokumentieren:
  - „XSS-Abwehr: Nutzer- und Importdaten werden ausschließlich per `textContent` gerendert.“
  - „JSON-Import wird vor Übernahme validiert; Dateigröße max. 1 MiB; Prototype-Pollution-Abwehr.“
  - „Keine Netzwerkrequests, keine serverseitige Verarbeitung.“
  - „Keine Laufzeit-Abhängigkeiten von Drittanbietern.“
  - Kontaktadresse für Sicherheitsmeldungen ergänzen.

### Befund 2.2 — Update-/Patch-Weg nicht dokumentiert
**Schweregrad:** mittel

Die statische App hat keinen sichtbaren Versions- oder Updateweg. Der CRA verlangt, dass Produkte mit Sicherheitsupdates versorgt werden können und Schwachstellen behebbar sind.

**Konkrete Abhilfe:**
- Eine Versionskennung einführen, z. B. `const APP_VERSION = "2.0.0"` in `js/main.js` und sichtbar in der UI ausgeben.
- Im `README.md` den Deployment-/Updateprozess dokumentieren: „Neue Version durch Austausch der statischen Dateien am Host; danach Browser-Cache beachten.“
- Optional eine kleine Versionszeile im Footer ergänzen.

### Befund 2.3 — Keine Content Security Policy sichtbar
**Schweregrad:** niedrig

Ohne CSP ist eine zusätzliche XSS-Schutzschicht nicht aktiviert. Die Anwendung hat zwar eine saubere `textContent`-Strategie, aber eine CSP wäre ein CRA-konformes Sicherheitsdefault.

**Konkrete Abhilfe:**
- In `index.html` im `<head>` ergänzen:
  ```html
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'none'; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'self'"
  />
  ```
- Vor Auslieferung prüfen, dass der JSON-Export per Blob-Download weiterhin funktioniert und alle lokalen Styles laden.
- Besser: Die CSP zusätzlich oder stattdessen als HTTP-Header setzen.

### Positiv festgestellt
- Keine Drittanbieter-Abhängigkeiten, daher kein separates SBOM mit anfälligen Bibliotheken erforderlich.
- Die Importvalidierung und `textContent`-Nutzung sind konkrete CRA-verträgliche Sicherheitsmerkmale.

---

## 3. EU AI Act

### Nicht anwendbar

Im sichtbaren Stand existiert keine KI-Funktion. Es gibt keine automatisierte Entscheidungsfindung, kein maschinelles Lernen, kein Profiling und kein KI-Modell. Der EU AI Act löst daher keine Pflichten aus.

---

## 4. Pflichttexte und UI

### Befund 4.1 — Impressum fehlt
**Schweregrad:** mittel

Für einen öffentlichen deutschen Webauftritt ist ein Impressum regelmäßig erforderlich, sofern der Auftritt geschäftsmäßig erfolgt. Im sichtbaren Code fehlt jede Verlinkung.

**Konkrete Abhilfe:**
- Neue Datei `impressum.html` anlegen.
- In `index.html` einen Footer ergänzen mit Links zu `impressum.html` und `datenschutz.html`, z. B.:
  ```html
  <footer class="site-footer container">
    <a href="impressum.html">Impressum</a>
    <a href="datenschutz.html">Datenschutz</a>
  </footer>
  ```
- Wenn der Auftritt rein privat und nicht geschäftsmäßig ist, kann das Impressum entfallen; die Datenschutzerklärung bleibt trotzdem dringend empfohlen.

### Befund 4.2 — Datenschutzerklärung fehlt
**Schweregrad:** hoch  
*Siehe Befund 1.1.* Die Datenschutzerklärung ist der zentrale Transparenztext und muss in der UI erreichbar sein.

### Befund 4.3 — Cookie-/Consent-Banner nicht erforderlich
**Schweregrad:** kein Mangel

Die Anwendung nutzt keine Tracking-Cookies. Die LocalStorage-Schlüssel `habits` und `theme` sind für die ausdrücklich angeforderte Funktion technisch erforderlich. Ein Consent-Banner ist daher nicht zu fordern und würde die App unnötig behindern.

### Befund 4.4 — Widerrufsbelehrung nicht anwendbar
**Schweregrad:** kein Mangel

Es gibt keinen Verkauf und keine kostenpflichtigen Verträge. Eine Widerrufsbelehrung ist nicht nötig.

---

## 5. Barrierefreiheit / WCAG 2.1 AA / BITV 2.0 / EAA

### Befund 5.1 — Eingabefeld für neue Gewohnheit hat kein Label
**Schweregrad:** hoch

In `index.html` besitzt das Feld `#habit-name-input` nur ein `placeholder`, aber kein sichtbares `<label>` und kein `aria-label`. Placeholder sind kein verlässlicher zugänglicher Name.

**Konkrete Abhilfe:**
- In `index.html` vor dem Input ein sichtbares Label ergänzen:
  ```html
  <label class="empty-state__label" for="habit-name-input">Neue Gewohnheit</label>
  <input id="habit-name-input" ... />
  ```
- Alternativ `aria-label="Neue Gewohnheit"` setzen, bevorzugt ist aber ein sichtbares Label.

### Befund 5.2 — Canvas-Diagramm hat keine zugängliche Textalternative
**Schweregrad:** hoch

Das in `js/main.js` erzeugte `<canvas class="habit-card__chart">` enthält die 8-Wochen-Statistik, hat aber weder `role="img"` noch `aria-label`. Für Screenreader ist der Verlauf damit unsichtbar.

**Konkrete Abhilfe:**
- In `js/main.js` beim Erstellen des Canvas ergänzen:
  ```js
  chart.setAttribute("role", "img");
  chart.setAttribute("aria-label", `8-Wochen-Verlauf für ${habit.name}`);
  ```
- Bessere Alternative: Aus `js/chart.js` eine Funktion exportieren, die eine kurze textuelle Zusammenfassung liefert, z. B.:
  ```js
  const summary = computeWeeks(habit.checks)
    .map((w) => `${Math.round((w.fulfilled / w.elapsed) * 100)}%`)
    .join(", ");
  chart.setAttribute("aria-label", `8-Wochen-Verlauf: ${summary}`);
  ```
- Optional zusätzlich eine unsichtbare Tabelle mit derselben Information anbieten.

### Befund 5.3 — Archiv-Stylesheet wird nicht eingebunden
**Schweregrad:** niedrig

Die Datei `css/archive.css` ist vorhanden, wird aber in `index.html` nicht geladen. Die Funktionalität ist nicht gebrochen, aber archivierte Karten erhalten den gedämpften Zustand nicht. Das ist primär ein UI-Marktreife-Hinweis, kein direkter Rechtsverstoß.

**Konkrete Abhilfe:**
- In `index.html` ergänzen:
  ```html
  <link rel="stylesheet" href="css/archive.css" />
  ```
- Alternativ in `js/archive.js` ein `ensureStylesheet()`-Muster analog zu `js/habits.js` verwenden.

---

## Gesamtbewertung

Kein fundamentaler Datenschutzverstoß: Die App überträgt keine personenbezogenen Daten an einen Server, verhindert XSS bewusst per `textContent` und validiert Importe nachvollziehbar. Die verbleibenden Lücken betreffen überwiegend Transparenztexte, dokumentierte Sicherheitseigenschaften und zugängliche UI-Elemente. Sie sind behebbar und rechtfertigen **CHANGES_REQUESTED**.