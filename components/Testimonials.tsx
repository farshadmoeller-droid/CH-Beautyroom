'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';
import { stimmen, stimmenPlatzhalterHinweis } from '@/content/testimonials';

/**
 * Ruhiger Slider mit Stimmen von Kundinnen.
 * Alle Zitate liegen im DOM; nicht sichtbare Panels sind mit hidden
 * ausgeblendet, damit Screenreader nicht durch Unsichtbares laufen.
 */
export default function Testimonials() {
  const [aktiv, setAktiv] = useState(0);
  const anzahl = stimmen.length;

  if (anzahl === 0) return null;

  return (
    <section aria-labelledby="stimmen-titel" className="section bg-sand">
      <div className="container-page">
        <h2 id="stimmen-titel" className="eyebrow">
          Stimmen von Kundinnen
        </h2>

        <p className="mt-4 max-w-[60ch] text-xs uppercase tracking-[0.1em] text-ink">
          {stimmenPlatzhalterHinweis}
        </p>

        <div className="mt-10">
          {stimmen.map((stimme, index) => (
            <figure
              key={`${stimme.name}-${stimme.leistung}`}
              hidden={index !== aktiv}
              aria-hidden={index !== aktiv}
            >
              <blockquote>
                <p className="quote max-w-[26ch] text-espresso sm:max-w-[32ch]">„{stimme.zitat}“</p>
              </blockquote>
              <figcaption className="mt-7 text-sm text-ink">
                {stimme.name} · {stimme.leistung}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setAktiv((index) => (index - 1 + anzahl) % anzahl)}
            className="flex h-11 w-11 items-center justify-center border border-control transition-colors hover:border-espresso"
          >
            <span className="sr-only">Vorherige Stimme</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAktiv((index) => (index + 1) % anzahl)}
            className="flex h-11 w-11 items-center justify-center border border-control transition-colors hover:border-espresso"
          >
            <span className="sr-only">Nächste Stimme</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
          <p aria-live="polite" className="text-sm text-ink">
            {aktiv + 1} von {anzahl}
          </p>
        </div>
      </div>
    </section>
  );
}
