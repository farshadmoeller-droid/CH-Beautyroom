'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Enthuellen from '@/components/ui/Enthuellen';
import Filterleiste from '@/components/sections/Filterleiste';
import Lightbox from '@/components/sections/Lightbox';
import { galerie, galerieKategorien, type GalerieKategorie } from '@/content/site';

type Auswahl = 'alle' | GalerieKategorie;

/**
 * Die Galerie.
 *
 * Beim Filtern erscheinen die Kacheln nicht neu und sie werden nicht
 * gestaffelt. Das ist Absicht: Filtern ist eine Handlung, die jemand
 * mehrmals hintereinander ausführt, und ein Auftritt, der beim ersten
 * Mal hübsch ist, bremst beim dritten Mal. Die Bilder wechseln schlicht.
 */
export default function Gallery() {
  const [kategorie, setKategorie] = useState<Auswahl>('alle');
  const [offen, setOffen] = useState<number | null>(null);

  const sichtbar = useMemo(
    () => (kategorie === 'alle' ? galerie : galerie.filter((b) => b.kategorie === kategorie)),
    [kategorie],
  );

  // Mauerwerk über CSS-Spalten: Die Kacheln behalten ihr Seitenverhältnis,
  // ohne dass Höhen in JavaScript gerechnet werden.
  return (
    <section id="galerie" aria-labelledby="galerie-titel" className="bg-blush py-28 sm:py-36">
      <div className="huelle">
        <Enthuellen stufe={0} weg={16}>
          <p className="label">Galerie</p>
          <h2 id="galerie-titel" className="h-abschnitt mt-4">
            Arbeiten aus dem Studio
          </h2>
        </Enthuellen>

        <div className="mt-8 overflow-x-auto pb-2">
          <Filterleiste
            eintraege={galerieKategorien}
            aktiv={kategorie}
            auswaehlen={setKategorie}
            beschriftung="Galerie nach Leistung filtern"
          />
        </div>

        <div className="mt-10 columns-2 gap-4 sm:gap-5 lg:columns-4">
          {sichtbar.map((bild) => {
            const index = galerie.indexOf(bild);
            const verhaeltnis =
              bild.format === 'hoch' ? 'aspect-[3/4]' : bild.format === 'quer' ? 'aspect-[4/3]' : 'aspect-square';
            return (
              <button
                key={bild.src}
                type="button"
                onClick={() => setOffen(index)}
                className="group mb-4 block w-full break-inside-avoid sm:mb-5"
              >
                <span className={`relative block w-full overflow-hidden rounded-xl bg-creme ${verhaeltnis}`}>
                  <Image
                    src={bild.src}
                    alt={bild.alt}
                    fill
                    sizes="(min-width: 1024px) 23vw, 45vw"
                    className="object-cover"
                    style={{ transition: 'transform var(--dauer-flaeche) var(--ease-out)' }}
                  />
                  {bild.vorher ? (
                    <span className="label absolute bottom-3 left-3 rounded-full bg-espresso/70 px-3 py-1 text-creme">
                      Vorher / Nachher
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Lightbox bilder={galerie} index={offen} schliessen={() => setOffen(null)} wechseln={setOffen} />
    </section>
  );
}
