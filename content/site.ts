/**
 * ════════════════════════════════════════════════════════════════════════
 *  CH BEAUTYROOM – ALLE INHALTE AN EINER STELLE
 * ════════════════════════════════════════════════════════════════════════
 *
 * Diese Datei ist die einzige, die du anfassen musst, um Texte, Bilder,
 * Zeiten oder Kontaktdaten zu ändern. Es steckt kein Layout darin – nur
 * Daten. Alles, was noch von dir kommen muss, ist mit TODO markiert.
 *
 * Nach einer Änderung: Datei speichern, Browser neu laden. Fertig.
 */

/* ───────────────────────────────────────────── 1 · Stammdaten des Studios */

export const business = {
  name: 'CH Beautyroom',

  /** Steht so auf dem Logo und damit auch im Impressum. */
  inhaberin: 'Carina Hinrichs',

  /** TODO: Straße und Hausnummer – Pflichtangabe im Impressum. */
  strasse: 'Straße Hausnummer',
  plz: '26683',
  ort: 'Ramsloh',
  gemeinde: 'Saterland',
  land: 'Deutschland',

  /** TODO: Telefonnummer in nationaler Schreibweise, z. B. "04498 1234567". */
  telefon: '04498 000000',

  /** TODO: Dieselbe Nummer international, ohne Plus und Leerzeichen. */
  whatsapp: '4915112345678',

  /** TODO: E-Mail-Adresse für Anfragen – steht öffentlich im Impressum. */
  email: 'hallo@ch-beautyroom.de',

  /**
   * Freigestelltes Logo. Dunkel für helle Flächen, hell für dunkle.
   *
   * `logo` ist die ganze Wortmarke mit Namenszeile – die steht in der
   * Fußzeile, wo sie groß genug ist. Oben in der Kopfzeile steht nur
   * `logoMarke`, das Monogramm: Bei 34 Pixel Höhe wäre die Zeile
   * „Carina Hinrichs" nicht mehr lesbar.
   */
  logo: '/logo.png',
  logoHell: '/logo-hell.png',
  logoMarke: '/logo-mark.png',
  logoMarkeHell: '/logo-mark-hell.png',

  instagramHandle: '@chbeautyroom_',
  instagramUrl: 'https://instagram.com/chbeautyroom_',

  /** TODO: Endgültige Domain mit https, ohne Schrägstrich am Ende. */
  domain: 'https://www.ch-beautyroom.de',

  /** TODO: Umsatzsteuer-ID – oder diesen Kleinunternehmer-Hinweis stehen lassen. */
  umsatzsteuer:
    'Als Kleinunternehmerin im Sinne von § 19 UStG wird keine Umsatzsteuer berechnet und daher auch keine Umsatzsteuer-Identifikationsnummer geführt.',

  /** TODO: Nur nötig, wenn fürs Tätowieren eine Anzeige beim Landkreis vorliegt. */
  aufsichtsbehoerde:
    'Gesundheitsamt des Landkreises Cloppenburg, Eschstraße 29, 49661 Cloppenburg',

  /** Nur Frauen – steht an mehreren Stellen sichtbar auf der Seite. */
  nurFuerFrauen: true,

  /**
   * Kurzer Hinweis unter der Marke. Steht in der Fußzeile und im Menü
   * auf dem Telefon – deshalb hier und nicht zweimal im Markup.
   */
  kurzsatz: 'Termine nach Vereinbarung, immer vormittags und ausschließlich für Frauen.',

  geo: { lat: 53.0975, lng: 7.7469 },

  einzugsgebiet: [
    'Saterland',
    'Scharrel',
    'Sedelsberg',
    'Strücklingen',
    'Barßel',
    'Friesoythe',
    'Cloppenburg',
    'Bösel',
    'Westerstede',
    'Oldenburg',
  ],
} as const;

/* ──────────────────────────────────────────── 2 · Termine und Zeitfenster */

