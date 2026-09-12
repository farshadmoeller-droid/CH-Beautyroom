'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/Icons';
import { kategorieLabels, type GalerieBild } from '@/content/gallery';
import { useFocusTrap, useScrollLock } from '@/lib/use-focus-trap';
import { blurDataURL } from '@/lib/blur';

type LightboxProps = {
  bilder: GalerieBild[];
  index: number;
  onSchliessen: () => void;
  onWechsel: (neuerIndex: number) => void;
};

export default function Lightbox({ bilder, index, onSchliessen, onWechsel }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [wischStart, setWischStart] = useState<number | null>(null);

  const bild = bilder[index];
  const anzahl = bilder.length;

  const weiter = useCallback(() => onWechsel((index + 1) % anzahl), [index, anzahl, onWechsel]);
  const zurueck = useCallback(() => onWechsel((index - 1 + anzahl) % anzahl), [index, anzahl, onWechsel]);

  useScrollLock(true);
  useFocusTrap(dialogRef, true, onSchliessen);

  useEffect(() => {
    function beiTaste(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        weiter();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        zurueck();
      }
    }
    document.addEventListener('keydown', beiTaste);
    return () => document.removeEventListener('keydown', beiTaste);
  }, [weiter, zurueck]);

  if (!bild) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Galerie, Bild ${index + 1} von ${anzahl}`}
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex flex-col bg-espresso/97"
      onTouchStart={(event) => setWischStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (wischStart === null) return;
        const ende = event.changedTouches[0]?.clientX ?? wischStart;
        const strecke = ende - wischStart;
        if (Math.abs(strecke) > 50) {
          if (strecke < 0) weiter();
          else zurueck();
        }
        setWischStart(null);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/70">
          {index + 1} / {anzahl}
        </p>
        <button
          type="button"
          onClick={onSchliessen}
          className="flex h-11 w-11 items-center justify-center text-cream transition-opacity hover:opacity-70"
        >
          <span className="sr-only">Galerie schließen</span>
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2 sm:px-16">
        <button
          type="button"
          onClick={zurueck}
          className="absolute left-1 z-10 flex h-12 w-12 items-center justify-center text-cream transition-opacity hover:opacity-70 sm:left-3"
        >
          <span className="sr-only">Vorheriges Bild</span>
          <ChevronLeftIcon className="h-7 w-7" />
        </button>

        <div className="relative h-full w-full max-w-5xl">
          <Image
            key={bild.src}
            src={bild.src}
            alt={bild.alt}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurDataURL}
            className={`object-contain ${bild.kategorie === 'fineline' ? 'grayscale' : ''}`}
          />
        </div>

        <button
          type="button"
          onClick={weiter}
          className="absolute right-1 z-10 flex h-12 w-12 items-center justify-center text-cream transition-opacity hover:opacity-70 sm:right-3"
        >
          <span className="sr-only">Nächstes Bild</span>
          <ChevronRightIcon className="h-7 w-7" />
        </button>
      </div>

      <div className="px-4 pb-8 pt-4 text-center sm:px-6">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-cream/60">
          {kategorieLabels[bild.kategorie]}
        </p>
        <p className="mx-auto mt-2 max-w-[50ch] font-serif text-lg font-light text-cream">
          {bild.beschreibung}
        </p>
      </div>
    </div>
  );
}
