/**
 * Datums-Hilfsfunktionen fuer den Kalender.
 *
 * Alle Berechnungen laufen bewusst in der Zeitzone Europe/Berlin, damit der
 * Kalender im Browser der Kundin und auf dem Server (Vercel laeuft in UTC)
 * dieselben Tage freigibt.
 */

import { bookingConfig } from '@/content/booking-config';

export const ZEITZONE = 'Europe/Berlin';

export const wochentageKurz = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;

export const wochentageLang = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
] as const;

export const monatsnamen = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const;

/** Kalendertag als reines Datum, ohne Uhrzeit und ohne Zeitzonen-Drift. */
export type Kalendertag = {
  /** Format JJJJ-MM-TT */
  iso: string;
  tag: number;
  monat: number;
  jahr: number;
  /** 0 = Sonntag … 6 = Samstag */
  wochentag: number;
};

function zweistellig(wert: number): string {
  return String(wert).padStart(2, '0');
}

export function toIso(jahr: number, monat: number, tag: number): string {
  return `${jahr}-${zweistellig(monat)}-${zweistellig(tag)}`;
}

/** Aktueller Zeitpunkt in Europe/Berlin, zerlegt in seine Bestandteile. */
export function jetztInBerlin(now: Date = new Date()): {
  iso: string;
  jahr: number;
  monat: number;
  tag: number;
  stunde: number;
  minute: number;
} {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZEITZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const teile = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  const jahr = Number(teile.year);
  const monat = Number(teile.month);
  const tag = Number(teile.day);
  const stunde = Number(teile.hour) % 24;
  const minute = Number(teile.minute);

  return { iso: toIso(jahr, monat, tag), jahr, monat, tag, stunde, minute };
}

/** Wochentag (0 = Sonntag) fuer ein ISO-Datum. */
export function wochentagVon(iso: string): number {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  return new Date(Date.UTC(jahr ?? 1970, (monat ?? 1) - 1, tag ?? 1)).getUTCDay();
}

/** Zeitfenster aus der Konfiguration, z. B. "08:00 – 10:00 Uhr". */
export type Zeitfenster = {
  /** Startzeit, dient als Wert im Formular. */
  start: string;
  ende: string;
  label: string;
};

export function zeitfenster(): Zeitfenster[] {
  return bookingConfig.slotStartTimes.map((start) => {
    const [stunde, minute] = start.split(':').map(Number);
    const endStunde = (stunde ?? 0) + bookingConfig.slotDurationHours;
    const ende = `${zweistellig(endStunde)}:${zweistellig(minute ?? 0)}`;
    return { start, ende, label: `${start} – ${ende} Uhr` };
  });
}

export function zeitfensterLabel(start: string): string | undefined {
  return zeitfenster().find((fenster) => fenster.start === start)?.label;
}

/** Abstand in vollen Tagen zwischen zwei ISO-Daten (b minus a). */
export function tageDazwischen(a: string, b: string): number {
  const [aj, am, at] = a.split('-').map(Number);
  const [bj, bm, bt] = b.split('-').map(Number);
  const msA = Date.UTC(aj ?? 1970, (am ?? 1) - 1, at ?? 1);
  const msB = Date.UTC(bj ?? 1970, (bm ?? 1) - 1, bt ?? 1);
  return Math.round((msB - msA) / 86_400_000);
}

/**
 * Zeitzonen-Versatz von Europe/Berlin zum angegebenen Zeitpunkt in
 * Millisekunden (Sommerzeit wird dadurch automatisch beruecksichtigt).
 */
