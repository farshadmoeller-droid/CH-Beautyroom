import Link from 'next/link';
import GalleryGrid from '@/components/GalleryGrid';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { galerie, galerieAuszug } from '@/content/gallery';

export default function GallerySection() {
  return (
    <section id="galerie" aria-labelledby="galerie-titel" className="section scroll-mt-24 bg-cream">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="galerie-titel"
            eyebrow="Galerie"
            titel="Arbeiten aus dem Studio"
            einleitung="Ein Auszug aus meiner Arbeit. Jedes Ergebnis ist auf die Kundin abgestimmt, die davor im Studio saß."
          />
          <Reveal delay={80}>
            <Link href="/galerie" className="btn btn-secondary whitespace-nowrap">
              {`Alle ${galerie.length} Bilder ansehen`}
            </Link>
          </Reveal>
        </div>

        <div className="mt-12">
          <GalleryGrid bilder={galerieAuszug} mitFilter={false} mitNachladen={false} />
        </div>

        <div className="mt-20 grid grid-cols-1 items-center gap-10 border-t border-taupe pt-16 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Vorher · Nachher</p>
            <h3 className="h-card mt-4 font-serif">Was ein Lashlifting verändert</h3>
            <p className="measure mt-4 text-ink">
              Beim Lifting kommt nichts dazu. Deine eigenen Wimpern werden aufgerichtet und in Form gelegt –
              das reicht oft schon, damit der Blick offener wirkt. Zieh den Regler und sieh selbst.
            </p>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-6">
            <BeforeAfterSlider />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
