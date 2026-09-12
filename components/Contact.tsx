import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, ClockIcon } from '@/components/Icons';
import { mailtoLink, siteConfig, whatsappLink } from '@/content/site-config';
import { blurDataURL } from '@/lib/blur';

const kartenLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ramsloh, Saterland')}`;

export default function Contact() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-titel" className="section scroll-mt-24 bg-cream">
      <div className="container-page">
        <SectionHeading
          id="kontakt-titel"
          eyebrow="Kontakt & Anfahrt"
          titel="So erreichst du mich"
          einleitung="Am liebsten über das Formular – dann habe ich gleich alles, was ich brauche. Du darfst mir aber genauso gut schreiben oder anrufen."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <dl className="border-t border-taupe">
              <div className="flex gap-4 border-b border-taupe py-5">
                <dt className="shrink-0">
                  <MailIcon className="h-5 w-5 text-clay-dark" />
                  <span className="sr-only">E-Mail</span>
                </dt>
                <dd>
                  <a href={mailtoLink} className="link-underline tap-target">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4 border-b border-taupe py-5">
                <dt className="shrink-0">
                  <PhoneIcon className="h-5 w-5 text-clay-dark" />
                  <span className="sr-only">Telefon und WhatsApp</span>
                </dt>
                <dd>
                  <a
                    href={`tel:${siteConfig.telefon.replace(/\s/g, '')}`}
                    className="link-underline tap-target"
                  >
                    {siteConfig.telefon}
                  </a>
                  <span className="mt-1 block text-sm text-ink">
                    Auch per{' '}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      WhatsApp
                    </a>{' '}
                    erreichbar.
                  </span>
                </dd>
              </div>

              <div className="flex gap-4 border-b border-taupe py-5">
                <dt className="shrink-0">
                  <InstagramIcon className="h-5 w-5 text-clay-dark" />
                  <span className="sr-only">Instagram</span>
                </dt>
                <dd>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline tap-target"
                  >
                    {siteConfig.instagramHandle}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4 border-b border-taupe py-5">
                <dt className="shrink-0">
                  <ClockIcon className="h-5 w-5 text-clay-dark" />
                  <span className="sr-only">Öffnungszeiten</span>
                </dt>
                <dd>
                  <p>{siteConfig.oeffnungszeitenText}</p>
                  <p className="mt-1 text-sm text-ink">{siteConfig.oeffnungszeitenHinweis}</p>
                  <p className="mt-1 text-sm text-ink">
                    Nachmittags und am Wochenende arbeite ich nicht.
                  </p>
                </dd>
              </div>

              <div className="flex gap-4 border-b border-taupe py-5">
                <dt className="shrink-0">
                  <PinIcon className="h-5 w-5 text-clay-dark" />
                  <span className="sr-only">Studio</span>
                </dt>
                <dd>
                  <p>{siteConfig.ortOeffentlich}</p>
                  <p className="measure mt-2 text-sm text-ink">
                    Mein Studio ist ein privates Homestudio. Die genaue Adresse und eine kurze Wegbeschreibung
                    bekommst du mit der Terminbestätigung. Im{' '}
                    <Link href="/impressum" className="link-underline">
                      Impressum
                    </Link>{' '}
                    findest du die vollständige Anschrift.
                  </p>
                </dd>
              </div>
            </dl>

            <p className="measure mt-8 text-sm text-ink">
              Ich arbeite für Kundinnen aus {siteConfig.einzugsgebiet.slice(0, -1).join(', ')} und{' '}
              {siteConfig.einzugsgebiet.at(-1)}.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src="/images/karte-ramsloh.jpg"
                  alt="Vereinfachte Kartengrafik der Region um Ramsloh im Saterland"
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="object-cover"
                />
              </div>
              <figcaption className="measure mt-4 text-sm text-ink">
                Diese Karte ist eine reine Grafik. Es wird keine Karte von einem fremden Anbieter geladen und
                keine Verbindung aufgebaut, solange du nicht selbst auf den Link unten klickst – deshalb
                braucht diese Seite kein Cookie-Banner.
              </figcaption>
            </figure>

            <a
              href={kartenLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-6"
            >
              Ramsloh bei Google Maps öffnen
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
