'use client';

import { useId, useState, type ReactNode } from 'react';
import { PlusIcon } from '@/components/Icons';

export type AccordionEintrag = {
  titel: string;
  inhalt: ReactNode;
};

type AccordionProps = {
  eintraege: AccordionEintrag[];
  /** Auf hellem Sandton werden die Trennlinien etwas kraeftiger gesetzt. */
  variante?: 'cream' | 'sand';
};

/**
 * Barrierefreies Accordion: echte Buttons, aria-expanded, aria-controls und
 * vollstaendige Tastaturbedienung. Mehrere Panels duerfen gleichzeitig offen
 * sein – das ist beim Nachlesen von Pflegehinweisen angenehmer.
 */
export default function Accordion({ eintraege, variante = 'cream' }: AccordionProps) {
  const basisId = useId();
  const [offen, setOffen] = useState<number[]>([]);

  function umschalten(index: number) {
    setOffen((aktuell) =>
      aktuell.includes(index) ? aktuell.filter((eintrag) => eintrag !== index) : [...aktuell, index],
    );
  }

  const linie = variante === 'sand' ? 'border-taupe' : 'border-taupe/70';

  return (
    <div className={`border-t ${linie}`}>
      {eintraege.map((eintrag, index) => {
        const istOffen = offen.includes(index);
        const buttonId = `${basisId}-button-${index}`;
        const panelId = `${basisId}-panel-${index}`;

        return (
          <div key={eintrag.titel} className={`border-b ${linie}`}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={istOffen}
                aria-controls={panelId}
                onClick={() => umschalten(index)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="font-serif text-lg font-light leading-snug text-espresso sm:text-xl">
                  {eintrag.titel}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-1 shrink-0 text-ink transition-transform duration-300 ${
                    istOffen ? 'rotate-45' : ''
                  }`}
                >
                  <PlusIcon className="h-5 w-5" />
                </span>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!istOffen}>
              <div className="measure pb-7 pr-6 text-ink">{eintrag.inhalt}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
