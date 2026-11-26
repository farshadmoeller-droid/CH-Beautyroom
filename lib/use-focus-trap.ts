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
 * Hält den Tastaturfokus in einem geöffneten Overlay und gibt ihn beim
 * Schließen an das auslösende Element zurück.
 */
export function useFokusFalle(
  behaelterRef: RefObject<HTMLElement | null>,
  aktiv: boolean,
  beimSchliessen?: () => void,
): void {
  useEffect(() => {
    if (!aktiv) return;
    const behaelter = behaelterRef.current;
    if (!behaelter) return;

    const vorher = document.activeElement as HTMLElement | null;
    const elemente = () => Array.from(behaelter.querySelectorAll<HTMLElement>(FOKUSSIERBAR));

    (elemente()[0] ?? behaelter).focus({ preventScroll: true });

    function beiTaste(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        beimSchliessen?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const liste = elemente();
      if (liste.length === 0) {
        e.preventDefault();
        return;
      }
      const erstes = liste[0]!;
      const letztes = liste[liste.length - 1]!;

      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault();
        letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault();
        erstes.focus();
      }
    }

    document.addEventListener('keydown', beiTaste);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      vorher?.focus?.({ preventScroll: true });
    };
  }, [aktiv, behaelterRef, beimSchliessen]);
}

/** Sperrt das Scrollen des Hintergrunds, solange ein Overlay offen ist. */
export function useScrollSperre(aktiv: boolean): void {
  useEffect(() => {
    if (!aktiv) return;
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = vorher;
    };
  }, [aktiv]);
}