export const termine = {
  /** Arbeitstage: 0 = Sonntag, 1 = Montag … 6 = Samstag. TODO prüfen. */
  arbeitstage: [1, 2, 3, 4, 5],

  /** Zwei Fenster am Vormittag. Ein drittes ergänzt du mit einem Eintrag. */
  zeitfenster: [
    { id: '08-10', label: '08:00 – 10:00 Uhr', start: '08:00', ende: '10:00' },
    { id: '10-12', label: '10:00 – 12:00 Uhr', start: '10:00', ende: '12:00' },
  ],

  /** Frühestens in so vielen Stunden. */
  vorlaufStunden: 24,

  /** Höchstens so viele Tage im Voraus. */
  maxVorausTage: 90,

  /** Urlaub, Feiertage, private Termine – Format "JJJJ-MM-TT". TODO pflegen. */
  gesperrteTage: ['2026-12-24', '2026-12-25', '2026-12-31'],

  /** TODO: Innerhalb welcher Zeit meldest du dich zurück? */
  antwortzeit: '24 bis 48 Stunden',

  oeffnungszeitenText: 'Montag bis Freitag, 08:00 – 12:00 Uhr',
  hinweis: 'Termine ausschließlich nach Vereinbarung. Nachmittags arbeite ich nicht.',
} as const;

/* ───────────────────────────────────────────────── 3 · Hero-Bildsequenz */

/**
 * Der Hero zeichnet eine Bildfolge auf ein <canvas> und steuert sie über
 * die Scroll-Position – wie die Produktseiten von Apple. Wie du die Frames
 * aus einem Handyvideo erzeugst, steht in der README.
 */
export const hero = {
  sequenz: {
    /** Ordner und Namensschema der Frames. {i} wird vierstellig ersetzt. */
    pfad: '/sequence/frame_{i}.webp',
    pfadMobil: '/sequence-mobile/frame_{i}.webp',

    /**
     * Anzahl der Frames.
     *
     * 0 bedeutet: keine Sequenz – der Hero zeigt dann das Standbild aus
     * `fallbackBild` mit sanftem Parallax. Sobald du aus deinem Video
     * Frames erzeugt hast (siehe README), trägst du hier ihre Anzahl ein,
     * und die Scroll-Sequenz läuft.
     */
    anzahl: 0,

    /** Auf Mobilgeräten nur jedes n-te Frame laden. */
    mobilSchrittweite: 2,

    /** Seitenverhältnis der Frames (Breite / Höhe). */
    seitenverhaeltnis: 1440 / 1800,
  },

  /** Wird gezeigt, wenn keine Sequenz da ist oder Bewegung reduziert wird. */
  fallbackBild: '/hero-fallback.webp',
  fallbackAlt:
    'Carina, Inhaberin des CH Beautyroom, sitzt in hellem Blazer auf einem Hocker im Studio, neben ihr Pampasgras in einer Korbvase',

  /**
   * Bildausschnitt des Standbilds (CSS object-position).
   *
   * Das Foto ist hochkant, der Hero auf dem Desktop quer – ohne Angabe
   * würde mittig beschnitten und das Gesicht verschwinden. Der zweite Wert
   * ist die senkrechte Verankerung: kleiner = weiter oben.
   */
  bildAusschnitt: 'center 6%',

  /** Wie lang die angeheftete Sektion scrollt – in Bildschirmhöhen. */
  scrollLaenge: 3.5,

  eyebrow: 'Lash · Brow · Fineline',

  /** Die Headline blendet Wort für Wort ein. */
  headline: ['Deine', 'Wimpern,', 'endlich'],
  /** Dieses Wort steht groß und kursiv unten rechts. */
  schlusswort: 'perfekt.',

  unterzeile:
    'Homestudio in Ramsloh. Nur für Frauen, immer eine Kundin, immer vormittags.',

  /**
   * Fokus-Ringe, die über das Porträt wandern.
   *
   * ANPASSEN: `bei` ist der Scroll-Fortschritt (0 = Anfang, 1 = Ende) der
   * angehefteten Sektion. `x` und `y` sind Prozentwerte im Bild, von links
   * oben gemessen. `r` ist der Radius in Prozent der Bildbreite. Probier die
   * Werte im Browser aus – die Ringe folgen sofort beim Speichern.
   */
  fokusRinge: [
    { id: 'wimpern', label: 'Wimpern', bei: 0.22, bis: 0.46, x: 62, y: 33, r: 9 },
    { id: 'brauen', label: 'Brauen', bei: 0.40, bis: 0.64, x: 70, y: 24, r: 10 },
    { id: 'natuerlich', label: 'Natürlich', bei: 0.58, bis: 0.84, x: 66, y: 38, r: 16 },
  ],

  /** Glas-Karte rechts. Die Zahlen zählen beim Erscheinen hoch. */
  kennzahlen: {
    titel: 'Im Studio',
    /** Ab diesem Fortschritt schwebt die Karte ein. */
    bei: 0.3,
    werte: [
      /** TODO: Jahre anpassen. */
      { label: 'Erfahrung', wert: 6, suffix: ' Jahre' },
      /** TODO: Zahl anpassen oder Zeile löschen. */
      { label: 'Zufriedene Kundinnen', wert: 400, suffix: '+' },
      { label: 'Haltbarkeit Lifting', wert: 8, prefix: 'bis zu ', suffix: ' Wochen' },
    ],
  },

  scrollHinweis: 'Scrollen',
} as const;

