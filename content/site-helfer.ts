/**
 * Kleine Hilfen rund um content/site.ts.
 *
 * Bewusst getrennt gehalten: site.ts enthält nur Daten und bleibt dadurch
 * auch ohne Programmierkenntnisse bearbeitbar.
 */

import { monatsnamen } from '@/lib/dates';

export { business, formular, leistungen, termine } from '@/content/site';

/** Wandelt "2026-10" in "Oktober 2026". */
export function monatLabelFallback(wert: string): string {
  const [jahr, monat] = wert.split('-').map(Number);
  const name = monatsnamen[(monat ?? 1) - 1];
  return name ? `${name} ${jahr}` : wert;
}
