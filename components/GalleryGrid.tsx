'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { kategorieLabels, type GalerieBild, type GalerieKategorie } from '@/content/gallery';
import { blurDataURL } from '@/lib/blur';

type Filter = 'alle' | GalerieKategorie;

type GalleryGridProps = {
  bilder: GalerieBild[];
  /** Filter-Chips anzeigen. */
  mitFilter?: boolean;
  /** Wie viele Bilder vor dem ersten Klick auf "Mehr laden" sichtbar sind. */
  startAnzahl?: number;
  /** Nachladen erlauben – auf der Startseite ist der Auszug bewusst endlich. */
  mitNachladen?: boolean;
};

const filterReihenfolge: Filter[] = ['alle', 'wimpern', 'lifting', 'fineline'];

const seitenverhaeltnis: Record<GalerieBild['format'], string> = {
  hoch: 'aspect-[5/7]',
  quer: 'aspect-[7/5]',
  quadrat: 'aspect-square',
};

export default function GalleryGrid({
  bilder,
  mitFilter = true,
  startAnzahl = 12,
  mitNachladen = true,
}: GalleryGridProps) {
  const [filter, setFilter] = useState<Filter>('alle');
  const [sichtbar, setSichtbar] = useState(startAnzahl);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gefiltert = useMemo(
    () => (filter === 'alle' ? bilder : bilder.filter((bild) => bild.kategorie === filter)),
    [bilder, filter],
  );

  const angezeigt = mitNachladen ? gefiltert.slice(0, sichtbar) : gefiltert;
  const restAnzahl = gefiltert.length - angezeigt.length;

  function filterSetzen(neu: Filter) {
    setFilter(neu);
    setSichtbar(startAnzahl);
  }

  return (
    <div>
      {mitFilter && (
        <div role="group" aria-label="Galerie nach Kategorie filtern" className="flex flex-wrap gap-2">
          {filterReihenfolge.map((eintrag) => {
            const aktiv = filter === eintrag;
            const label = eintrag === 'alle' ? 'Alle' : kategorieLabels[eintrag];
            return (
              <button
                key={eintrag}
                type="button"
                onClick={() => filterSetzen(eintrag)}
                aria-pressed={aktiv}
                className={`min-h-11 rounded-[2px] border px-5 text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  aktiv
                    ? 'border-espresso bg-espresso text-cream'
                    : 'border-control bg-transparent text-espresso hover:border-espresso'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {`${gefiltert.length} Bilder in der Auswahl ${filter === 'alle' ? 'Alle' : kategorieLabels[filter]}.`}
      </p>

      <ul className="mt-8 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {angezeigt.map((bild, index) => (
          <li key={bild.src} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group block w-full text-left"
            >
              <span className={`relative block overflow-hidden bg-sand ${seitenverhaeltnis[bild.format]}`}>
                <Image
                  src={bild.src}
                  alt={bild.alt}
                  fill
                  loading={index < 6 ? 'eager' : 'lazy'}
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 47vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
                    bild.kategorie === 'fineline' ? 'grayscale' : ''
                  }`}
                />
              </span>
              <span className="mt-2 block text-xs text-ink">{bild.beschreibung}</span>
            </button>
          </li>
        ))}
      </ul>

      {mitNachladen && restAnzahl > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setSichtbar((anzahl) => anzahl + startAnzahl)}
            className="btn btn-secondary"
          >
            {`Mehr laden (${restAnzahl})`}
          </button>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          bilder={angezeigt}
          index={lightboxIndex}
          onSchliessen={() => setLightboxIndex(null)}
          onWechsel={setLightboxIndex}
        />
      )}
    </div>
  );
}
