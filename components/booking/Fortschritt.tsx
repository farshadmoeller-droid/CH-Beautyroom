'use client';

type FortschrittProps = {
  schritte: string[];
  /** Nullbasierter Index des aktuellen Schritts. */
  aktiv: number;
};

/** Schlanke Fortschrittsanzeige ueber dem Formular. */
export default function Fortschritt({ schritte, aktiv }: FortschrittProps) {
  return (
    <ol
      aria-label={`Schritt ${aktiv + 1} von ${schritte.length}`}
      className="flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      {schritte.map((schritt, index) => {
        const erledigt = index < aktiv;
        const istAktiv = index === aktiv;

        return (
          <li key={schritt} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[0.7rem] ${
                istAktiv
                  ? 'border-espresso bg-espresso text-cream'
                  : erledigt
                    ? 'border-clay-dark bg-clay-dark text-cream'
                    : 'border-taupe text-ink'
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`text-[0.7rem] uppercase tracking-[0.14em] ${
                istAktiv ? 'text-espresso' : 'text-ink'
              }`}
            >
              {schritt}
              {istAktiv && <span className="sr-only"> – aktueller Schritt</span>}
            </span>
            {index < schritte.length - 1 && (
              <span aria-hidden="true" className="hidden h-px w-8 bg-taupe sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
