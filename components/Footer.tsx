import Link from 'next/link';
import Logo from '@/components/Logo';
import { InstagramIcon } from '@/components/Icons';
import { hauptnavigation, rechtsnavigation } from '@/lib/navigation';
import { siteConfig } from '@/content/site-config';

export default function Footer() {
  const jahr = new Date().getFullYear();

  return (
    <footer className="border-t border-taupe bg-sand">
      <div className="container-page py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo className="items-start text-left" />
            <p className="measure mt-6 text-sm text-ink">
              Homestudio für Wimpernverlängerung, Lash- und Browlifting sowie feine Fineline-Tattoos in
              {' '}{siteConfig.ortOeffentlich}. Termine ausschließlich nach Vereinbarung, immer 1:1.
            </p>

            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-espresso transition-opacity hover:opacity-70"
            >
              <InstagramIcon className="h-5 w-5" />
              {siteConfig.instagramHandle}
            </a>
          </div>

          <nav aria-label="Footer-Navigation" className="lg:col-span-3 lg:col-start-6">
            <p className="eyebrow">Seite</p>
            <ul className="mt-2">
              {hauptnavigation.map((eintrag) => (
                <li key={eintrag.href}>
                  <Link href={eintrag.href} className="inline-flex min-h-11 items-center text-sm text-ink transition-colors hover:text-espresso">
                    {eintrag.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/galerie" className="inline-flex min-h-11 items-center text-sm text-ink transition-colors hover:text-espresso">
                  Komplette Galerie
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow">Öffnungszeiten</p>
            <p className="mt-5 text-sm text-ink">{siteConfig.oeffnungszeitenText}</p>
            <p className="mt-2 text-sm text-ink">Samstag und Sonntag geschlossen</p>
            <p className="mt-4 text-sm text-ink">{siteConfig.oeffnungszeitenHinweis}</p>
            <Link href="/#termin" className="btn btn-secondary mt-6">
              Termin anfragen
            </Link>
          </div>
        </div>

        <hr className="hairline my-10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink">
            © {jahr} {siteConfig.studioName} · {siteConfig.inhaberinName}
          </p>
          <ul className="flex gap-6">
            {rechtsnavigation.map((eintrag) => (
              <li key={eintrag.href}>
                <Link
                  href={eintrag.href}
                  className="inline-flex min-h-11 items-center text-xs text-ink transition-colors hover:text-espresso"
                >
                  {eintrag.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
