/**
 * Alle Leistungstexte an einer Stelle.
 * Aenderungen hier wirken sich auf Uebersicht, Detailabschnitte, das
 * Buchungsformular und die strukturierten Daten aus.
 */

export type ServiceId = 'wimpern' | 'lifting' | 'fineline' | 'ringana';

export type ServiceDetail = {
  label: string;
  value: string;
};

export type Service = {
  id: ServiceId;
  /** Anker fuer die Navigation, ohne Raute. */
  anchor: string;
  titel: string;
  /** Kurztext fuer die Uebersichtskarte – genau zwei Saetze. */
  kurz: string;
  /** Erzaehlender Fliesstext im Detailabschnitt. */
  text: string[];
  details: ServiceDetail[];
  /** Wichtige Hinweise vor dem Termin. */
  hinweiseVorher: string[];
  bild: string;
  bildAlt: string;
  /** Wird im Buchungsformular zur Auswahl angeboten. */
  buchbar: boolean;
};

/** Auswaehlbare Beauty-Behandlungen im Buchungsformular (ohne Tattoo). */
export type BookableTreatment = {
  id: string;
  name: string;
  dauer: string;
  bereich: ServiceId;
};

export const services: Service[] = [
  {
    id: 'wimpern',
    anchor: 'wimpernverlaengerung',
    titel: 'Wimpernverlängerung',
    kurz: 'Von der natürlichen 1:1-Technik bis zu weichen Volumenlashes – abgestimmt auf deine Augenform und deinen Alltag. Du wachst auf und bist fertig.',
    text: [
      'Bei der Wimpernverlängerung wird jede einzelne Naturwimper mit einer künstlichen Wimper verbunden. Das passiert im Liegen, mit geschlossenen Augen, in Ruhe. Viele meiner Kundinnen schlafen dabei ein – und genau so darf es sein.',
      'Vor der ersten Behandlung schauen wir uns gemeinsam deine Augenform, deinen Naturwimpernbestand und deinen Alltag an. Daraus ergibt sich, was zu dir passt: die dezente 1:1-Technik für einen sehr natürlichen Look, weiche Volumenlashes für mehr Fülle oder ein Styling wie das Soft Cat Eye, das den Blick nach außen öffnet.',
      'Ich arbeite nicht nach Schema. Was bei einer Kundin wunderschön aussieht, kann bei der nächsten zu viel sein. Deshalb nehme ich mir die Zeit, es mit dir abzustimmen, bevor die erste Wimper gesetzt wird.',
    ],
    details: [
      { label: 'Dauer Neuanlage', value: 'ca. 2 Stunden' },
      { label: 'Dauer Auffüllen', value: 'ca. 1,5 Stunden' },
      { label: 'Haltbarkeit', value: 'je nach Wachstumszyklus etwa 4 bis 6 Wochen' },
      { label: 'Refill-Intervall', value: 'alle 3 bis 4 Wochen empfehlenswert' },
      { label: 'Techniken', value: '1:1 Classic, Volumen, Styling-Varianten wie Soft Cat Eye' },
    ],
    hinweiseVorher: [
      'Bitte ungeschminkt kommen, vor allem ohne Mascara und ohne ölhaltige Augenpflege.',
      'Am Behandlungstag keine Wimpernserum-Anwendung.',
      'Kontaktlinsen bitte vorher herausnehmen – eine Brille kannst du gern mitbringen.',
      'Plane etwas Puffer ein, damit wir in Ruhe beraten können.',
    ],
    bild: '/images/leistung-wimpern.jpg',
    bildAlt: 'Nahaufnahme geschlossener Augen mit fein gesetzter Wimpernverlängerung in warmem Tageslicht',
    buchbar: true,
  },
  {
    id: 'lifting',
    anchor: 'lash-browlifting',
    titel: 'Lashlifting & Browlifting',
    kurz: 'Deine eigenen Wimpern, nur schöner geschwungen – ganz ohne Extensions. Beim Browlifting bekommen deine Brauen eine klare, gleichmäßige Form.',
    text: [
      'Das Lashlifting formt deine eigenen Wimpern. Sie werden an der Wurzel aufgerichtet und in einen weichen Schwung gelegt. Das Ergebnis wirkt, als hättest du Mascara aufgetragen – nur dass du morgens nichts tun musst.',
      'Ich arbeite mit dem sogenannten Korean Lifting. Die Produkte sind besonders schonend und enthalten Keratin, das die Wimpern stärkt und ihnen Glanz gibt. Deine Wimpern wirken danach geschwungen und optisch verlängert, über mehrere Wochen hinweg – ganz ohne Mascara und ohne Extensions.',
      'Beim Browlifting passiert dasselbe mit deinen Augenbrauen: Die Härchen werden in Form gelegt und fixiert. Gerade bei widerspenstigen oder unregelmäßig wachsenden Brauen entsteht dadurch ein ruhiges, gepflegtes Bild. Auf Wunsch färbe ich Wimpern oder Brauen im gleichen Termin.',
    ],
    details: [
      { label: 'Dauer Lashlifting', value: 'ca. 1 Stunde' },
      { label: 'Dauer Browlifting', value: 'ca. 45 Minuten' },
      { label: 'Haltbarkeit', value: 'etwa 6 bis 8 Wochen' },
      { label: 'Auffrischung', value: 'frühestens nach 8 Wochen, damit die Härchen sich erholen' },
      { label: 'Besonderheit', value: 'Korean Lifting mit keratinhaltigen, schonenden Produkten' },
    ],
    hinweiseVorher: [
      'Bitte ungeschminkt und ohne Augen-Make-up kommen.',
      'In den ersten 24 Stunden nach dem Lifting die Augenpartie trocken halten.',
      'Kein Lifting direkt vor oder nach einer Wimpernverlängerung – wir planen das zeitlich sinnvoll.',
      'Sag mir vorher Bescheid, wenn du empfindliche Augen hast oder allergisch reagierst.',
    ],
    bild: '/images/leistung-lifting.jpg',
    bildAlt: 'Ruhige Detailaufnahme einer Augenpartie nach einem Lashlifting mit geschwungenen Naturwimpern',
    buchbar: true,
  },
  {
    id: 'fineline',
    anchor: 'fineline-tattoo',
    titel: 'Fineline-Tattoo',
    kurz: 'Feine Single-Needle-Arbeiten: zarte Linien, filigrane Motive, viel Bedeutung auf wenig Fläche. Jedes Motiv entsteht im Gespräch mit dir.',
    text: [
      'Fineline bedeutet, mit einer einzelnen, sehr feinen Nadel zu arbeiten. Die Linien sind zart, die Motive filigran, das Ergebnis wirkt eher wie eine Zeichnung auf der Haut als wie ein klassisches Tattoo.',
      'Für mich ist ein Tattoo keine Ware. Fast jedes Motiv, das ich steche, hat eine Geschichte: eine Lotusblüte für Reinheit, Wachstum und Stärke. Geburtsblumen, die für die Eigenschaften eines Geburtsmonats stehen. Ein Mandala für innere Ruhe und Ordnung. Zahlen, die für Menschen stehen, die dir wichtig sind.',
      'Deshalb beginnt jedes Tattoo bei mir mit einem Gespräch, nicht mit einer Nadel. Du erzählst mir deine Idee, ich zeichne einen Entwurf, und wir passen ihn gemeinsam an, bis er stimmt. Auch bestehende Tattoos erweitere ich gern oder binde sie in ein größeres Motiv ein.',
    ],
    details: [
      { label: 'Dauer', value: 'je nach Motiv zwischen 45 Minuten und mehreren Stunden' },
      { label: 'Technik', value: 'Single Needle, feine Linienführung, Schwarz-Grau oder Farbe' },
      { label: 'Entwurf', value: 'individuell gezeichnet, gemeinsam besprochen und angepasst' },
      { label: 'Nachkontrolle', value: 'auf Wunsch nach der Abheilung, Nachstechen wenn nötig' },
      { label: 'Altersgrenze', value: 'ausschließlich ab 18 Jahren' },
    ],
    hinweiseVorher: [
      'Komm ausgeschlafen und iss vorher etwas Richtiges.',
      'In den 24 Stunden vor dem Termin bitte keinen Alkohol.',
      'Zieh bequeme Kleidung an, die zur Körperstelle passt.',
      'Die Haut am Termintag nicht eincremen und nicht rasieren.',
    ],
    bild: '/images/leistung-fineline.jpg',
    bildAlt: 'Schwarz-weiße Nahaufnahme eines feinen Fineline-Tattoos mit floralem Motiv am Unterarm',
    buchbar: false,
  },
  {
    id: 'ringana',
    anchor: 'ringana',
    titel: 'Ringana',
    kurz: 'Frische, vegane Naturkosmetik, die ich selbst seit Jahren nutze. Wenn du magst, testest du sie in Ruhe – ganz unverbindlich.',
    text: [
      'Ringana ist frische, vegane Naturkosmetik ohne synthetische Konservierungsstoffe. Ich arbeite damit, weil sie zu dem passt, was mir bei meiner Arbeit wichtig ist: wenige, klare Inhaltsstoffe und nichts, was laut sein muss.',
      'Wenn dich das interessiert, bekommst du bei mir kostenlose Produkttests zum Ausprobieren. Ab und zu gibt es außerdem einen kleinen Info-Abend im Studio. Beides ist völlig unverbindlich – du musst nichts kaufen und ich frage auch nicht nach.',
    ],
    details: [
      { label: 'Produkttests', value: 'kostenlos und unverbindlich, einfach im Termin ansprechen' },
      { label: 'Info-Abende', value: 'gelegentlich in kleiner Runde im Studio' },
      { label: 'Beratung', value: 'persönlich, ohne Verkaufsdruck' },
    ],
    hinweiseVorher: [],
    bild: '/images/leistung-ringana.jpg',
    bildAlt: 'Naturkosmetik-Flakons auf hellem Leinen neben getrockneten Gräsern',
    buchbar: false,
  },
];

