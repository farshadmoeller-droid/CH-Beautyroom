import type { Metadata } from 'next';
import Link from 'next/link';
import GalleryGrid from '@/components/GalleryGrid';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Reveal from '@/components/Reveal';
import { galerie } from '@/content/gallery';
import { breadcrumbSchema } from '@/lib/jsonld';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Galerie – Wimpern, Lifting und Fineline-Tattoos',
  description:
    'Arbeiten aus dem CH Beautyroom in Ramsloh: Wimpernverlängerung, Lash- und Browlifting sowie feine Fineline-Tattoos. Nach Kategorie filterbar.',
  alternates: { canonical: '/galerie' },
};

export default function GaleriePage() {
  return (
    <>
      <section aria-labelledby="galerie-seite-titel" className="bg-cream pb-4 pt-32 lg:pt-40">
        <div className="container-page">
          <nav aria-label="Brotkrümelnavigation" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-ink">
              <li>
                <Link href="/" className="link-underline tap-target">
                  Startseite
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li aria-current="page">Galerie</li>
            </ol>
          </nav>

          <Reveal>
            <p className="eyebrow">Galerie</p>
            <h1 id="galerie-seite-titel" className="h-display mt-5 max-w-[16ch]">
              Arbeiten aus dem Studio
            </h1>
            <p className="measure mt-6 text-ink">
              Jedes Ergebnis hier ist auf eine bestimmte Kundin abgestimmt – auf ihre Augenform, ihren Alltag,
              ihre Geschichte. Filtere nach dem, was dich interessiert, und klick ein Bild an, um es größer zu
              sehen.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Alle Bilder" className="bg-cream pb-24 pt-12 lg:pb-32">
        <div className="container-page">
          <GalleryGrid bilder={galerie} mitFilter startAnzahl={12} />
        </div>
      </section>

      <section aria-labelledby="vergleich-titel" className="section border-t border-taupe bg-sand">
        <div className="container-page">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="eyebrow">Vorher · Nachher</p>
              <h2 id="vergleich-titel" className="h-section mt-4">
                Was ein Lashlifting verändert
              </h2>
              <p className="measure mt-5 text-ink">
                Beim Lifting kommt nichts dazu: Deine eigenen Wimpern werden aufgerichtet und in Form gelegt.
                Zieh den Regler und sieh den Unterschied.
              </p>
              <Link href="/#termin" className="btn btn-primary mt-8">
                Termin anfragen
              </Link>
            </div>
            <div className="lg:col-span-6">
              <BeforeAfterSlider />
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Startseite', pfad: '/' },
              { name: 'Galerie', pfad: '/galerie' },
            ]),
          ),
        }}
      />
    </>
  );
}
