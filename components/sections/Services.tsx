'use client';

import Image from 'next/image';
import Link from 'next/link';
import Enthuellen from '@/components/ui/Enthuellen';
import { leistungen } from '@/content/site';

/**
 * Die Leistungen.
 *
 * Ursprünglich war hier eine angeheftete Sektion vorgesehen, durch die
 * die Karten beim Scrollen waagerecht wandern. Gebaut, gemessen,
 * verworfen – aus zwei Gründen:
 *
 * 1. Die Karten sind zusammen mit Überschrift und Kopfzeile höher als
 *    ein Laptop-Fenster. Damit sie passen, hätten die vier Stichpunkte
 *    je Leistung wegfallen müssen. Eine Bewegung, die Inhalt kostet,
 *    ist den Tausch nicht wert.
 * 2. Anheften nimmt der Besucherin das Scrollen aus der Hand. Wer
 *    weiterlesen will, muss erst durch vier Karten.
 *
 * Geblieben ist die waagerechte Geste, aber als echtes Scrollen: eine
 * Bahn mit Einrastpunkten, die man wischt oder mit dem Trackpad schiebt.
 * Das kostet keine Bibliothek, blockiert nichts und funktioniert auf dem
 * Telefon von selbst. Auf schmalen Schirmen stehen die Karten
 * untereinander – dort liest es sich besser.
 */
export default function Services() {
  return (
    <section id="leistungen" aria-labelledby="leistungen-titel" className="bg-blush py-28 scroll-mt-24 sm:py-36">
      <Enthuellen className="huelle" stufe={0} weg={16}>
        <p className="label">Leistungen</p>
        <h2 id="leistungen-titel" className="h-abschnitt mt-4">
          Was ich für dich mache
        </h2>
        <p className="mass mt-5 text-leise-stark lg:hidden">
          Vier Leistungen – tippe auf eine, um direkt anzufragen.
        </p>
      </Enthuellen>

      <Enthuellen
        stufe={110}
        weg={14}
        className="bahn mt-12"
      >
        {leistungen.map((leistung) => (
          <article
            key={leistung.id}
            id={leistung.id}
            className="flex shrink-0 snap-start flex-col gap-5 scroll-mt-24 max-lg:w-full lg:w-[360px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-creme">
              <Image
                src={leistung.bild}
                alt={leistung.alt}
                fill
                sizes="(min-width: 1024px) 360px, 100vw"
                className="object-cover"
              />
            </div>

            <h3 className="h-klein">{leistung.titel}</h3>
            <p className="text-leise-stark">{leistung.text}</p>

            <ul className="flex flex-col gap-2">
              {leistung.details.map((zeile) => (
                <li key={zeile} className="flex gap-3 text-sm text-leise-stark">
                  <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-akzent" />
                  {zeile}
                </li>
              ))}
            </ul>

            <Link href="#termin" className="label self-start underline underline-offset-4">
              {leistung.ueberTattooFormular ? 'Tattoo anfragen' : 'Termin anfragen'}
            </Link>
          </article>
        ))}
      </Enthuellen>
    </section>
  );
}