/* ──────────────────────────────────────── 4 · Statement mit Inline-Bildern */

/**
 * Ein langer Satz in Serif, durch den beim Scrollen die Einfärbung wandert.
 * Zwischen den Wörtern sitzen kleine runde Bilder.
 */
export const statement = {
  label: 'Mein Anspruch',
  /** Bausteine des Satzes – in dieser Reihenfolge gesetzt. */
  teile: [
    { art: 'text', inhalt: 'Ich betone deine' },
    { art: 'bild', src: '/statement/pille-1.webp', alt: 'Nahaufnahme einer Wimpernverlängerung' },
    { art: 'kursiv', inhalt: 'natürliche' },
    { art: 'text', inhalt: 'Schönheit – sanft, präzise und mit' },
    { art: 'bild', src: '/statement/pille-2.webp', alt: 'Nahaufnahme eines Fineline-Schriftzugs auf der Haut' },
    { art: 'text', inhalt: 'viel Liebe zum' },
    { art: 'kursiv', inhalt: 'Detail.' },
  ],
  /** Kleine Marken, die um den Satz herum schweben. */
  schweber: [
    { text: 'Natürlich', x: 8, y: 14 },
    { text: 'Strahlend', x: 78, y: 30 },
    { text: 'Selbstbewusst', x: 18, y: 84 },
  ],
} as const;

/* ─────────────────────────────────────────────────────── 5 · Leistungen */

export type Leistung = {
  id: string;
  titel: string;
  kurz: string;
  text: string;
  details: string[];
  bild: string;
  alt: string;
  /** Erscheint im Dropdown des Beauty-Formulars. */
  imFormular: boolean;
  /** true schickt zum Tattoo-Formular statt zum Kalender. */
  ueberTattooFormular?: boolean;
};

