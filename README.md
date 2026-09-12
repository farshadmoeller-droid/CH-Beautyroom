# CH Beautyroom – Website

Website für den CH Beautyroom in 26683 Ramsloh: Homestudio für
Wimpernverlängerung, Lash- und Browlifting, Fineline-Tattoos und Ringana.

Die Seite kommt **ohne Cookie-Banner** aus: keine Google Fonts vom Server
Dritter, kein Analytics, keine eingebetteten Instagram- oder Maps-Elemente,
keine Datenbank. Beim Aufruf wird kein einziger Request an einen Drittanbieter
gestellt.

---

## Inhalt

1. [Schnellstart](#schnellstart)
2. [Was du ausfüllen musst](#was-du-ausfüllen-musst)
3. [Umgebungsvariablen](#umgebungsvariablen)
4. [Projektstruktur](#projektstruktur)
5. [Inhalte ändern, ohne zu programmieren](#inhalte-ändern-ohne-zu-programmieren)
6. [Das Buchungsmodul](#das-buchungsmodul)
7. [Deployment bei Vercel](#deployment-bei-vercel)
8. [Google-Unternehmensprofil – der wichtigste SEO-Hebel](#google-unternehmensprofil--der-wichtigste-seo-hebel)
9. [Rechtliches](#rechtliches)
10. [Technische Entscheidungen](#technische-entscheidungen)

---

## Schnellstart

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install          # Pakete installieren
cp .env.example .env.local
# .env.local öffnen und die Werte eintragen (siehe unten)
npm run dev          # Entwicklungsserver auf http://localhost:3000
```

Weitere Befehle:

| Befehl | Wirkung |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit automatischem Neuladen |
| `npm run build` | Produktionsbuild erzeugen |
| `npm run start` | Produktionsbuild lokal starten |
| `npm run lint` | Code auf Fehler prüfen |
| `npm run typecheck` | TypeScript prüfen, ohne zu bauen |
| `npm run bilder` | Platzhalterbilder neu erzeugen |

---

## Was du ausfüllen musst

Alle Stammdaten stehen an **einer** Stelle: `content/site-config.ts`.
Jeder noch offene Wert ist dort mit `TODO:` markiert.

| Wert | Bedeutung |
| --- | --- |
| `inhaberinName` | Vollständiger Name – erscheint im Logo, im Impressum und in den E-Mails |
| `strasseHausnummer` | Straße und Hausnummer. Pflichtangabe im Impressum, auch beim Homestudio. Ein Postfach reicht rechtlich nicht. |
| `plzOrt` | PLZ und Ort fürs Impressum |
| `telefon` | Telefonnummer in nationaler Schreibweise, z. B. `04498 1234567` |
| `whatsappNummer` | Dieselbe Nummer international, ohne Plus und Leerzeichen, z. B. `4915112345678` |
| `email` | E-Mail-Adresse für Anfragen und Impressum |
| `instagramUrl` | Vollständige Instagram-Adresse |
| `domain` | Endgültige Domain mit `https://`, ohne Schrägstrich am Ende |
| `ustIdOderKleinunternehmer` | Umsatzsteuer-ID oder der Hinweis auf § 19 UStG |
| `zustaendigesGesundheitsamt` | Nur nötig, wenn für das Tätowieren eine Anzeige beim Landkreis vorliegt. Sonst den Absatz im Impressum löschen. |

Außerdem:

- **Bilder** austauschen – Anleitung in [`public/images/README.md`](public/images/README.md).
- **Logo**: Das Logo ist zunächst reine Typografie in
  `components/Logo.tsx`. Sobald eine SVG-Datei vorliegt, tauschst du den
  Inhalt dieser einen Komponente aus – alle Stellen, an denen das Logo
  erscheint, ziehen automatisch nach.
- **Kundinnenstimmen**: Die Texte in `content/testimonials.ts` sind sichtbar
  als Platzhalter gekennzeichnet. Vor dem Livegang bitte durch echte,
  freigegebene Zitate ersetzen oder den Abschnitt entfernen – erfundene
  Bewertungen sind wettbewerbsrechtlich unzulässig.
- **Öffnungstage**: In `content/booking-config.ts` ist Montag bis Freitag
  hinterlegt. Wird samstags gearbeitet, `openingDays` um `6` ergänzen.

---

## Umgebungsvariablen

Die Datei `.env.local` wird nicht mit ins Repository übernommen. Bei Vercel
trägst du dieselben Werte unter *Settings → Environment Variables* ein.

| Variable | Pflicht | Bedeutung |
| --- | --- | --- |
| `RESEND_API_KEY` | ja | API-Key von [resend.com](https://resend.com). Wird ausschließlich auf dem Server gelesen und gelangt nie in den Browser. |
| `MAIL_FROM` | ja | Absenderadresse, z. B. `CH Beautyroom <termin@deine-domain.de>`. Die Domain muss bei Resend verifiziert sein. |
| `MAIL_TO` | ja | Postfach, in dem die Terminanfragen landen |
| `NEXT_PUBLIC_SITE_URL` | nein | Basis-URL der Website |
| `MAIL_TRANSPORT` | nein | `smtp` setzen, um statt Resend einen eigenen Postausgang zu nutzen |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | nein | Nur nötig bei `MAIL_TRANSPORT=smtp`. Zusätzlich `npm install nodemailer` ausführen. |

**Ohne gesetzte Mail-Variablen** zeigt das Formular einen ruhigen Fehlerzustand
mit dem Hinweis, direkt per E-Mail zu schreiben. Es geht also nichts still
verloren – aber die Anfragen kommen eben auch nicht an. Bitte vor dem Livegang
einmal testen.

### Resend in fünf Minuten einrichten

1. Konto auf [resend.com](https://resend.com) anlegen (kostenlos für den
   Bedarf eines kleinen Studios).
2. Unter *Domains* die eigene Domain hinzufügen und die angezeigten
   DNS-Einträge beim Domainanbieter eintragen.
3. Unter *API Keys* einen Key erzeugen und als `RESEND_API_KEY` hinterlegen.
4. `MAIL_FROM` auf eine Adresse dieser Domain setzen, `MAIL_TO` auf das eigene
   Postfach.

---

## Projektstruktur

```
app/                        Seiten und Routen (Next.js App Router)
  layout.tsx                Grundgerüst: Kopf, Fuß, Schriften, Metadaten
  page.tsx                  Startseite – setzt die Abschnitte zusammen
  galerie/page.tsx          Komplette Galerie
  impressum/page.tsx        Impressum nach § 5 DDG
  datenschutz/page.tsx      Datenschutzerklärung nach Art. 13 DSGVO
  danke/page.tsx            Bestätigungsseite nach einer Anfrage
  not-found.tsx             404-Seite im Look der Website
  error.tsx                 Fehlerseite im Look der Website
  sitemap.ts, robots.ts     Suchmaschinen-Dateien
  actions/terminanfrage.ts  Server Action: prüft die Anfrage und verschickt sie
  globals.css               Design-System: Farben, Schriften, Abstände

components/                 Bausteine der Oberfläche
  Header, Footer, Hero, ...  Abschnitte der Startseite
  GalleryGrid, Lightbox      Galerie mit Filter und Vollbildansicht
  booking/                   Das Buchungsmodul
    BookingSection.tsx       Weichenstellung: Beauty oder Tattoo
    BeautyFlow.tsx           Drei Schritte mit Kalender
    TattooForm.tsx           Tattoo-Anfrage mit Bild-Upload
    Calendar.tsx             Selbst gebauter Monatskalender
    Fields.tsx               Eingabefelder, Auswahlgruppen, Fehlermeldungen

content/                    Alle Texte und Daten – hier änderst du Inhalte
  site-config.ts            Stammdaten (Name, Adresse, Kontakt, Domain)
  services.ts               Die vier Leistungsbereiche
  gallery.ts                Galeriebilder
  faq.ts                    Häufige Fragen
  booking-config.ts         Zeitfenster, Öffnungstage, Vorlaufzeit, Urlaub
  fineline.ts               Motivwelten, Ablauf, Vorbereitung, Pflege
  ablauf.ts                 Ablauf eines Termins, Vertrauensmerkmale
  testimonials.ts           Kundinnenstimmen (aktuell Platzhalter)

lib/                        Technik im Hintergrund
  dates.ts                  Kalenderlogik, Zeitzone Europe/Berlin
  schemas.ts                Prüfregeln, gemeinsam für Browser und Server
  mail.ts                   E-Mail-Versand (Resend oder SMTP)
  mail-templates.ts         Aufbau der beiden E-Mails
  rate-limit.ts             Einfacher Schutz vor Massenanfragen
  jsonld.ts                 Strukturierte Daten für Google
  fonts.ts                  Schriften, lokal ausgeliefert

public/images/              Bilder – siehe README in diesem Ordner
scripts/                    Hilfsskript zum Erzeugen der Platzhalterbilder
```

---

## Inhalte ändern, ohne zu programmieren

Fast alle Texte liegen in `content/`. Die Dateien sind reine Listen und
Texte – es gibt dort kein JSX und kein Layout.

**Beispiel: eine neue Frage ins FAQ aufnehmen.** In `content/faq.ts` einen
Block ergänzen:

```ts
{
  frage: 'Kann ich meine Kinder mitbringen?',
  antwort:
    'Weil ich nur eine Kundin gleichzeitig betreue, ist das leider schwierig. Sprich mich aber gern an – vielleicht finden wir einen passenden Termin.',
},
```

Die Frage erscheint danach automatisch im Aufklapp-Bereich **und** in den
strukturierten Daten für Google.

**Urlaub eintragen:** in `content/booking-config.ts` bei `blockedDates`
ergänzen, im Format `"JJJJ-MM-TT"`. Diese Tage sind im Kalender dann nicht
mehr anklickbar.

**Ein drittes Zeitfenster:** in `content/booking-config.ts` bei
`slotStartTimes` einen Eintrag ergänzen, z. B. `"12:00"`. Mehr ist nicht nötig –
Kalender, Prüfregeln und E-Mails ziehen automatisch nach.

---

## Das Buchungsmodul

Das Modul ist **kein verbindliches Buchungssystem**. Es kennt keine
Verfügbarkeiten und reserviert nichts. Es sammelt die Angaben strukturiert ein
und verschickt sie als E-Mail. Das steht auch für die Kundin an mehreren
Stellen deutlich auf der Seite.

**Zwei Wege:**

- **Beauty-Behandlung** → Leistung wählen → Wunschtag und Zeitfenster im
  Kalender → Kontaktdaten → Übersicht → absenden.
- **Fineline-Tattoo** → kein Kalender, stattdessen ein eigenes Formular für
  Motividee, Körperstelle, Größe, Ausführung und bis zu drei Referenzbilder.

**Regeln des Kalenders** (alle aus `content/booking-config.ts`):

- Termine nur Montag bis Freitag zwischen 08:00 und 12:00 Uhr.
- Zwei Zeitfenster pro Tag: 08:00–10:00 Uhr und 10:00–12:00 Uhr.
- Mindestens 24 Stunden Vorlauf. Die Vorlaufzeit gilt für das konkrete
  Zeitfenster: Wer morgens um neun anfragt, bekommt für den nächsten Tag nur
  noch das 10-Uhr-Fenster angeboten.
- Höchstens 90 Tage im Voraus.
- Vergangene Tage, Wochenenden und geblockte Tage sind ausgegraut, mit
  `aria-disabled` gekennzeichnet und nicht anklickbar.
- Vollständig mit der Tastatur bedienbar: Pfeiltasten bewegen den Fokus,
  Pos1/Ende springen an Wochenanfang und -ende, Bild auf/ab wechseln den Monat,
  Enter oder Leertaste wählen aus.

Alle Berechnungen laufen in der Zeitzone `Europe/Berlin` – unabhängig davon,
in welcher Zeitzone der Server läuft.

**Schutz vor Spam** – ganz ohne Captcha:

- ein für Menschen unsichtbares Feld, das leer bleiben muss (Honeypot),
- eine Zeitfalle: Absenden in unter drei Sekunden wird verworfen,
- ein einfaches Limit pro IP-Adresse (fünf Anfragen pro Stunde).

**Zwei E-Mails pro Anfrage:**

1. an dich, mit allen Angaben strukturiert aufbereitet. Betreff:
   `Neue Terminanfrage – [Leistung] – [Datum] [Uhrzeit]`. Ein „Antworten“
   geht direkt an die Kundin.
2. an die Kundin, als freundliche Eingangsbestätigung mit ihren Angaben.

**Es werden keine Daten gespeichert** – weder in einer Datenbank noch als Datei
auf dem Server. Genau so steht es auch in der Datenschutzerklärung.

---

## Deployment bei Vercel

1. Projekt bei [vercel.com](https://vercel.com) importieren (GitHub verbinden).
2. Unter *Settings → Environment Variables* die Werte aus `.env.local`
   eintragen – für *Production*, *Preview* und *Development*.
3. Unter *Settings → Domains* die eigene Domain hinzufügen und die
   angezeigten DNS-Einträge beim Domainanbieter setzen.
4. `domain` in `content/site-config.ts` auf dieselbe Domain setzen, damit
   Sitemap, canonical-Adressen und Vorschaubilder stimmen.
5. Deploy auslösen. Jeder Push auf den Hauptzweig baut die Seite automatisch neu.

Die Seite wird beim Bauen vollständig statisch erzeugt. Dynamisch ist nur das
Absenden des Formulars.

### Nach dem ersten Livegang prüfen

- [ ] Eine Testanfrage über beide Formulare abschicken – kommen beide E-Mails an?
- [ ] Impressum und Datenschutzerklärung inhaltlich durchlesen.
- [ ] Alle Bilder ausgetauscht?
- [ ] Kundinnenstimmen ersetzt oder Abschnitt entfernt?
- [ ] `domain` gesetzt, `https://deine-domain.de/sitemap.xml` erreichbar?
- [ ] Seite auf dem eigenen Handy durchklicken.

---

## Google-Unternehmensprofil – der wichtigste SEO-Hebel

Für ein lokales Studio bringt **ein gepflegtes Google-Unternehmensprofil mehr
als jede andere Maßnahme**. Wer in Ramsloh, Scharrel oder Barßel nach
„Wimpernverlängerung in der Nähe“ sucht, sieht zuerst die Karte – und erst
darunter die Websites.

So gehst du vor:

1. Unter [google.com/business](https://www.google.com/business/) ein Profil
   anlegen. Als Kategorie **„Kosmetikstudio“** wählen, als weitere Kategorie
   **„Tattoo-Studio“** ergänzen.
2. Weil es ein Homestudio ohne Laufkundschaft ist: die Adresse **ausblenden**
   und stattdessen ein **Einzugsgebiet** angeben (Saterland, Scharrel,
   Sedelsberg, Strücklingen, Barßel, Friesoythe, Cloppenburg, Bösel,
   Westerstede, Oldenburg). Google erlaubt das ausdrücklich für Betriebe, die
   Kundinnen nur nach Vereinbarung empfangen.
3. Öffnungszeiten eintragen: Montag bis Freitag, 08:00–12:00 Uhr.
4. **Die Website verlinken** – das ist der entscheidende Schritt. Die Website
   liefert über ihre strukturierten Daten (`BeautySalon` mit
   `additionalType: TattooParlor`) dieselben Angaben noch einmal an Google:
   Name, Ort, Öffnungszeiten, Leistungen, Instagram-Profil.
5. Profil mit echten Fotos füllen – dieselben wie auf der Website.
6. Zufriedene Kundinnen um eine Bewertung bitten. Bewertungen sind der
   stärkste einzelne Faktor in der lokalen Suche.
7. Zusätzlich anmelden: die Website in der
   [Google Search Console](https://search.google.com/search-console)
   bestätigen und dort einmal `https://deine-domain.de/sitemap.xml` einreichen.

Was die Website selbst bereits mitbringt:

- deutschsprachige Titel und Beschreibungen mit Ortsbezug pro Seite,
- strukturierte Daten für Studio, FAQ und Brotkrümelnavigation,
- `sitemap.xml` und `robots.txt`,
- Vorschaubilder für WhatsApp, Instagram und Facebook,
- saubere Überschriftenhierarchie mit genau einer `h1` je Seite,
- Zielbegriffe organisch im Fließtext: Wimpernverlängerung Ramsloh,
  Lashlifting Saterland, Browlifting Friesoythe, Fineline Tattoo Cloppenburg,
  Kosmetikstudio Saterland.

---

## Rechtliches

- **Impressum** (`/impressum`) nach § 5 DDG: Name, vollständige Anschrift,
  Kontakt, Umsatzsteuerangabe, Aufsichtsbehörde, Hinweis nach Art. 14
  ODR-Verordnung und die Erklärung zur Verbraucherschlichtung.
- **Datenschutzerklärung** (`/datenschutz`) nach Art. 13 DSGVO: verantwortliche
  Stelle, Hosting mit Server-Logfiles, Formulare mit Zweck, Rechtsgrundlage,
  Speicherdauer und Empfängern, Datei-Uploads, Betroffenenrechte, Hinweis auf
  lokal ausgelieferte Schriften und auf die reine Verlinkung zu Instagram.
- **Kein Cookie-Banner nötig**, weil keine einwilligungspflichtigen Cookies und
  keine Drittanbieter-Dienste geladen werden. Wird später doch eine
  Reichweitenmessung gewünscht, bitte eine cookiefreie Lösung wählen und die
  Datenschutzerklärung ergänzen.
- **Keine Preise auf der Website.** Damit greift die Preisangabenverordnung
  nicht. Werden später Preise ergänzt, müssen es Endpreise sein, bei
  Kleinunternehmerschaft mit entsprechendem Hinweis.
- **Tätowierungen ab 18 Jahren**, keine Tattoos in Schwangerschaft und
  Stillzeit – beides steht sichtbar auf der Seite und wird im Formular
  bestätigt.
- **Keine Heil- oder Wirkversprechen** bei Kosmetik und Ringana – die Texte
  sind bewusst beschreibend gehalten (Heilmittelwerbegesetz,
  Health-Claims-Verordnung).
- **Barrierefreiheit:** Das Barrierefreiheitsstärkungsgesetz gilt seit dem
  28. Juni 2025. Kleinstunternehmen mit weniger als 10 Beschäftigten und
  höchstens 2 Mio. € Jahresumsatz sind bei Dienstleistungen ausgenommen –
  auf dieses Studio trifft die Ausnahme aller Voraussicht nach zu. Die Seite
  ist trotzdem nach WCAG 2.1 AA gebaut.

> Diese Hinweise sind keine Rechtsberatung. Die fertigen Rechtstexte sollten
> vor dem Livegang von einer Anwältin oder über einen geprüften Generator
> abgesichert werden.

---

## Technische Entscheidungen

Kurz begründet, damit spätere Änderungen nichts kaputtmachen:

- **Next.js 15 mit App Router, TypeScript im strict-Modus, Tailwind CSS v4.**
  Alle Farben und Schriften liegen als Design-Tokens in `app/globals.css`.
  Im Markup stehen keine Hex-Werte.
- **Schriften lokal.** `next/font/google` lädt Cormorant Garamond und Jost
  beim Bauen herunter und liefert sie danach vom eigenen Server aus. Zur
  Laufzeit geht kein Request an Google – das ist die Voraussetzung dafür, dass
  die Seite ohne Einwilligungsbanner auskommt.
- **Ein Prüf-Schema für beide Seiten.** `lib/schemas.ts` wird im Browser
  (react-hook-form) und in der Server Action verwendet. Die Prüfung im Browser
  ist Komfort, die auf dem Server ist die verbindliche.
- **Eigener Kalender statt Datepicker-Bibliothek.** Ein fremder Datepicker
  hätte deutsche Beschriftung, Wochenstart am Montag, gesperrte Tage und
  vollständige Tastaturbedienung ohnehin nur teilweise mitgebracht – und
  kostet zusätzliche Ladezeit.
- **Eingabefeld und Beschriftung sind über `id`/`htmlFor` verknüpft, nicht
  ineinander verschachtelt.** Liegt ein Auswahlfeld im Label, leitet das Label
  den Klick ein zweites Mal weiter und React erkennt die Änderung nicht mehr,
  wenn direkt auf den Punkt geklickt wird. Bitte so lassen.
- **Fehlermeldungen haben festen Platz.** Die Zeile unter jedem Feld ist immer
  vorhanden, auch ohne Fehler. So springt das Layout nicht, wenn eine Meldung
  erscheint oder verschwindet – sonst verrutscht der „Weiter“-Knopf unter dem
  Finger. Screenreader lesen den Bereich dadurch außerdem zuverlässiger vor.
- **Kontrast vor Ästhetik.** Für Text und für die Ränder von Bedienelementen
  gibt es abgedunkelte Varianten der sehr hellen Grundpalette
  (`--color-ink`, `--color-clay-dark`, `--color-sage-dark`, `--color-control`).
  Fließtext erreicht mindestens 4,5:1, Bedienelemente mindestens 3:1.
- **Bewegung ist optional.** Alle Animationen entfallen vollständig, wenn im
  Betriebssystem „Bewegung reduzieren“ aktiviert ist.
