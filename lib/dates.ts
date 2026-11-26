/**
 * Datumslogik für den Kalender.
 *
 * Alle Berechnungen laufen in Europe/Berlin, damit Browser und Server
 * dieselben Tage freigeben – Vercel läuft in UTC.
 */

import { termine } from '@/content/site';

export const ZEITZONE = 'Europe/Berlin';

export const wochentageKurz = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;

export const wochentageLang = [
  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag',
] as const;

export const monatsnamen = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
] as const;

export type Kalendertag = { iso: string; tag: number; monat: number; jahr: number };

function zwei(n: number): string {
  return String(n).padStart(2, '0');
}

export function toIso(jahr: number, monat: number, tag: number): string {
  return `${jahr}-${zwei(monat)}-${zwei(tag)}`;
}

/** Aktueller Zeitpunkt in Berlin, zerlegt. */
export function jetztInBerlin(now: Date = new Date()) {
  const teile = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: ZEITZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  const jahr = Number(teile.year);
  const monat = Number(teile.month);
  const tag = Number(teile.day);
  return { iso: toIso(jahr, monat, tag), jahr, monat, tag, stunde: Number(teile.hour) % 24 };
}

export function wochentagVon(iso: string): number {
  const [j, m, t] = iso.split('-').map(Number);
  return new Date(Date.UTC(j ?? 1970, (m ?? 1) - 1, t ?? 1)).getUTCDay();
}

export function tageDazwischen(a: string, b: string): number {
  const [aj, am, at] = a.split('-').map(Number);
  const [bj, bm, bt] = b.split('-').map(Number);
  return Math.round(
    (Date.UTC(bj ?? 1970, (bm ?? 1) - 1, bt ?? 1) - Date.UTC(aj ?? 1970, (am ?? 1) - 1, at ?? 1)) / 86_400_000,
  );
}

export function isoPlusTage(iso: string, tage: number): string {
  const [j, m, t] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(j ?? 1970, (m ?? 1) - 1, (t ?? 1) + tage));
  return toIso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** Zeitzonen-Versatz von Berlin zu einem Zeitpunkt – berücksichtigt Sommerzeit. */
function berlinVersatzMs(utcMs: number): number {
  const teile = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: ZEITZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })
      .formatToParts(new Date(utcMs))
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  return (
    Date.UTC(
      Number(teile.year), Number(teile.month) - 1, Number(teile.day),
      Number(teile.hour) % 24, Number(teile.minute), Number(teile.second),
    ) - utcMs
  );
}

/** Wandelt einen Berliner Zeitpunkt (Datum + "HH:MM") in einen Zeitstempel. */
export function berlinZeitstempel(iso: string, uhrzeit: string): number {
  const [j, m, t] = iso.split('-').map(Number);
  const [std, min] = uhrzeit.split(':').map(Number);
  const naiv = Date.UTC(j ?? 1970, (m ?? 1) - 1, t ?? 1, std ?? 0, min ?? 0);
  return naiv - berlinVersatzMs(naiv);
}

/**
 * Prüft ein einzelnes Zeitfenster gegen die Vorlaufzeit.
 *
 * Die Vorlaufzeit gilt bewusst für den konkreten Termin, nicht pauschal
 * für den ganzen Tag: Wer morgens um neun anfragt, bekommt für den
 * nächsten Tag noch das 10-Uhr-Fenster angeboten, aber nicht mehr das um
 * acht – das läge nur 23 Stunden entfernt.
 */
export function fensterVerfuegbar(iso: string, start: string, now: Date = new Date()): boolean {
  return berlinZeitstempel(iso, start) - now.getTime() >= termine.vorlaufStunden * 3_600_000;
}

export function verfuegbareFenster(iso: string, now: Date = new Date()) {
  return termine.zeitfenster.filter((f) => fensterVerfuegbar(iso, f.start, now));
}

export type SperrGrund = 'vergangen' | 'vorlaufzeit' | 'geschlossen' | 'gesperrt' | 'zuWeit';

export function tagStatus(iso: string, now: Date = new Date()): { frei: boolean; grund?: SperrGrund } {
  const heute = jetztInBerlin(now).iso;

  if (tageDazwischen(heute, iso) < 0) return { frei: false, grund: 'vergangen' };
  if (!(termine.arbeitstage as readonly number[]).includes(wochentagVon(iso))) {
    return { frei: false, grund: 'geschlossen' };
  }
  if ((termine.gesperrteTage as readonly string[]).includes(iso)) return { frei: false, grund: 'gesperrt' };
  if (tageDazwischen(heute, iso) > termine.maxVorausTage) return { frei: false, grund: 'zuWeit' };
  if (verfuegbareFenster(iso, now).length === 0) return { frei: false, grund: 'vorlaufzeit' };

  return { frei: true };
}

export function istFrei(iso: string, now: Date = new Date()): boolean {
  return tagStatus(iso, now).frei;
}

/** Erster Tag, an dem noch mindestens ein Zeitfenster frei ist. */
export function fruehesterTag(now: Date = new Date()): string {
  const heute = jetztInBerlin(now).iso;
  for (let versatz = 0; versatz <= termine.maxVorausTage; versatz++) {
    const iso = isoPlusTage(heute, versatz);
    if (tagStatus(iso, now).frei) return iso;
  }
  return isoPlusTage(heute, 1);
}

export function formatiereDatumLang(iso: string): string {
  const [j, m, t] = iso.split('-').map(Number);
  return `${wochentageLang[wochentagVon(iso)]}, ${t}. ${monatsnamen[(m ?? 1) - 1]} ${j}`;
}

export function formatiereDatumKurz(iso: string): string {
  const [j, m, t] = iso.split('-').map(Number);
  return `${zwei(t ?? 1)}.${zwei(m ?? 1)}.${j}`;
}

/** Monatsraster, immer mit Montag als erstem Tag. Leere Felder sind null. */
export function monatsRaster(jahr: number, monat: number): (Kalendertag | null)[] {
  const ersterWochentag = new Date(Date.UTC(jahr, monat - 1, 1)).getUTCDay();
  const versatz = (ersterWochentag + 6) % 7;
  const tageImMonat = new Date(Date.UTC(jahr, monat, 0)).getUTCDate();

  const felder: (Kalendertag | null)[] = Array.from({ length: versatz }, () => null);
  for (let tag = 1; tag <= tageImMonat; tag++) {
    felder.push({ iso: toIso(jahr, monat, tag), tag, monat, jahr });
  }
  return felder;
}

export function verschiebeMonat(jahr: number, monat: number, schritte: number) {
  const gesamt = jahr * 12 + (monat - 1) + schritte;
  return { jahr: Math.floor(gesamt / 12), monat: (gesamt % 12) + 1 };
}

/** Die nächsten zwölf Monate – für den Wunschzeitraum im Tattoo-Formular. */
export function monatsAuswahl(now: Date = new Date()) {
  const heute = jetztInBerlin(now);
  return Array.from({ length: 12 }, (_, i) => {
    const { jahr, monat } = verschiebeMonat(heute.jahr, heute.monat, i);
    return { wert: `${jahr}-${zwei(monat)}`, label: `${monatsnamen[monat - 1]} ${jahr}` };
  });
}
