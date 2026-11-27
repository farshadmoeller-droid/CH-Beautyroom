'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

/**
 * Vorher-Nachher-Regler.
 *
 * Hier wird bewusst nichts animiert: Der Griff folgt dem Finger 1:1.
 * Jede Glättung würde sich wie Verzögerung anfühlen. Nur das Loslassen
 * und die Pfeiltasten bekommen einen kurzen Übergang, damit der Sprung
 * nicht hart ist.
 */
type Props = {
  vorher: string;
  vorherAlt: string;
  nachher: string;
  nachherAlt: string;
};

export default function BeforeAfter({ vorher, vorherAlt, nachher, nachherAlt }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [anteil, setAnteil] = useState(50);
  const [zieht, setZieht] = useState(false);

  const ausPosition = useCallback((x: number) => {
    const feld = ref.current?.getBoundingClientRect();
    if (!feld) return;
    const roh = ((x - feld.left) / feld.width) * 100;
    setAnteil(Math.min(100, Math.max(0, roh)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-xl bg-blush"
      onPointerDown={(e) => {
        // Zeiger einfangen: Das Ziehen läuft weiter, auch wenn der Finger
        // das Bild verlässt.
        e.currentTarget.setPointerCapture(e.pointerId);
        setZieht(true);
        ausPosition(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!zieht) return;
        ausPosition(e.clientX);
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setZieht(false);
      }}
      onPointerCancel={() => setZieht(false)}
    >
      <Image src={nachher} alt={nachherAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - anteil}% 0 0)`,
          transition: zieht ? 'none' : 'clip-path var(--dauer-klein) var(--ease-out)',
        }}
      >
        <Image src={vorher} alt={vorherAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <span className="label absolute left-4 top-4 rounded-full bg-espresso/60 px-3 py-1 text-creme">
          Vorher
        </span>
      </div>

      <span className="label absolute right-4 top-4 rounded-full bg-espresso/60 px-3 py-1 text-creme">
        Nachher
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-px bg-creme"
        style={{
          left: `${anteil}%`,
          transition: zieht ? 'none' : 'left var(--dauer-klein) var(--ease-out)',
        }}
      />

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(anteil)}
        onChange={(e) => setAnteil(Number(e.target.value))}
        aria-label="Vergleich zwischen vorher und nachher"
        className="absolute inset-x-0 bottom-0 h-11 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
