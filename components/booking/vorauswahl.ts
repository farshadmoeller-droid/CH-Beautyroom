'use client';

/**
 * Kleine Brücke zwischen den Leistungskarten und dem Formular weiter unten:
 * Ein Klick auf „Termin anfragen“ springt zum Formular und wählt dort den
 * passenden Reiter und die passende Leistung vor.
 *
 * Ohne JavaScript bleibt der Link ein normaler Anker – die Vorauswahl
 * entfällt dann, bedienbar ist das Formular trotzdem.
 */

export const VORAUSWAHL_EVENT = 'chb:vorauswahl';

export type Vorauswahl = {
  reiter: 'beauty' | 'tattoo';
  /** ID aus content/site.ts – nur beim Beauty-Weg relevant. */
  leistung?: string;
};

export function sendeVorauswahl(auswahl: Vorauswahl) {
  window.dispatchEvent(new CustomEvent<Vorauswahl>(VORAUSWAHL_EVENT, { detail: auswahl }));
}
