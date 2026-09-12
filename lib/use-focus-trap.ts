'use client';

import { useEffect, type RefObject } from 'react';

const FOKUSSIERBAR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Haelt den Tastaturfokus innerhalb eines geoeffneten Overlays (Mobilmenue,
 * Lightbox) und gibt ihn beim Schliessen an das ausloesende Element zurueck.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  aktiv: boolean,
  beimSchliessen?: () => void,
): void {
  useEffect(() => {
    if (!aktiv) return;

    const container = containerRef.current;
    if (!container) return;

    const vorherFokussiert = document.activeElement as HTMLElement | null;

    const elemente = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOKUSSIERBAR)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );

    const zuerst = elemente()[0];
    (zuerst ?? container).focus({ preventScroll: true });

    function beiTastendruck(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        beimSchliessen?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const liste = elemente();
      if (liste.length === 0) {
        event.preventDefault();
        return;
      }

      const erstes = liste[0]!;
      const letztes = liste[liste.length - 1]!;

      if (event.shiftKey && document.activeElement === erstes) {
        event.preventDefault();
        letztes.focus();
      } else if (!event.shiftKey && document.activeElement === letztes) {
        event.preventDefault();
        erstes.focus();
      }
    }

    document.addEventListener('keydown', beiTastendruck);

    return () => {
      document.removeEventListener('keydown', beiTastendruck);
      vorherFokussiert?.focus?.({ preventScroll: true });
    };
  }, [aktiv, containerRef, beimSchliessen]);
}

/** Sperrt das Scrollen des Hintergrunds, solange ein Overlay offen ist. */
export function useScrollLock(aktiv: boolean): void {
  useEffect(() => {
    if (!aktiv) return;
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = vorher;
    };
  }, [aktiv]);
}
