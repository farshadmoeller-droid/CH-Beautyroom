'use client';

import { useEffect, useRef, useState } from 'react';
import { hero } from '@/content/site';
import { useBewegungReduziert } from '@/lib/use-reduced-motion';

/**
 * Die Glaskarte im Hero. Die Zahlen zählen beim ersten Erscheinen hoch.
 *
 * Das Hochzählen ist Beiwerk und nicht die Hauptsache des Hero – deshalb
 * kurz (900 ms), einmalig und ohne eigene Bewegung: Die Karte selbst
 * erscheint mit dem übrigen Hero, hier wandert nur der Zahlenwert.
 */
export default function Kennzahlen() {
  const ref = useRef<HTMLDivElement>(null);
  const reduziert = useBewegungReduziert();
  const [staende, setStaende] = useState<number[]>(() => hero.kennzahlen.werte.map(() => 0));

  useEffect(() => {
    const ziele = hero.kennzahlen.werte.map((w) => w.wert);

    // Weniger Bewegung: Der Wert steht sofort da. Eine laufende Zahl ist
    // genau die Art Bewegung, die bei dieser Einstellung stört.
    if (reduziert) {
      setStaende(ziele);
      return;
    }

    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setStaende(ziele);
      return;
    }

    let bild = 0;
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        if (!eintraege.some((e) => e.isIntersecting)) return;
        beobachter.disconnect();

        const dauer = 900;
        const start = performance.now();
        const schritt = (jetzt: number) => {
          const anteil = Math.min((jetzt - start) / dauer, 1);
          // Dieselbe Kurve wie --ease-out, damit die Zahl zum Rest passt.
          const weich = 1 - Math.pow(1 - anteil, 3);
          setStaende(ziele.map((z) => Math.round(z * weich)));
          if (anteil < 1) bild = requestAnimationFrame(schritt);
        };
        bild = requestAnimationFrame(schritt);
      },
      { threshold: 0.4 },
    );

    beobachter.observe(element);
    return () => {
      beobachter.disconnect();
      cancelAnimationFrame(bild);
    };
  }, [reduziert]);

  return (
    <div ref={ref} className="glas-dunkel w-full max-w-[330px] rounded-xl p-7">
      {/* Hier keine eigene Pille: Die Karte ist schon eine Fläche. Eine
          zweite darin sähe nach Aufkleber aus. */}
      <p className="label text-creme">{hero.kennzahlen.titel}</p>
      <dl className="mt-5 flex flex-col gap-5">
        {hero.kennzahlen.werte.map((wert, index) => (
          <div key={wert.label} className="flex flex-col gap-1">
            <dt className="text-sm text-creme/70">{wert.label}</dt>
            <dd className="font-serif text-[2.1rem] leading-none text-creme">
              {'prefix' in wert ? wert.prefix : ''}
              {staende[index] ?? 0}
              {'suffix' in wert ? wert.suffix : ''}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
