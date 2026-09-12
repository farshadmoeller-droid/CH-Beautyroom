'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { siteConfig } from '@/content/site-config';

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
    <div className="bg-cream pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="container-page">
        <p className="eyebrow">Etwas ist schiefgelaufen</p>
        <h1 className="h-display mt-5 max-w-[18ch]">Das hat gerade nicht geklappt.</h1>
        <p className="measure mt-7 text-ink">
          Bitte lade die Seite noch einmal. Wenn es weiterhin nicht funktioniert, schreib mir einfach direkt
          an{' '}
          <a href={`mailto:${siteConfig.email}`} className="link-underline">
            {siteConfig.email}
          </a>
          {' '}– ich melde mich dann persönlich bei dir.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Erneut versuchen
          </button>
          <Link href="/" className="btn btn-secondary">
            Zur Startseite
          </Link>
        </div>

        {error.digest && <p className="mt-10 text-xs text-ink">Fehlernummer: {error.digest}</p>}
      </div>
    </div>
  );
}
