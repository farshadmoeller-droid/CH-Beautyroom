/** Zentrale Navigation – wird in Header, Mobilmenue und Footer verwendet. */

export type NavEintrag = { label: string; href: string };

export const hauptnavigation: NavEintrag[] = [
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Fineline-Tattoo', href: '/#fineline' },
  { label: 'Galerie', href: '/#galerie' },
  { label: 'Über mich', href: '/#ueber-mich' },
  { label: 'Ablauf', href: '/#ablauf' },
  { label: 'Kontakt', href: '/#kontakt' },
];

export const rechtsnavigation: NavEintrag[] = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
];
