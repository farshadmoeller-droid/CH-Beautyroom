import Enthuellen from '@/components/ui/Enthuellen';
import { ablauf } from '@/content/site';

/**
 * Drei Schritte, kein Durchlauf.
 *
 * Dieser Abschnitt hatte eine große Bogenfläche, in der beim Scrollen ein
 * Bild zum jeweils aktiven Schritt überblendete. Zwei Gründe, warum das
 * weg ist:
 *
 * 1. Für „Beratung", „Behandlung" und „Pflege" gibt es keine echten
 *    Fotos, und es wird vermutlich auch keine geben – ein Homestudio
 *    inszeniert sein Beratungsgespräch nicht. Übrig blieb eine leere
 *    Fläche von 493 × 616 Pixeln, fast ein Drittel des Abschnitts.
 * 2. Die beiden nicht aktiven Schritte waren auf 45 % Deckkraft gesetzt,
 *    damit die Überblendung einen Bezug hat. Gemessen standen sie damit
 *    bei 1,58:1 – unter jeder Lesbarkeitsgrenze. Eine Bewegung, die Text
 *    unlesbar macht, verliert gegen den Text.
 *
 * Geblieben ist eine ruhige Dreiteilung: große Ziffer, Name, Satz, durch
 * Haarlinien getrennt. Nichts bewegt sich außer dem einen Auftritt, und
 * alle drei Schritte sind gleich gut lesbar – es gibt keinen „aktiven",
 * weil es nichts gibt, worauf er sich beziehen würde.
 */
export default function Process() {
  return (
    <section id="ablauf" aria-labelledby="ablauf-titel" className="huelle py-24 scroll-mt-24 sm:py-32">
      <Enthuellen className="max-w-2xl" stufe={0} weg={16}>
        <p className="label">{ablauf.label}</p>
        <h2 id="ablauf-titel" className="h-abschnitt mt-4">
          {ablauf.titel}
        </h2>
      </Enthuellen>

      <Enthuellen
        as="ol"
        stufe={110}
        weg={14}
        className="mt-14 grid border-t border-akzent-rand/30 lg:grid-cols-3"
      >
        {ablauf.schritte.map((schritt, index) => (
          <li
            key={schritt.nummer}
            className={`flex flex-col gap-4 border-akzent-rand/25 py-10 lg:py-12 ${
              index > 0 ? 'border-t lg:border-l lg:border-t-0 lg:pl-12' : ''
            } ${index < ablauf.schritte.length - 1 ? 'lg:pr-12' : ''}`}
          >
            <span aria-hidden="true" className="font-serif text-5xl leading-none text-akzent-text">
              {schritt.nummer}
            </span>
            <h3 className="h-klein">{schritt.titel}</h3>
            <p className="text-leise">{schritt.text}</p>
          </li>
        ))}
      </Enthuellen>
    </section>
  );
}
