import Link from 'next/link';
import type { ReactNode } from 'react';

/** Einheitlicher Rahmen für Impressum und Datenschutzerklärung. */
export default function RechtsSeite({
  titel,
  einleitung,
  stand,
  children,
}: {
  titel: string;
  einleitung?: string;
  stand: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-creme pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="huelle">
        <nav aria-label="Brotkrümelnavigation" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-leise-stark">
            <li>
              <Link href="/" className="underline decoration-akzent-rand underline-offset-4">
                Startseite
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li aria-current="page">{titel}</li>
          </ol>
        </nav>

        <p className="label">Rechtliches</p>
        <h1 className="h-gross mt-5 max-w-[16ch]">{titel}</h1>
        {einleitung && <p className="mass mt-6 text-leise-stark">{einleitung}</p>}

        <hr className="my-12 border-ink/12" />

        <div className="mass space-y-10 text-leise-stark [&_a]:underline [&_a]:decoration-akzent-rand [&_a]:underline-offset-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-ink [&_li]:pl-1 [&_p]:mt-3 [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>

        <p className="mt-16 text-xs text-leise">Stand: {stand}</p>
      </div>
    </div>
  );
}
