'use client';

import { useEffect, useState } from 'react';

/**
 * Gibt zurück, ob die Nutzerin „Bewegung reduzieren“ eingeschaltet hat.
 * Startet mit false, damit Server und Browser dasselbe rendern, und
 * korrigiert sich direkt nach dem ersten Rendern.
 */
export function useBewegungReduziert(): boolean {
  const [reduziert, setReduziert] = useState(false);

  useEffect(() => {
    const abfrage = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduziert(abfrage.matches);

    const beiWechsel = (e: MediaQueryListEvent) => setReduziert(e.matches);
    abfrage.addEventListener('change', beiWechsel);
    return () => abfrage.removeEventListener('change', beiWechsel);
  }, []);

  return reduziert;
}
