'use client';

import { useEffect, useRef, useState } from 'react';
import BeautyFlow from '@/components/booking/BeautyFlow';
import TattooForm from '@/components/booking/TattooForm';
import Fortschritt from '@/components/booking/Fortschritt';
import SectionHeading from '@/components/SectionHeading';
import { ArrowRightIcon } from '@/components/Icons';
import { VORAUSWAHL_EVENT, type Vorauswahl } from '@/components/BookingLink';
import { mailtoLink, siteConfig } from '@/content/site-config';

type Weg = 'beauty' | 'tattoo' | null;

/**
 * Herzstueck der Seite: die Terminanfrage.
 *
 * Wichtig: Das ist kein Buchungssystem. Es wird nichts reserviert und nichts
 * gespeichert – die Angaben gehen als strukturierte E-Mail an die Inhaberin,
 * die den Termin persoenlich bestaetigt. Genau so steht es auch fuer die
 * Nutzerin sichtbar ueber dem Formular.
 */
export default function BookingSection() {
  const [weg, setWeg] = useState<Weg>(null);
  const [vorauswahl, setVorauswahl] = useState<string | undefined>(undefined);
  const bereichRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function beiVorauswahl(event: Event) {
      const detail = (event as CustomEvent<Vorauswahl>).detail;
      if (!detail) return;
      setWeg(detail.art);
      setVorauswahl(detail.behandlung);
    }

    window.addEventListener(VORAUSWAHL_EVENT, beiVorauswahl);
    return () => window.removeEventListener(VORAUSWAHL_EVENT, beiVorauswahl);
  }, []);

  function zurueckZurWahl() {
    setWeg(null);
    setVorauswahl(undefined);
    bereichRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  return (
    <section id="termin" aria-labelledby="termin-titel" className="section scroll-mt-24 bg-sand">
      <div className="container-page" ref={bereichRef}>
        <SectionHeading
          id="termin-titel"
          eyebrow="Terminanfrage"
          titel="Lass uns einen Termin finden"
          einleitung="Das hier ist eine Anfrage, keine feste Buchung. Du schickst mir deinen Wunsch, ich melde mich innerhalb von 24 Stunden mit einer verbindlichen Bestätigung."
        />

        <div className="mt-12 border border-taupe bg-cream p-6 sm:p-10">
          {weg === null && (
            <div>
              <Fortschritt schritte={['Was möchtest du?', 'Details', 'Prüfen & senden']} aktiv={0} />

              <h3 className="h-card mt-10 font-serif">Was möchtest du anfragen?</h3>

              <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setWeg('beauty')}
                  className="group flex flex-col items-start border border-control bg-cream p-6 text-left transition-colors hover:border-espresso sm:p-8"
                >
                  <span className="eyebrow">Weg 1</span>
                  <span className="mt-3 font-serif text-2xl font-light text-espresso">Beauty-Behandlung</span>
                  <span className="mt-3 text-sm text-ink">
                    Wimpernverlängerung, Lashlifting, Browlifting oder eine Ringana-Beratung. Du wählst deine
                    Leistung und ein Wunsch-Zeitfenster im Kalender.
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-espresso">
                    Weiter zum Kalender
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWeg('tattoo')}
                  className="group flex flex-col items-start border border-control bg-cream p-6 text-left transition-colors hover:border-espresso sm:p-8"
                >
                  <span className="eyebrow">Weg 2</span>
                  <span className="mt-3 font-serif text-2xl font-light text-espresso">Fineline-Tattoo</span>
                  <span className="mt-3 text-sm text-ink">
                    Jedes Tattoo ist unterschiedlich aufwendig. Erzähl mir zuerst von deiner Idee — den
                    passenden Termin finden wir dann gemeinsam.
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-espresso">
                    Idee beschreiben
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </div>

              <p className="mt-8 text-sm text-ink">
                Lieber direkt? Schreib mir an{' '}
                <a href={mailtoLink} className="link-underline">
                  {siteConfig.email}
                </a>{' '}
                oder auf Instagram unter{' '}
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  {siteConfig.instagramHandle}
                </a>
                .
              </p>
            </div>
          )}

          {weg === 'beauty' && <BeautyFlow vorauswahl={vorauswahl} onZurueckZurWahl={zurueckZurWahl} />}
          {weg === 'tattoo' && <TattooForm onZurueckZurWahl={zurueckZurWahl} />}
        </div>

        <p className="measure mt-6 text-xs text-ink">
          Deine Angaben werden ausschließlich per E-Mail an mich übermittelt und nicht in einer Datenbank
          gespeichert. Alles Weitere steht in der Datenschutzerklärung.
        </p>
      </div>
    </section>
  );
}
