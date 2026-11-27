'use client';

import { useEffect } from 'react';
import { useBewegungReduziert } from '@/lib/use-reduced-motion';

/**
 * Weiches Scrollen.
 *
 * Das ist keine Animation, sondern eine Gefühlsentscheidung: Der Sprung
 * zwischen zwei Scroll-Positionen wird geglättet. Wer „Bewegung
 * reduzieren" eingestellt hat, bekommt das native Scrollen – dort wäre
 * eine Glättung genau die Art Bewegung, die stört.
 */
export default function SmoothScroll() {
  const reduziert = useBewegungReduziert();

  useEffect(() => {
    if (reduziert) return;
    let aufraeumen = () => {};
    let abgebrochen = false;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('@/lib/gsap'),
      ]);
      if (abgebrochen) return;

      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });

      // Lenis scrollt an `window.scrollY` vorbei. Ohne diese Kopplung
      // rechnet ScrollTrigger mit veralteten Positionen und die
      // scrollgebundenen Stellen laufen hinterher.
      const beiScroll = () => ScrollTrigger.update();
      lenis.on('scroll', beiScroll);
      const takt = (zeit: number) => lenis.raf(zeit * 1000);
      gsap.ticker.add(takt);
      gsap.ticker.lagSmoothing(0);

      aufraeumen = () => {
        lenis.off('scroll', beiScroll);
        gsap.ticker.remove(takt);
        lenis.destroy();
      };
    })();

    return () => {
      abgebrochen = true;
      aufraeumen();
    };
  }, [reduziert]);

  return null;
}
