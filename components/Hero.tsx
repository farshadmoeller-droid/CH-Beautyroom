'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { blurDataURL } from '@/lib/blur';

/**
 * Bildschirmfuellender Hero mit sehr dezentem Parallax. Der Effekt entfaellt
 * vollstaendig, wenn im System "Bewegung reduzieren" aktiviert ist.
 */
export default function Hero() {
  const [versatz, setVersatz] = useState(0);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (query.matches) return;

    let angefordert = false;

    function beiScroll() {
      if (angefordert) return;
      angefordert = true;
      window.requestAnimationFrame(() => {
        setVersatz(Math.min(window.scrollY * 0.15, 120));
        angefordert = false;
      });
    }

    window.addEventListener('scroll', beiScroll, { passive: true });
    return () => window.removeEventListener('scroll', beiScroll);
  }, []);

  return (
    <section
      aria-labelledby="hero-titel"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-sand"
    >
      <div className="absolute inset-0" style={{ transform: `translate3d(0, ${versatz}px, 0)` }}>
        <Image
          src="/images/hero.jpg"
          alt="Ruhiger Blick in das Homestudio von CH Beautyroom mit Trockenblumen und hellem Holz"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover"
        />
      </div>

      <div aria-hidden="true" className="image-scrim absolute inset-0" />

      <div className="container-page relative z-10 w-full pb-24 pt-32 md:pb-32">
        <p className="eyebrow text-cream/90">Homestudio · 26683 Ramsloh</p>

        <h1 id="hero-titel" className="h-display mt-6 max-w-[14ch] text-cream">
          Schönheit, die sich nach dir anfühlt.
        </h1>

        <p className="measure mt-7 text-base text-cream/90 sm:text-lg">
          Wimpernverlängerung, Lash- und Browlifting, feine Fineline-Tattoos und frische Naturkosmetik von
          Ringana – in einem kleinen Studio im Saterland, in dem du die Einzige bist.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/#termin" className="btn btn-primary">
            Termin anfragen
          </Link>
          <Link href="/galerie" className="btn btn-on-image">
            Galerie ansehen
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.28em] text-cream/80">Scrollen</span>
        <span className="block h-10 w-px animate-[scrollhint_2.4s_ease-in-out_infinite] bg-cream/60" />
      </div>

      <style>{`
        @keyframes scrollhint {
          0% { transform: scaleY(0.2); transform-origin: top; opacity: 0.2; }
          45% { transform: scaleY(1); transform-origin: top; opacity: 0.9; }
          55% { transform: scaleY(1); transform-origin: bottom; opacity: 0.9; }
          100% { transform: scaleY(0.2); transform-origin: bottom; opacity: 0.2; }
        }
      `}</style>
    </section>
  );
}
