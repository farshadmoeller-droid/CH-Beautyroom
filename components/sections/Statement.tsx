'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { statement } from '@/content/site';
import { useBewegungReduziert } from '@/lib/use-reduced-motion';

/**
 * Ein Satz, durch den beim Scrollen die Einfärbung wandert.
 *
 * Einer von genau zwei Orten auf dieser Seite, an denen GSAP eingesetzt
 * wird: Der Wert hängt am Scroll-Fortschritt und muss sich beim
 * Zurückscrollen umkehren lassen. Ein CSS-Übergang kann das nicht.
 *
 * Animiert wird `color` – die einzige Stelle, an der bewusst keine
 * Transform-Eigenschaft läuft, weil sich eine Einfärbung nicht anders
 * ausdrücken lässt. Farbe kostet nur Paint, kein Layout.
 */
export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const reduziert = useBewegungReduziert();
  const [fortschritt, setFortschritt] = useState(0);

  useEffect(() => {
    // Weniger Bewegung: Der Satz steht fertig eingefärbt da.
    if (reduziert) {
      setFortschritt(1);
      return;
    }
    const element = ref.current;
    if (!element) return;

    let aufraeumen = () => {};
    let abgebrochen = false;
    (async () => {
      const { ScrollTrigger } = await import('@/lib/gsap');
      if (abgebrochen) return;
      const ausloeser = ScrollTrigger.create({
        trigger: element,
        start: 'top 72%',
        end: 'bottom 60%',
        scrub: true,
        onUpdate: (selbst) => setFortschritt(selbst.progress),
      });
      aufraeumen = () => ausloeser.kill();
    })();

    return () => {
      abgebrochen = true;
      aufraeumen();
    };
  }, [reduziert]);

  /** Ein Wort oder ein kleines rundes Bild zwischen zwei Wörtern. */
  type Baustein =
    | { art: 'bild'; src: string; alt: string; schluessel: string }
    | { art: 'text' | 'kursiv'; wort: string; schluessel: string };

  // Wortweise Schwelle: Jedes Wort bekommt seinen Punkt auf der Strecke.
  const woerter: Baustein[] = statement.teile.flatMap((teil, teilIndex): Baustein[] =>
    teil.art === 'bild'
      ? [{ art: 'bild', src: teil.src, alt: teil.alt, schluessel: `b${teilIndex}` }]
      : teil.inhalt.split(' ').map((wort, i) => ({
          art: teil.art,
          wort,
          schluessel: `${teilIndex}-${i}`,
        })),
  );
  const anzahl = woerter.length;

  return (
    <section ref={ref} className="huelle py-28 sm:py-36 lg:py-44" aria-labelledby="aussage-titel">
      <p className="label text-center">{statement.label}</p>
      <p id="aussage-titel" className="h-gross mx-auto mt-8 max-w-[22ch] text-center">
        {woerter.map((eintrag, index) => {
          if (eintrag.art === 'bild') {
            return (
              <span
                key={eintrag.schluessel}
                className="mx-2 inline-block h-[0.8em] w-[1.6em] translate-y-[0.06em] overflow-hidden rounded-full align-middle"
              >
                <Image
                  src={eintrag.src}
                  alt={eintrag.alt}
                  width={160}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </span>
            );
          }
          // Etwas Vorlauf, damit das erste Wort schon gefärbt ist, wenn
          // der Satz mittig steht.
          const schwelle = (index / anzahl) * 0.85;
          const an = fortschritt >= schwelle;
          return (
            <span
              key={eintrag.schluessel}
              className={eintrag.art === 'kursiv' ? 'italic' : undefined}
              style={{
                color: an ? 'var(--color-ink)' : 'var(--color-leise)',
                opacity: an ? 1 : 0.45,
                transition: 'color 320ms var(--ease-out), opacity 320ms var(--ease-out)',
              }}
            >
              {eintrag.wort}{' '}
            </span>
          );
        })}
      </p>
    </section>
  );
}
