import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  robots: { index: false, follow: false },
};

export default function NichtGefunden() {
  return (
    <div className="bg-cream pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="container-page">
        <p className="eyebrow">Fehler 404</p>
        <h1 className="h-display mt-5 max-w-[16ch]">Diese Seite gibt es nicht.</h1>
        <p className="measure mt-7 text-ink">
          Vielleicht hat sich ein Tippfehler eingeschlichen oder der Link ist veraltet. Von hier kommst du
          überall hin.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
          <Link href="/galerie" className="btn btn-secondary">
            Galerie
          </Link>
          <Link href="/#termin" className="btn btn-secondary">
            Termin anfragen
          </Link>
        </div>
      </div>
    </div>
  );
}
