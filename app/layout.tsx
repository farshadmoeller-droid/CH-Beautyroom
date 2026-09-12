import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { cormorant, jost } from '@/lib/fonts';
import { siteConfig } from '@/content/site-config';
import { studioSchema, websiteSchema } from '@/lib/jsonld';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: 'CH Beautyroom – Wimpern, Lifting & Fineline-Tattoo in Ramsloh',
    template: '%s · CH Beautyroom',
  },
  description:
    'Homestudio in 26683 Ramsloh: Wimpernverlängerung, Lashlifting, Browlifting und feine Fineline-Tattoos. Termine nach Vereinbarung, 1:1-Betreuung im Saterland.',
  applicationName: 'CH Beautyroom',
  authors: [{ name: siteConfig.inhaberinName }],
  creator: siteConfig.inhaberinName,
  keywords: [
    'Wimpernverlängerung Ramsloh',
    'Lashlifting Saterland',
    'Browlifting Friesoythe',
    'Fineline Tattoo Cloppenburg',
    'Kosmetikstudio Saterland',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: siteConfig.domain,
    siteName: 'CH Beautyroom',
    title: 'CH Beautyroom – Wimpern, Lifting & Fineline-Tattoo in Ramsloh',
    description:
      'Kleines Homestudio im Saterland für Wimpernverlängerung, Lash- und Browlifting sowie feine Fineline-Tattoos. Termine ausschließlich nach Vereinbarung.',
    images: [
      {
        url: '/images/og-bild.jpg',
        width: 1200,
        height: 630,
        alt: 'CH Beautyroom – Homestudio in 26683 Ramsloh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CH Beautyroom – Wimpern, Lifting & Fineline-Tattoo in Ramsloh',
    description:
      'Homestudio im Saterland für Wimpernverlängerung, Lifting und feine Fineline-Tattoos. Termine nach Vereinbarung.',
    images: ['/images/og-bild.jpg'],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#FAF8F4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>

        <Header />

        <main id="inhalt">{children}</main>

        <Footer />
        <FloatingActions />

        <script
          type="application/ld+json"
          // JSON-LD stammt vollstaendig aus eigenen, typisierten Inhaltsdateien.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </body>
    </html>
  );
}
