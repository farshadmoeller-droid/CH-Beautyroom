import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { ArrowRightIcon } from '@/components/Icons';
import { services } from '@/content/services';
import { blurDataURL } from '@/lib/blur';

export default function ServicesOverview() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="section bg-cream">
      <div className="container-page">
        <SectionHeading
          id="leistungen-titel"
          eyebrow="Leistungen"
          titel="Vier Bereiche, ein Anspruch"
          einleitung="Ein Termin bei mir ist kein Durchlauf. Wir nehmen uns Zeit — für dein Motiv, für deine Wimpern, für ein Ergebnis, das zu dir passt."
        />

        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.id}>
              <Reveal delay={index * 60} className="group h-full">
                <Link
                  href={`/#${service.anchor}`}
                  className="flex h-full flex-col transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <Image
                      src={service.bild}
                      alt={service.bildAlt}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <h3 className="h-card mt-6">{service.titel}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink">{service.kurz}</p>

                  <span className="mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-espresso">
                    Mehr erfahren
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
