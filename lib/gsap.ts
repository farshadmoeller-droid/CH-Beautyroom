'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP wird auf dieser Seite sparsam eingesetzt – nur dort, wo ein Wert
 * wirklich am Scroll-Fortschritt hängt und sich jederzeit umkehren lassen
 * muss: die Einfärbung im Aussage-Satz und die waagerechten Leistungen.
 *
 * Alles andere – Erscheinen, Aufklappen, Knöpfe, Überblendungen – läuft
 * über CSS-Übergänge. Die sind billiger, laufen auf dem Compositor und
 * brauchen keine Bibliothek.
 */
if (typeof window !== 'undefined') {
  // Mehrfaches Registrieren ist bei GSAP folgenlos, aber unnötig.
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
