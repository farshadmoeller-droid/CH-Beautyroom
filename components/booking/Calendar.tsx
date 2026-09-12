'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';
import {
  formatiereDatumLang,
  fruehesterTag,
  isoPlusTage,
  jetztInBerlin,
  monatsRaster,
  monatsnamen,
  spaetesterTag,
  tagStatus,
  tageDazwischen,
  verschiebeMonat,
  wochentageKurz,
  type SperrGrund,
} from '@/lib/dates';

type CalendarProps = {
  /** Aktuell gewaehlter Tag im Format JJJJ-MM-TT oder null. */
  wert: string | null;
  onAuswahl: (iso: string) => void;
  /** ID der Fehlerzeile, die zu diesem Kalender gehoert. */
  beschriebenVon?: string;
};

const sperrText: Record<SperrGrund, string> = {
  vergangen: 'liegt in der Vergangenheit',
  vorlaufzeit: 'zu kurzfristig, ich brauche mindestens 24 Stunden Vorlauf',
  geschlossen: 'an diesem Wochentag ist geschlossen',
  blockiert: 'an diesem Tag bin ich nicht da',
  zuWeit: 'liegt zu weit in der Zukunft',
};

/**
 * Selbst gebauter Monatskalender – ohne Datepicker-Bibliothek.
 *
 * Bedienung per Tastatur: Pfeiltasten bewegen den Fokus, Pos1/Ende springen
 * an den Wochenanfang und das Wochenende, Bild auf/ab wechseln den Monat,
 * Enter oder Leertaste waehlen den Tag aus.
 */
