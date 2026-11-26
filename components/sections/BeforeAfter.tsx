'use client';

import Image from 'next/image';
import { useId, useState } from 'react';

type Props = {
  vorher: string;
  vorherAlt: string;
  nachher: string;
  nachherAlt: string;
  /** Auf dunklem Grund (Lightbox) werden die Marken hell gesetzt. */
  dunkel?: boolean;
};

/**
 * Vorher-Nachher-Vergleich mit Schieberegler.
 *
 * Der Regler ist ein echter <input type="range">: Damit funktioniert er
 * mit Maus, Finger und Tastatur gleichermaßen, ohne eigenes Zeigerhandling.
 */
export default function BeforeAfter({ vorher, vorherAlt, nachher, nachherAlt, dunkel = false }: Props) {
  const [position, setPosition] = useState(50);
  const id = useId();

  const marke = dunkel
    ? 'bg-espresso/80 text-creme'
    : 'bg-creme/90 text-ink';

  return (
    <figure className="w-full">
      <div className="relative aspect-4/3 w-full select-none overflow-hidden rounded-xl bg-blush">
        <Image src={nachher} alt={nachherAlt} fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />

        {/* Das Vorher-Bild wird von links beschnitten. Der innere Rahmen
            rechnet die Breite zurück, damit das Bild nicht mitskaliert. */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <div className="relative h-full" style={{ width: `calc(100% * 100 / ${Math.max(position, 1)})` }}>
            <Image src={vorher} alt={vorherAlt} fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
          </div>
        </div>

        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-creme" style={{ left: `${position}%` }} />
        <span aria-hidden="true" className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.2em] ${marke}`}>
          Vorher
        </span>
        <span aria-hidden="true" className={`pointer-events-none absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.2em] ${marke}`}>
          Nachher
        </span>
      </div>

      <label htmlFor={id} className={`feld-label mt-4 ${dunkel ? 'text-creme/70' : ''}`}>
        Vergleich verschieben
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-valuetext={`${position} Prozent des Vorher-Bildes sichtbar`}
        className="h-11 w-full accent-[var(--color-akzent-rand)]"
      />
    </figure>
  );
}
