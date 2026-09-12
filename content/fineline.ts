/** Inhalte des Fineline-Schwerpunktabschnitts. */

export type Motivwelt = {
  titel: string;
  beschreibung: string;
};

export const motivwelten: Motivwelt[] = [
  { titel: 'Florales', beschreibung: 'Zweige, einzelne Blüten und ganze Blumen-Sleeves in feiner Linie.' },
  { titel: 'Mandalas', beschreibung: 'Symmetrische Ornamente – Symbol für innere Ruhe und Ordnung.' },
  { titel: 'Geburtsblumen', beschreibung: 'Die Blume deines Geburtsmonats, mit ihrer eigenen Bedeutung.' },
  { titel: 'Zahlen & Daten', beschreibung: 'Geburtsjahre deiner Liebsten als stilles Familien-Tattoo.' },
  { titel: 'Lettering', beschreibung: 'Feine Schrift, ein Wort oder ein Satz, der dir gehört.' },
  { titel: 'Ornamente', beschreibung: 'Zarte geometrische und verspielte Elemente als Ergänzung.' },
  { titel: 'Finger & Handgelenk', beschreibung: 'Kleine Motive an sichtbaren, feinen Stellen.' },
  { titel: 'Erweiterungen', beschreibung: 'Bestehende Tattoos weiterdenken und zusammenführen.' },
];

export type Schritt = {
  nummer: string;
  titel: string;
  text: string;
};

export const tattooAblauf: Schritt[] = [
  {
    nummer: '01',
    titel: 'Anfrage mit Motividee',
    text: 'Du erzählst mir über das Formular, was dir vorschwebt: Motiv, Körperstelle, ungefähre Größe. Referenzbilder darfst du gern mitschicken.',
  },
  {
    nummer: '02',
    titel: 'Entwurf besprechen',
    text: 'Ich zeichne einen Entwurf, der zu deiner Körperstelle passt. Wir gehen ihn gemeinsam durch und ändern, was noch nicht stimmt.',
  },
  {
    nummer: '03',
    titel: 'Termin & Stechen',
    text: 'Vor dem Stechen klären wir alles Wichtige in einem Aufklärungsgespräch. Dann arbeiten wir in Ruhe, mit Pausen, so lange du sie brauchst.',
  },
  {
    nummer: '04',
    titel: 'Nachsorge & Kontrolle',
    text: 'Du bekommst eine klare Pflegeanleitung mit nach Hause. Nach der Abheilung schauen wir gemeinsam drauf und bessern nach, falls nötig.',
  },
];

export const vorbereitung: string[] = [
  'Komm ausgeschlafen – ein müder Körper hält den Termin schlechter durch.',
  'Iss vorher etwas Richtiges und trink ausreichend.',
  'In den 24 Stunden vor dem Termin bitte keinen Alkohol.',
  'Zieh bequeme Kleidung an, die zur Körperstelle passt und Farbe abbekommen darf.',
  'Die Haut am Termintag bitte nicht eincremen und nicht rasieren.',
  'Bring Zeit mit. Wir besprechen den Entwurf vorher in Ruhe.',
];

export const pflege: string[] = [
  'Folie oder Pflaster erst nach meiner Anweisung entfernen.',
  'Die Stelle mehrmals täglich dünn eincremen – dünn ist wichtiger als oft.',
  'Zwei bis drei Wochen kein Schwimmbad, keine Sauna, kein Solarium.',
  'Direkte Sonne in der Abheilphase meiden.',
  'Kruste und Schuppen niemals abkratzen, auch wenn es juckt.',
  'Danach dauerhaft Sonnenschutz auf der Stelle – das hält die feinen Linien klar.',
];

export const tattooHinweise: string[] = [
  'Tätowierungen ausschließlich ab 18 Jahren. Bitte bring einen gültigen Ausweis mit.',
  'Keine Tattoos während Schwangerschaft und Stillzeit.',
  'Vor jedem Termin führen wir ein Aufklärungs- und Einwilligungsgespräch.',
  'Ich verwende ausschließlich konforme, geprüfte Tätowiermittel und steriles Einwegmaterial.',
];
