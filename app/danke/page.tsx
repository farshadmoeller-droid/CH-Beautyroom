import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/content/site-config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Danke für deine Anfrage',
  description: 'Deine Anfrage ist im CH Beautyroom angekommen. Ich melde mich innerhalb von 24 Stunden.',
  alternates: { canonical: '/danke' },
  robots: { index: false, follow: true },
};

export default function DankePage() {
  return (
    <div className="bg-cream pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="container-page">
        <p className="eyebrow">Anfrage verschickt</p>
        <h1 className="h-display mt-5 max-w-[18ch]">Deine Anfrage ist angekommen.</h1>

        <p className="measure mt-7 text-lg text-ink">
          Ich melde mich innerhalb von 24 Stunden bei dir. Erst mit meiner persönlichen Bestätigung ist dein
          Termin verbindlich – bis dahin ist alles ein Wunschtermin.
        </p>

        <div className="mt-12 border-t border-taupe pt-10">
          <h2 className="h-card font-serif">Was jetzt passiert</h2>
          <ol className="measure mt-6 space-y-5 text-ink">
            <li className="flex gap-4">
              <span aria-hidden="true" className="font-serif text-2xl font-light text-clay-dark">
                01
              </span>
              <span>
                Du bekommst gleich eine Eingangsbestätigung per E-Mail, in der alle deine Angaben noch einmal
                zusammengefasst sind. Schau bitte auch im Spam-Ordner nach.
              </span>
            </li>
            <li className="flex gap-4">
              <span aria-hidden="true" className="font-serif text-2xl font-light text-clay-dark">
                02
              </span>
              <span>
                Ich schaue mir deine Anfrage in Ruhe an und melde mich mit einer verbindlichen Bestätigung –
                oder mit einem Alternativvorschlag, falls dein Wunschtermin schon vergeben ist.
              </span>
            </li>
            <li className="flex gap-4">
              <span aria-hidden="true" className="font-serif text-2xl font-light text-clay-dark">
                03
              </span>
              <span>
                Mit der Bestätigung bekommst du die genaue Adresse meines Homestudios und eine kurze
                Wegbeschreibung.
              </span>
            </li>
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {`Auf Instagram vorbeischauen (${siteConfig.instagramHandle})`}
          </a>
          <Link href="/galerie" className="btn btn-secondary">
            Galerie ansehen
          </Link>
          <Link href="/" className="btn btn-secondary">
            Zur Startseite
          </Link>
        </div>

        <p className="measure mt-12 text-sm text-ink">
          Ist etwas dazwischengekommen oder hast du dich vertippt? Schreib mir einfach an{' '}
          <a href={`mailto:${siteConfig.email}`} className="link-underline">
            {siteConfig.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
