'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/Icons';
import {
  formatiereDatumLang,
  fruehesterTag,
  isoPlusTage,
  jetztInBerlin,
  monatsRaster,
  monatsnamen,
  tagStatus,
  tageDazwischen,
  verschiebeMonat,
  wochentageKurz,
  type SperrGrund,
} from '@/lib/dates';
import { termine } from '@/content/site';

type Props = {
  wert: string | null;
  onAuswahl: (iso: string) => void;
  beschriebenVon?: string;
};

const sperrText: Record<SperrGrund, string> = {
  vergangen: 'liegt in der Vergangenheit',
  vorlaufzeit: 'zu kurzfristig, ich brauche mindestens 24 Stunden Vorlauf',
  geschlossen: 'an diesem Wochentag ist geschlossen',
  gesperrt: 'an diesem Tag bin ich nicht da',
  zuWeit: 'liegt zu weit in der Zukunft',
};

/**
 * Selbst gebauter Monatskalender – ohne Datepicker-Bibliothek.
 *
 * Tastatur: Pfeiltasten bewegen den Fokus, Pos1/Ende springen an
 * Wochenanfang und -ende, Bild auf/ab wechseln den Monat, Enter oder
 * Leertaste wählen aus.
 */
export default function Calendar({ wert, onAuswahl, beschriebenVon }: Props) {
  const heute = useMemo(() => jetztInBerlin(), []);
  const start = wert ?? fruehesterTag();

  const [ansicht, setAnsicht] = useState(() => {
    const [jahr, monat] = start.split('-').map(Number);
    return { jahr: jahr ?? heute.jahr, monat: monat ?? heute.monat };
  });
  const [fokusTag, setFokusTag] = useState(start);
  const [fokusSetzen, setFokusSetzen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const felder = useMemo(() => monatsRaster(ansicht.jahr, ansicht.monat), [ansicht]);
  const grenzeFrueh = useMemo(() => fruehesterTag(), []);
  const grenzeSpaet = useMemo(() => isoPlusTage(heute.iso, termine.maxVorausTage), [heute.iso]);

  const zurueckMoeglich =
    tageDazwischen(grenzeFrueh, `${ansicht.jahr}-${String(ansicht.monat).padStart(2, '0')}-01`) > 0;
  const vorMoeglich = (() => {
    const n = verschiebeMonat(ansicht.jahr, ansicht.monat, 1);
    return tageDazwischen(`${n.jahr}-${String(n.monat).padStart(2, '0')}-01`, grenzeSpaet) >= 0;
  })();

  useEffect(() => {
    if (!fokusSetzen) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${fokusTag}"]`)?.focus();
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
    const tag = Math.min(Number(fokusTag.split('-')[2] ?? 1), 28);
    setFokusTag(`${neu.jahr}-${String(neu.monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`);
  }

  function beiTaste(e: React.KeyboardEvent<HTMLDivElement>) {
    const wochentag = (new Date(`${fokusTag}T00:00:00Z`).getUTCDay() + 6) % 7;
    const aktionen: Record<string, () => void> = {
      ArrowRight: () => bewege(1),
      ArrowLeft: () => bewege(-1),
      ArrowDown: () => bewege(7),
      ArrowUp: () => bewege(-7),
      Home: () => bewege(-wochentag),
      End: () => bewege(6 - wochentag),
      PageUp: () => wechsleMonat(-1),
      PageDown: () => wechsleMonat(1),
    };
    const aktion = aktionen[e.key];
    if (!aktion) return;
    e.preventDefault();
    aktion();
  }

  const titel = `${monatsnamen[ansicht.monat - 1]} ${ansicht.jahr}`;

  return (
    <div className="rounded-xl border border-akzent-rand bg-white/50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => wechsleMonat(-1)}
          disabled={!zurueckMoeglich}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-akzent-rand transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="sr-only">Vorheriger Monat</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        <p aria-live="polite" className="font-serif text-xl">
          {titel}
        </p>

        <button
          type="button"
          onClick={() => wechsleMonat(1)}
          disabled={!vorMoeglich}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-akzent-rand transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="sr-only">Nächster Monat</span>
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={`Wunschtag auswählen, ${titel}`}
        aria-describedby={beschriebenVon}
        onKeyDown={beiTaste}
        className="mt-4"
      >
        <div role="row" className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {wochentageKurz.map((tag) => (
            <div key={tag} role="columnheader" className="pb-2 text-center text-[0.62rem] uppercase tracking-[0.12em] text-leise-stark">
              {tag}
            </div>
          ))}
        </div>

        {Array.from({ length: Math.ceil(felder.length / 7) }, (_, zeile) => (
          <div key={zeile} role="row" className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {felder.slice(zeile * 7, zeile * 7 + 7).map((feld, spalte) => {
              if (!feld) return <div key={`leer-${zeile}-${spalte}`} role="gridcell" aria-hidden="true" />;

              const status = tagStatus(feld.iso);
              const gewaehlt = wert === feld.iso;
              const istHeute = feld.iso === heute.iso;

              return (
                <button
                  key={feld.iso}
                  type="button"
                  role="gridcell"
                  data-iso={feld.iso}
                  aria-label={
                    status.frei
                      ? formatiereDatumLang(feld.iso)
                      : `${formatiereDatumLang(feld.iso)} – nicht buchbar, ${sperrText[status.grund ?? 'geschlossen']}`
                  }
                  aria-selected={gewaehlt}
                  aria-disabled={!status.frei}
                  aria-current={istHeute ? 'date' : undefined}
                  tabIndex={feld.iso === fokusTag ? 0 : -1}
                  onFocus={() => setFokusTag(feld.iso)}
                  onClick={() => status.frei && onAuswahl(feld.iso)}
                  className={`flex min-h-11 items-center justify-center rounded-lg border text-sm transition-colors duration-200 ${
                    gewaehlt
                      ? 'border-ink bg-ink text-creme'
                      : status.frei
                        ? 'border-transparent bg-blush/60 text-ink hover:border-akzent-rand'
                        : 'cursor-not-allowed border-transparent text-leise/35'
                  } ${istHeute && !gewaehlt ? 'border-akzent-rand' : ''}`}
                >
                  {feld.tag}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-leise-stark">
        Grau hinterlegte Tage sind nicht buchbar: Wochenenden, Urlaub und alles innerhalb der nächsten
        24 Stunden. Termine finden ausschließlich vormittags zwischen 08:00 und 12:00 Uhr statt.
      </p>
    </div>
  );
}
