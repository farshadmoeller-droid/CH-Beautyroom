'use client';

type ZusammenfassungProps = {
  zeilen: { label: string; wert: string; schritt?: number }[];
  onAendern?: (schritt: number) => void;
};

/** Uebersicht aller Angaben vor dem Absenden – mit Sprung zurueck zum Schritt. */
export default function Zusammenfassung({ zeilen, onAendern }: ZusammenfassungProps) {
  return (
    <dl className="border-t border-taupe">
      {zeilen.map((zeile) => (
        <div key={zeile.label} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-taupe py-3">
          <dt className="w-40 shrink-0 text-[0.7rem] uppercase tracking-[0.14em] text-ink">{zeile.label}</dt>
          <dd className="flex-1 whitespace-pre-line text-sm text-espresso">{zeile.wert}</dd>
          {onAendern && zeile.schritt !== undefined && (
            <button
              type="button"
              onClick={() => onAendern(zeile.schritt as number)}
              className="link-underline text-xs"
            >
              Ändern
              <span className="sr-only"> – {zeile.label}</span>
            </button>
          )}
        </div>
      ))}
    </dl>
  );
}
