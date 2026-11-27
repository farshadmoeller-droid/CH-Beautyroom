'use client';

import { useEffect, useState } from 'react';

/**
 * Hat die Besucherin „Bewegung reduzieren" eingestellt?
 *
 * Der Startwert ist `false`, damit die vom Server gelieferte Fassung und
 * die erste Fassung im Browser übereinstimmen – sonst meckert React beim
 * Andocken. Die echte Antwort kommt unmittelbar danach.
 */
export function useBewegungReduziert(): boolean {
  const [reduziert, setReduziert] = useState(false);

  useEffect(() => {
    const abfrage = window.matchMedia('(prefers-reduced-motion: reduce)');
    const uebernehmen = () => setReduziert(abfrage.matches);
    uebernehmen();
    abfrage.addEventListener('change', uebernehmen);
    return () => abfrage.removeEventListener('change', uebernehmen);
  }, []);

  return reduziert;
}
