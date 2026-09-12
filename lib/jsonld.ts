/**
 * Strukturierte Daten (JSON-LD) fuer die lokale Auffindbarkeit.
 * Wird im <head> der jeweiligen Seite als <script type="application/ld+json">
 * ausgegeben.
 */

import { siteConfig } from '@/content/site-config';
import { services } from '@/content/services';
import { faq } from '@/content/faq';
import { bookingConfig } from '@/content/booking-config';

const wochentagUri = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function studioSchema() {
  const ersteStartzeit = bookingConfig.slotStartTimes[0] ?? '08:00';
  const letzteStartzeit = bookingConfig.slotStartTimes[bookingConfig.slotStartTimes.length - 1] ?? '10:00';
  const schlusszeit = `${String(Number(letzteStartzeit.split(':')[0]) + bookingConfig.slotDurationHours).padStart(2, '0')}:00`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    additionalType: 'https://schema.org/TattooParlor',
    '@id': `${siteConfig.domain}/#studio`,
    name: siteConfig.studioName,
    description:
      'Homestudio für Wimpernverlängerung, Lash- und Browlifting sowie feine Fineline-Tattoos in 26683 Ramsloh, Gemeinde Saterland. Termine ausschließlich nach Vereinbarung, 1:1-Betreuung.',
    url: siteConfig.domain,
    telephone: siteConfig.telefon,
    email: siteConfig.email,
    image: `${siteConfig.domain}/images/og-bild.jpg`,
    logo: `${siteConfig.domain}/icon.svg`,
    priceRange: 'Preise auf Anfrage',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.strasseHausnummer,
      postalCode: '26683',
      addressLocality: 'Saterland-Ramsloh',
      addressRegion: 'Niedersachsen',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: bookingConfig.openingDays.map((tag) => `https://schema.org/${wochentagUri[tag]}`),
        opens: ersteStartzeit,
        closes: schlusszeit,
      },
    ],
    areaServed: siteConfig.einzugsgebiet.map((ort) => ({ '@type': 'City', name: ort })),
    sameAs: [siteConfig.instagramUrl],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.titel,
          description: service.kurz,
        },
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
      item: `${siteConfig.domain}${eintrag.pfad}`,
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.studioName,
    url: siteConfig.domain,
    inLanguage: 'de-DE',
  };
}
