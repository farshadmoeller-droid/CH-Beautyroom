'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger, bewegungReduziert } from '@/lib/gsap';
import { statement } from '@/content/site';

/**
 * Ein langer Satz in Serif, durch den beim Scrollen die Einfärbung wandert:
 * Die Wörter wechseln nacheinander von gedämpftem Grau auf Schwarz.
 * Zwischen den Wörtern sitzen kleine runde Bilder.
 */
export default function Statement() {
  const sektionRef = useRef<HTMLElement>(null);
  const [fortschritt, setFortschritt] = useState(0);
  const [reduziert, setReduziert] = useState(false);

  /**
   * Der Satz wird in eine flache Liste zerlegt, damit jedes Wort einzeln
   * eingefärbt werden kann. Bilder zählen dabei wie ein Wort.
   */
  const bausteine = useMemo(() => {
    const liste: ({ art: 'wort'; inhalt: string; kursiv: boolean } | { art: 'bild'; src: string; alt: string })[] = [];
    for (const teil of statement.teile) {
      if (teil.art === 'bild') {
        liste.push({ art: 'bild', src: teil.src, alt: teil.alt });
      } else {
        for (const wort of teil.inhalt.split(' ')) {
          liste.push({ art: 'wort', inhalt: wort, kursiv: teil.art === 'kursiv' });
        }
      }
    }
    return liste;
  }, []);

  useEffect(() => {
    const sektion = sektionRef.current;
    if (!sektion) return;

    if (bewegungReduziert()) {
      setReduziert(true);
      setFortschritt(1);
      return;
    }

    const ausloeser = ScrollTrigger.create({
      trigger: sektion,
      start: 'top 75%',
      end: 'bottom 70%',
      onUpdate: (selbst) => setFortschritt(selbst.progress),
    });

    return () => ausloeser.kill();
  }, []);

  return (
    <section ref={sektionRef} aria-labelledby="statement-titel" className="abschnitt relative overflow-hidden bg-creme">
      <div className="huelle relative">
        <p className="label">{statement.label}</p>

        {/* Schwebende Marken – rein dekorativ. */}
        {statement.schweber.map((marke) => (
          <span
            key={marke.text}
            aria-hidden="true"
            className="pointer-events-none absolute hidden rounded-full border border-akzent-rand/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-akzent-text lg:block"
            style={{
              left: `${marke.x}%`,
              top: `${marke.y}%`,
              opacity: reduziert ? 0.9 : Math.min(1, Math.max(0, fortschritt * 2.2 - 0.2)),
              transition: 'opacity 600ms var(--ease-ruhig)',
            }}
          >
            {marke.text}
          </span>
        ))}

        <h2
          id="statement-titel"
          className="mt-10 max-w-[18ch] font-serif"
          style={{ fontSize: 'clamp(1.9rem, 5.2vw, 4.25rem)', lineHeight: 1.18 }}
        >
          {bausteine.map((baustein, index) => {
            // Jedes Wort bekommt seinen eigenen Punkt auf der Zeitachse.
            const schwelle = index / Math.max(bausteine.length - 1, 1);
            const aktiv = reduziert || fortschritt >= schwelle * 0.85;

            if (baustein.art === 'bild') {
              return (
                <span
                  key={`bild-${index}`}
                  className="relative mx-[0.18em] inline-block h-[0.85em] w-[1.5em] overflow-hidden rounded-full align-middle"
                  style={{
                    opacity: aktiv ? 1 : 0.35,
                    transition: 'opacity 500ms var(--ease-ruhig)',
                  }}
                >
                  <Image
                    src={baustein.src}
                    alt={baustein.alt}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </span>
              );
            }

            return (
              <span
                key={`wort-${index}`}
                className={baustein.kursiv ? 'italic' : undefined}
                style={{
                  color: aktiv ? 'var(--color-ink)' : 'var(--color-leise)',
                  opacity: aktiv ? 1 : 0.45,
                  transition: 'color 500ms var(--ease-ruhig), opacity 500ms var(--ease-ruhig)',
                }}
              >
                {baustein.inhalt}{' '}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
