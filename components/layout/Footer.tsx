import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import { ClockIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { business, navigation, termine } from '@/content/site';

const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
  'Hallo, ich habe eine Frage zu einem Termin im CH Beautyroom.',
)}`;

/**
 * Kontakt und Footer in dunklem Espresso – der Abschluss des Farbverlaufs,
 * der sich über die ganze Seite aufbaut.
 */
export default function Footer() {
  const jahr = new Date().getFullYear();

  return (
    <footer id="kontakt" className="bg-espresso text-creme">
      <div className="huelle abschnitt">
        <p className="label label-hell">Kontakt</p>
        <h2 className="h-gross mt-6 max-w-[14ch]">
          Schreib mir, <em className="italic">wir finden einen Termin.</em>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <dl className="border-t border-creme/15">
              <div className="flex gap-4 border-b border-creme/15 py-5">
                <dt className="shrink-0">
                  <MailIcon className="h-5 w-5 text-akzent" />
                  <span className="sr-only">E-Mail</span>
                </dt>
                <dd>
                  <a href={`mailto:${business.email}`} className="underline decoration-akzent underline-offset-4">
                    {business.email}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4 border-b border-creme/15 py-5">
                <dt className="shrink-0">
                  <PhoneIcon className="h-5 w-5 text-akzent" />
                  <span className="sr-only">Telefon</span>
                </dt>
                <dd>
                  <a
                    href={`tel:${business.telefon.replace(/\s/g, '')}`}
                    className="underline decoration-akzent underline-offset-4"
                  >
                    {business.telefon}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4 border-b border-creme/15 py-5">
                <dt className="shrink-0">
                  <ClockIcon className="h-5 w-5 text-akzent" />
                  <span className="sr-only">Zeiten</span>
                </dt>
                <dd>
                  <p>{termine.oeffnungszeitenText}</p>
                  <p className="mt-1 text-sm text-creme/70">{termine.hinweis}</p>
                </dd>
              </div>

              <div className="flex gap-4 border-b border-creme/15 py-5">
                <dt className="shrink-0">
                  <PinIcon className="h-5 w-5 text-akzent" />
                  <span className="sr-only">Studio</span>
                </dt>
                <dd>
                  <p>
                    {business.plz} {business.ort}, Gemeinde {business.gemeinde}
                  </p>
                  <p className="mass mt-2 text-sm text-creme/70">
                    Homestudio – die genaue Anfahrt bekommst du nach der Terminbestätigung. Die vollständige
                    Anschrift steht im{' '}
                    <Link href="/impressum" className="underline decoration-akzent underline-offset-4">
                      Impressum
                    </Link>
                    .
                  </p>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="knopf knopf-hell">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="knopf knopf-hell"
              >
                <InstagramIcon className="h-4 w-4" />
                {business.instagramHandle}
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-8">
            <p className="label label-hell">Einzugsgebiet</p>
            <p className="mass mt-5 text-sm text-creme/70">
              Ich arbeite für Kundinnen aus {business.einzugsgebiet.slice(0, -1).join(', ')} und{' '}
              {business.einzugsgebiet.at(-1)}.
            </p>

            <p className="label label-hell mt-10">Seite</p>
            <ul className="mt-4">
              {navigation.map((eintrag) => (
                <li key={eintrag.href}>
                  <Link
                    href={eintrag.href}
                    className="inline-flex min-h-11 items-center text-sm text-creme/75 transition-colors hover:text-creme"
                  >
                    {eintrag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-12 border-creme/15" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Logo hell />
          <div className="flex flex-col gap-3 sm:items-end">
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/impressum"
                  className="inline-flex min-h-11 items-center text-xs text-creme/65 transition-colors hover:text-creme"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="inline-flex min-h-11 items-center text-xs text-creme/65 transition-colors hover:text-creme"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
            <p className="text-xs text-creme/50">
              © {jahr} {business.name} · {business.inhaberin}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
