'use client';

import { useEffect, useState } from 'react';
import BeautyForm from '@/components/booking/BeautyForm';
import TattooForm from '@/components/booking/TattooForm';
import { VORAUSWAHL_EVENT, type Vorauswahl } from '@/components/booking/vorauswahl';
import { business, formular } from '@/content/site';

type Reiter = 'beauty' | 'tattoo';

/**
 * Terminanfrage in zwei Reitern.
 *
 * Wichtig: Das ist kein Buchungssystem. Es wird nichts reserviert und
 * nichts gespeichert – die Angaben gehen als strukturierte E-Mail an
 * Carina, die den Termin persönlich bestätigt. Genau so steht es auch für
 * die Nutzerin sichtbar über dem Formular.
 */
export default function BookingSection() {
  const [reiter, setReiter] = useState<Reiter>('beauty');
  const [vorauswahl, setVorauswahl] = useState<string | undefined>();

  useEffect(() => {
    function beiVorauswahl(e: Event) {
      const detail = (e as CustomEvent<Vorauswahl>).detail;
      if (!detail) return;
      setReiter(detail.reiter);
      setVorauswahl(detail.leistung);
    }
    window.addEventListener(VORAUSWAHL_EVENT, beiVorauswahl);
    return () => window.removeEventListener(VORAUSWAHL_EVENT, beiVorauswahl);
  }, []);

  const reiterListe: { id: Reiter; label: string; beschreibung: string }[] = [
    { id: 'beauty', label: 'Beauty-Termin', beschreibung: 'Wimpern, Lash- und Brow Lifting' },
    { id: 'tattoo', label: 'Fineline-Tattoo', beschreibung: 'Motividee statt Kalender' },
  ];

  return (
    <section id="termin" aria-labelledby="termin-titel" className="abschnitt scroll-mt-24 bg-creme">
      <div className="huelle">
        <p className="label">Termin anfragen</p>
        <h2 id="termin-titel" className="h-gross mt-5 max-w-[14ch]">
          Lass uns <em className="italic">einen Termin finden.</em>
        </h2>
        <p className="mass mt-5 text-leise-stark">{formular.hinweis}</p>

        <div className="mt-12 rounded-2xl border border-akzent-rand/50 bg-blush/40 p-5 sm:p-8 lg:p-10">
          {/* Reiter */}
          <div role="tablist" aria-label="Art der Anfrage" className="flex flex-col gap-3 sm:flex-row">
            {reiterListe.map((eintrag) => {
              const aktiv = reiter === eintrag.id;
              return (
                <button
                  key={eintrag.id}
                  type="button"
                  role="tab"
                  id={`reiter-${eintrag.id}`}
                  aria-selected={aktiv}
                  aria-controls={`panel-${eintrag.id}`}
                  onClick={() => setReiter(eintrag.id)}
                  className={`flex-1 rounded-xl border px-5 py-4 text-left transition-colors duration-300 ${
                    aktiv
                      ? 'border-ink bg-ink text-creme'
                      : 'border-akzent-rand bg-white/40 text-ink hover:border-ink'
                  }`}
                >
                  <span className="block text-sm">{eintrag.label}</span>
                  <span className={`mt-0.5 block text-xs ${aktiv ? 'text-creme/70' : 'text-leise-stark'}`}>
                    {eintrag.beschreibung}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${reiter}`}
            aria-labelledby={`reiter-${reiter}`}
            className="mt-8"
          >
            {reiter === 'beauty' ? <BeautyForm vorauswahl={vorauswahl} /> : <TattooForm />}
          </div>
        </div>

        <p className="mass mt-6 text-xs text-leise-stark">
          Deine Angaben werden ausschließlich per E-Mail an mich übermittelt und nicht in einer Datenbank
          gespeichert. Lieber direkt? Schreib mir an{' '}
          <a href={`mailto:${business.email}`} className="underline decoration-akzent-rand underline-offset-4">
            {business.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
