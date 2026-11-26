'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, bewegungReduziert } from '@/lib/gsap';
import { ablauf } from '@/content/site';

/**
 * „So arbeite ich“ – drei Schritte.
 *
 * Links eine senkrechte Linie, die sich beim Scrollen füllt; rechts ein
 * Bild in Bogenform, das pro Schritt überblendet. Der jeweils aktive
 * Schritt steht in voller Farbe, die anderen treten zurück.
 */
export default function Process() {
  const sektionRef = useRef<HTMLElement>(null);
  const [fortschritt, setFortschritt] = useState(0);
  const [reduziert, setReduziert] = useState(false);

  useEffect(() => {
    const sektion = sektionRef.current;
    if (!sektion) return;

    if (bewegungReduziert()) {
      setReduziert(true);
      return;
    }

    const ausloeser = ScrollTrigger.create({
      trigger: sektion,
      start: 'top 65%',
      end: 'bottom 85%',
      onUpdate: (selbst) => setFortschritt(selbst.progress),
    });

    return () => ausloeser.kill();
  }, []);

  const anzahl = ablauf.schritte.length;
  // Aktiver Schritt aus dem Fortschritt ableiten.
  const aktiv = reduziert ? -1 : Math.min(Math.floor(fortschritt * anzahl), anzahl - 1);

  return (
    <section ref={sektionRef} id="ablauf" aria-labelledby="ablauf-titel" className="abschnitt bg-creme">
      <div className="huelle">
        <p className="label">{ablauf.label}</p>
        <h2 id="ablauf-titel" className="h-gross mt-5 max-w-[14ch]">
          {ablauf.titel}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Zeitachse mit den Schritten */}
          <ol className="relative lg:col-span-6">
            {/* Grundlinie und gefüllter Anteil */}
            <span aria-hidden="true" className="absolute left-[0.3rem] top-2 bottom-2 w-px bg-ink/12" />
            <span
              aria-hidden="true"
              className="absolute left-[0.3rem] top-2 w-px origin-top bg-akzent-rand transition-transform duration-500"
              style={{
                bottom: '0.5rem',
                transform: `scaleY(${reduziert ? 1 : Math.min(fortschritt * 1.15, 1)})`,
                transitionTimingFunction: 'var(--ease-ruhig)',
              }}
            />

            {ablauf.schritte.map((schritt, index) => {
              const istAktiv = reduziert || index <= aktiv;
              return (
                <li key={schritt.nummer} className="relative pb-12 pl-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1.5 block h-[0.7rem] w-[0.7rem] rounded-full border transition-colors duration-500 ${
                      istAktiv ? 'border-akzent-rand bg-akzent-rand' : 'border-ink/20 bg-creme'
                    }`}
                  />
                  <div
                    className="transition-opacity duration-500"
                    style={{ opacity: istAktiv ? 1 : 0.42, transitionTimingFunction: 'var(--ease-ruhig)' }}
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-akzent-text">
                      Schritt {schritt.nummer}
                    </p>
                    <h3 className="h-klein mt-3 font-serif">{schritt.titel}</h3>
                    <p className="mass mt-3 text-leise-stark">{schritt.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Bild in Bogenform, überblendet pro Schritt */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="bogen relative mx-auto aspect-4/5 w-full max-w-sm bg-blush lg:sticky lg:top-28 lg:max-w-none">
              {ablauf.schritte.map((schritt, index) => {
                const sichtbar = reduziert ? index === 0 : index === Math.max(aktiv, 0);
                return (
                  <Image
                    key={schritt.nummer}
                    src={schritt.bild}
                    alt={schritt.alt}
                    fill
                    sizes="(min-width: 1024px) 38vw, 90vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="object-cover transition-opacity duration-700"
                    style={{ opacity: sichtbar ? 1 : 0, transitionTimingFunction: 'var(--ease-ruhig)' }}
                  />
                );
              })}
            </div>

            {/* Für Screenreader und ohne Bewegung: welche Aufnahme gerade zu sehen ist. */}
            <p className="sr-only" aria-live="polite">
              {reduziert
                ? ablauf.schritte[0]!.alt
                : ablauf.schritte[Math.max(aktiv, 0)]!.alt}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
