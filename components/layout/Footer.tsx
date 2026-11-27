import Link from 'next/link';
import { business, navigation } from '@/content/site';

/** Dunkle Fußzeile. Ohne Bewegung – hier liest niemand mehr, hier sucht man. */
export default function Footer() {
  return (
    <footer className="bg-espresso text-creme">
      <div className="huelle flex flex-col gap-12 py-20 lg:flex-row lg:gap-20">
        <div className="lg:flex-1">
          <p className="h-abschnitt">{business.name}</p>
          <p className="mass mt-4 text-creme/70">
            Homestudio in {business.plz} {business.ort}, {business.gemeinde}. Termine nur nach
            Vereinbarung, ausschließlich vormittags und ausschließlich für Frauen.
          </p>
        </div>

        <div>
          <p className="label text-akzent">Kontakt</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-creme/75">
            <li>
              <a href={`mailto:${business.email}`} className="underline-offset-4 hover:underline">
                {business.email}
              </a>
            </li>
            <li>
              <a href={`tel:${business.telefon.replace(/\s/g, '')}`} className="underline-offset-4 hover:underline">
                {business.telefon}
              </a>
            </li>
            <li>
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {business.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="label text-akzent">Seite</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-creme/75">
            {navigation.map((eintrag) => (
              <li key={eintrag.href}>
                <Link href={eintrag.href} className="underline-offset-4 hover:underline">
                  {eintrag.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label text-akzent">Rechtliches</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-creme/75">
            <li>
              <Link href="/impressum" className="underline-offset-4 hover:underline">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="underline-offset-4 hover:underline">
                Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="huelle border-t border-creme/15 py-7">
        <p className="text-sm text-creme/50">
          © {new Date().getFullYear()} {business.name} · Keine Preisangaben auf dieser Seite ·
          Kein Einwilligungsbanner, weil keine fremden Dienste geladen werden
        </p>
      </div>
    </footer>
  );
}