function berlinVersatzMs(utcMs: number): number {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZEITZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const teile = Object.fromEntries(
    formatter.formatToParts(new Date(utcMs)).map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  const alsUtcGelesen = Date.UTC(
    Number(teile.year),
    Number(teile.month) - 1,
    Number(teile.day),
    Number(teile.hour) % 24,
    Number(teile.minute),
    Number(teile.second),
  );

  return alsUtcGelesen - utcMs;
}

/** Wandelt einen Berliner Zeitpunkt (Datum + "HH:MM") in einen Zeitstempel um. */
export function berlinZeitstempel(iso: string, uhrzeit: string): number {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  const [stunde, minute] = uhrzeit.split(':').map(Number);
  const naiv = Date.UTC(jahr ?? 1970, (monat ?? 1) - 1, tag ?? 1, stunde ?? 0, minute ?? 0);
  return naiv - berlinVersatzMs(naiv);
}

/**
 * Prueft, ob ein einzelnes Zeitfenster weit genug in der Zukunft liegt.
 * Damit greift die Vorlaufzeit dort, wo sie hingehoert: am konkreten Termin
 * und nicht pauschal am ganzen Tag.
 */
export function slotIstVerfuegbar(iso: string, start: string, now: Date = new Date()): boolean {
  const vorlaufMs = bookingConfig.minLeadTimeHours * 3_600_000;
  return berlinZeitstempel(iso, start) - now.getTime() >= vorlaufMs;
}

/** Alle Zeitfenster eines Tages, die noch innerhalb der Vorlaufzeit liegen. */
export function verfuegbareZeitfenster(iso: string, now: Date = new Date()): Zeitfenster[] {
  return zeitfenster().filter((fenster) => slotIstVerfuegbar(iso, fenster.start, now));
}

/**
 * Fruehestes anfragbares Datum: der erste Tag, an dem noch mindestens ein
 * Zeitfenster ausserhalb der Vorlaufzeit liegt und an dem geoeffnet ist.
 */
export function fruehesterTag(now: Date = new Date()): string {
  const heute = jetztInBerlin(now).iso;
  const maxTage = bookingConfig.maxAdvanceDays;

  for (let versatz = 0; versatz <= maxTage; versatz++) {
    const iso = isoPlusTage(heute, versatz);
    if (!(bookingConfig.openingDays as readonly number[]).includes(wochentagVon(iso))) continue;
    if ((bookingConfig.blockedDates as readonly string[]).includes(iso)) continue;
    if (verfuegbareZeitfenster(iso, now).length > 0) return iso;
  }

  return isoPlusTage(heute, 1);
}

/** Spaetester anfragbarer Tag. */
export function spaetesterTag(now: Date = new Date()): string {
  return isoPlusTage(jetztInBerlin(now).iso, bookingConfig.maxAdvanceDays);
}

export function isoPlusTage(iso: string, tage: number): string {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  const datum = new Date(Date.UTC(jahr ?? 1970, (monat ?? 1) - 1, (tag ?? 1) + tage));
  return toIso(datum.getUTCFullYear(), datum.getUTCMonth() + 1, datum.getUTCDate());
}

export type SperrGrund = 'vergangen' | 'vorlaufzeit' | 'geschlossen' | 'blockiert' | 'zuWeit';

/**
 * Prueft, ob ein Tag als Wunschtermin auswaehlbar ist.
 * Wird sowohl im Kalender als auch in der serverseitigen Validierung genutzt.
 */
export function tagStatus(iso: string, now: Date = new Date()): { auswaehlbar: boolean; grund?: SperrGrund } {
  const heute = jetztInBerlin(now).iso;

  if (tageDazwischen(heute, iso) < 0) {
    return { auswaehlbar: false, grund: 'vergangen' };
  }
  if (!(bookingConfig.openingDays as readonly number[]).includes(wochentagVon(iso))) {
    return { auswaehlbar: false, grund: 'geschlossen' };
  }
  if ((bookingConfig.blockedDates as readonly string[]).includes(iso)) {
    return { auswaehlbar: false, grund: 'blockiert' };
  }
  if (verfuegbareZeitfenster(iso, now).length === 0) {
    return { auswaehlbar: false, grund: 'vorlaufzeit' };
  }
  if (tageDazwischen(iso, spaetesterTag(now)) < 0) {
    return { auswaehlbar: false, grund: 'zuWeit' };
  }
  return { auswaehlbar: true };
}

export function istAuswaehlbar(iso: string, now: Date = new Date()): boolean {
  return tagStatus(iso, now).auswaehlbar;
}


/** Deutsches Anzeigedatum, z. B. "Montag, 14. April 2026". */
export function formatiereDatumLang(iso: string): string {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  const wochentag = wochentageLang[wochentagVon(iso)];
  return `${wochentag}, ${tag}. ${monatsnamen[(monat ?? 1) - 1]} ${jahr}`;
}

/** Kurzes Anzeigedatum, z. B. "14.04.2026". */
export function formatiereDatumKurz(iso: string): string {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  return `${zweistellig(tag ?? 1)}.${zweistellig(monat ?? 1)}.${jahr}`;
}

/**
 * Baut das Raster eines Monats – immer mit Montag als erstem Tag.
 * Leere Felder vor dem Monatsersten werden als null zurueckgegeben.
 */
export function monatsRaster(jahr: number, monat: number): (Kalendertag | null)[] {
  const ersterWochentag = new Date(Date.UTC(jahr, monat - 1, 1)).getUTCDay();
  const versatz = (ersterWochentag + 6) % 7; // Montag = 0
  const tageImMonat = new Date(Date.UTC(jahr, monat, 0)).getUTCDate();

  const felder: (Kalendertag | null)[] = Array.from({ length: versatz }, () => null);

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const iso = toIso(jahr, monat, tag);
    felder.push({ iso, tag, monat, jahr, wochentag: wochentagVon(iso) });
  }

  return felder;
}

/** Monat um einen Schritt verschieben. */
export function verschiebeMonat(jahr: number, monat: number, schritte: number): { jahr: number; monat: number } {
  const gesamt = jahr * 12 + (monat - 1) + schritte;
  return { jahr: Math.floor(gesamt / 12), monat: (gesamt % 12) + 1 };
}

/** Naechste zwölf Monate als Auswahlliste (fuer den Wunschzeitraum im Tattoo-Formular). */
export function monatsAuswahl(now: Date = new Date()): { wert: string; label: string }[] {
  const heute = jetztInBerlin(now);
  return Array.from({ length: 12 }, (_, index) => {
    const { jahr, monat } = verschiebeMonat(heute.jahr, heute.monat, index);
    return { wert: `${jahr}-${zweistellig(monat)}`, label: `${monatsnamen[monat - 1]} ${jahr}` };
  });
}
