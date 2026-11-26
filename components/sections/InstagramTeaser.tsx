import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { InstagramIcon } from '@/components/ui/Icons';
import { business, instagram } from '@/content/site';

/**
 * Statische Bilder, kein eingebettetes Instagram-Widget: So wird erst beim
 * Klick auf den Link eine Verbindung zu Meta aufgebaut – vorher fließen
 * keine Daten ab, und die Seite bleibt ohne Einwilligungsbanner.
 */
export default function InstagramTeaser() {
  return (
    <section aria-labelledby="instagram-titel" className="abschnitt bg-creme">
      <div className="huelle">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">{instagram.label}</p>
            <h2 id="instagram-titel" className="h-mittel mt-5 max-w-[16ch]">
              {instagram.titel}
            </h2>
            <p className="mass mt-4 text-leise-stark">{instagram.text}</p>
          </div>

          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="knopf knopf-linie whitespace-nowrap"
          >
            <InstagramIcon className="h-4 w-4" />
            Folge mir {business.instagramHandle}
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {instagram.bilder.map((bild, index) => (
            <li key={bild.src}>
              <Reveal delay={index * 0.05}>
                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-blush"
                >
                  <Image
                    src={bild.src}
                    alt={bild.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 16vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
