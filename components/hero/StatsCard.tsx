'use client';

import { useEffect, useRef, useState } from 'react';
import { hero } from '@/content/site';

type Props = {
  /** Fortschritt der angehefteten Sektion, 0 bis 1. */
  fortschritt: number;
  /** Ohne Animation werden die Endwerte sofort gezeigt. */
  reduziert: boolean;
};

/**
 * Schwebende Glas-Karte mit Kennzahlen. Die Zahlen zählen einmal hoch,
 * sobald die Karte erscheint – nicht bei jedem Scroll-Schritt neu.
 */
export default function StatsCard({ fortschritt, reduziert }: Props) {
  const sichtbarAb = hero.kennzahlen.bei;
  const roh = (fortschritt - sichtbarAb) / 0.12;
  const deckkraft = reduziert ? 1 : Math.min(Math.max(roh, 0), 1);

  const [gezaehlt, setGezaehlt] = useState(false);
  const laeuft = useRef(false);
  const [werte, setWerte] = useState<number[]>(() => hero.kennzahlen.werte.map(() => 0));

  // „Bewegung reduzieren“ steht erst nach dem ersten Rendern fest – der
  // Startwert oben kann es also noch nicht kennen. Dann sofort die
  // Endwerte zeigen, statt hochzuzählen.
  useEffect(() => {
    if (!reduziert) return;
    setWerte(hero.kennzahlen.werte.map((w) => w.wert));
    setGezaehlt(true);
  }, [reduziert]);

  useEffect(() => {
    if (reduziert || gezaehlt || laeuft.current || deckkraft < 0.6) return;
    laeuft.current = true;

    const dauer = 1100;
    const start = performance.now();
    const ziele = hero.kennzahlen.werte.map((w) => w.wert);

    let id = 0;
    const schritt = (jetzt: number) => {
      const t = Math.min((jetzt - start) / dauer, 1);
      // Schnell anlaufen, weich auslaufen.
      const weich = 1 - Math.pow(1 - t, 3);
      setWerte(ziele.map((ziel) => Math.round(ziel * weich)));
      if (t < 1) {
        id = requestAnimationFrame(schritt);
      } else {
        setGezaehlt(true);
      }
    };
    id = requestAnimationFrame(schritt);

    return () => cancelAnimationFrame(id);
  }, [deckkraft, gezaehlt, reduziert]);

  if (deckkraft <= 0.01) return null;

  return (
    <div
      className="glas-dunkel pointer-events-none w-[15rem] rounded-2xl p-5 text-creme sm:w-[17rem] sm:p-6"
      style={{
        opacity: deckkraft,
        transform: reduziert ? undefined : `translateY(${(1 - deckkraft) * 24}px)`,
      }}
    >
      <p className="text-[0.6rem] uppercase tracking-[0.24em] text-creme/60">{hero.kennzahlen.titel}</p>

      <dl className="mt-4 flex flex-col gap-4">
        {hero.kennzahlen.werte.map((eintrag, index) => (
          <div key={eintrag.label} className="border-t border-creme/15 pt-3 first:border-t-0 first:pt-0">
            <dt className="text-[0.72rem] text-creme/65">{eintrag.label}</dt>
            <dd className="mt-0.5 font-serif text-2xl tabular-nums">
              {'prefix' in eintrag && eintrag.prefix ? (
                <span className="text-base text-creme/70">{eintrag.prefix}</span>
              ) : null}
              {werte[index] ?? 0}
              {eintrag.suffix ? <span className="text-base text-creme/70">{eintrag.suffix}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
