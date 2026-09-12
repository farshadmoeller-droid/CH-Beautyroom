/** Ablauf eines Termins – Zeitachse im Abschnitt "So läuft es ab". */

export type AblaufSchritt = {
  nummer: string;
  titel: string;
  text: string;
};

export const ablauf: AblaufSchritt[] = [
  {
    nummer: '01',
    titel: 'Anfrage stellen',
    text: 'Du wählst deine Behandlung und ein Wunsch-Zeitfenster oder erzählst mir von deiner Tattoo-Idee. Das dauert keine zwei Minuten.',
  },
  {
    nummer: '02',
    titel: 'Persönliche Rückmeldung',
    text: 'Ich melde mich innerhalb von 24 Stunden bei dir, bestätige den Termin verbindlich oder schlage dir eine Alternative vor. Dann bekommst du auch die genaue Adresse.',
  },
  {
    nummer: '03',
    titel: 'Behandlung im Studio',
    text: 'Du kommst an, wir besprechen in Ruhe, was du dir wünschst. Danach hast du meine volle Aufmerksamkeit – ohne Wartezimmer, ohne Zeitdruck.',
  },
  {
    nummer: '04',
    titel: 'Pflege & Folgetermin',
    text: 'Du bekommst konkrete Pflegehinweise mit. Wenn du magst, halten wir den nächsten Termin direkt fest.',
  },
];

/** Vertrauens-Merkmale im Abschnitt "Über mich". */
export const vertrauensmerkmale = [
  {
    titel: 'Hygiene & steriles Einwegmaterial',
    text: 'Sterile Einwegartikel, saubere Arbeitsflächen und klare Abläufe – bei jeder Behandlung, ohne Abkürzung.',
    icon: 'shield' as const,
  },
  {
    titel: 'Zeit für 1:1-Betreuung',
    text: 'Immer nur eine Kundin im Studio. Kein Nebenbei, keine Überschneidung, keine Laufkundschaft.',
    icon: 'clock' as const,
  },
  {
    titel: 'Geschulte Techniken & Weiterbildung',
    text: 'Alle Techniken habe ich in Schulungen gelernt und bilde mich regelmäßig weiter.',
    icon: 'sparkle' as const,
  },
];
