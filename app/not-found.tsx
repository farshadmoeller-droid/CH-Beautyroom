import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Seite nicht gefunden', robots: { index: false, follow: false } };

export default function NichtGefunden() {
  return (
    <div className="bg-creme pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="huelle">
        <p className="label">Fehler 404</p>
        <h1 className="h-gross mt-5 max-w-[14ch]">
          Diese Seite <em className="italic">gibt es nicht.</em>
        </h1>
        <p className="mass mt-6 text-leise-stark">
          Vielleicht hat sich ein Tippfehler eingeschlichen oder der Link ist veraltet. Von hier kommst
          du überall hin.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="knopf knopf-voll">
            Zur Startseite
          </Link>
          <Link href="/#termin" className="knopf knopf-linie">
            Termin anfragen
          </Link>
        </div>
      </div>
    </div>
  );
}
