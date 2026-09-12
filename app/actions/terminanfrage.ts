'use server';

import { headers } from 'next/headers';
import { ipAusHeadern, pruefeRateLimit } from '@/lib/rate-limit';
import { empfaengerInhaberin, sendeMail, type MailAnhang } from '@/lib/mail';
import { beautyZeilen, mailAnInhaberin, mailAnKundin, tattooZeilen } from '@/lib/mail-templates';
import {
  MINDEST_AUSFUELLZEIT_MS,
  beautyAnfrageSchema,
  pruefeDateien,
  tattooAnfrageSchema,
  type AnfrageErgebnis,
} from '@/lib/schemas';
import { getTreatmentName } from '@/content/services';
import { uploadLimits } from '@/content/booking-config';
import { formatiereDatumKurz, zeitfensterLabel } from '@/lib/dates';
import { siteConfig } from '@/content/site-config';

/** Kurzes Aktenzeichen, damit sich Anfrage und Antwort zuordnen lassen. */
function erzeugeReferenz(): string {
  const zufall = Math.random().toString(36).slice(2, 6).toUpperCase();
  const jetzt = new Date();
  const datum = `${jetzt.getFullYear()}${String(jetzt.getMonth() + 1).padStart(2, '0')}${String(
    jetzt.getDate(),
  ).padStart(2, '0')}`;
  return `CHB-${datum}-${zufall}`;
}

function text(formData: FormData, feld: string): string {
  const wert = formData.get(feld);
  return typeof wert === 'string' ? wert : '';
}

function checkbox(formData: FormData, feld: string): boolean {
  const wert = formData.get(feld);
  return wert === 'on' || wert === 'true';
}

const allgemeinerFehler = `Die Anfrage konnte gerade nicht verschickt werden. Schreib mir alternativ direkt an ${siteConfig.email}.`;

/**
 * Nimmt beide Formularvarianten entgegen, prueft sie und verschickt die zwei
 * E-Mails. Es werden keinerlei Daten gespeichert – weder in einer Datenbank
 * noch als Datei auf dem Server.
 */
