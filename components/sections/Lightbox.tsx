'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalerieBild } from '@/content/site';
import BeforeAfter from '@/components/sections/BeforeAfter';

/**
 * Großbild.
 *
 * Nach dem Muster für Dialoge: aus `scale(0.96)` und durchsichtig in
 * 250 ms herein, der Hintergrund blendet gleichzeitig mit, damit beide
 * als eine Fläche gelesen werden. Kein `scale(0)` – nichts in der
 * Wirklichkeit entsteht aus dem Nichts.
 *
 * Anders als ein Menü hängt ein Dialog an keinem Auslöser, deshalb bleibt
 * der Ursprung in der Mitte.
 */
type Props = {
  bilder: GalerieBild[];
  index: number | null;
  schliessen: () => void;
  wechseln: (index: number) => void;
};

export default function Lightbox({ bilder, index, schliessen, wechseln }: Props) {
  const offen = index !== null;
  const [sichtbar, setSichtbar] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const vorherFokus = useRef<HTMLElement | null>(null);

  // Erst einhängen, dann im nächsten Bild sichtbar schalten – sonst
  // startet der Übergang nicht.
  useEffect(() => {
    if (!offen) {
      setSichtbar(false);
      return;
    }
    const id = requestAnimationFrame(() => setSichtbar(true));
    return () => cancelAnimationFrame(id);
  }, [offen]);

  const weiter = useCallback(
    (richtung: number) => {
      if (index === null) return;
      wechseln((index + richtung + bilder.length) % bilder.length);
    },
    [index, bilder.length, wechseln],
  );

  useEffect(() => {
    if (!offen) return;
    vorherFokus.current = document.activeElement as HTMLElement | null;
    const vorherOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const behaelter = dialogRef.current;
    behaelter?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return schliessen();
      if (e.key === 'ArrowRight') return weiter(1);
      if (e.key === 'ArrowLeft') return weiter(-1);
      if (e.key !== 'Tab' || !behaelter) return;
      const ziele = Array.from(behaelter.querySelectorAll<HTMLElement>('button, input'));
      if (ziele.length === 0) return;
      const erstes = ziele[0]!;
      const letztes = ziele[ziele.length - 1]!;
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault();
        letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault();
        erstes.focus();
      }
    };

    document.addEventListener('keydown', beiTaste);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.body.style.overflow = vorherOverflow;
      vorherFokus.current?.focus?.({ preventScroll: true });
    };
  }, [offen, schliessen, weiter]);

  if (index === null) return null;
  const bild = bilder[index];
  if (!bild) return null;

  const uebergang = `opacity var(--dauer-menue) var(--ease-out), transform var(--dauer-menue) var(--ease-out)`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={bild.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
    >
      <button
        type="button"
        aria-label="Großbild schließen"
        onClick={schliessen}
        className="absolute inset-0 cursor-default bg-espresso/90"
        style={{ opacity: sichtbar ? 1 : 0, transition: `opacity var(--dauer-menue) var(--ease-out)` }}
      />

      <div
        ref={dialogRef}
        className="relative z-10 flex max-h-full w-full max-w-4xl flex-col gap-4"
        style={{
          opacity: sichtbar ? 1 : 0,
          transform: sichtbar ? 'none' : 'scale(0.96)',
          transition: uebergang,
        }}
      >
        {bild.vorher ? (
          <BeforeAfter
            vorher={bild.vorher}
            vorherAlt={bild.vorherAlt ?? 'Vorher'}
            nachher={bild.src}
            nachherAlt={bild.alt}
          />
        ) : (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-blush">
            <Image src={bild.src} alt={bild.alt} fill sizes="90vw" className="object-contain" />
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-creme/80">{bild.alt}</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => weiter(-1)} className="knopf knopf-hell" aria-label="Vorheriges Bild">
              ←
            </button>
            <button type="button" onClick={() => weiter(1)} className="knopf knopf-hell" aria-label="Nächstes Bild">
              →
            </button>
            <button type="button" onClick={schliessen} className="knopf knopf-hell">
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
