/**
 * Konfiguration des Buchungsmoduls.
 *
 * Die Terminanfrage ist bewusst kein verbindliches Buchungssystem: Es gibt
 * keine Verfuegbarkeitspruefung und keine Datenbank. Alle hier gesetzten
 * Werte steuern nur, welche Wunschtermine im Kalender auswaehlbar sind.
 */

export const bookingConfig = {
  /**
   * Startzeiten der Zeitfenster. Ein drittes Fenster laesst sich durch einen
   * einzigen zusaetzlichen Eintrag ergaenzen, z. B. "12:00".
   */
  slotStartTimes: ['08:00', '10:00'],

  /** Laenge eines Zeitfensters in Stunden. */
  slotDurationHours: 2,

  /** Geoeffnete Wochentage: 0 = Sonntag, 1 = Montag … 6 = Samstag. */
  openingDays: [1, 2, 3, 4, 5],

  /** Vorlaufzeit in Stunden – frueheste Anfrage ab jetzt gerechnet. */
  minLeadTimeHours: 24,

  /** Wie weit im Voraus darf angefragt werden (in Tagen). */
  maxAdvanceDays: 90,

  /** Urlaub, Feiertage und private Termine im Format "JJJJ-MM-TT". */
  blockedDates: ['2026-12-24', '2026-12-25'],
} as const;

/** Koerperstellen zur Auswahl im Tattoo-Formular. */
export const koerperstellen = [
  'Unterarm',
  'Oberarm',
  'Handgelenk',
  'Finger',
  'Hand',
  'Schluesselbein',
  'Nacken',
  'Ruecken',
  'Rippen',
  'Huefte',
  'Oberschenkel',
  'Wade',
  'Knoechel',
  'Andere Stelle – ich beschreibe sie unten',
] as const;

/** Grenzen fuer den Referenzbild-Upload im Tattoo-Formular. */
export const uploadLimits = {
  maxFiles: 3,
  maxFileSizeBytes: 5 * 1024 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  acceptAttribute: 'image/jpeg,image/png,image/webp',
} as const;
