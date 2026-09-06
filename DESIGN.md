# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Ruhige, moderne Produktivitäts-Optik im Linear-Stil: warmes Neutralgrau, klare Karten, ein kräftiges Grün als Erfolgs-/Akzentfarbe und ein gleichwertiger Dark Mode.

## Colors

- `--color-bg`: **#F7F7F5**
- `--color-fg`: **#1B1F1D**
- `--color-surface`: **#FFFFFF**
- `--color-surface_alt`: **#EFF1EF**
- `--color-border`: **#DCE1DD**
- `--color-muted`: **#5F6B64**
- `--color-accent`: **#16794B**
- `--color-accent_hover`: **#0E5F39**
- `--color-accent_soft`: **#DCF1E6**
- `--color-success`: **#16794B**
- `--color-danger`: **#C73E3E**
- `--color-danger_soft`: **#FBE7E7**
- `--color-chart_grid`: **#E5E9E6**
- `--color-dark_bg`: **#131614**
- `--color-dark_fg`: **#E8ECE9**
- `--color-dark_surface`: **#1B1F1D**
- `--color-dark_surface_alt`: **#232826**
- `--color-dark_border`: **#303632**
- `--color-dark_muted`: **#9AA69F**
- `--color-dark_accent`: **#3DCD86**
- `--color-dark_accent_hover`: **#5BD99C**
- `--color-dark_accent_soft`: **#163629**
- `--color-dark_success`: **#3DCD86**
- `--color-dark_danger`: **#F07878**
- `--color-dark_danger_soft`: **#3A1F1F**
- `--color-dark_chart_grid`: **#2C332F**

## Typography

- `font_family`: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif
- `heading_weight`: 600
- `body_weight`: 400

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button

Primär: padding 10px 20px, min-height 44px, radius md, font-weight 600, font-size 16px, bg=accent, color=#FFFFFF; hover bg=accent_hover; active um 1px nach unten versetzt und bg=accent_hover; disabled opacity 0.45, pointer-events none. Sekundär: bg=surface, color=fg, border 1px solid border; hover bg=surface_alt. Ghost: bg transparent, color=accent; hover bg=accent_soft. Focus-visible: outline 2px solid accent, outline-offset 2px.

### IconButton

Größe 44x44px, radius md, bg transparent, color=fg, border 1px solid border, display flex zentriert; hover bg=surface_alt; active bg=accent_soft; disabled opacity 0.45. Dient für Dark-Mode-Toggle, Archivieren, Wiederherstellen, Export/Import.

### Input

height 44px, padding 0 14px, font-size 16px, color=fg, bg=surface, border 1px solid border, radius md, width 100%; placeholder color=muted; focus border-color=accent, box-shadow 0 0 0 3px accent_soft; disabled bg=surface_alt, color=muted.

### Card

Habit-Karte: bg=surface, border 1px solid border, radius lg, padding 16px (mobile) / 24px (desktop), display flex column, gap 16px. Enthält Kopfzeile mit Name, Badges und Aktionen, darunter 30-Tage-Raster und Canvas-Chart. Kein harter Schatten; optional box-shadow 0 1px 2px rgba(0,0,0,0.04).

### DayCell

Zelle im 30-Tage-Raster: min-height 36px, min-width 36px, radius sm, border 1px solid border, bg=surface, display flex zentriert, cursor pointer; hover border-color=accent; checked bg=accent, border-color=accent, Häkchen als inline SVG oder Text '✓' in #FFFFFF, font-size 18px; unchecked bg=surface; heute zusätzlich outline 2px solid accent_soft; focus-visible outline 2px solid accent, offset 2px. Vergangene zukünftige/gesperrte Tage: bg=surface_alt, color=muted, cursor default.

### Badge

Kompakte Kennzahl (Serie, längste Serie, Wochenquote): display inline-flex, align-items center, gap 4px, padding 4px 10px, radius pill, bg=accent_soft, color=accent, font-size 13px, font-weight 600. Dark Mode: bg=dark_accent_soft, color=dark_accent. Gefahrenzustand (Löschen) in danger/danger_soft.

### Toggle

Dark-Mode-Schalter: Breite 48px, Höhe 28px, radius pill, bg=surface_alt, border 1px solid border; Knopf 22x22px, radius pill, bg=surface, box-shadow 0 1px 2px rgba(0,0,0,0.2); on bg=accent, Knopf nach rechts, bg=#FFFFFF; focus-visible outline 2px solid accent, offset 2px. Icon (Sonne/Mond) im Knopf, 12px, color=muted.

### Modal

Bestätigungs-/Import-Dialog: Overlay rgba(15,17,16,0.55) über Viewport, z-index 100; Dialog bg=surface, radius lg, padding 24px, max-width 420px, width calc(100% - 32px), border 1px solid border. Titel font-size 20px, font-weight 600; Text color=muted; Aktionen rechtsbündig mit Sekundär-/Gefahr-Button, gap 12px.

### EmptyState

Leerer Zustand ohne Daten: zentriert, max-width 400px, padding 48px 24px, margin auto; Icon 48px in accent_soft mit accent; Titel font-size 20px, font-weight 600, color=fg; Beschreibung color=muted, font-size 15px; primärer Button 'Erste Gewohnheit anlegen' darunter, margin-top 16px.

### ChartCanvas

Canvas-Balkendiagramm der letzten 8 Wochen: Breite 100% der Karte, Höhe 160px (mobile) / 200px (desktop), devicePixelRatio-scharf gezeichnet. Hintergrund transparent; Gitterlinien 1px in chart_grid; Achsenbeschriftung font-size 11px, color=muted; Balken radius sm oben, bg=accent_soft, Hover/aktive Woche bg=accent, Höhe proportional zur Wochenquote; Mindesthöhe 2px, maximale Balkenbreite 40px, Abstand zwischen Balken 8px.

## Layout Principles

- Container max-width 960px, zentriert, padding 16px (mobil), 24px (≥640px), 32px (≥960px); kein horizontales Scrollen auf schmalen Viewports.
- Breakpoints: Basis mobil, ≥640px Tablet, ≥960px Desktop.
- Habit-Karten einspaltig untereinander mit 16px Abstand; das 30-Tage-Raster ist ein CSS-Grid mit auto-fill/minmax(28px, 1fr), gap 6px, auf Mobil etwa 7 Spalten, auf Desktop bis zu 15 Spalten.
- Dark Mode über CSS-Custom-Properties auf :root und [data-theme='dark']; Standard folgt prefers-color-scheme, der manuelle Toggle überschreibt und wird in LocalStorage gespeichert.
- Focus-Styles immer sichtbar: outline 2px solid accent, offset 2px; Zustände nie nur über Farbe vermitteln.
- Alle interaktiven Elemente haben eine Touch-/Klickfläche von mindestens 44x44px.
