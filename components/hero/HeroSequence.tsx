'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useBewegungReduziert } from '@/lib/use-reduced-motion';
import { useImageSequence } from '@/components/hero/useImageSequence';
import FocusRings, { FocusLabels } from '@/components/hero/FocusRings';
import StatsCard from '@/components/hero/StatsCard';
import { hero } from '@/content/site';

/** Unterhalb dieser Breite wird die kleinere Sequenz geladen. */
const MOBIL_BIS = 768;

/** Die Bildfolge läuft über die ersten 85 % – danach darf das Bild stehen. */
const SEQUENZ_ANTEIL = 0.85;

/**
 * Ob überhaupt eine Bildfolge vorliegt, steht schon zur Bauzeit fest
 * (`hero.sequenz.anzahl` in content/site.ts). Das hier aus der
 * Konfiguration abzuleiten statt erst im Browser zu prüfen, hält Server
 * und Browser beim ersten Rendern identisch – sonst springt die Höhe der
 * Sektion nach dem Laden.
 */
const HAT_SEQUENZ = hero.sequenz.anzahl > 0;

export default function HeroSequence() {
  const reduziert = useBewegungReduziert();
  const [mobil, setMobil] = useState<boolean | null>(null);

  const sektionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fortschrittRef = useRef(0);
  const [fortschritt, setFortschritt] = useState(0);

  useEffect(() => {
    const pruefe = () => setMobil(window.innerWidth < MOBIL_BIS);
    pruefe();
    window.addEventListener('resize', pruefe);
    return () => window.removeEventListener('resize', pruefe);
  }, []);

  // Erst laden, wenn feststeht, welche Größe gebraucht wird – und niemals
  // bei reduzierter Bewegung, dann genügt das Standbild.
  const sequenzAktiv = HAT_SEQUENZ && mobil !== null && !reduziert;

  const { status, bildFuerFortschritt } = useImageSequence({
    vorlage: mobil ? hero.sequenz.pfadMobil : hero.sequenz.pfad,
    anzahl: hero.sequenz.anzahl,
    schrittweite: mobil ? hero.sequenz.mobilSchrittweite : 1,
    aktiv: sequenzAktiv,
  });

  const nutzeSequenz = sequenzAktiv && !status.fehlgeschlagen;

  /** Zeichnet das zum Fortschritt passende Frame bildschirmfüllend. */
  const zeichne = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const anteil = Math.min(fortschrittRef.current / SEQUENZ_ANTEIL, 1);
    const bild = bildFuerFortschritt(anteil);
    if (!bild) return;

    const breite = canvas.clientWidth;
    const hoehe = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== Math.round(breite * dpr) || canvas.height !== Math.round(hoehe * dpr)) {
      canvas.width = Math.round(breite * dpr);
      canvas.height = Math.round(hoehe * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, breite, hoehe);

    // Wie object-fit: cover – das Bild füllt die Fläche, ohne zu verzerren.
    const skala = Math.max(breite / bild.naturalWidth, hoehe / bild.naturalHeight);
    const zielBreite = bild.naturalWidth * skala;
    const zielHoehe = bild.naturalHeight * skala;
    ctx.drawImage(bild, (breite - zielBreite) / 2, (hoehe - zielHoehe) / 2, zielBreite, zielHoehe);
  }, [bildFuerFortschritt]);

  // Fortschritt an die Scroll-Position koppeln.
  useEffect(() => {
    const sektion = sektionRef.current;
    if (!sektion || reduziert) return;

    const ausloeser = ScrollTrigger.create({
      trigger: sektion,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (selbst) => {
        fortschrittRef.current = selbst.progress;
        setFortschritt(selbst.progress);
        zeichne();
      },
    });

    return () => ausloeser.kill();
  }, [reduziert, zeichne]);

  // Neu zeichnen, wenn Frames nachgeladen wurden oder sich die Größe ändert.
  useEffect(() => {
    if (!nutzeSequenz) return;
    zeichne();
    const beiResize = () => zeichne();
    window.addEventListener('resize', beiResize);
    return () => window.removeEventListener('resize', beiResize);
  }, [nutzeSequenz, status.fortschritt, zeichne]);

  // Sanfter Parallax für das Standbild, wenn keine Sequenz läuft.
  const standbildRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (nutzeSequenz || reduziert) return;
    const element = standbildRef.current;
    const sektion = sektionRef.current;
    if (!element || !sektion) return;

    const animation = gsap.to(element, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: sektion, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [nutzeSequenz, reduziert]);

  const ladend = nutzeSequenz && !status.bereit;
  const prozent = Math.round(status.fortschritt * 100);

  /** Ohne laufende Sequenz gibt es keinen Fortschritt – dann alles zeigen. */
  const sofort = reduziert || !HAT_SEQUENZ;

  // Die Headline erscheint Wort für Wort über die ersten 30 % des Scrollens.
  const wortSchwelle = (index: number) => 0.04 + index * 0.075;

  const schlusswortSichtbar = sofort || fortschritt > 0.72;
  const schlusswortStil: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: 'clamp(2.25rem, 7vw, 5.5rem)',
    lineHeight: 0.9,
    color: 'rgb(247 242 238 / 0.92)',
    opacity: schlusswortSichtbar ? 1 : 0,
    transform: schlusswortSichtbar ? 'none' : 'translateY(0.3em)',
    transition: 'opacity 900ms var(--ease-ruhig), transform 900ms var(--ease-ruhig)',
  };

  return (
    <section
      id="hero"
      ref={sektionRef}
      aria-labelledby="hero-titel"
      className={`relative bg-espresso ${HAT_SEQUENZ ? 'hero-lang' : 'h-[100svh]'}`}
      style={HAT_SEQUENZ ? ({ '--hero-laenge': hero.scrollLaenge } as React.CSSProperties) : undefined}
    >
      <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden">
        {/* Bildebene */}
        {nutzeSequenz ? (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            style={{ opacity: ladend ? 0 : 1, transition: 'opacity 600ms var(--ease-ruhig)' }}
          />
        ) : (
          <div ref={standbildRef} className="absolute inset-0 scale-110">
            <Image
              src={hero.fallbackBild}
              alt={hero.fallbackAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              // Das Standbild ist hochkant, der Hero auf dem Desktop quer.
              // Ohne diese Verankerung schneidet object-cover mittig und
              // damit das Gesicht ab. Der Wert steht in content/site.ts.
              style={{ objectPosition: hero.bildAusschnitt }}
            />
          </div>
        )}

        {/* Ein Bild für Screenreader und für den Fall, dass JavaScript aus ist. */}
        {nutzeSequenz && (
          <noscript>
            <Image
              src={hero.fallbackBild}
              alt={hero.fallbackAlt}
              fill
              sizes="100vw"
              className="absolute inset-0 object-cover"
            />
          </noscript>
        )}

        <div aria-hidden="true" className="schleier absolute inset-0" />

        {/* Fokus-Ringe */}
        {nutzeSequenz && !ladend && (
          <>
            <FocusRings fortschritt={fortschritt} />
            <FocusLabels fortschritt={fortschritt} />
          </>
        )}

        {/* Text und Karte */}
        <div className="huelle relative z-10 w-full pb-20 pt-28 sm:pb-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between">
            {/* Auf grossen Schirmen bleibt die Textspalte schmal: Die
                Headline umbricht dann drei Mal und laeuft nicht quer ueber
                das Gesicht im Bild. */}
            <div className="lg:max-w-[54%] lg:self-end">
              <p className="label label-auf-bild">{hero.eyebrow}</p>

              <h1 id="hero-titel" className="h-riesig mt-6 text-creme">
                {hero.headline.map((wort, index) => {
                  const sichtbar = sofort || fortschritt >= wortSchwelle(index);
                  return (
                    // Das Leerzeichen gehört in den Textfluss, nicht in einen
                    // Rand: sonst lesen Screenreader die Wörter zusammen.
                    <span
                      key={wort}
                      className="inline-block transition-all duration-700"
                      style={{
                        opacity: sichtbar ? 1 : 0,
                        transform: sichtbar ? 'none' : 'translateY(0.35em)',
                        transitionTimingFunction: 'var(--ease-ruhig)',
                      }}
                    >
                      {wort}
                      {index < hero.headline.length - 1 ? '\u00A0' : ''}
                    </span>
                  );
                })}
              </h1>

              <p className="mass mt-7 text-base text-creme/85 sm:text-lg">{hero.unterzeile}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="#termin" className="knopf knopf-hell">
                  Termin anfragen
                </Link>
                <Link href="#leistungen" className="knopf knopf-hell">
                  Leistungen ansehen
                </Link>
              </div>
            </div>

            {/* Rechte Spalte: Karte oben, Schlusswort unten – so können sich
                die beiden auf keiner Bildschirmhöhe überlagern. */}
            <div className="hidden lg:flex lg:flex-col lg:items-end lg:justify-between lg:gap-8">
              <StatsCard fortschritt={sofort ? 1 : fortschritt} reduziert={sofort} />
              <p aria-hidden="true" className="pointer-events-none" style={schlusswortStil}>
                {hero.schlusswort}
              </p>
            </div>
          </div>

          {/* Auf schmalen Bildschirmen steht das Schlusswort unter den Knöpfen. */}
          <p
            aria-hidden="true"
            className="pointer-events-none mt-8 text-right lg:hidden"
            style={schlusswortStil}
          >
            {hero.schlusswort}
          </p>
          <span className="sr-only">{hero.schlusswort}</span>
        </div>

        {/* Ladeanzeige */}
        {ladend && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-espresso">
            <p className="font-serif text-6xl text-creme/90 tabular-nums" aria-live="polite">
              {prozent}
              <span className="text-2xl text-creme/50">%</span>
            </p>
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-creme/50">
              Einen Moment
            </p>
          </div>
        )}

        {/* Scroll-Hinweis */}
        {!reduziert && !ladend && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
            style={{ opacity: Math.max(0, 1 - fortschritt * 8) }}
          >
            <span className="text-[0.58rem] uppercase tracking-[0.3em] text-creme/70">
              {hero.scrollHinweis}
            </span>
            <span className="block h-10 w-px bg-creme/40" />
          </div>
        )}
      </div>
    </section>
  );
}