export const leistungen: Leistung[] = [
  {
    id: 'wimpernverlaengerung',
    titel: 'Wimpernverlängerung',
    kurz: '1:1-Technik, Volumen und Auffüllen',
    text: 'Jede Naturwimper bekommt ihre eigene Extension – oder einen feinen Fächer, wenn du mehr Fülle möchtest. Was zu dir passt, schauen wir uns vorher gemeinsam an, statt es nach Schema zu setzen.',
    details: [
      'Neuanlage 1:1 für ein sehr natürliches Ergebnis',
      'Volumenlashes für mehr Fülle, trotzdem leicht',
      'Auffüllen alle drei bis vier Wochen',
      'Haltbarkeit je nach Wachstumszyklus vier bis sechs Wochen',
    ],
    bild: '/services/wimpern.webp',
    alt: 'Auge mit fein gesetzter Wimpernverlängerung, dichter Kranz',
    imFormular: true,
  },
  {
    id: 'lash-lifting',
    titel: 'Lash Lifting',
    kurz: 'Deine eigenen Wimpern, nur schöner geschwungen',
    text: 'Beim Lifting kommt nichts dazu. Deine Naturwimpern werden an der Wurzel aufgerichtet und in Form gelegt – das reicht oft schon, damit der Blick offener wirkt. Keine Extensions, keine Mascara.',
    details: [
      'Schonende, keratinhaltige Produkte',
      'Auf Wunsch mit Färbung im selben Termin',
      'Hält etwa sechs bis acht Wochen',
      'Dauer rund eine Stunde',
    ],
    bild: '/services/lash-lifting.webp',
    alt: 'Augenpartie nach einem Lash Lifting, Naturwimpern deutlich aufgerichtet',
    imFormular: true,
  },
  {
    id: 'brow-lifting',
    titel: 'Brow Lifting',
    kurz: 'Eine ruhige, gleichmäßige Form für deine Brauen',
    text: 'Widerspenstige oder unregelmäßig wachsende Härchen werden in Form gelegt und fixiert. Dadurch wirkt die Braue voller und sortierter, ohne dass etwas gezupft oder gezeichnet werden muss.',
    details: [
      'Härchen werden gerichtet und fixiert',
      'Auf Wunsch mit Färbung und Korrektur der Form',
      'Hält etwa sechs bis acht Wochen',
      'Dauer rund 45 Minuten',
    ],
    bild: '/services/brow-lifting.webp',
    alt: 'Beide Brauen nach einem Brow Lifting, Härchen gleichmäßig gerichtet',
    imFormular: true,
  },
  {
    id: 'fineline-tattoo',
    titel: 'Fineline-Tattoo',
    kurz: 'Feine Einzelnadel-Arbeiten, nur für Frauen',
    text: 'Zarte Linien, filigrane Motive, viel Bedeutung auf wenig Fläche. Jedes Tattoo beginnt mit einem Gespräch und einem Entwurf, nicht mit der Nadel. Termine vereinbaren wir über das eigene Tattoo-Formular.',
    details: [
      'Florales, Mandalas, Geburtsblumen, Lettering, Ornamente',
      'Erweiterung bestehender Tattoos möglich',
      'Entwurf wird vorab gemeinsam besprochen',
      'Ausschließlich ab 18 Jahren',
    ],
    bild: '/services/fineline.webp',
    alt: 'Feiner Schriftzug als Fineline-Tattoo, längs über den Unterarm gesetzt',
    imFormular: false,
    ueberTattooFormular: true,
  },
];

/* ─────────────────────────────────────────────────── 6 · So arbeite ich */

export const ablauf = {
  label: 'So arbeite ich',
  titel: 'Drei Schritte, kein Durchlauf',
  /*
   *  Ohne Bilder. Für Beratung, Behandlung und Pflege gibt es keine
   *  echten Fotos, und ein Homestudio inszeniert sein Beratungsgespräch
   *  nicht. Der Abschnitt steht deshalb rein typografisch.
   */
  schritte: [
    {
      nummer: '01',
      titel: 'Beratung',
      text: 'Wir schauen uns deine Augenform, deinen Naturbestand und deinen Alltag an. Daraus ergibt sich, was zu dir passt – manchmal auch, dass weniger besser ist.',
    },
    {
      nummer: '02',
      titel: 'Behandlung',
      text: 'Du liegst, ich arbeite. Immer nur eine Kundin im Studio, keine Tür, die nebenbei aufgeht. Viele schlafen dabei ein – genau so darf es sein.',
    },
    {
      nummer: '03',
      titel: 'Pflege',
      text: 'Du bekommst konkrete Hinweise mit, damit das Ergebnis lange hält. Und wenn etwas unklar ist, schreibst du mir einfach.',
    },
  ],
} as const;

/* ────────────────────────────────────────────────────────── 7 · Galerie */

export type GalerieKategorie = 'wimpern' | 'lifting' | 'fineline';

export type GalerieBild = {
  src: string;
  alt: string;
  kategorie: GalerieKategorie;
  /** Steuert die Höhe im Mauerwerk-Raster. */
  format: 'hoch' | 'quer' | 'quadrat';
  /** Wenn gesetzt, gibt es zu diesem Bild einen Vorher-Nachher-Regler. */
  vorher?: string;
  vorherAlt?: string;
};

