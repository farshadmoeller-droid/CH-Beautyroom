/**
 * Schriften werden beim Build heruntergeladen und danach vom eigenen Server
 * ausgeliefert. Zur Laufzeit geht kein Request an Google – das ist die
 * Voraussetzung dafür, dass die Seite ohne Einwilligungsbanner auskommt.
 */

import { Instrument_Serif, Inter } from 'next/font/google';

/** Headlines. Instrument Serif hat genau einen Schnitt – normal und kursiv. */
export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif-datei',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
});

/** Fließtext und Bedienelemente. */
export const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-sans-datei',
  fallback: ['system-ui', 'sans-serif'],
});
