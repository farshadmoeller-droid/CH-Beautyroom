import { NextResponse } from 'next/server';
import { sendeAnfrage, type Anhang } from '@/lib/mail';
import { mailAnInhaberin, mailAnKundin } from '@/lib/mail-vorlagen';
import { ipAus, pruefeRateLimit } from '@/lib/rate-limit';
import {
  MINDEST_AUSFUELLZEIT_MS,
  beautySchema,
  pruefeDateien,
  tattooSchema,
  type AnfrageErgebnis,
} from '@/lib/schemas';
import { business, formular, leistungen, monatLabelFallback, termine } from '@/content/site-helfer';
import { formatiereDatumKurz, formatiereDatumLang } from '@/lib/dates';

/** Der Versand braucht Node, nicht die Edge-Laufzeit. */
export const runtime = 'nodejs';

function referenz(): string {
  const zufall = Math.random().toString(36).slice(2, 6).toUpperCase();
  const jetzt = new Date();
  const datum = `${jetzt.getFullYear()}${String(jetzt.getMonth() + 1).padStart(2, '0')}${String(
    jetzt.getDate(),
  ).padStart(2, '0')}`;
  return `CHB-${datum}-${zufall}`;
}

function text(daten: FormData, feld: string): string {
  const wert = daten.get(feld);
  return typeof wert === 'string' ? wert : '';
}

function haken(daten: FormData, feld: string): boolean {
  const wert = daten.get(feld);
  return wert === 'on' || wert === 'true';
}

function antwort(ergebnis: AnfrageErgebnis, status = 200) {
  return NextResponse.json(ergebnis, { status });
}

const allgemeinerFehler = `Die Anfrage konnte gerade nicht verschickt werden. Schreib mir alternativ direkt an ${business.email}.`;

