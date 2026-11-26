'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap, bewegungReduziert } from '@/lib/gsap';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { sendeVorauswahl } from '@/components/booking/vorauswahl';
import { leistungen } from '@/content/site';

/**
 * Leistungen als waagerecht laufende Karten.
 *
 * Auf dem Desktop wird die Sektion angeheftet und die Kartenreihe beim
 * Scrollen seitlich verschoben. Auf schmalen Geräten und bei reduzierter
 * Bewegung ist es eine ganz normale Wischleiste – das fühlt sich dort
 * ohnehin natürlicher an und kostet keine Rechenzeit.
 */
export default function Services() {
  const sektionRef = useRef<HTMLElement>(null);
  const bahnRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sektion = sektionRef.current;
    const bahn = bahnRef.current;
    if (!sektion || !bahn) return;

    // Nur auf großen Zeigegeräten anheften.
    const grossGenug = window.matchMedia('(min-width: 1024px)');
    if (!grossGenug.matches || bewegungReduziert()) return;

    const weite = () => Math.max(bahn.scrollWidth - window.innerWidth + 80, 0);

    const animation = gsap.to(bahn, {
      x: () => -weite(),
      ease: 'none',
      scrollTrigger: {
        trigger: sektion,
        start: 'top top',
        end: () => `+=${weite()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
      gsap.set(bahn, { clearProps: 'transform' });
    };
  }, []);

  return (
    <section
      ref={sektionRef}
      id="leistungen"
      aria-labelledby="leistungen-titel"
      className="relative overflow-hidden bg-blush py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="huelle">
        <p className="label">Leistungen</p>
        <h2 id="leistungen-titel" className="h-gross mt-5 max-w-[16ch]">
          Vier Dinge, <em className="italic">die ich richtig gut kann.</em>
        </h2>
        <p className="mass mt-5 text-leise-stark">
          Preise nenne ich dir gern persönlich im Beratungsgespräch oder auf Anfrage.
        </p>
      </div>

      <div className="mt-12 overflow-x-auto pb-4 ohne-leiste lg:mt-16 lg:overflow-visible lg:pb-0">
        <ul
          ref={bahnRef}
          className="flex w-max gap-5 px-5 md:px-10 lg:gap-8"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {leistungen.map((leistung, index) => (
            <li
              key={leistung.id}
              className="w-[78vw] max-w-[22rem] shrink-0 sm:w-[20rem] lg:w-[23rem]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <article className="group flex h-full flex-col">
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-creme">
                  <Image
                    src={leistung.bild}
                    alt={leistung.alt}
                    fill
                    sizes="(min-width: 1024px) 23rem, 78vw"
                    loading={index < 2 ? 'eager' : 'lazy'}
                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                      leistung.id === 'fineline-tattoo' ? 'grayscale' : ''
                    }`}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-creme/85 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ink">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="h-klein mt-6 font-serif">{leistung.titel}</h3>
                <p className="mt-2 text-sm text-akzent-text">{leistung.kurz}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-leise-stark">{leistung.text}</p>

                <ul className="mt-5 flex flex-col gap-1.5">
                  {leistung.details.map((detail) => (
                    <li key={detail} className="flex gap-2.5 text-xs text-leise-stark">
                      <span aria-hidden="true" className="mt-2 block h-px w-2.5 shrink-0 bg-akzent" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#termin"
                  onClick={() =>
                    sendeVorauswahl(
                      leistung.ueberTattooFormular
                        ? { reiter: 'tattoo' }
                        : { reiter: 'beauty', leistung: leistung.id },
                    )
                  }
                  className="mt-7 inline-flex min-h-11 items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-ink"
                >
                  Termin anfragen
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
