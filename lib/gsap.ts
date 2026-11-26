'use client';

/**
 * Eine zentrale Stelle, an der GSAP und ScrollTrigger registriert werden.
 * Doppelte Registrierung ist unschädlich, aber so bleibt es übersichtlich.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Liest die Systemeinstellung „Bewegung reduzieren“. */
export function bewegungReduziert(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
