import Link from 'next/link';
import type { ReactNode } from 'react';

type LegalPageProps = {
  titel: string;
  eyebrow: string;
  einleitung?: string;
  stand: string;
  children: ReactNode;
};

/** Einheitlicher Rahmen fuer Impressum und Datenschutzerklaerung. */
export default function LegalPage({ titel, eyebrow, einleitung, stand, children }: LegalPageProps) {
  return (
    <div className="bg-cream pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="container-page">
        <nav aria-label="Brotkrümelnavigation" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-ink">
            <li>
              <Link href="/" className="link-underline tap-target">
                Startseite
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li aria-current="page">{titel}</li>
          </ol>
        </nav>

        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-display mt-5 max-w-[16ch]">{titel}</h1>
        {einleitung && <p className="measure mt-6 text-ink">{einleitung}</p>}

        <hr className="hairline my-12" />

        <div className="measure space-y-10 text-ink [&_a]:underline [&_a]:decoration-clay [&_a]:underline-offset-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-light [&_h2]:text-espresso [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-light [&_h3]:text-espresso [&_li]:pl-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>

        <p className="mt-16 text-xs text-ink">Stand: {stand}</p>
      </div>
    </div>
  );
}