export const galerieKategorien: { id: 'alle' | GalerieKategorie; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'wimpern', label: 'Wimpern' },
  { id: 'lifting', label: 'Lifting' },
  { id: 'fineline', label: 'Fineline' },
];

export const galerie: GalerieBild[] = [
  /*
   *  Echte Arbeiten aus dem Studio. Die Beschreibungen nennen die
   *  Behandlung, nie eine Person – auf den Fotos sind Kundinnen zu sehen.
   */
  {
    src: '/gallery/wimpern-01.webp',
    alt: 'Auge mit Wimpernverlängerung, dichter Kranz mit weichem Übergang nach außen',
    kategorie: 'wimpern',
    format: 'quer',
    vorher: '/gallery/wimpern-01-vorher.webp',
    vorherAlt: 'Dieselbe Augenpartie vor der Behandlung, Naturwimpern ohne Extensions',
  },
  {
    src: '/gallery/wimpern-02.webp',
    alt: 'Wimpernverlängerung im Profil, Blick nach oben',
    kategorie: 'wimpern',
    format: 'hoch',
  },
  {
    src: '/gallery/lifting-01.webp',
    alt: 'Augenpartie nach Lash und Brow Lifting, Wimpern aufgerichtet, Braue in Form gelegt',
    kategorie: 'lifting',
    format: 'hoch',
  },
  {
    src: '/gallery/lifting-02.webp',
    alt: 'Beide Augen nach Lash und Brow Lifting, offener Blick',
    kategorie: 'lifting',
    format: 'quer',
  },
  {
    src: '/gallery/lifting-03.webp',
    alt: 'Brauen nach dem Lifting in gleichmäßiger Form, Härchen gerichtet',
    kategorie: 'lifting',
    format: 'hoch',
  },
  {
    src: '/gallery/lifting-04.webp',
    alt: 'Nahaufnahme einer gelifteten Braue mit aufgerichteten Naturwimpern',
    kategorie: 'lifting',
    format: 'quadrat',
  },

  /*
   *  Fineline-Arbeiten. Warmes Schwarzweiß, damit die feine Linie gegen
   *  die Haut steht – bei drei der fünf Vorlagen war das ohnehin so.
   *
   *  Die Beschreibungen nennen bewusst keine Namen, Initialen oder Daten,
   *  obwohl sie auf den Fotos zu sehen sind. Was im Alt-Text steht, ist
   *  maschinenlesbar und wird durchsuchbar – das sind Angaben über
   *  Menschen, die nie gefragt wurden.
   */
  {
    src: '/gallery/fineline-01.webp',
    alt: 'Zwei Vornamen in feiner Schreibschrift, verbunden durch ein kleines Herz, auf dem Unterarm',
    kategorie: 'fineline',
    format: 'quer',
  },
  {
    src: '/gallery/fineline-02.webp',
    alt: 'Englischer Schriftzug in feiner Schreibschrift, längs über den Unterarm gesetzt',
    kategorie: 'fineline',
    format: 'hoch',
  },
  {
    src: '/gallery/fineline-03.webp',
    alt: 'Kurzer Schriftzug längs am Handgelenk, feine Schreibschrift',
    kategorie: 'fineline',
    format: 'hoch',
  },
  {
    src: '/gallery/fineline-04.webp',
    alt: 'Vier Zahlenpaare in feiner Serifenschrift auf dem Unterarm',
    kategorie: 'fineline',
    format: 'quer',
  },
  {
    src: '/gallery/fineline-05.webp',
    alt: 'Zwei Initialen mit kleinen Herzen, senkrecht untereinander am Unterarm',
    kategorie: 'fineline',
    format: 'quadrat',
  },
];

/* ──────────────────────────────────────────────────────── 8 · Über mich */

