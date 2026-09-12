/**
 * Zentrale Stammdaten der Website.
 *
 * Alle mit TODO: markierten Werte bitte einmalig hier eintragen – sie werden
 * an jeder Stelle der Website (Header, Footer, Impressum, Datenschutz,
 * strukturierte Daten, E-Mails) automatisch verwendet.
 */

export const siteConfig = {
  /** TODO: Vollstaendiger Name der Inhaberin, z. B. "Carina Hinrichs". */
  inhaberinName: 'Vorname Nachname',

  /** TODO: Strasse und Hausnummer – Pflichtangabe fuer das Impressum. */
  strasseHausnummer: 'Musterstrasse 1',

  /** TODO: PLZ und Ort – Pflichtangabe fuer das Impressum. */
  plzOrt: '26683 Ramsloh',

  /** TODO: Telefonnummer in nationaler Schreibweise, z. B. "04498 1234567". */
  telefon: '04498 000000',

  /** TODO: Telefonnummer international ohne Plus und Leerzeichen, z. B. "4915112345678". */
  whatsappNummer: '4915112345678',

  /** TODO: E-Mail-Adresse fuer Kundinnenanfragen und Impressum. */
  email: 'hallo@ch-beautyroom.de',

  /** TODO: Vollstaendige Instagram-URL. */
  instagramUrl: 'https://www.instagram.com/chbeautyroom_/',

  /** Instagram-Handle fuer die Anzeige im Text. */
  instagramHandle: '@chbeautyroom_',

  /** TODO: Domain inklusive Protokoll, ohne Schraegstrich am Ende. */
  domain: 'https://www.ch-beautyroom.de',

  /**
   * TODO: Entweder die Umsatzsteuer-Identifikationsnummer eintragen oder den
   * Kleinunternehmer-Hinweis stehen lassen.
   */
  ustIdOderKleinunternehmer:
    'Als Kleinunternehmerin im Sinne von § 19 UStG wird keine Umsatzsteuer berechnet und daher auch keine Umsatzsteuer-Identifikationsnummer gefuehrt.',

  /**
   * TODO: Zustaendige Aufsichtsbehoerde fuer die Taetowier-Taetigkeit.
   * Nur relevant, wenn beim Landkreis eine Anzeige nach § 4 IfSG vorliegt.
   */
  zustaendigesGesundheitsamt:
    'Gesundheitsamt des Landkreises Cloppenburg, Eschstrasse 29, 49661 Cloppenburg',

  /** Anzeigename des Studios. */
  studioName: 'CH Beautyroom',

  /** Ort, der oeffentlich kommuniziert wird (ohne Strasse – Homestudio). */
  ortOeffentlich: '26683 Ramsloh, Gemeinde Saterland',

  /** Geokoordinaten von Ramsloh – fuer strukturierte Daten und die Kartengrafik. */
  geo: { lat: 53.0975, lng: 7.7469 },

  /** Orte im Einzugsgebiet – erscheinen im Kontaktbereich und in den SEO-Daten. */
  einzugsgebiet: [
    'Saterland',
    'Scharrel',
    'Sedelsberg',
    'Struecklingen',
    'Barssel',
    'Friesoythe',
    'Cloppenburg',
    'Boesel',
    'Westerstede',
    'Oldenburg',
  ],

  /** Oeffnungszeiten als Klartext. Muss zu content/booking-config.ts passen. */
  oeffnungszeitenText: 'Montag bis Freitag, 08:00 – 12:00 Uhr',
  oeffnungszeitenHinweis: 'Termine ausschliesslich nach Vereinbarung.',
} as const;

/** Vorbereiteter WhatsApp-Link mit Starttext. */
export const whatsappLink = `https://wa.me/${siteConfig.whatsappNummer}?text=${encodeURIComponent(
  'Hallo, ich habe eine Frage zu einem Termin im CH Beautyroom.',
)}`;

/** E-Mail-Link mit vorbereitetem Betreff. */
export const mailtoLink = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
  'Terminanfrage CH Beautyroom',
)}`;
