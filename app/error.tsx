'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { business } from '@/content/site';

export default function Fehlerseite({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-creme pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="huelle">
        <p className="label">Etwas ist schiefgelaufen</p>
        <h1 className="h-gross mt-5 max-w-[16ch]">Das hat gerade nicht geklappt.</h1>
        <p className="mass mt-6 text-leise-stark">
          Bitte lade die Seite noch einmal. Wenn es weiterhin nicht funktioniert, schreib mir direkt an{' '}
          <a href={`mailto:${business.email}`} className="underline decoration-akzent-rand underline-offset-4">
            {business.email}
          </a>{' '}
          – ich melde mich dann persönlich bei dir.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="knopf knopf-voll">
            Erneut versuchen
          </button>
          <Link href="/" className="knopf knopf-linie">
            Zur Startseite
          </Link>
        </div>
        {error.digest && <p className="mt-10 text-xs text-leise">Fehlernummer: {error.digest}</p>}
      </div>
    </div>
  );
}