export const ueberMich = {
  label: 'Über mich',
  titel: 'Schön, dass du da bist',
  portrait: '/about/portrait.webp',
  portraitAlt: 'Carina, Inhaberin des CH Beautyroom, in hellem Blazer vor einer weißen Wand',
  /** TODO: Carinas eigene Worte, zwei bis vier Sätze. */
  absaetze: [
    'Ich bin Carina und führe den CH Beautyroom als mein eigenes kleines Studio – zu Hause, in Ramsloh. Angefangen hat alles mit Wimpern, dazu kamen Lifting und schließlich das Tätowieren.',
    'Ein Homestudio war für mich die richtige Entscheidung: keine Laufkundschaft, kein Wartebereich, keine Tür, die nebenbei aufgeht. Du kommst an, wir haben Zeit, und du bist die Einzige hier.',
    'Mir ist wichtig, dass du kein Ergebnis mitnimmst, das gerade in Mode ist, sondern eines, das zu deinem Gesicht und deinem Alltag passt. Dafür frage ich lieber einmal mehr nach, bevor wir anfangen.',
  ],
  zitat: 'Ein Termin bei mir ist kein Durchlauf. Wir nehmen uns Zeit – für dein Motiv, für deine Wimpern, für ein Ergebnis, das zu dir passt.',
  merkmale: [
    { titel: 'Hygiene', text: 'Steriles Einwegmaterial und klare Abläufe, bei jeder Behandlung.' },
    { titel: 'Zeit', text: 'Immer nur eine Kundin. Kein Nebenbei, keine Überschneidung.' },
    { titel: 'Weiterbildung', text: 'Alle Techniken geschult, regelmäßig aufgefrischt.' },
  ],
} as const;

/* ─────────────────────────────────────────────────────── 9 · Instagram */

export const instagram = {
  label: 'Instagram',
  titel: 'Aktuelles aus dem Studio',
  text: 'Neue Arbeiten, freie Termine und kleine Einblicke zeige ich dort zuerst.',
  /** Statische Bilder – es wird keine Instagram-Schnittstelle angebunden. */
  bilder: [
    { src: '/instagram/01.webp', alt: 'Instagram-Beitrag: Lash und Brow Lifting' },
    { src: '/instagram/02.webp', alt: 'Instagram-Beitrag: Wimpernverlängerung' },
    { src: '/instagram/03.webp', alt: 'Instagram-Beitrag: offener Blick nach dem Lifting' },
    { src: '/instagram/04.webp', alt: 'Instagram-Beitrag: Brauen nach dem Lifting' },
    { src: '/instagram/05.webp', alt: 'Instagram-Beitrag: Wimpern im Profil' },
    { src: '/instagram/06.webp', alt: 'Instagram-Beitrag: Nahaufnahme einer gelifteten Braue' },
  ],
} as const;

/* ─────────────────────────────────────────────────────── 10 · Formulare */

export const formular = {
  koerperstellen: [
    'Unterarm',
    'Oberarm',
    'Handgelenk',
    'Finger',
    'Hand',
    'Schlüsselbein',
    'Nacken',
    'Rücken',
    'Rippen',
    'Hüfte',
    'Oberschenkel',
    'Wade',
    'Knöchel',
    'Andere Stelle – ich beschreibe sie unten',
  ],
  groessen: ['bis 5 cm', '5 – 10 cm', '10 – 15 cm', 'größer als 15 cm', 'noch unklar'],
  upload: {
    maxDateien: 3,
    maxBytes: 5 * 1024 * 1024,
    typen: ['image/jpeg', 'image/png', 'image/webp'],
    accept: 'image/jpeg,image/png,image/webp',
  },
  hinweis: `Das ist eine Anfrage, keine feste Buchung. Ich melde mich innerhalb von ${termine.antwortzeit} mit einer verbindlichen Bestätigung.`,
} as const;

/* ────────────────────────────────────────────────────────────── 11 · FAQ */

