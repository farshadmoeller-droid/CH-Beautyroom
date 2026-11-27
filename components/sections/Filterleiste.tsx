'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Filterknöpfe mit wanderndem Hintergrund.
 *
 * Die Liste steht zweimal da: einmal normal, einmal in der aktiven
 * Ausführung darüber. Die zweite Fassung ist auf den aktiven Knopf
 * zugeschnitten, und beim Wechsel wandert nur dieser Zuschnitt.
 *
 * Warum nicht einfach Hintergrund- und Schriftfarbe überblenden? Weil
 * zwei getrennte Farbübergänge nie gleichzeitig ankommen – in der Mitte
 * sieht man kurz eine dritte, falsche Farbe. Hier wechseln Fläche und
 * Schrift zusammen, weil sie ein Element sind, das freigelegt wird.
 */
type Props<T extends string> = {
  eintraege: readonly { id: T; label: string }[];
  aktiv: T;
  auswaehlen: (id: T) => void;
  beschriftung: string;
};

export default function Filterleiste<T extends string>({
  eintraege,
  aktiv,
  auswaehlen,
  beschriftung,
}: Props<T>) {
  const leisteRef = useRef<HTMLDivElement>(null);
  const knopfRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [zuschnitt, setZuschnitt] = useState('inset(0 100% 0 0)');

  useEffect(() => {
    const messen = () => {
      const leiste = leisteRef.current;
      const index = eintraege.findIndex((e) => e.id === aktiv);
      const knopf = knopfRefs.current[index];
      if (!leiste || !knopf) return;
      const gesamt = leiste.getBoundingClientRect();
      const feld = knopf.getBoundingClientRect();
      const links = ((feld.left - gesamt.left) / gesamt.width) * 100;
      const rechts = ((gesamt.right - feld.right) / gesamt.width) * 100;
      setZuschnitt(`inset(0 ${rechts}% 0 ${links}%)`);
    };
    messen();
    window.addEventListener('resize', messen);
    return () => window.removeEventListener('resize', messen);
  }, [aktiv, eintraege]);

  return (
    <div ref={leisteRef} className="relative inline-flex" role="group" aria-label={beschriftung}>
      <div className="flex gap-2">
        {eintraege.map((eintrag, index) => (
          <button
            key={eintrag.id}
            ref={(el) => {
              knopfRefs.current[index] = el;
            }}
            type="button"
            onClick={() => auswaehlen(eintrag.id)}
            aria-pressed={eintrag.id === aktiv}
            className="knopf knopf-umriss"
          >
            {eintrag.label}
          </button>
        ))}
      </div>

      {/* Die zugeschnittene Kopie. Sie fängt keine Klicks ab und wird
          nicht vorgelesen – die Knöpfe darunter sind die echten. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex gap-2"
        style={{
          clipPath: zuschnitt,
          transition: 'clip-path var(--dauer-menue) var(--ease-in-out)',
        }}
      >
        {eintraege.map((eintrag) => (
          <span key={eintrag.id} className="knopf knopf-voll">
            {eintrag.label}
          </span>
        ))}
      </div>
    </div>
  );
}