export async function POST(anfrage: Request): Promise<NextResponse<AnfrageErgebnis>> {
  let daten: FormData;
  try {
    daten = await anfrage.formData();
  } catch {
    return antwort({ status: 'fehler', nachricht: allgemeinerFehler }, 400);
  }

  // 1. Honeypot – für Menschen unsichtbar, muss leer bleiben.
  if (text(daten, 'webseite').trim() !== '') {
    // Bots bekommen eine unauffällige Erfolgsmeldung.
    return antwort({ status: 'ok', referenz: referenz() });
  }

  // 2. Zeitfalle – wer in unter drei Sekunden absendet, ist kein Mensch.
  const gestartet = Number(text(daten, 'gestartet'));
  if (Number.isFinite(gestartet) && gestartet > 0 && Date.now() - gestartet < MINDEST_AUSFUELLZEIT_MS) {
    return antwort({ status: 'ok', referenz: referenz() });
  }

  // 3. Rate-Limit pro IP.
  if (!pruefeRateLimit(ipAus(anfrage.headers))) {
    return antwort(
      {
        status: 'fehler',
        nachricht: `Es sind gerade sehr viele Anfragen von deinem Anschluss gekommen. Bitte versuch es später noch einmal oder schreib mir direkt an ${business.email}.`,
      },
      429,
    );
  }

  const art = text(daten, 'art');
  const kennung = referenz();
  const anhaenge: Anhang[] = [];

  let betreff: string;
  let ueberschrift: string;
  let zeilen: [string, string][];
  let vorname: string;
  let email: string;

  if (art === 'tattoo') {
    const ergebnis = tattooSchema.safeParse({
      art: 'tattoo',
      vorname: text(daten, 'vorname'),
      nachname: text(daten, 'nachname'),
      telefon: text(daten, 'telefon'),
      email: text(daten, 'email'),
      motiv: text(daten, 'motiv'),
      koerperstelle: text(daten, 'koerperstelle'),
      groesse: text(daten, 'groesse'),
      zeitraum: text(daten, 'zeitraum'),
      erstesTattoo: text(daten, 'erstesTattoo'),
      volljaehrig: haken(daten, 'volljaehrig'),
      datenschutz: haken(daten, 'datenschutz'),
      webseite: text(daten, 'webseite'),
    });

    if (!ergebnis.success) {
      return antwort(
        {
          status: 'fehler',
          nachricht: 'Bitte schau dir die markierten Felder noch einmal an.',
          felder: Object.fromEntries(
            ergebnis.error.issues.map((p) => [String(p.path[0] ?? 'form'), p.message]),
          ),
        },
        400,
      );
    }

    const dateien = daten
      .getAll('referenzbilder')
      .filter((e): e is File => e instanceof File && e.size > 0);

    const dateiFehler = pruefeDateien(dateien);
    if (dateiFehler) {
      return antwort(
        { status: 'fehler', nachricht: dateiFehler, felder: { referenzbilder: dateiFehler } },
        400,
      );
    }

    for (const datei of dateien.slice(0, formular.upload.maxDateien)) {
      anhaenge.push({
        dateiname: datei.name,
        inhalt: Buffer.from(await datei.arrayBuffer()),
        typ: datei.type,
      });
    }

    const d = ergebnis.data;
    vorname = d.vorname;
    email = d.email;
    zeilen = [
      ['Name', `${d.vorname} ${d.nachname}`],
      ['E-Mail', d.email],
      ...(d.telefon ? ([['Telefon', d.telefon]] as [string, string][]) : []),
      ['Motividee', d.motiv],
      ['Körperstelle', d.koerperstelle],
      ['Größe', d.groesse],
      ['Wunschzeitraum', monatLabelFallback(d.zeitraum)],
      ['Erstes Tattoo', d.erstesTattoo === 'ja' ? 'Ja' : 'Nein'],
      ['Referenzbilder', anhaenge.length > 0 ? `${anhaenge.length} im Anhang` : 'keine'],
      ['Volljährigkeit', 'bestätigt'],
    ];
    betreff = `Neue Tattoo-Anfrage – ${d.koerperstelle} – ${monatLabelFallback(d.zeitraum)}`;
    ueberschrift = 'Neue Tattoo-Anfrage';
  } else {
    const ergebnis = beautySchema.safeParse({
      art: 'beauty',
      vorname: text(daten, 'vorname'),
      nachname: text(daten, 'nachname'),
      telefon: text(daten, 'telefon'),
      email: text(daten, 'email'),
      leistung: text(daten, 'leistung'),
      datum: text(daten, 'datum'),
      zeitfenster: text(daten, 'zeitfenster'),
      ersterBesuch: text(daten, 'ersterBesuch'),
      nachricht: text(daten, 'nachricht'),
      datenschutz: haken(daten, 'datenschutz'),
      webseite: text(daten, 'webseite'),
    });

    if (!ergebnis.success) {
      return antwort(
        {
          status: 'fehler',
          nachricht: 'Bitte schau dir die markierten Felder noch einmal an.',
          felder: Object.fromEntries(
            ergebnis.error.issues.map((p) => [String(p.path[0] ?? 'form'), p.message]),
          ),
        },
        400,
      );
    }

    const d = ergebnis.data;
    const leistung = leistungen.find((l) => l.id === d.leistung)?.titel ?? d.leistung;
    const fenster = termine.zeitfenster.find((f) => f.id === d.zeitfenster)?.label ?? d.zeitfenster;

    vorname = d.vorname;
    email = d.email;
    zeilen = [
      ['Leistung', leistung],
      ['Wunschtag', formatiereDatumLang(d.datum)],
      ['Zeitfenster', fenster],
      ['Name', `${d.vorname} ${d.nachname}`],
      ['E-Mail', d.email],
      ['Telefon', d.telefon],
      ['Erster Besuch', d.ersterBesuch === 'ja' ? 'Ja' : 'Nein'],
      ...(d.nachricht ? ([['Nachricht', d.nachricht]] as [string, string][]) : []),
    ];
    betreff = `Neue Terminanfrage – ${leistung} – ${formatiereDatumKurz(d.datum)} ${fenster}`;
    ueberschrift = 'Neue Terminanfrage';
  }

  const anCarina = mailAnInhaberin({ betreff, ueberschrift, zeilen, referenz: kennung });
  const anKundin = mailAnKundin({ vorname, istTattoo: art === 'tattoo', zeilen, referenz: kennung });

  const versand = await sendeAnfrage(
    {
      ...anCarina,
      antwortAn: email,
      anhaenge,
      felder: Object.fromEntries(zeilen),
    },
    { ...anKundin, felder: {} },
  );

  if (!versand.ok) {
    console.error('Versand fehlgeschlagen:', versand.fehler);
    return antwort({ status: 'fehler', nachricht: allgemeinerFehler }, 502);
  }

  return antwort({ status: 'ok', referenz: kennung });
}
