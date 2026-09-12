/**
 * Schriften werden von Next.js beim Build heruntergeladen und danach vom
 * eigenen Server ausgeliefert. Zur Laufzeit geht dadurch kein einziger
 * Request an Google – das ist die Voraussetzung dafuer, dass die Seite ohne
 * Einwilligungsbanner auskommt.
 */

import { Cormorant_Garamond, Jost } from 'next/font/google';

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
});

export const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-jost',
  fallback: ['Inter', 'system-ui', 'sans-serif'],
});
