import Image from 'next/image';
import Enthuellen from '@/components/ui/Enthuellen';
import { business, instagram } from '@/content/site';

/**
 * Instagram-Vorschau mit festen Bildern.
 *
 * Es wird keine Schnittstelle angebunden: Ein eingebundenes Instagram-Feed
 * würde fremde Skripte und Cookies nachladen – dann bräuchte die Seite ein
 * Einwilligungsbanner, und das will sie ausdrücklich nicht.
 */
export default function InstagramTeaser() {
  return (
    <section aria-labelledby="instagram-titel" className="bg-blush py-24 sm:py-28">
      <div className="huelle">
        <Enthuellen className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" stufe={0} weg={14}>
          <div>
            <p className="label">{instagram.label}</p>
            <h2 id="instagram-titel" className="h-abschnitt mt-4">
              {instagram.titel}
            </h2>
            <p className="mass mt-4 text-leise-stark">{instagram.text}</p>
          </div>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="knopf knopf-umriss shrink-0"
          >
            {business.instagramHandle}
          </a>
        </Enthuellen>

        <ul className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {instagram.bilder.map((bild) => (
            <li key={bild.src} className="group relative aspect-square overflow-hidden rounded-xl bg-creme">
              <Image
                src={bild.src}
                alt={bild.alt}
                fill
                sizes="(min-width: 1024px) 15vw, 30vw"
                className="object-cover"
                style={{ transition: 'transform var(--dauer-flaeche) var(--ease-out)' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
