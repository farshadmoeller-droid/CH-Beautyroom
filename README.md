# CH Beautyroom – Website

One-Page-Website für ein Beauty-Homestudio in 26683 Ramsloh (Saterland):
Wimpernverlängerung, Lash Lifting, Brow Lifting und Fineline-Tattoos.

Die Seite kommt **ohne Cookie-Banner** aus: Schriften werden lokal
ausgeliefert, es gibt kein Tracking, keine eingebetteten Karten und kein
Instagram-Widget. Beim Aufruf geht kein einziger Request an einen
Drittanbieter.

---

## Inhalt

1. [Schnellstart](#schnellstart)
2. [Eigene Bilder einbinden](#eigene-bilder-einbinden)
3. [Die Hero-Bildsequenz aus einem Handyvideo](#die-hero-bildsequenz-aus-einem-handyvideo)
4. [Die Fokus-Ringe anpassen](#die-fokus-ringe-anpassen)
5. [Inhalte ändern](#inhalte-ändern)
6. [E-Mail-Versand: Resend oder Formspree](#e-mail-versand-resend-oder-formspree)
7. [Deployment bei Vercel](#deployment-bei-vercel)
8. [Google-Unternehmensprofil](#google-unternehmensprofil)
9. [Projektstruktur](#projektstruktur)
10. [Technische Entscheidungen](#technische-entscheidungen)
11. [Rechtliches](#rechtliches)

---

## Schnellstart

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
cp .env.example .env.local      # danach die Werte eintragen
npm run dev                     # http://localhost:3000
```

| Befehl | Wirkung |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit automatischem Neuladen |
| `npm run build` | Produktionsbuild |
| `npm run start` | Produktionsbuild lokal starten |
| `npm run lint` | Code prüfen |
| `npm run typecheck` | TypeScript prüfen |
| `npm run platzhalter` | Platzhalterbilder neu erzeugen |

Die Seite läuft sofort – alle Bilder sind als neutrale Platzhalter
vorhanden, auch die 150 Frames der Hero-Sequenz.

---

## Eigene Bilder einbinden

Alle Bilder liegen unter `public/`. Jede Datei einfach **gleichnamig
überschreiben**, dann stimmt das Seitenverhältnis und nichts verrutscht.

| Ordner / Datei | Größe | Wofür |
| --- | --- | --- |
| `public/sequence/frame_0001.webp` … | 1440 × 1800 | Frames des Hero – siehe nächster Abschnitt |
| `public/sequence-mobile/` | 720 × 900 | Kleinere Version, jedes 2. Frame |
| `public/hero-fallback.webp` | 1440 × 1800 | Standbild, wenn keine Sequenz läuft |
| `public/services/*.webp` | 1200 × 1500 | Vier Leistungsbilder, hochkant |
| `public/process/*.webp` | 1000 × 1250 | Drei Bilder für „So arbeite ich“ |
| `public/gallery/*.webp` | je nach `format` | Galerie – hoch 1000 × 1400, quer 1400 × 1000, quadrat 1200 × 1200 |
| `public/gallery/*-vorher.webp` | wie das Nachher-Bild | Gegenstück für den Vergleichsregler |
| `public/about/portrait.webp` | 1000 × 1400 | Porträt, wird als Bogen dargestellt |
| `public/instagram/01.webp` … `06.webp` | 800 × 800 | Sechs Instagram-Kacheln |
| `public/statement/pille-1.webp`, `pille-2.webp` | 400 × 400 | Runde Bilder im großen Satz |
| `public/og-bild.jpg` | 1200 × 630 | Vorschau beim Teilen (bewusst JPG, nicht WebP) |

Zu jedem Galeriebild gehört ein Eintrag in `content/site.ts` mit `src`,
`alt`, `kategorie` und `format`. Der Alt-Text beschreibt, was zu sehen ist –
bitte immer auf Deutsch ausformulieren.

**Rechtliches zu Bildern:** nur eigene Aufnahmen oder solche mit Lizenz
verwenden. Sind Kundinnen erkennbar, brauchst du deren schriftliche
Einwilligung – auch bei Nahaufnahmen der Augenpartie.

---

## Die Hero-Bildsequenz aus einem Handyvideo

Der Hero zeichnet eine Bildfolge auf ein `<canvas>` und steuert sie über
die Scroll-Position. Dafür braucht es Einzelbilder, keine Videodatei.

### 1. Das Video aufnehmen

- **Hochformat**, Handy auf ein Stativ oder feste Unterlage – die Kamera
  darf sich nicht bewegen, nur der Kopf.
- **5 bis 8 Sekunden.** Langsam den Kopf zur Seite drehen und wieder in die
  Kamera schauen. Lieber zu langsam als zu schnell.
- **Ruhiger, heller Hintergrund** – eine helle Wand genügt. Je gleichmäßiger
  der Hintergrund, desto weicher wirkt die Sequenz.
- **Gleichmäßiges Licht**, am besten Tageslicht von vorn. Kein Gegenlicht.
- Oben und unten etwas Luft lassen: Der Ausschnitt wird je nach
  Bildschirmgröße beschnitten.

### 2. Frames erzeugen

[ffmpeg](https://ffmpeg.org) installieren, dann im Projektordner:

```bash
# Alte Platzhalter entfernen
rm -f public/sequence/*.webp public/sequence-mobile/*.webp

# Desktop-Sequenz: 24 Bilder pro Sekunde, 1440 px breit
ffmpeg -i video.mp4 -vf "fps=24,scale=1440:-1" \
  -c:v libwebp -quality 80 public/sequence/frame_%04d.webp

# Mobile Sequenz: jedes zweite Bild, halb so breit
ffmpeg -i video.mp4 -vf "fps=12,scale=720:-1" \
  -c:v libwebp -quality 72 public/sequence-mobile/frame_%04d.webp
```

### 3. Nummerierung der mobilen Frames angleichen

Wichtig: Beide Ordner müssen **dieselben Frame-Nummern** verwenden, sonst
passen Desktop und Mobil nicht zum selben Scroll-Fortschritt. `fps=12`
erzeugt eine eigene Zählung ab `0001` – das lässt sich so umbenennen:

```bash
cd public/sequence-mobile
i=1
for datei in $(ls frame_*.webp | sort); do
  neu=$(printf "frame_%04d.webp" $i)
  [ "$datei" != "$neu" ] && mv "$datei" "$neu"
  i=$((i + 2))      # 1, 3, 5, 7 … passend zu mobilSchrittweite: 2
done
cd ../..
```

### 4. Anzahl eintragen

```bash
ls public/sequence/*.webp | wc -l
```

Die Zahl in `content/site.ts` unter `hero.sequenz.anzahl` eintragen. Fertig.

### Wie viele Frames sind sinnvoll?

120 bis 180 sind ein guter Bereich. Darunter wirkt die Bewegung ruckelig,
darüber wird die Seite unnötig schwer. Achte auf die Gesamtgröße:

```bash
du -sh public/sequence public/sequence-mobile
```

Bleib möglichst unter 6 MB für die Desktop-Sequenz. Wird es deutlich mehr,
senke die Qualität (`-quality 70`) oder die Bildrate (`fps=18`).

---

## Die Fokus-Ringe anpassen

Die Ringe, die auf Augen, Wimpern und Brauen zeigen, stehen in
`content/site.ts` unter `hero.fokusRinge`:

```ts
{ id: 'wimpern', label: 'Wimpern', bei: 0.22, bis: 0.46, x: 62, y: 33, r: 9 },
```

| Feld | Bedeutung |
| --- | --- |
| `bei` / `bis` | Von wann bis wann der Ring sichtbar ist. `0` = Anfang des Hero-Scrollens, `1` = Ende. |
| `x` / `y` | Position im Bild in Prozent, von links oben gemessen. |
| `r` | Radius in Prozent der Bildbreite. |
| `label` | Die kleine Beschriftung unter dem Ring. |

**So gehst du vor:** `npm run dev` starten, bis zur passenden Stelle im
Hero scrollen, dann `x` und `y` in kleinen Schritten ändern und speichern –
der Ring springt sofort an die neue Stelle. Die Standardwerte liegen in der
rechten Bildhälfte, damit sie nicht über der Headline liegen.

---

## Inhalte ändern

Fast alles steht in **`content/site.ts`** – eine einzige Datei, nur Daten,
kein Layout. Jeder noch offene Wert ist mit `TODO` markiert.

Das musst du dort eintragen:

- `business` – Name, vollständige Anschrift (Pflicht im Impressum, auch beim
  Homestudio), Telefon, WhatsApp-Nummer international ohne Plus, E-Mail,
  Domain, Umsatzsteuerangabe, Aufsichtsbehörde fürs Tätowieren
- `termine` – Arbeitstage, Zeitfenster, Vorlaufzeit, Urlaubstage, Antwortzeit
- `leistungen`, `ablauf`, `ueberMich`, `faq` – Texte gegenlesen und anpassen
- `galerie` – Bilder mit Alt-Text und Kategorie

**Urlaub eintragen:** bei `termine.gesperrteTage` ergänzen, Format
`"JJJJ-MM-TT"`. Diese Tage sind im Kalender nicht mehr anklickbar.

**Ein drittes Zeitfenster:** bei `termine.zeitfenster` einen Eintrag
ergänzen. Kalender, Prüfregeln und E-Mails ziehen automatisch nach.

---

## E-Mail-Versand: Resend oder Formspree

Beide Wege sind vorbereitet und werden über `MAIL_PROVIDER` in
`.env.local` umgeschaltet. Der Rest des Codes bleibt gleich.

### Weg 1 – Resend (empfohlen)

Verschickt **zwei** E-Mails: die strukturierte Benachrichtigung an Carina
und eine freundliche Eingangsbestätigung an die Kundin.

```env
MAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxx
MAIL_FROM="CH Beautyroom <termin@deine-domain.de>"
MAIL_TO="carina@example.de"
```

Einrichtung: Konto auf [resend.com](https://resend.com) anlegen, unter
*Domains* die eigene Domain hinzufügen und die DNS-Einträge beim
Domainanbieter setzen, dann unter *API Keys* einen Key erzeugen.

### Weg 2 – Formspree

Braucht kein eigenes Mail-Setup. Die Eingangsbestätigung an die Kundin
richtest du dort im Formspree-Dashboard ein (Autoresponder).

```env
MAIL_PROVIDER=formspree
FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

> Datei-Uploads im Tattoo-Formular sind bei Formspree kostenpflichtigen
> Tarifen vorbehalten. Ohne passenden Tarif kommt die Anfrage an, die
> Referenzbilder aber nicht.

**Ohne gesetzte Variablen** zeigt das Formular einen ruhigen Fehlerzustand
mit dem Hinweis, direkt per E-Mail zu schreiben. Es geht also nichts
verloren – die Anfragen kommen aber auch nicht an. Vor dem Livegang bitte
einmal testen.

---

## Deployment bei Vercel

1. Projekt auf [vercel.com](https://vercel.com) importieren (GitHub verbinden).
2. Unter *Settings → Environment Variables* die Werte aus `.env.local`
   eintragen – für *Production*, *Preview* und *Development*.
3. Unter *Settings → Domains* die eigene Domain hinzufügen.
4. `business.domain` in `content/site.ts` auf dieselbe Domain setzen, damit
   Sitemap, canonical-Adressen und Vorschaubilder stimmen.
5. Deploy auslösen.

Alle Seiten werden statisch erzeugt. Dynamisch ist nur `/api/anfrage`.

### Nach dem ersten Livegang prüfen

- [ ] Testanfrage über beide Reiter – kommen die E-Mails an?
- [ ] Impressum und Datenschutzerklärung inhaltlich durchlesen
- [ ] Alle Bilder und die Hero-Sequenz ausgetauscht?
- [ ] `business.domain` gesetzt, `/sitemap.xml` erreichbar?
- [ ] Seite auf dem eigenen Handy durchklicken

---

## Google-Unternehmensprofil

Für ein lokales Studio bringt ein gepflegtes Google-Profil mehr als jede
andere Maßnahme. Wer in Ramsloh oder Barßel nach „Wimpernverlängerung in
der Nähe“ sucht, sieht zuerst die Karte.

1. Profil auf [google.com/business](https://www.google.com/business/) anlegen.
   Kategorie **Kosmetikstudio**, als zweite Kategorie **Tattoo-Studio**.
2. Weil es ein Homestudio ohne Laufkundschaft ist: Adresse **ausblenden**
   und stattdessen ein **Einzugsgebiet** angeben (Saterland, Scharrel,
   Sedelsberg, Strücklingen, Barßel, Friesoythe, Cloppenburg, Bösel,
   Westerstede, Oldenburg). Google erlaubt das ausdrücklich für Betriebe,
   die nur nach Vereinbarung empfangen.
3. Öffnungszeiten eintragen: Montag bis Freitag, 08:00 – 12:00 Uhr.
4. **Website verlinken** – der entscheidende Schritt.
5. Zufriedene Kundinnen um Bewertungen bitten; sie sind in der lokalen
   Suche der stärkste einzelne Faktor.
6. Die Website in der
   [Google Search Console](https://search.google.com/search-console)
   bestätigen und `/sitemap.xml` einreichen.

Was die Website schon mitbringt: deutschsprachige Metadaten mit Ortsbezug,
JSON-LD für `BeautySalon` mit `additionalType: TattooParlor`, FAQ- und
Breadcrumb-Schema, `sitemap.xml`, `robots.txt`, Open-Graph-Bild und die
Zielbegriffe organisch im Text.

---

## Projektstruktur

```
app/
  layout.tsx              Grundgerüst: Schriften, Kopf, Fuß, JSON-LD
  page.tsx                Startseite – setzt die Abschnitte zusammen
  globals.css             Design-System: Farben, Typografie, Bausteine
  impressum/              Impressum nach § 5 DDG
  datenschutz/            Datenschutzerklärung nach Art. 13 DSGVO
  api/anfrage/route.ts    Nimmt beide Formulare entgegen und verschickt sie
  sitemap.ts, robots.ts   Suchmaschinen-Dateien
  not-found.tsx, error.tsx

components/
  providers/SmoothScroll  Lenis, gekoppelt an GSAP
  layout/                 Header, Footer, Logo, Rahmen der Rechtsseiten
  hero/                   Hero mit Standbild, Kennzahlen-Karte
  sections/               Statement, Leistungen, Ablauf, Galerie,
                          Filterleiste, Lightbox, Vorher-Nachher,
                          Über mich, Instagram, FAQ
  booking/                Reiter, beide Formulare, Kalender, Eingabefelder
  ui/                     Enthuellen (Scroll-Einblendung), Icons

content/
  site.ts                 ALLE Inhalte und Daten – hier änderst du
  site-helfer.ts          Kleine Funktionen rund um site.ts

lib/
  gsap.ts                 GSAP und ScrollTrigger registrieren
  dates.ts                Kalenderlogik, Zeitzone Europe/Berlin
  schemas.ts              Prüfregeln für Browser und Server
  mail.ts                 Versand – Resend oder Formspree
  mail-vorlagen.ts        Aufbau der beiden E-Mails
  rate-limit.ts           Einfacher Schutz vor Massenanfragen
  jsonld.ts               Strukturierte Daten
  fonts.ts                Schriften, lokal ausgeliefert
  use-focus-trap.ts       Fokus-Falle für Overlays

public/                   Bilder – siehe oben
scripts/                  Erzeugt die Platzhalterbilder
```

---

## Technische Entscheidungen

Kurz begründet, damit spätere Änderungen nichts kaputtmachen:

- **Bewegung läuft über CSS, nicht über eine Bibliothek.** Erscheinen,
  Aufklappen, Knöpfe, Überblendungen und das Großbild sind Übergänge auf
  `transform` und `opacity`. Die laufen auf dem Compositor und bleiben
  deshalb flüssig, während der Browser noch lädt – eine Animation über
  `requestAnimationFrame` verliert genau in diesem Moment Bilder.
  Ausgelöst wird per `IntersectionObserver` (`components/ui/Enthuellen`).
- **GSAP steht nur noch an einer Stelle:** der Einfärbung im
  Aussage-Satz, wo ein Wert wirklich am Scroll-Fortschritt hängt und sich
  beim Zurückscrollen umkehren muss. Dazu kommt der Parallax im Hero.
  Alles andere braucht es nicht.
- **Lenis treibt ScrollTrigger an, nicht umgekehrt.** In
  `SmoothScroll.tsx` meldet Lenis jeden Scroll-Schritt an ScrollTrigger,
  und GSAPs Ticker treibt Lenis an. Ohne diese Kopplung rechnet
  ScrollTrigger mit veralteten Positionen.
- **Die Leistungen sind eine Bahn mit Einrastpunkten, keine angeheftete
  Sektion.** Die ursprünglich geplante waagerechte Falle wurde gebaut und
  wieder entfernt: Die Karten sind zusammen mit Überschrift und Kopfzeile
  höher als ein Laptop-Fenster, sie hätte also Inhalt gekostet, und sie
  nimmt der Besucherin das Scrollen aus der Hand. Die waagerechte Geste
  ist geblieben, als echtes Scrollen.
- **Kurven und Dauern stehen als Variablen in `globals.css`.** Drei Kurven
  (`--ease-out`, `--ease-in-out`, `--ease-drawer`), fünf Dauern.
  Bedienelemente bleiben unter 300 ms; nur das Erscheinen beim Scrollen
  darf länger laufen, weil es keine Bedienung ist. `ease-in` kommt
  nirgends vor – es beginnt langsam, genau wenn jemand hinsieht.
- **Die Vorlaufzeit gilt pro Zeitfenster, nicht pro Tag.** Wer morgens um
  neun anfragt, bekommt für den nächsten Tag noch das 10-Uhr-Fenster, aber
  nicht mehr das um acht – das läge nur 23 Stunden entfernt.
- **Eingabefeld und Beschriftung sind über `id`/`htmlFor` verknüpft, nicht
  ineinander verschachtelt.** Liegt das Feld im Label, leitet das Label den
  Klick ein zweites Mal weiter und React erkennt die Änderung nicht mehr,
  wenn direkt auf den Punkt geklickt wird. Bitte so lassen.
- **Fehlermeldungen haben festen Platz.** Die Zeile unter jedem Feld ist
  immer vorhanden. So springt das Layout nicht, wenn eine Meldung erscheint
  oder verschwindet – sonst verrutscht der Absenden-Knopf unter dem Finger.
- **Kontrast vor Ästhetik.** Die Palette ist sehr hell, deshalb gibt es
  abgedunkelte Varianten für Text und für Ränder von Bedienelementen
  (`--color-akzent-text`, `--color-akzent-rand`, `--color-leise-stark`).
  Fließtext erreicht mindestens 4,5:1, Bedienelemente mindestens 3:1.
- **Bewegung ist optional, nicht abgeschaltet.** Bei „Bewegung
  reduzieren“ entfallen Lenis, der Parallax und jede Verschiebung; das
  Aufblenden bleibt, weil es beim Verstehen hilft. Die Kennzahlen stehen
  dann sofort auf ihrem Endwert.
- **Kontrast über dem Foto wird gemessen, nicht geschätzt.** Das Foto ist
  sehr hell, deshalb hat die Wortmarke einen eigenen schmalen Verlauf
  (`.kopf-schutz`), das Label im Hero eine eigene Fläche und die
  Glaskarte eine dunkle statt heller Tönung. Gemessen erreichen alle
  Texte über dem Bild ihre WCAG-Grenze.

---

## Rechtliches

- **Impressum** (`/impressum`) nach § 5 DDG, **Datenschutzerklärung**
  (`/datenschutz`) nach Art. 13 DSGVO – beide vollständig ausformuliert.
- **Kein Cookie-Banner nötig**, weil keine einwilligungspflichtigen Cookies
  und keine Drittanbieter-Dienste geladen werden.
- **Keine Preise auf der Website.** Damit greift die Preisangabenverordnung
  nicht. Werden später Preise ergänzt, müssen es Endpreise sein, bei
  Kleinunternehmerschaft mit entsprechendem Hinweis.
- **Tätowierungen ab 18 Jahren**, keine Tattoos in Schwangerschaft und
  Stillzeit – beides steht sichtbar auf der Seite und wird im Formular
  bestätigt.
- **Keine Heil- oder Wirkversprechen** bei den Kosmetiktexten
  (Heilmittelwerbegesetz, Health-Claims-Verordnung).
- **Barrierefreiheit:** Das Barrierefreiheitsstärkungsgesetz gilt seit dem
  28. Juni 2025. Kleinstunternehmen mit weniger als 10 Beschäftigten und
  höchstens 2 Mio. € Jahresumsatz sind bei Dienstleistungen ausgenommen –
  auf dieses Studio trifft die Ausnahme aller Voraussicht nach zu. Die
  Seite ist trotzdem nach WCAG 2.1 AA gebaut.

> Diese Hinweise sind keine Rechtsberatung. Die fertigen Rechtstexte
> sollten vor dem Livegang von einer Anwältin oder über einen geprüften
> Generator abgesichert werden.
