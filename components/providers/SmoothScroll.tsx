'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Weiches Scrollen mit Lenis, gekoppelt an GSAP.
 *
 * Wichtig ist die Reihenfolge: Lenis meldet jeden Scroll-Schritt an
 * ScrollTrigger, und GSAPs Ticker treibt Lenis an. Ohne diese Kopplung
 * laufen angeheftete Sektionen und das weiche Scrollen auseinander.
 *
 * Wer „Bewegung reduzieren“ eingeschaltet hat, bekommt gar kein Lenis –
 * dann scrollt der Browser ganz normal.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Auf Touchgeräten fühlt sich natives Scrollen besser an.
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const takt = (zeit: number) => lenis.raf(zeit * 1000);
    gsap.ticker.add(takt);
    gsap.ticker.lagSmoothing(0);

    // Anker-Links sollen weich scrollen statt zu springen.
    const beiKlick = (e: MouseEvent) => {
      const ziel = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!ziel) return;
      const id = ziel.getAttribute('href');
      if (!id || id === '#') return;
      const element = document.querySelector(id);
      if (!element) return;
      e.preventDefault();
      lenis.scrollTo(element as HTMLElement, { offset: -8 });
    };

    document.addEventListener('click', beiKlick);

    return () => {
      document.removeEventListener('click', beiKlick);
      gsap.ticker.remove(takt);
      lenis.destroy();
    };
  }, []);

  return null;
}
