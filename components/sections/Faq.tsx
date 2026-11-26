'use client';

import { useId, useState } from 'react';
import { PlusIcon } from '@/components/ui/Icons';
import { faq } from '@/content/site';

/**
 * Barrierefreies Akkordeon: echte Buttons, aria-expanded und aria-controls,
 * vollständig mit der Tastatur bedienbar. Mehrere Antworten dürfen
 * gleichzeitig offen sein – beim Nachlesen ist das angenehmer.
 */
export default function Faq() {
  const basisId = useId();
  const [offen, setOffen] = useState<number[]>([]);

  function umschalten(index: number) {
    setOffen((aktuell) =>
      aktuell.includes(index) ? aktuell.filter((i) => i !== index) : [...aktuell, index],
    );
  }

  return (
    <section id="faq" aria-labelledby="faq-titel" className="abschnitt bg-blush">
      <div className="huelle">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="label">Häufige Fragen</p>
            <h2 id="faq-titel" className="h-gross mt-5 max-w-[10ch]">
              Gut <em className="italic">zu wissen</em>
            </h2>
            <p className="mass mt-5 text-leise-stark">
              Steht deine Frage nicht dabei? Schreib mir einfach – ich antworte dir persönlich.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-ink/15">
              {faq.map((eintrag, index) => {
                const istOffen = offen.includes(index);
                const buttonId = `${basisId}-b-${index}`;
                const panelId = `${basisId}-p-${index}`;

                return (
                  <div key={eintrag.frage} className="border-b border-ink/15">
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={istOffen}
                        aria-controls={panelId}
                        onClick={() => umschalten(index)}
                        className="flex w-full items-start justify-between gap-6 py-5 text-left"
                      >
                        <span className="font-serif text-lg leading-snug sm:text-xl">{eintrag.frage}</span>
                        <span
                          aria-hidden="true"
                          className={`mt-1 shrink-0 text-akzent-text transition-transform duration-300 ${
                            istOffen ? 'rotate-45' : ''
                          }`}
                        >
                          <PlusIcon className="h-5 w-5" />
                        </span>
                      </button>
                    </h3>

                    <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!istOffen}>
                      <p className="mass pb-7 pr-6 text-leise-stark">{eintrag.antwort}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