export default function Calendar({ wert, onAuswahl, beschriebenVon }: CalendarProps) {
  const heute = useMemo(() => jetztInBerlin(), []);
  const startTag = wert ?? fruehesterTag();

  const [ansicht, setAnsicht] = useState(() => {
    const [jahr, monat] = startTag.split('-').map(Number);
    return { jahr: jahr ?? heute.jahr, monat: monat ?? heute.monat };
  });
  const [fokusTag, setFokusTag] = useState(startTag);
  const [fokusSetzen, setFokusSetzen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  const felder = useMemo(() => monatsRaster(ansicht.jahr, ansicht.monat), [ansicht]);
  const grenzeFrueh = useMemo(() => fruehesterTag(), []);
  const grenzeSpaet = useMemo(() => spaetesterTag(), []);

  const vorherigerMonatMoeglich =
    tageDazwischen(grenzeFrueh, `${ansicht.jahr}-${String(ansicht.monat).padStart(2, '0')}-01`) > 0;
  const naechsterMonatMoeglich = (() => {
    const naechster = verschiebeMonat(ansicht.jahr, ansicht.monat, 1);
    return tageDazwischen(`${naechster.jahr}-${String(naechster.monat).padStart(2, '0')}-01`, grenzeSpaet) >= 0;
  })();

  useEffect(() => {
    if (!fokusSetzen) return;
    const ziel = gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${fokusTag}"]`);
    ziel?.focus();
    setFokusSetzen(false);
  }, [fokusSetzen, fokusTag]);

  function bewege(tage: number) {
    const neu = isoPlusTage(fokusTag, tage);
    if (tageDazwischen(neu, grenzeSpaet) < 0) return;
    if (tageDazwischen(heute.iso, neu) < 0) return;

    const [jahr, monat] = neu.split('-').map(Number);
    if (jahr !== ansicht.jahr || monat !== ansicht.monat) {
      setAnsicht({ jahr: jahr ?? ansicht.jahr, monat: monat ?? ansicht.monat });
    }
    setFokusTag(neu);
    setFokusSetzen(true);
  }

  function wechsleMonat(schritte: number) {
    const neu = verschiebeMonat(ansicht.jahr, ansicht.monat, schritte);
    setAnsicht(neu);
    const tagImMonat = Math.min(Number(fokusTag.split('-')[2] ?? 1), 28);
    setFokusTag(`${neu.jahr}-${String(neu.monat).padStart(2, '0')}-${String(tagImMonat).padStart(2, '0')}`);
  }

  function beiTaste(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        bewege(1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        bewege(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        bewege(7);
        break;
      case 'ArrowUp':
        event.preventDefault();
        bewege(-7);
        break;
      case 'Home': {
        event.preventDefault();
        const wochentag = (new Date(`${fokusTag}T00:00:00Z`).getUTCDay() + 6) % 7;
        bewege(-wochentag);
        break;
      }
      case 'End': {
        event.preventDefault();
        const wochentag = (new Date(`${fokusTag}T00:00:00Z`).getUTCDay() + 6) % 7;
        bewege(6 - wochentag);
        break;
      }
      case 'PageUp':
        event.preventDefault();
        wechsleMonat(-1);
        break;
      case 'PageDown':
        event.preventDefault();
        wechsleMonat(1);
        break;
      default:
        break;
    }
  }

  const monatsTitel = `${monatsnamen[ansicht.monat - 1]} ${ansicht.jahr}`;

  return (
    <div className="border border-taupe bg-cream p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => wechsleMonat(-1)}
          disabled={!vorherigerMonatMoeglich}
          className="flex h-11 w-11 items-center justify-center border border-control transition-colors hover:border-espresso disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="sr-only">Vorheriger Monat</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        <p aria-live="polite" className="font-serif text-xl font-light text-espresso">
          {monatsTitel}
        </p>

        <button
          type="button"
          onClick={() => wechsleMonat(1)}
          disabled={!naechsterMonatMoeglich}
          className="flex h-11 w-11 items-center justify-center border border-control transition-colors hover:border-espresso disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="sr-only">Nächster Monat</span>
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={`Wunschtag auswählen, ${monatsTitel}`}
        aria-describedby={beschriebenVon}
        onKeyDown={beiTaste}
        className="mt-5"
      >
        <div role="row" className="grid grid-cols-7 gap-1">
          {wochentageKurz.map((tag) => (
            <div
              key={tag}
              role="columnheader"
              className="pb-2 text-center text-[0.65rem] uppercase tracking-[0.14em] text-ink"
            >
              {tag}
            </div>
          ))}
        </div>

        {Array.from({ length: Math.ceil(felder.length / 7) }, (_, zeile) => (
          <div key={zeile} role="row" className="grid grid-cols-7 gap-1">
            {felder.slice(zeile * 7, zeile * 7 + 7).map((feld, spalte) => {
              if (!feld) {
                return <div key={`leer-${zeile}-${spalte}`} role="gridcell" aria-hidden="true" />;
              }

              const status = tagStatus(feld.iso);
              const gewaehlt = wert === feld.iso;
              const istHeute = feld.iso === heute.iso;

              const beschreibung = status.auswaehlbar
                ? formatiereDatumLang(feld.iso)
                : `${formatiereDatumLang(feld.iso)} – nicht buchbar, ${sperrText[status.grund ?? 'geschlossen']}`;

              return (
                <button
                  key={feld.iso}
                  type="button"
                  role="gridcell"
                  data-iso={feld.iso}
                  aria-label={beschreibung}
                  aria-selected={gewaehlt}
                  aria-disabled={!status.auswaehlbar}
                  aria-current={istHeute ? 'date' : undefined}
                  tabIndex={feld.iso === fokusTag ? 0 : -1}
                  onFocus={() => setFokusTag(feld.iso)}
                  onClick={() => {
                    if (!status.auswaehlbar) return;
                    onAuswahl(feld.iso);
                  }}
                  className={`flex aspect-square min-h-11 items-center justify-center border text-sm transition-colors duration-200 ${
                    gewaehlt
                      ? 'border-espresso bg-espresso text-cream'
                      : status.auswaehlbar
                        ? 'border-transparent bg-sand text-espresso hover:border-clay hover:bg-taupe/60'
                        : 'cursor-not-allowed border-transparent bg-transparent text-ink/35'
                  } ${istHeute && !gewaehlt ? 'border-clay' : ''}`}
                >
                  {feld.tag}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-ink">
        Grau hinterlegte Tage sind nicht buchbar: Wochenenden, Urlaub und alles innerhalb der nächsten 24
        Stunden. Ich arbeite ausschließlich vormittags zwischen 08:00 und 12:00 Uhr.
      </p>
    </div>
  );
}
