/**
 * Strukturierte Daten für die lokale Auffindbarkeit. Alles stammt aus
 * content/site.ts – es gibt keine zweite Wahrheit.
 */

import { business, faq, leistungen, termine, seo } from '@/content/site';

const wochentag = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function studioSchema() {
  const erstes = termine.zeitfenster[0];
  const letztes = termine.zeitfenster[termine.zeitfenster.length - 1];

  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    additionalType: 'https://schema.org/TattooParlor',
    '@id': `${business.domain}/#studio`,
    name: business.name,
    description: seo.beschreibung,
    url: business.domain,
    telephone: business.telefon,
    email: business.email,
    image: `${business.domain}${seo.ogBild}`,
    priceRange: 'Preise auf Anfrage',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.strasse,
      postalCode: business.plz,
      addressLocality: `${business.gemeinde}-${business.ort}`,
      addressRegion: 'Niedersachsen',
      addressCountry: 'DE',
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: termine.arbeitstage.map((tag) => `https://schema.org/${wochentag[tag]}`),
        opens: erstes?.start ?? '08:00',
        closes: letztes?.ende ?? '12:00',
      },
    ],
    areaServed: business.einzugsgebiet.map((ort) => ({ '@type': 'City', name: ort })),
    sameAs: [business.instagramUrl],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen',
      itemListElement: leistungen.map((leistung) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: leistung.titel, description: leistung.kurz },
      })),
    },
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((eintrag) => ({
      '@type': 'Question',
      name: eintrag.frage,
      acceptedAnswer: { '@type': 'Answer', text: eintrag.antwort },
    })),
  };
}

export function breadcrumbSchema(eintraege: { name: string; pfad: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: eintraege.map((eintrag, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: eintrag.name,
      item: `${business.domain}${eintrag.pfad}`,
    })),
  };
}
