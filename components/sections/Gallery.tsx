'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Lightbox from '@/components/sections/Lightbox';
import { galerie, galerieKategorien, type GalerieKategorie } from '@/content/site';

type Filter = 'alle' | GalerieKategorie;

/** Wie hoch eine Kachel im Mauerwerk-Raster steht. */
const verhaeltnis: Record<'hoch' | 'quer' | 'quadrat', string> = {
  hoch: 'aspect-5/7',
  quer: 'aspect-7/5',
  quadrat: 'aspect-square',
};

/** So viele Bilder sind zunächst sichtbar. */
const SCHRITT = 9;

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>('alle');
  const [sichtbar, setSichtbar] = useState(SCHRITT);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const gefiltert = useMemo(
    () => (filter === 'alle' ? galerie : galerie.filter((b) => b.kategorie === filter)),
    [filter],
  );

  const angezeigt = gefiltert.slice(0, sichtbar);
  const rest = gefiltert.length - angezeigt.length;

  function filterSetzen(neu: Filter) {
    setFilter(neu);
    setSichtbar(SCHRITT);
  }

  return (
    <section id="galerie" aria-labelledby="galerie-titel" className="abschnitt bg-creme">
      <div className="huelle">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label">Galerie</p>
            <h2 id="galerie-titel" className="h-gross mt-5 max-w-[13ch]">
              Arbeiten <em className="italic">aus dem Studio</em>
            </h2>
          </div>
          <p className="mass text-leise-stark lg:max-w-sm lg:text-right">
            Jedes Ergebnis ist auf die Kundin abgestimmt, die davor im Studio saß. Tippe ein Bild an, um
            es groß zu sehen.
          </p>
        </div>

        <div role="group" aria-label="Galerie nach Kategorie filtern" className="mt-12 flex flex-wrap gap-2">
          {galerieKategorien.map((eintrag) => {
            const aktiv = filter === eintrag.id;
            return (
              <button
                key={eintrag.id}
                type="button"
                onClick={() => filterSetzen(eintrag.id)}
                aria-pressed={aktiv}
                className={`min-h-11 rounded-full border px-5 text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  aktiv
                    ? 'border-ink bg-ink text-creme'
                    : 'border-akzent-rand bg-transparent text-ink hover:border-ink'
                }`}
              >
                {eintrag.label}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="sr-only">
          {`${gefiltert.length} Bilder in der Auswahl ${
            galerieKategorien.find((k) => k.id === filter)?.label ?? ''
          }.`}
        </p>

        <ul className="mt-10 columns-2 gap-3 sm:gap-4 lg:columns-3">
          {angezeigt.map((bild, index) => (
            <li key={bild.src} className="mb-3 break-inside-avoid sm:mb-4">
              <button type="button" onClick={() => setLightbox(index)} className="group block w-full text-left">
                <span className={`relative block overflow-hidden rounded-xl bg-blush ${verhaeltnis[bild.format]}`}>
                  <Image
                    src={bild.src}
                    alt={bild.alt}
                    fill
                    loading={index < 4 ? 'eager' : 'lazy'}
                    sizes="(min-width: 1024px) 31vw, 47vw"
                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
                      bild.kategorie === 'fineline' ? 'grayscale' : ''
                    }`}
                  />
                  {bild.vorher && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-creme/90 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.18em] text-ink">
                      Vorher / Nachher
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {rest > 0 && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setSichtbar((n) => n + SCHRITT)} className="knopf knopf-linie">
              {`Mehr laden (${rest})`}
            </button>
          </div>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox
          bilder={angezeigt}
          index={lightbox}
          onSchliessen={() => setLightbox(null)}
          onWechsel={setLightbox}
        />
      )}
    </section>
  );
}
