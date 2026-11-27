'use client';

import { useEffect, useState } from 'react';
import { CheckIcon } from '@/components/ui/Icons';
import { business, termine } from '@/content/site';

/**
 * Ruhiger Erfolgszustand nach dem Absenden – kein Alert, kein Seitenwechsel.
 *
 * Das ist der seltenste Moment der Seite: einmal, nachdem jemand ein
 * Formular ausgefüllt hat. Hier darf Bewegung sein. Trotzdem kommt sie
 * ohne Bibliothek aus – vier Übergänge auf `opacity` und `transform`
 * kann CSS allein.
 *
 * Das Häkchen beginnt bei `scale(0.92)`, nicht bei null: Nichts in der
 * Wirklichkeit entsteht aus dem Nichts.
 */
export default function Erfolg({
  vorname,
  referenz,
  istTattoo,
}: {
  vorname: string;
  referenz: string;
  istTattoo: boolean;
}) {
  const [bereit, setBereit] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setBereit(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /** Schrumpfende Schritte – gleiche Abstände lesen sich mechanisch. */
  const auftritt = (stufe: number, weg = 12) => ({
    opacity: bereit ? 1 : 0,
    transform: bereit ? 'none' : `translateY(${weg}px)`,
    transition: `opacity 480ms var(--ease-out) ${stufe}ms, transform 480ms var(--ease-out) ${stufe}ms`,
  });

  return (
    <div className="py-6 text-center" role="status" aria-live="polite">
      <span
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink text-creme"
        style={{
          opacity: bereit ? 1 : 0,
          transform: bereit ? 'none' : 'scale(0.92)',
          transition: 'opacity 420ms var(--ease-out), transform 420ms var(--ease-out)',
        }}
      >
        <CheckIcon className="h-7 w-7" />
      </span>

      <h3 className="h-klein mt-8" style={auftritt(110)}>
        Danke, {vorname}.
      </h3>

      <p className="mass mx-auto mt-4 text-leise-stark" style={auftritt(190)}>
        {istTattoo
          ? `Deine Anfrage ist angekommen. Ich schaue sie mir in Ruhe an und melde mich innerhalb von ${termine.antwortzeit} bei dir – dann besprechen wir deine Idee und finden gemeinsam einen Termin.`
          : `Deine Anfrage ist angekommen. Ich melde mich innerhalb von ${termine.antwortzeit} mit einer verbindlichen Bestätigung. Bis dahin ist der Termin ein Wunschtermin.`}
      </p>

      <p className="mt-6 text-xs text-leise" style={auftritt(250, 8)}>
        Eine Eingangsbestätigung liegt in deinem Postfach. Referenz: {referenz}
      </p>

      <a
        href={business.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="knopf knopf-umriss mt-8"
        style={auftritt(300, 8)}
      >
        Auf Instagram vorbeischauen
      </a>
    </div>
  );
}
