/**
 * Fragen und Antworten. Werden im Accordion und im FAQPage-Schema verwendet.
 * Die Antworten sind bewusst als reiner Text gehalten, damit sie auch in den
 * strukturierten Daten sauber ausgegeben werden koennen.
 */

export type FaqEintrag = {
  frage: string;
  antwort: string;
};

export const faq: FaqEintrag[] = [
  {
    frage: 'Wie buche ich einen Termin?',
    antwort:
      'Über das Formular auf dieser Seite. Du wählst deine Behandlung, ein Wunsch-Zeitfenster und trägst deine Kontaktdaten ein. Alternativ erreichst du mich per E-Mail, telefonisch oder über Instagram. Wichtig: Deine Anfrage ist noch keine feste Buchung. Verbindlich wird der Termin erst, wenn ich ihn dir persönlich bestätigt habe.',
  },
  {
    frage: 'Wie schnell bekomme ich eine Antwort?',
    antwort:
      'In der Regel innerhalb von 24 Stunden. Da ich alle Termine selbst betreue, kann es an vollen Tagen etwas länger dauern – spätestens nach zwei Werktagen hast du eine Rückmeldung von mir. Sollte nichts angekommen sein, schreib mir gern noch einmal.',
  },
  {
    frage: 'Warum sind Termine nur vormittags möglich?',
    antwort:
      'Weil ich mein Studio zu Hause führe und die Nachmittage meiner Familie gehören. Ich arbeite von Montag bis Freitag zwischen 08:00 und 12:00 Uhr, in zwei Zeitfenstern: 08:00 bis 10:00 Uhr und 10:00 bis 12:00 Uhr. So bleibt für jede Kundin genug Zeit, ohne dass ich auf die Uhr schauen muss.',
  },
  {
    frage: 'Was kostet eine Behandlung?',
    antwort:
      'Preise nenne ich dir gern persönlich im Beratungsgespräch oder auf Anfrage. Gerade bei Tattoos hängt der Preis stark vom Motiv, der Größe und dem Aufwand ab – eine pauschale Zahl wäre unehrlich. Schreib mir einfach, was du dir vorstellst, dann bekommst du eine klare Auskunft, bevor wir einen Termin festhalten.',
  },
  {
    frage: 'Wie lange halten Wimpernverlängerung, Lashlifting und Browlifting?',
    antwort:
      'Eine Wimpernverlängerung hält je nach Wachstumszyklus etwa vier bis sechs Wochen; ein Refill alle drei bis vier Wochen hält das Bild gleichmäßig. Lashlifting und Browlifting halten in der Regel sechs bis acht Wochen, bis die behandelten Härchen nachgewachsen sind. Wie lange es bei dir genau hält, hängt von deinem Haarwachstum und der Pflege zu Hause ab.',
  },
  {
    frage: 'Was ist der Unterschied zwischen 1:1-Technik und Volumenlashes?',
    antwort:
      'Bei der 1:1-Technik, auch Classic genannt, wird auf jede Naturwimper genau eine Extension gesetzt. Das Ergebnis ist sehr natürlich und betont, was du ohnehin hast. Bei Volumenlashes wird pro Naturwimper ein feiner Fächer aus mehreren, deutlich dünneren Wimpern gesetzt. Das gibt mehr Fülle und wirkt dichter, bleibt durch das geringere Einzelgewicht aber trotzdem leicht. Was besser zu dir passt, schauen wir uns vor der Behandlung gemeinsam an.',
  },
  {
    frage: 'Wie bereite ich mich auf meinen Tattoo-Termin vor?',
    antwort:
      'Komm ausgeschlafen und iss vorher etwas Richtiges, das macht den Termin für dich deutlich angenehmer. In den 24 Stunden davor bitte keinen Alkohol. Zieh bequeme Kleidung an, die zur Körperstelle passt und die auch etwas Farbe abbekommen darf. Die Haut am Termintag bitte nicht eincremen und nicht rasieren. Und bring Zeit mit – wir gehen den Entwurf vorher in Ruhe gemeinsam durch.',
  },
  {
    frage: 'Tut ein Fineline-Tattoo weh?',
    antwort:
      'Spürbar ist es, das gehört dazu. Wie stark, ist sehr unterschiedlich und hängt von der Körperstelle und deinem persönlichen Empfinden ab. An Stellen mit wenig Gewebe – Rippen, Finger, Knöchel – ist es intensiver als am Unterarm oder Oberschenkel. Weil Fineline-Motive meist klein und die Linien fein sind, sind die Sitzungen in der Regel kurz. Wir machen jederzeit Pause, wenn du eine brauchst.',
  },
  {
    frage: 'Ab welchem Alter darf ich mich tätowieren lassen?',
    antwort:
      'Ich tätowiere ausschließlich ab 18 Jahren, ohne Ausnahme und auch nicht mit Einverständnis der Eltern. Bring bitte zum Termin einen gültigen Ausweis mit. Während Schwangerschaft und Stillzeit tätowiere ich ebenfalls nicht.',
  },
  {
    frage: 'Kann ich mein eigenes Motiv mitbringen?',
    antwort:
      'Sehr gern. Schick mir deine Idee, Skizzen oder Referenzbilder einfach über das Tattoo-Formular. Ich zeichne dann einen eigenen Entwurf, der zu deiner Körperstelle passt, und wir passen ihn gemeinsam an, bis er wirklich stimmt. Fremde Arbeiten kopiere ich nicht eins zu eins – aber als Inspiration sind Referenzen immer willkommen.',
  },
  {
    frage: 'Was passiert, wenn ich meinen Termin absagen muss?',
    antwort:
      'Das kann passieren, das ist überhaupt kein Problem. Sag mir bitte bis 24 Stunden vorher Bescheid, dann können wir den Termin kostenfrei verschieben. Bei sehr kurzfristigen Absagen oder wenn du unentschuldigt nicht erscheinst, bitte ich um Verständnis, dass ich für den nächsten Termin gegebenenfalls eine Anzahlung vereinbare – die Zeit ist für andere Kundinnen dann nämlich blockiert gewesen.',
  },
  {
    frage: 'Wo genau finde ich das Studio?',
    antwort:
      'Mein Studio liegt in 26683 Ramsloh in der Gemeinde Saterland. Weil es sich um ein privates Homestudio handelt, nenne ich dir die genaue Adresse erst mit der Terminbestätigung. Du bekommst dann auch eine kurze Wegbeschreibung und einen Hinweis, wo du parken kannst. Die vollständige Anschrift findest du außerdem jederzeit im Impressum.',
  },
];
