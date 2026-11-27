'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Enthuellen from '@/components/ui/Enthuellen';
import { ablauf } from '@/content/site';

/**
 * Drei Schritte, daneben ein Bild, das mitwechselt.
 *
 * Der Wechsel ist eine Überblendung, kein Scroll-Wert – deshalb reicht
 * ein IntersectionObserver und ein CSS-Übergang auf `opacity`. Kein GSAP.
 *
 * Die beiden Bilder liegen übereinander. Weil zwei Fotos während der
 * Überblendung kurz als zwei Dinge gelesen werden, bekommt das
 * abtretende Bild zusätzlich eine leichte Unschärfe: Dadurch
 * verschmelzen sie zu einer Bewegung statt zu einem Tausch.
 */
export default function Process() {
  const [aktiv, setAktiv] = useState(0);
  const schritteRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const elemente = schritteRef.current.filter((e): e is HTMLLIElement => e !== null);
    if (elemente.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (!eintrag.isIntersecting) continue;
          const index = elemente.indexOf(eintrag.target as HTMLLIElement);
          if (index >= 0) setAktiv(index);
        }
      },
      // Das mittlere Drittel des Fensters entscheidet, welcher Schritt gilt.
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    );

    for (const e of elemente) beobachter.observe(e);
    return () => beobachter.disconnect();
  }, []);

  return (
    <section id="ablauf" aria-labelledby="ablauf-titel" className="huelle py-28 sm:py-36">
      <Enthuellen stufe={0} weg={16}>
        <p className="label">{ablauf.label}</p>
        <h2 id="ablauf-titel" className="h-abschnitt mt-4">
          {ablauf.titel}
        </h2>
      </Enthuellen>

      <div className="mt-14 flex flex-col gap-14 lg:flex-row lg:items-start lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:w-[44%]">
          <div className="bogen relative aspect-[4/5] w-full bg-blush">
            {ablauf.schritte.map((schritt, index) => (
              <Image
                key={schritt.nummer}
                src={schritt.bild}
                alt={schritt.alt}
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
                style={{
                  opacity: index === aktiv ? 1 : 0,
                  filter: index === aktiv ? 'none' : 'blur(6px)',
                  transition:
                    'opacity 420ms var(--ease-in-out), filter 420ms var(--ease-in-out)',
                }}
                // Nur das sichtbare Bild zählt für Screenreader – sonst
                // liest man drei Bildbeschreibungen hintereinander.
                aria-hidden={index !== aktiv}
              />
            ))}
          </div>
        </div>

        <ol className="flex flex-1 flex-col gap-16 lg:gap-28 lg:py-24">
          {ablauf.schritte.map((schritt, index) => (
            <li
              key={schritt.nummer}
              ref={(el) => {
                schritteRef.current[index] = el;
              }}
              className="flex gap-6"
              style={{
                opacity: index === aktiv ? 1 : 0.45,
                transition: 'opacity 300ms var(--ease-out)',
              }}
            >
              <span aria-hidden="true" className="font-serif text-4xl leading-none text-akzent">
                {schritt.nummer}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="h-klein">{schritt.titel}</h3>
                <p className="mass text-leise">{schritt.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
