'use client';

import { useEffect, useRef, useState } from 'react';

export type SequenzStatus = {
  /** 0 bis 1 – Ladefortschritt für die Anzeige. */
  fortschritt: number;
  /** Erst wenn alle Frames da sind, läuft die Sequenz flüssig. */
  bereit: boolean;
  /** Konnte nicht einmal das erste Frame geladen werden. */
  fehlgeschlagen: boolean;
};

type Optionen = {
  /** Pfadvorlage mit {i} als Platzhalter für die vierstellige Nummer. */
  vorlage: string;
  anzahl: number;
  /** Nur jedes n-te Frame laden (für Mobilgeräte). */
  schrittweite?: number;
  /** Mit false wird gar nichts geladen – etwa bei reduzierter Bewegung. */
  aktiv?: boolean;
};

/** Gleichzeitig offene Anfragen. Mehr bringt nichts und blockiert nur. */
const PARALLEL = 8;

function pfadFuer(vorlage: string, nummer: number): string {
  return vorlage.replace('{i}', String(nummer).padStart(4, '0'));
}

/**
 * Lädt eine Bildfolge vor und meldet den Fortschritt.
 *
 * Die geladenen Bilder liegen in einem Ref, nicht im State: Sie ändern sich
 * nie und sollen kein erneutes Rendern auslösen. Gezeichnet wird daraus
 * später direkt auf das Canvas.
 */
export function useImageSequence({ vorlage, anzahl, schrittweite = 1, aktiv = true }: Optionen) {
  const bilderRef = useRef<Map<number, HTMLImageElement>>(new Map());
  /** Die tatsächlich geladenen Frame-Nummern, aufsteigend. */
  const nummernRef = useRef<number[]>([]);
  const [status, setStatus] = useState<SequenzStatus>({
    fortschritt: 0,
    bereit: false,
    fehlgeschlagen: false,
  });

  useEffect(() => {
    if (!aktiv || anzahl <= 0) return;

    let abgebrochen = false;

    const nummern: number[] = [];
    for (let i = 1; i <= anzahl; i += schrittweite) nummern.push(i);
    nummernRef.current = nummern;

    let geladen = 0;
    let fehler = 0;

    function ladeEines(nummer: number): Promise<void> {
      return new Promise((fertig) => {
        const bild = new Image();
        bild.decoding = 'async';
        bild.src = pfadFuer(vorlage, nummer);

        const abschluss = (erfolg: boolean) => {
          if (abgebrochen) return fertig();
          if (erfolg) {
            bilderRef.current.set(nummer, bild);
          } else {
            fehler += 1;
          }
          geladen += 1;
          setStatus((alt) => ({
            ...alt,
            fortschritt: geladen / nummern.length,
            // Ohne ein einziges Bild lohnt der Versuch nicht.
            fehlgeschlagen: fehler === geladen && geladen > 2,
          }));
          fertig();
        };

        bild.onload = () => abschluss(true);
        bild.onerror = () => abschluss(false);
      });
    }

    async function alleLaden() {
      // Das erste Frame zuerst und allein – damit sofort etwas zu sehen ist.
      await ladeEines(nummern[0]!);
      if (abgebrochen) return;

      const rest = nummern.slice(1);
      let naechster = 0;

      async function arbeiter() {
        while (!abgebrochen && naechster < rest.length) {
          const index = naechster++;
          await ladeEines(rest[index]!);
        }
      }

      await Promise.all(Array.from({ length: PARALLEL }, arbeiter));
      if (!abgebrochen) {
        setStatus((alt) => ({ ...alt, fortschritt: 1, bereit: bilderRef.current.size > 0 }));
      }
    }

    void alleLaden();

    return () => {
      abgebrochen = true;
    };
  }, [vorlage, anzahl, schrittweite, aktiv]);

  /** Liefert das Bild, das dem Fortschritt 0–1 am nächsten liegt. */
  function bildFuerFortschritt(fortschritt: number): HTMLImageElement | undefined {
    const nummern = nummernRef.current;
    if (nummern.length === 0) return undefined;

    const begrenzt = Math.min(Math.max(fortschritt, 0), 1);
    const index = Math.round(begrenzt * (nummern.length - 1));

    // Fehlt genau dieses Frame noch, das nächstgelegene vorhandene nehmen.
    for (let abstand = 0; abstand < nummern.length; abstand++) {
      const vor = bilderRef.current.get(nummern[index - abstand] ?? -1);
      if (vor) return vor;
      const zurueck = bilderRef.current.get(nummern[index + abstand] ?? -1);
      if (zurueck) return zurueck;
    }
    return undefined;
  }

  return { status, bildFuerFortschritt };
}