/** Konkrete Behandlungen, die im Buchungsformular ausgewählt werden können. */
export const bookableTreatments: BookableTreatment[] = [
  { id: 'wimpern-neuanlage-classic', name: 'Wimpernverlängerung – Neuanlage 1:1 (Classic)', dauer: 'ca. 2 Std.', bereich: 'wimpern' },
  { id: 'wimpern-neuanlage-volumen', name: 'Wimpernverlängerung – Neuanlage Volumen', dauer: 'ca. 2 Std.', bereich: 'wimpern' },
  { id: 'wimpern-refill', name: 'Wimpernverlängerung – Auffüllen (Refill)', dauer: 'ca. 1,5 Std.', bereich: 'wimpern' },
  { id: 'wimpern-beratung', name: 'Wimpern – Beratung und Styling-Besprechung', dauer: 'ca. 30 Min.', bereich: 'wimpern' },
  { id: 'lashlifting', name: 'Lashlifting (Korean Lifting)', dauer: 'ca. 1 Std.', bereich: 'lifting' },
  { id: 'browlifting', name: 'Browlifting', dauer: 'ca. 45 Min.', bereich: 'lifting' },
  { id: 'lash-brow-kombi', name: 'Lashlifting und Browlifting kombiniert', dauer: 'ca. 1,5 Std.', bereich: 'lifting' },
  { id: 'ringana-beratung', name: 'Ringana – Produkttest und Beratung', dauer: 'ca. 30 Min.', bereich: 'ringana' },
];

export function getService(id: ServiceId): Service {
  const service = services.find((entry) => entry.id === id);
  if (!service) {
    throw new Error(`Leistung "${id}" ist in content/services.ts nicht definiert.`);
  }
  return service;
}

export function getTreatmentName(id: string): string | undefined {
  return bookableTreatments.find((treatment) => treatment.id === id)?.name;
}