export async function sendeAnfrage(formData: FormData): Promise<AnfrageErgebnis> {
  // 1. Honeypot: Dieses Feld ist fuer Menschen unsichtbar und muss leer bleiben.
  if (text(formData, 'webseite').trim() !== '') {
    // Bots bekommen eine unauffaellige Erfolgsmeldung, damit sie es nicht erneut versuchen.
    return { status: 'ok', referenz: erzeugeReferenz() };
  }

  // 2. Zeitfalle: Wer das Formular in unter drei Sekunden ausfuellt, ist kein Mensch.
  const gestartetUm = Number(text(formData, 'gestartetUm'));
  if (Number.isFinite(gestartetUm) && gestartetUm > 0 && Date.now() - gestartetUm < MINDEST_AUSFUELLZEIT_MS) {
    return { status: 'ok', referenz: erzeugeReferenz() };
  }

  // 3. Rate-Limit pro IP-Adresse.
  const kopfzeilen = await headers();
  const { erlaubt } = pruefeRateLimit(ipAusHeadern(kopfzeilen));
  if (!erlaubt) {
    return {
      status: 'fehler',
      nachricht: `Es sind gerade sehr viele Anfragen von deinem Anschluss gekommen. Bitte versuch es später noch einmal oder schreib mir direkt an ${siteConfig.email}.`,
    };
  }

  const art = text(formData, 'art');
  const referenz = erzeugeReferenz();
  const anhaenge: MailAnhang[] = [];

  let betreff: string;
  let ueberschrift: string;
  let zeilen: [string, string][];
  let vorname: string;
  let email: string;

  if (art === 'tattoo') {
    const ergebnis = tattooAnfrageSchema.safeParse({
      art: 'tattoo',
      vorname: text(formData, 'vorname'),
      nachname: text(formData, 'nachname'),
      email: text(formData, 'email'),
      telefon: text(formData, 'telefon'),
      motividee: text(formData, 'motividee'),
      koerperstelle: text(formData, 'koerperstelle'),
      groesseCm: text(formData, 'groesseCm'),
      farbe: text(formData, 'farbe'),
      erweiterung: text(formData, 'erweiterung'),
      wunschzeitraum: text(formData, 'wunschzeitraum'),
      volljaehrig: checkbox(formData, 'volljaehrig'),
      datenschutz: checkbox(formData, 'datenschutz'),
      webseite: text(formData, 'webseite'),
    });

    if (!ergebnis.success) {
      return {
        status: 'fehler',
        nachricht: 'Bitte schau dir die markierten Felder noch einmal an.',
        felder: Object.fromEntries(
          ergebnis.error.issues.map((problem) => [String(problem.path[0] ?? 'form'), problem.message]),
        ),
      };
    }

    const dateien = formData
      .getAll('referenzbilder')
      .filter((eintrag): eintrag is File => eintrag instanceof File && eintrag.size > 0);

    const dateiFehler = pruefeDateien(dateien);
    if (dateiFehler) {
      return { status: 'fehler', nachricht: dateiFehler, felder: { referenzbilder: dateiFehler } };
    }

    for (const datei of dateien.slice(0, uploadLimits.maxFiles)) {
      anhaenge.push({
        dateiname: datei.name,
        inhalt: Buffer.from(await datei.arrayBuffer()),
        typ: datei.type,
      });
    }

    const daten = ergebnis.data;
    zeilen = tattooZeilen(daten, anhaenge.length);
    vorname = daten.vorname;
    email = daten.email;
    betreff = `Neue Tattoo-Anfrage – Fineline – ${daten.koerperstelle} – ${daten.wunschzeitraum}`;
    ueberschrift = 'Neue Tattoo-Anfrage';
  } else {
    const ergebnis = beautyAnfrageSchema.safeParse({
      art: 'beauty',
      behandlung: text(formData, 'behandlung'),
      datum: text(formData, 'datum'),
      zeitfenster: text(formData, 'zeitfenster'),
      alternativTermin: text(formData, 'alternativTermin'),
      vorname: text(formData, 'vorname'),
      nachname: text(formData, 'nachname'),
      email: text(formData, 'email'),
      telefon: text(formData, 'telefon'),
      bereitsKundin: text(formData, 'bereitsKundin'),
      nachricht: text(formData, 'nachricht'),
      datenschutz: checkbox(formData, 'datenschutz'),
      webseite: text(formData, 'webseite'),
    });

    if (!ergebnis.success) {
      return {
        status: 'fehler',
        nachricht: 'Bitte schau dir die markierten Felder noch einmal an.',
        felder: Object.fromEntries(
          ergebnis.error.issues.map((problem) => [String(problem.path[0] ?? 'form'), problem.message]),
        ),
      };
    }

    const daten = ergebnis.data;
    zeilen = beautyZeilen(daten);
    vorname = daten.vorname;
    email = daten.email;
    betreff = `Neue Terminanfrage – ${getTreatmentName(daten.behandlung) ?? daten.behandlung} – ${formatiereDatumKurz(
      daten.datum,
    )} ${zeitfensterLabel(daten.zeitfenster) ?? daten.zeitfenster}`;
    ueberschrift = 'Neue Terminanfrage';
  }

  const empfaenger = empfaengerInhaberin();
  if (!empfaenger) {
    console.error('MAIL_TO ist nicht gesetzt – die Anfrage konnte nicht zugestellt werden.');
    return { status: 'fehler', nachricht: allgemeinerFehler };
  }

  const inhaberinMail = mailAnInhaberin({ betreff, ueberschrift, zeilen, referenz });

  const versand = await sendeMail({
    an: empfaenger,
    betreff: inhaberinMail.betreff,
    text: inhaberinMail.text,
    html: inhaberinMail.html,
    antwortAn: email,
    anhaenge,
  });

  if (!versand.ok) {
    console.error('Versand an die Inhaberin fehlgeschlagen:', versand.fehler);
    return { status: 'fehler', nachricht: allgemeinerFehler };
  }

  // Die Eingangsbestaetigung ist wichtig, aber nicht kritisch: Wenn sie
  // scheitert, ist die Anfrage trotzdem angekommen.
  const kundinMail = mailAnKundin({ vorname, istTattoo: art === 'tattoo', zeilen, referenz });
  const bestaetigung = await sendeMail({
    an: email,
    betreff: kundinMail.betreff,
    text: kundinMail.text,
    html: kundinMail.html,
    antwortAn: empfaenger,
  });

  if (!bestaetigung.ok) {
    console.error('Eingangsbestätigung an die Kundin fehlgeschlagen:', bestaetigung.fehler);
  }

  return { status: 'ok', referenz };
}
