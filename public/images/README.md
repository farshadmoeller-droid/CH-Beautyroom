# Bilder austauschen

Alle Bilder in diesem Ordner sind **Platzhalter**. Sie haben bereits das
richtige Seitenverhältnis, damit beim Austauschen nichts verrutscht und die
Seite nicht springt.

Neu erzeugen lassen sich die Platzhalter jederzeit mit:

```bash
npm run bilder
```

## So tauschst du ein Bild aus

1. Neues Bild auf die unten angegebene Größe bringen (längere Kante genügt,
   Next.js rechnet die kleineren Varianten selbst aus).
2. Als **JPG** speichern, Qualität etwa 80. WebP und AVIF erzeugt Next.js
   automatisch – du musst also nichts konvertieren.
3. Datei mit **exakt demselben Namen** in diesen Ordner legen.
4. Den Alt-Text prüfen: Er steht in `content/services.ts`,
   `content/gallery.ts` oder direkt in der jeweiligen Komponente. Alt-Texte
   beschreiben, was zu sehen ist – bitte immer auf Deutsch und in ganzen Worten.

Die Bilder der Instagram-Beiträge eignen sich gut, am besten in der höchsten
verfügbaren Auflösung.

## Übersicht: welches Bild wohin gehört

| Datei | Größe (Pixel) | Format | Wo es erscheint |
| --- | --- | --- | --- |
| `hero.jpg` | 2000 × 1250 | quer | Großes Bild ganz oben auf der Startseite. Ruhiges Studio-Detail, Trockenblumen oder Pampasgras. Es liegt Text darüber – bitte ein Motiv ohne unruhige Mitte wählen. |
| `leistung-wimpern.jpg` | 1200 × 1500 | hoch | Karte und Detailblock „Wimpernverlängerung“ |
| `leistung-lifting.jpg` | 1200 × 1500 | hoch | Karte und Detailblock „Lashlifting & Browlifting“ |
| `leistung-fineline.jpg` | 1200 × 1500 | hoch | Karte und Detailblock „Fineline-Tattoo“ (wird automatisch in Schwarz-Weiß dargestellt) |
| `leistung-ringana.jpg` | 1200 × 1500 | hoch | Karte „Ringana“ |
| `fineline-atmosphaere.jpg` | 1600 × 1067 | quer | Großes Bild im Fineline-Schwerpunktabschnitt (Schwarz-Weiß) |
| `portrait.jpg` | 1000 × 1400 | hoch | Portrait im Abschnitt „Über mich“. Wird als Bogenform dargestellt – bitte oben etwas Luft über dem Kopf lassen. |
| `ringana.jpg` | 1600 × 1067 | quer | Bild im Ringana-Abschnitt |
| `karte-ramsloh.jpg` | 1200 × 900 | quer | Statische Kartengrafik im Kontaktbereich. **Keine Google-Maps-Kachel verwenden** – sonst wird die Seite einwilligungspflichtig. Geeignet sind z. B. ein OpenStreetMap-Ausschnitt mit passender Lizenz oder eine selbst gezeichnete Übersichtskarte. |
| `vergleich-lifting-vorher.jpg` | 1200 × 900 | quer | Linke Seite des Vorher-Nachher-Reglers |
| `vergleich-lifting-nachher.jpg` | 1200 × 900 | quer | Rechte Seite des Vorher-Nachher-Reglers. Wichtig: gleicher Bildausschnitt wie „vorher“, sonst wirkt der Vergleich unsauber. |
| `og-bild.jpg` | 1200 × 630 | quer | Vorschaubild beim Teilen per WhatsApp, Instagram oder Facebook |

## Galeriebilder

Ordner `galerie/`. Jedes Bild braucht einen passenden Eintrag in
`content/gallery.ts` mit `src`, `alt`, `kategorie`, `beschreibung` und
`format`. Das Feld `format` steuert den Platz im Raster:

| `format` | Größe (Pixel) |
| --- | --- |
| `hoch` | 1000 × 1400 |
| `quer` | 1400 × 1000 |
| `quadrat` | 1200 × 1200 |

Aktuell hinterlegt:

- `wimpern-01.jpg` bis `wimpern-07.jpg` – Kategorie „Wimpern“
- `lifting-01.jpg` bis `lifting-05.jpg` – Kategorie „Lifting“
- `fineline-01.jpg` bis `fineline-12.jpg` – Kategorie „Fineline-Tattoo“
  (werden automatisch in Schwarz-Weiß dargestellt)

Mehr Bilder sind jederzeit möglich: Datei ablegen, Eintrag in
`content/gallery.ts` ergänzen – fertig. Die Galerie lädt nach jeweils zwölf
Bildern nach und bleibt auch mit 60 Bildern flüssig.

## Rechtliches zu den Bildern

- Nur eigene Aufnahmen verwenden oder solche, für die eine Lizenz vorliegt.
- Sind Kundinnen erkennbar, brauchst du deren schriftliche Einwilligung –
  auch bei Nahaufnahmen von Augenpartien.
- Keine fremden Tattoo-Arbeiten zeigen, ohne die Urheberin oder den Urheber zu
  fragen.
