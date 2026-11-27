'use client';

import { useRef, useState } from 'react';
import Enthuellen from '@/components/ui/Enthuellen';
import { faq } from '@/content/site';

/**
 * Fragen und Antworten.
 *
 * Das Aufklappen animiert `height` – die eine Stelle auf dieser Seite, an
 * der das in Ordnung geht, weil es für „von null auf Inhaltshöhe" keine
 * Entsprechung mit `transform` gibt. Dafür bleibt es kurz: 200 ms. Eine
 * Eigenschaft, die in jedem Bild das Layout neu rechnen lässt, darf nicht
 * lange laufen.
 *
 * Die Zielhöhe wird gemessen, nicht auf `auto` animiert – `auto` lässt
 * sich nicht interpolieren.
 */
export default function Faq() {
  const [offen, setOffen] = useState<number | null>(0);
  const inhalte = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section id="fragen" aria-labelledby="fragen-titel" className="huelle py-28 sm:py-36">
      <Enthuellen stufe={0} weg={16}>
        <p className="label">Fragen</p>
        <h2 id="fragen-titel" className="h-abschnitt mt-4">
          Gut zu wissen
        </h2>
      </Enthuellen>

      <ul className="mx-auto mt-12 max-w-3xl">
        {faq.map((eintrag, index) => {
          const ist = offen === index;
          const hoehe = ist ? (inhalte.current[index]?.scrollHeight ?? 0) : 0;
          return (
            <li key={eintrag.frage} className="border-b border-akzent-rand/40">
              <h3>
                <button
                  type="button"
                  onClick={() => setOffen(ist ? null : index)}
                  aria-expanded={ist}
                  aria-controls={`antwort-${index}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg">{eintrag.frage}</span>
                  <span
                    aria-hidden="true"
                    className="relative block h-5 w-5 shrink-0"
                    style={{
                      transform: ist ? 'rotate(45deg)' : 'none',
                      transition: 'transform var(--dauer-klein) var(--ease-out)',
                    }}
                  >
                    <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-akzent-text" />
                    <span className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-akzent-text" />
                  </span>
                </button>
              </h3>

              <div
                id={`antwort-${index}`}
                role="region"
                className="overflow-hidden"
                style={{
                  height: hoehe,
                  opacity: ist ? 1 : 0,
                  transition: 'height var(--dauer-klein) var(--ease-out), opacity var(--dauer-klein) var(--ease-out)',
                }}
              >
                <div
                  ref={(el) => {
                    inhalte.current[index] = el;
                  }}
                  className="pb-6"
                >
                  <p className="mass text-leise">{eintrag.antwort}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
