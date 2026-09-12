/**
 * Stimmen von Kundinnen.
 *
 * TODO: Diese Texte sind Platzhalter und muessen vor dem Livegang durch echte,
 * freigegebene Kundinnenstimmen ersetzt oder entfernt werden. Erfundene
 * Bewertungen sind wettbewerbsrechtlich unzulaessig.
 */

export type Stimme = {
  zitat: string;
  name: string;
  leistung: string;
};

/** Sichtbarer Platzhalter-Hinweis ueber dem Slider. */
export const stimmenPlatzhalterHinweis =
  'Platzhalter: Diese Texte werden vor dem Livegang durch echte, freigegebene Kundinnenstimmen ersetzt.';

export const stimmen: Stimme[] = [
  {
    zitat:
      'Platzhaltertext. Hier steht später, wie sich der Termin angefühlt hat – in den eigenen Worten der Kundin.',
    name: 'Vorname',
    leistung: 'Wimpernverlängerung',
  },
  {
    zitat:
      'Platzhaltertext. Hier steht später eine echte Rückmeldung zum Lashlifting und zur Beratung vorab.',
    name: 'Vorname',
    leistung: 'Lashlifting',
  },
  {
    zitat:
      'Platzhaltertext. Hier steht später, wie der Entwurf für das Tattoo gemeinsam entstanden ist.',
    name: 'Vorname',
    leistung: 'Fineline-Tattoo',
  },
  {
    zitat:
      'Platzhaltertext. Hier steht später eine Rückmeldung zur Atmosphäre im Homestudio.',
    name: 'Vorname',
    leistung: 'Browlifting',
  },
];
