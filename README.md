# Habit-Tracker

Ein rein statischer Gewohnheits-Tracker ohne Framework und Build-Schritt. Du
verwaltest Gewohnheiten, setzt tägliche Häkchen in einem 30-Tage-Raster, siehst
Serien und Wochenquote, verfolgst einen 8-Wochen-Verlauf auf einem Canvas-Diagramm,
archivierst und filterst, schaltest den Dark Mode um und behältst alle Daten per
JSON-Export/-Import und LocalStorage vollständig in deinem Browser.

## Tech-Stack

- **Sprache**: JavaScript (ES6+)
- **Markup**: HTML5
- **Styling**: CSS3 (Design-Tokens in `css/base.css`)
- **Diagramm**: Canvas 2D API
- **Speicherung**: LocalStorage (Schlüssel `habits`, `theme`)
- **Build**: keiner

## Installation

Keine Abhängigkeiten, kein Build-Schritt. Einfach die Dateien klonen oder
herunterladen und einen statischen Server starten.

## Start

Im Projektverzeichnis einen statischen HTTP-Server starten (ES-Module
funktionieren nicht über `file://`):

```bash
python -m http.server 8000
```

Unter Windows alternativ:

```bash
py -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.

## Bedienung

- **Gewohnheit anlegen**: Im leeren Zustand einen Namen eingeben und
  „Gewohnheit anlegen“ klicken.
- **Aktiv/Archiviert**: Über die Filter-Buttons oben zwischen aktiven und
  archivierten Gewohnheiten wechseln.
- **Umbenennen / Löschen / Archivieren**: Die Aktions-Buttons auf jeder
  Gewohnheits-Karte.
- **Dark Mode**: Über den Schalter oben rechts umschalten; die Auswahl wird
  gespeichert.
- **Export/Import**: Den gesamten Datenbestand als JSON exportieren bzw.
  wieder importieren.

## Features

- Gewohnheiten anlegen, umbenennen und löschen
- 30-Tage-Raster mit täglichen Häkchen
- Aktuelle und längste Serie sowie Wochenquote
- 8-Wochen-Verlauf als Canvas-Balkendiagramm
- Archivieren und Filtern (Aktiv/Archiviert)
- Dark Mode mit Speicherung der Auswahl
- Persistenz in LocalStorage
- JSON-Export und -Import mit Validierung

## Datenschutz

Die Anwendung führt keinerlei Netzwerkrequests aus. Alle Daten verbleiben
ausschließlich im Browser des Nutzers (LocalStorage).
