'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import { vorherNachher } from '@/content/gallery';
import { blurDataURL } from '@/lib/blur';

/**
 * Vorher-Nachher-Vergleich mit Schieberegler.
 * Der Regler ist ein echter <input type="range"> – dadurch funktioniert er
 * mit Maus, Finger und Tastatur gleichermassen.
 */
export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <figure>
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden bg-sand">
        <Image
          src={vorherNachher.nachher.src}
          alt={vorherNachher.nachher.alt}
          fill
          sizes="(min-width: 1024px) 45vw, 92vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover"
        />

        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <div className="relative h-full" style={{ width: `calc(100% * 100 / ${position})` }}>
            <Image
              src={vorherNachher.vorher.src}
              alt={vorherNachher.vorher.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 92vw"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-cover"
            />
          </div>
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-cream"
          style={{ left: `${position}%` }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-3 bg-cream/90 px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-espresso"
        >
          Vorher
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 bg-cream/90 px-2 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-espresso"
        >
          Nachher
        </span>
      </div>

      <label htmlFor={id} className="field-label mt-4">
        Vergleich verschieben
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${position} Prozent des Vorher-Bildes sichtbar`}
        className="h-11 w-full accent-[var(--color-espresso)]"
      />

      <figcaption className="measure mt-1 text-sm text-ink">{vorherNachher.beschreibung}</figcaption>
    </figure>
  );
}
