import Image from 'next/image';
import Enthuellen from '@/components/ui/Enthuellen';
import { ueberMich } from '@/content/site';

/**
 * Über mich. Ein Abschnitt ohne eigene Bewegung außer dem Auftritt.
 *
 * Ein Auftritt pro Behälter: Bild und Text kommen als zwei Beats – das
 * Porträt zuerst (es ist die Hauptsache), der Text kurz darauf. Die
 * Merkmale darunter bekommen keinen eigenen Auftritt mehr, sie sind
 * einfach da. Drei Ebenen Auftritt hintereinander lässt die Leserin
 * warten, bis die Seite fertig vorgeführt hat.
 */
export default function About() {
  return (
    <section id="ueber-mich" aria-labelledby="ueber-mich-titel" className="huelle py-28 sm:py-36">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
        <Enthuellen className="lg:w-[42%]" stufe={0} weg={18}>
          <div className="bogen relative aspect-[3/4] w-full bg-blush">
            <Image
              src={ueberMich.portrait}
              alt={ueberMich.portraitAlt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-top"
            />
          </div>
        </Enthuellen>

        <Enthuellen className="flex flex-1 flex-col gap-6" stufe={110} weg={14}>
          <div>
            <p className="label">{ueberMich.label}</p>
            <h2 id="ueber-mich-titel" className="h-abschnitt mt-4">
              {ueberMich.titel}
            </h2>
          </div>

          {ueberMich.absaetze.map((absatz) => (
            <p key={absatz} className="mass text-leise">
              {absatz}
            </p>
          ))}

          <blockquote className="border-l-2 border-akzent pl-6">
            <p className="font-serif text-xl leading-snug sm:text-2xl">{ueberMich.zitat}</p>
          </blockquote>

          <dl className="mt-2 grid gap-6 sm:grid-cols-3">
            {ueberMich.merkmale.map((merkmal) => (
              <div key={merkmal.titel}>
                <dt className="label">{merkmal.titel}</dt>
                <dd className="mt-2 text-sm text-leise">{merkmal.text}</dd>
              </div>
            ))}
          </dl>
        </Enthuellen>
      </div>
    </section>
  );
}
