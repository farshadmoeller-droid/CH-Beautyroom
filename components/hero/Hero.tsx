'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Kennzahlen from '@/components/hero/Kennzahlen';
import { hero } from '@/content/site';
import { useBewegungReduziert } from '@/lib/use-reduced-motion';

/**
 * Der Hero.
 *
 * Bewegung in diesem Abschnitt – die Entscheidungen dahinter:
 *
 * · Häufigkeit: einmal pro Besuch. Das ist die Stufe, auf der man sich
 *   etwas erlauben darf.
 * · Zweck: Erklären und Begrüßen. Die Headline soll gelesen werden,
 *   nicht nur gesehen.
 * · Ein Auftritt pro Behälter: Der Abschnitt selbst bewegt sich nicht.
 *   Nur sein Inhalt tritt auf, und zwar als eine Geste.
 * · Die Abstände schrumpfen (0 · 110 · 200 · 270 · 330 · 390 ms). Gleiche
 *   Abstände würden sich wie ein Metronom lesen.
 * · Die Headline reist am weitesten, Begleitendes weniger, das Label
 *   blendet nur auf. Wer überall gleich weit bewegt, hat keine Hierarchie.
 * · Nichts blockiert: Die Knöpfe sind anklickbar, sobald sie sichtbar
 *   sind – die Verzögerung liegt im Übergang, nicht in `pointer-events`.
 */
export default function Hero() {
  const reduziert = useBewegungReduziert();
  const [bereit, setBereit] = useState(false);
  const bildRef = useRef<HTMLDivElement>(null);
  const sektionRef = useRef<HTMLElement>(null);

  // Ein Bild warten, damit der Übergang auch wirklich läuft und nicht
  // schon im ersten gemalten Bild beendet ist.
  useEffect(() => {
    const id = requestAnimationFrame(() => setBereit(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Parallax: der einzige Platz im Hero, an dem ein Wert am Scroll hängt.
  useEffect(() => {
    if (reduziert) return;
    const bild = bildRef.current;
    const sektion = sektionRef.current;
    if (!bild || !sektion) return;

    let aufraeumen = () => {};
    let abgebrochen = false;
    (async () => {
      const { gsap } = await import('@/lib/gsap');
      if (abgebrochen) return;
      const tween = gsap.to(bild, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: sektion, start: 'top top', end: 'bottom top', scrub: true },
      });
      aufraeumen = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();

    return () => {
      abgebrochen = true;
      aufraeumen();
    };
  }, [reduziert]);

  const woerter = hero.headline;
  /** Schrumpfende Schritte – siehe Kopfkommentar. */
  const stufen = { eyebrow: 0, headline: 110, unterzeile: 270, knoepfe: 330, karte: 200, schluss: 390 };

  const auftritt = (stufe: number, weg: number) => ({
    opacity: bereit ? 1 : 0,
    transform: bereit ? 'none' : `translateY(${reduziert ? 0 : weg}px)`,
    transition: `opacity 700ms var(--ease-out) ${stufe}ms, transform 700ms var(--ease-out) ${stufe}ms`,
  });

  return (
    <section
      id="hero"
      ref={sektionRef}
      aria-labelledby="hero-titel"
      className="relative h-[100svh] overflow-hidden bg-espresso"
    >
      {/* Das Foto sitzt in einem etwas größeren Rahmen, damit der Parallax
          unten keine Lücke aufreißt: 10 % Weg brauchen 10 % Vorrat. */}
      <div ref={bildRef} className="absolute inset-x-0 -top-[12%] h-[112%]">
        <Image
          src={hero.fallbackBild}
          alt={hero.fallbackAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: hero.bildAusschnitt }}
        />
      </div>

      <div aria-hidden="true" className="schleier absolute inset-0" />

      <div className="huelle absolute inset-x-0 bottom-0 z-10 pb-16 sm:pb-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          {/* Auf großen Schirmen schmal, damit die Headline nicht quer
              über Carinas Gesicht läuft. */}
          <div className="lg:max-w-[54%]">
            <p className="label label-auf-bild" style={auftritt(stufen.eyebrow, 6)}>
              {hero.eyebrow}
            </p>

            <h1 id="hero-titel" className="h-riesig mt-5 text-creme">
              {woerter.map((wort, index) => (
                // Das Leerzeichen gehört in den Textfluss, nicht in einen
                // Rand – sonst liest ein Screenreader die Wörter zusammen.
                <span
                  key={wort}
                  className="inline-block"
                  style={auftritt(stufen.headline + index * 70, 26)}
                >
                  {wort}
                  {index < woerter.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>

            <p
              className="mass mt-6 text-base text-creme/85 sm:text-lg"
              style={auftritt(stufen.unterzeile, 12)}
            >
              {hero.unterzeile}
            </p>

            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              style={auftritt(stufen.knoepfe, 12)}
            >
              <Link href="#termin" className="knopf knopf-hell">
                Termin anfragen
              </Link>
              <Link href="#leistungen" className="knopf knopf-hell">
                Leistungen ansehen
              </Link>
            </div>
          </div>

          {/* Karte oben, Schlusswort unten – so überlagern sie sich auf
              keiner Bildschirmhöhe. */}
          <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-10">
            <div style={auftritt(stufen.karte, 16)}>
              <Kennzahlen />
            </div>
            <p
              aria-hidden="true"
              className="font-serif text-[clamp(3rem,5.5vw,5.5rem)] italic leading-none text-creme/90"
              style={auftritt(stufen.schluss, 10)}
            >
              {hero.schlusswort}
            </p>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-10 text-right font-serif text-5xl italic leading-none text-creme/90 lg:hidden"
          style={auftritt(stufen.schluss, 10)}
        >
          {hero.schlusswort}
        </p>
      </div>
    </section>
  );
}
