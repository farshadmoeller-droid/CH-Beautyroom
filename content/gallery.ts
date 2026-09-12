/**
 * Galerie-Inhalte.
 *
 * Neue Bilder: Datei nach public/images/galerie/ legen und hier einen Eintrag
 * ergaenzen. Der Alt-Text beschreibt das Bild fuer Menschen, die es nicht
 * sehen koennen – bitte immer ausformulieren, nie leer lassen.
 */

export type GalerieKategorie = 'wimpern' | 'lifting' | 'fineline';

export type GalerieBild = {
  src: string;
  alt: string;
  kategorie: GalerieKategorie;
  beschreibung: string;
  /** Hochformat, Querformat oder quadratisch – steuert das Masonry-Raster. */
  format: 'hoch' | 'quer' | 'quadrat';
};

export const kategorieLabels: Record<GalerieKategorie, string> = {
  wimpern: 'Wimpern',
  lifting: 'Lifting',
  fineline: 'Fineline-Tattoo',
};

export const galerie: GalerieBild[] = [
  {
    src: '/images/galerie/wimpern-01.jpg',
    alt: 'Geschlossene Augen mit dichter, natürlich wirkender Wimpernverlängerung in 1:1-Technik',
    kategorie: 'wimpern',
    beschreibung: '1:1-Technik, Neuanlage',
    format: 'quer',
  },
  {
    src: '/images/galerie/wimpern-02.jpg',
    alt: 'Seitliche Nahaufnahme von Volumenlashes mit weichem Übergang zum äußeren Augenwinkel',
    kategorie: 'wimpern',
    beschreibung: 'Volumenlashes, Soft Cat Eye',
    format: 'hoch',
  },
  {
    src: '/images/galerie/wimpern-03.jpg',
    alt: 'Frisch aufgefüllte Wimpernverlängerung, Blick leicht nach unten gerichtet',
    kategorie: 'wimpern',
    beschreibung: 'Refill nach drei Wochen',
    format: 'quadrat',
  },
  {
    src: '/images/galerie/wimpern-04.jpg',
    alt: 'Detailaufnahme einzelner Wimpernextensions auf einer geschlossenen Augenpartie',
    kategorie: 'wimpern',
    beschreibung: 'Classic, sehr natürliches Ergebnis',
    format: 'hoch',
  },
  {
    src: '/images/galerie/wimpern-05.jpg',
    alt: 'Geöffneter Blick mit Volumenlashes, warmes Tageslicht im Studio',
    kategorie: 'wimpern',
    beschreibung: 'Volumen, offener Blick',
    format: 'quer',
  },
  {
    src: '/images/galerie/wimpern-06.jpg',
    alt: 'Wimpernverlängerung im Soft-Cat-Eye-Styling aus leichter Obersicht fotografiert',
    kategorie: 'wimpern',
    beschreibung: 'Soft Cat Eye',
    format: 'quadrat',
  },
  {
    src: '/images/galerie/lifting-01.jpg',
    alt: 'Naturwimpern nach einem Lashlifting, deutlich aufgerichtet und geschwungen',
    kategorie: 'lifting',
    beschreibung: 'Lashlifting, Korean Lifting',
    format: 'quer',
  },
  {
    src: '/images/galerie/lifting-02.jpg',
    alt: 'Augenbrauen nach einem Browlifting in gleichmäßiger, ruhiger Form',
    kategorie: 'lifting',
    beschreibung: 'Browlifting',
    format: 'hoch',
  },
  {
    src: '/images/galerie/lifting-03.jpg',
    alt: 'Seitliches Profil mit geliftteten Naturwimpern ohne Mascara',
    kategorie: 'lifting',
    beschreibung: 'Lashlifting ohne Färbung',
    format: 'quadrat',
  },
  {
    src: '/images/galerie/lifting-04.jpg',
    alt: 'Kombination aus Lashlifting und Browlifting in einer Behandlung',
    kategorie: 'lifting',
    beschreibung: 'Lash- und Browlifting kombiniert',
    format: 'hoch',
  },
  {
    src: '/images/galerie/lifting-05.jpg',
    alt: 'Nahaufnahme gefärbter und gelifteter Wimpern bei geschlossenem Auge',
    kategorie: 'lifting',
    beschreibung: 'Lifting mit Färbung',
    format: 'quer',
  },
  {
    src: '/images/galerie/fineline-01.jpg',
    alt: 'Feines Fineline-Tattoo mit floralem Zweig am Unterarm in Schwarz-Grau',
    kategorie: 'fineline',
    beschreibung: 'Florales Motiv, Unterarm',
    format: 'hoch',
  },
  {
    src: '/images/galerie/fineline-02.jpg',
    alt: 'Mandala in feiner Linienführung auf dem Unterarm, schwarz-weiß fotografiert',
    kategorie: 'fineline',
    beschreibung: 'Mandala',
    format: 'quadrat',
  },
  {
    src: '/images/galerie/fineline-03.jpg',
    alt: 'Geburtsblume als zartes Fineline-Tattoo am Schlüsselbein',
    kategorie: 'fineline',
    beschreibung: 'Geburtsblume, Schlüsselbein',
    format: 'hoch',
  },
  {
    src: '/images/galerie/fineline-04.jpg',
    alt: 'Jahreszahlen in feiner Schrift als Familien-Tattoo am Unterarm',
    kategorie: 'fineline',
    beschreibung: 'Geburtsjahre als Familien-Tattoo',
    format: 'quer',
  },
  {
    src: '/images/galerie/fineline-05.jpg',
    alt: 'Feines Lettering in Schreibschrift an der Innenseite des Oberarms',
    kategorie: 'fineline',
    beschreibung: 'Lettering',
    format: 'quadrat',
  },
  {
    src: '/images/galerie/fineline-06.jpg',
    alt: 'Kleines ornamentales Fineline-Tattoo am Handgelenk',
    kategorie: 'fineline',
    beschreibung: 'Ornament, Handgelenk',
    format: 'hoch',
  },
  {
    src: '/images/galerie/fineline-07.jpg',
    alt: 'Zarte Fingertattoos an zwei Fingern einer Hand, schwarz-weiß',
    kategorie: 'fineline',
    beschreibung: 'Fingertattoo',
    format: 'quadrat',
  },
  {
    src: '/images/galerie/fineline-08.jpg',
    alt: 'Blumen-Sleeve in feiner Linienführung über den gesamten Unterarm',
    kategorie: 'fineline',
    beschreibung: 'Blumen-Sleeve',
    format: 'hoch',
  },
  {
    src: '/images/galerie/fineline-09.jpg',
    alt: 'Zwei zusammengehörige Partner-Tattoos in feiner Linie nebeneinander',
    kategorie: 'fineline',
    beschreibung: 'Partner-Tattoos',
    format: 'quer',
  },
  {
    src: '/images/galerie/fineline-10.jpg',
    alt: 'Erweiterung eines bestehenden Tattoos durch feine florale Elemente',
    kategorie: 'fineline',
    beschreibung: 'Erweiterung eines bestehenden Tattoos',
    format: 'quadrat',
  },
  {
    src: '/images/galerie/fineline-11.jpg',
    alt: 'Lotusblüte als Fineline-Tattoo auf dem Rücken, sehr feine Linien',
    kategorie: 'fineline',
    beschreibung: 'Lotusblüte',
    format: 'hoch',
  },
  {
    src: '/images/galerie/fineline-12.jpg',
    alt: 'Feines Tattoo mit Zweig und kleinen Blättern entlang der Wirbelsäule',
    kategorie: 'fineline',
    beschreibung: 'Florales Motiv, Rücken',
    format: 'hoch',
  },
  {
    src: '/images/galerie/wimpern-07.jpg',
    alt: 'Ruhige Studioaufnahme während einer Wimpernbehandlung, Hände und Pinzetten im Bild',
    kategorie: 'wimpern',
    beschreibung: 'Während der Behandlung',
    format: 'quer',
  },
];

/** Auszug fuer die Startseite. */
export const galerieAuszug = galerie.slice(0, 8);

/** Vorher-Nachher-Vergleich fuer den Lifting-Bereich. */
export const vorherNachher = {
  vorher: {
    src: '/images/vergleich-lifting-vorher.jpg',
    alt: 'Naturwimpern vor dem Lashlifting, gerade nach unten gewachsen',
  },
  nachher: {
    src: '/images/vergleich-lifting-nachher.jpg',
    alt: 'Dieselben Wimpern nach dem Lashlifting, deutlich aufgerichtet und geschwungen',
  },
  beschreibung:
    'Dieselben Naturwimpern vor und nach einem Lashlifting. Keine Extensions, keine Mascara – nur aufgerichtet und in Form gelegt.',
};
