import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { mailtoLink } from '@/content/site-config';
import { getService } from '@/content/services';
import { blurDataURL } from '@/lib/blur';

export default function Ringana() {
  const service = getService('ringana');

  return (
    <section id="ringana" aria-labelledby="ringana-titel" className="section scroll-mt-24 bg-cream">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              <Image
                src="/images/ringana.jpg"
                alt="Ringana Naturkosmetik auf hellem Leinen neben getrockneten Gräsern"
                fill
                sizes="(min-width: 1024px) 38vw, 92vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <p className="eyebrow" style={{ color: 'var(--color-sage-dark)' }}>
              Ringana
            </p>
            <h2 id="ringana-titel" className="h-section mt-4">
              Frische Naturkosmetik, ganz ohne Verkaufsdruck
            </h2>

            <div className="measure mt-6 space-y-4 text-ink">
              {service.text.map((absatz) => (
                <p key={absatz.slice(0, 40)}>{absatz}</p>
              ))}
            </div>

            <p
              className="mt-8 border-l pl-4 text-sm text-ink"
              style={{ borderColor: 'var(--color-sage)' }}
            >
              Kostenlose Produkttests und gelegentliche Info-Abende. Kein Shop, keine Preise, keine Nachfrage –
              sprich mich einfach an, wenn dich etwas interessiert.
            </p>

            <a href={mailtoLink} className="link-underline tap-target mt-8 inline-block text-sm">
              Schreib mir zu Ringana
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
