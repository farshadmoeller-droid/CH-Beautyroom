import type { Metadata, Viewport } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { serif, sans } from '@/lib/fonts';
import { business, seo } from '@/content/site';
import { studioSchema } from '@/lib/jsonld';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(business.domain),
  title: { default: seo.titel, template: seo.titelVorlage },
  description: seo.beschreibung,
  applicationName: business.name,
  authors: [{ name: business.inhaberin }],
  creator: business.inhaberin,
  keywords: [...seo.schluesselbegriffe],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: business.domain,
    siteName: business.name,
    title: seo.titel,
    description: seo.beschreibung,
    images: [{ url: seo.ogBild, width: 1200, height: 630, alt: `${business.name} – Homestudio in Ramsloh` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.titel,
    description: seo.beschreibung,
    images: [seo.ogBild],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#F7F2EE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#inhalt" className="sprung-link">
          Zum Inhalt springen
        </a>

        <SmoothScroll />
        <Header />

        <main id="inhalt">{children}</main>

        <Footer />

        <script
          type="application/ld+json"
          // Die Daten stammen vollständig aus content/site.ts.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema()) }}
        />
      </body>
    </html>
  );
}