export const faq = [
  {
    frage: 'Wie bereite ich mich auf meinen Termin vor?',
    antwort:
      'Komm bitte ungeschminkt, vor allem ohne Mascara und ohne ölhaltige Augenpflege. Kontaktlinsen nimmst du besser vorher heraus. Vor einem Tattoo-Termin gilt zusätzlich: ausgeschlafen kommen, vorher etwas essen, 24 Stunden vorher keinen Alkohol und die Haut am Termintag nicht eincremen oder rasieren.',
  },
  {
    frage: 'Wie lange hält das Ergebnis?',
    antwort:
      'Eine Wimpernverlängerung hält je nach Wachstumszyklus etwa vier bis sechs Wochen, ein Refill alle drei bis vier Wochen hält das Bild gleichmäßig. Lash Lifting und Brow Lifting halten in der Regel sechs bis acht Wochen, bis die behandelten Härchen nachgewachsen sind.',
  },
  {
    frage: 'Wie pflege ich das Ergebnis zu Hause?',
    antwort:
      'In den ersten 24 Stunden die Augenpartie trocken halten und auf Sauna, Dampf und Solarium verzichten. Danach gilt vor allem: keine ölhaltigen Produkte an den Wimpern und nicht reiben. Für Tattoos bekommst du eine eigene Anleitung mit – dünn eincremen, zwei bis drei Wochen kein Schwimmbad, Kruste nicht abkratzen und später konsequent Sonnenschutz.',
  },
  {
    frage: 'Was gilt, wenn ich absagen muss?',
    antwort:
      'Sag mir bitte bis 24 Stunden vorher Bescheid, dann verschieben wir den Termin kostenfrei. Bei sehr kurzfristigen Absagen oder wenn du unentschuldigt nicht erscheinst, bitte ich um Verständnis, dass ich für den nächsten Termin gegebenenfalls eine Anzahlung vereinbare – die Zeit war dann für andere Kundinnen blockiert.',
  },
  {
    frage: 'Ab welchem Alter darf ich mich tätowieren lassen?',
    antwort:
      'Ausschließlich ab 18 Jahren, ohne Ausnahme und auch nicht mit Einverständnis der Eltern. Bring bitte einen gültigen Ausweis mit. Während Schwangerschaft und Stillzeit tätowiere ich nicht.',
  },
  {
    frage: 'Warum sind Termine nur vormittags möglich?',
    antwort:
      'Weil ich mein Studio zu Hause führe und die Nachmittage meiner Familie gehören. Ich arbeite Montag bis Freitag zwischen 08:00 und 12:00 Uhr, in zwei Zeitfenstern. So bleibt für jede Kundin genug Zeit, ohne dass ich auf die Uhr schauen muss.',
  },
  {
    frage: 'Was kostet eine Behandlung?',
    antwort:
      'Preise nenne ich dir gern persönlich im Beratungsgespräch oder auf Anfrage. Gerade bei Tattoos hängt der Preis stark vom Motiv, der Größe und dem Aufwand ab – eine pauschale Zahl wäre unehrlich.',
  },
  {
    frage: 'Wo genau finde ich das Studio?',
    antwort:
      'Mein Studio liegt in 26683 Ramsloh in der Gemeinde Saterland. Weil es sich um ein privates Homestudio handelt, bekommst du die genaue Adresse und eine kurze Wegbeschreibung mit der Terminbestätigung. Die vollständige Anschrift findest du jederzeit im Impressum.',
  },
] as const;

/* ──────────────────────────────────────────────────── 12 · Navigation */

export const navigation = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Über mich', href: '#ueber-mich' },
  { label: 'Termin', href: '#termin' },
] as const;

/* ───────────────────────────────────────────────────────────── 13 · SEO */

export const seo = {
  titel: 'CH Beautyroom – Wimpernverlängerung & Fineline-Tattoo in Ramsloh',
  titelVorlage: '%s · CH Beautyroom',
  beschreibung:
    'Homestudio in 26683 Ramsloh: Wimpernverlängerung, Lash Lifting, Brow Lifting und feine Fineline-Tattoos. Nur für Frauen, Termine nach Vereinbarung im Saterland.',
  schluesselbegriffe: [
    'Wimpernverlängerung Ramsloh',
    'Lash Lifting Saterland',
    'Brow Lifting Friesoythe',
    'Fineline Tattoo Cloppenburg',
    'Kosmetikstudio Saterland',
  ],
  ogBild: '/og-bild.jpg',
} as const;
