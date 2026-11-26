'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/ui/Icons';
import BeforeAfter from '@/components/sections/BeforeAfter';
import { useFokusFalle, useScrollSperre } from '@/lib/use-focus-trap';
import { galerieKategorien, type GalerieBild } from '@/content/site';

type Props = {
  bilder: GalerieBild[];
  index: number;
  onSchliessen: () => void;
  onWechsel: (neu: number) => void;
};

export default function Lightbox({ bilder, index, onSchliessen, onWechsel }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [wischStart, setWischStart] = useState<number | null>(null);

  const bild = bilder[index];
  const anzahl = bilder.length;

  const weiter = useCallback(() => onWechsel((index + 1) % anzahl), [index, anzahl, onWechsel]);
  const zurueck = useCallback(() => onWechsel((index - 1 + anzahl) % anzahl), [index, anzahl, onWechsel]);

  useScrollSperre(true);
  useFokusFalle(dialogRef, true, onSchliessen);

  useEffect(() => {
    function beiTaste(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        weiter();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        zurueck();
      }
    }
    document.addEventListener('keydown', beiTaste);
    return () => document.removeEventListener('keydown', beiTaste);
  }, [weiter, zurueck]);

  if (!bild) return null;

  const kategorie = galerieKategorien.find((k) => k.id === bild.kategorie)?.label ?? '';
  const hatVergleich = Boolean(bild.vorher);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Galerie, Bild ${index + 1} von ${anzahl}`}
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex flex-col bg-espresso/97"
      onTouchStart={(e) => setWischStart(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (wischStart === null) return;
        const ende = e.changedTouches[0]?.clientX ?? wischStart;
        const strecke = ende - wischStart;
        if (Math.abs(strecke) > 50) {
          if (strecke < 0) weiter();
          else zurueck();
        }
        setWischStart(null);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-creme/60 tabular-nums">
          {index + 1} / {anzahl}
        </p>
        <button
          type="button"
          onClick={onSchliessen}
          className="flex h-11 w-11 items-center justify-center text-creme transition-opacity hover:opacity-70"
        >
          <span className="sr-only">Galerie schließen</span>
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-y-auto px-2 sm:px-16">
        <button
          type="button"
          onClick={zurueck}
          className="absolute left-1 z-10 flex h-12 w-12 items-center justify-center text-creme transition-opacity hover:opacity-70 sm:left-3"
        >
          <span className="sr-only">Vorheriges Bild</span>
          <ChevronLeftIcon className="h-7 w-7" />
        </button>

        {hatVergleich ? (
          <div className="w-full max-w-3xl py-4">
            <BeforeAfter
              vorher={bild.vorher!}
              vorherAlt={bild.vorherAlt ?? 'Aufnahme vor der Behandlung'}
              nachher={bild.src}
              nachherAlt={bild.alt}
              dunkel
            />
          </div>
        ) : (
          <div className="relative h-full w-full max-w-5xl">
            <Image
              key={bild.src}
              src={bild.src}
              alt={bild.alt}
              fill
              sizes="100vw"
              className={`object-contain ${bild.kategorie === 'fineline' ? 'grayscale' : ''}`}
            />
          </div>
        )}

        <button
          type="button"
          onClick={weiter}
          className="absolute right-1 z-10 flex h-12 w-12 items-center justify-center text-creme transition-opacity hover:opacity-70 sm:right-3"
        >
          <span className="sr-only">Nächstes Bild</span>
          <ChevronRightIcon className="h-7 w-7" />
        </button>
      </div>

      <div className="px-4 pb-8 pt-4 text-center sm:px-6">
        <p className="text-[0.6rem] uppercase tracking-[0.24em] text-creme/55">{kategorie}</p>
        <p className="mx-auto mt-2 max-w-[55ch] font-serif text-lg text-creme">{bild.alt}</p>
      </div>
    </div>
  );
}
