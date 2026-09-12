import Image from 'next/image';
import Reveal from '@/components/Reveal';
import BookingLink from '@/components/BookingLink';
import { bookableTreatments, services } from '@/content/services';
import { blurDataURL } from '@/lib/blur';

/**
 * Abwechselnde Bild-Text-Bloecke. Der Ringana-Bereich hat einen eigenen,
 * ruhigeren Abschnitt und wird hier bewusst ausgelassen.
 */
export default function ServiceDetails() {
  const bloecke = services.filter((service) => service.id !== 'ringana');

  return (
    <section aria-labelledby="leistungen-detail-titel" className="bg-cream pb-4 pt-4">
      <h2 id="leistungen-detail-titel" className="sr-only">
        Die Leistungen im Detail
      </h2>

      {bloecke.map((service, index) => {
        const linksBild = index % 2 === 0;
        const vorauswahl = bookableTreatments.find((treatment) => treatment.bereich === service.id);
        const istTattoo = service.id === 'fineline';

        return (
          <article
            key={service.id}
            id={service.anchor}
            aria-labelledby={`${service.anchor}-titel`}
            className="section scroll-mt-28 border-t border-taupe/60 first:border-t-0"
          >
            <div className="container-page">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <Reveal
                  className={`lg:col-span-6 ${linksBild ? 'lg:order-1' : 'lg:order-2 lg:col-start-7'}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <Image
                      src={service.bild}
                      alt={service.bildAlt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      className={`object-cover ${service.id === 'fineline' ? 'grayscale' : ''}`}
                    />
                  </div>
                </Reveal>

                <Reveal
                  delay={80}
                  className={`lg:col-span-6 ${linksBild ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <p className="eyebrow mb-4">{`0${index + 1} · Leistung`}</p>
                  <h3 id={`${service.anchor}-titel`} className="h-section">
                    {service.titel}
                  </h3>

                  <div className="measure mt-6 space-y-4 text-ink">
                    {service.text.map((absatz) => (
                      <p key={absatz.slice(0, 40)}>{absatz}</p>
                    ))}
                  </div>

                  <dl className="mt-9 border-t border-taupe">
                    {service.details.map((detail) => (
                      <div
                        key={detail.label}
                        className="flex flex-col gap-1 border-b border-taupe py-3 sm:flex-row sm:gap-6"
                      >
                        <dt className="shrink-0 text-[0.7rem] uppercase tracking-[0.14em] text-ink sm:w-44">
                          {detail.label}
                        </dt>
                        <dd className="text-sm text-espresso">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>

                  {service.hinweiseVorher.length > 0 && (
                    <div className="mt-8">
                      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-ink">
                        Wichtig vor deinem Termin
                      </p>
                      <ul className="measure mt-3 space-y-2 text-sm text-ink">
                        {service.hinweiseVorher.map((hinweis) => (
                          <li key={hinweis} className="flex gap-3">
                            <span aria-hidden="true" className="mt-2.5 block h-px w-3 shrink-0 bg-clay" />
                            <span>{hinweis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-8 border-l border-clay pl-4 text-sm italic text-ink">
                    Preise nenne ich dir gern persönlich im Beratungsgespräch oder auf Anfrage.
                  </p>

                  <BookingLink
                    art={istTattoo ? 'tattoo' : 'beauty'}
                    behandlung={istTattoo ? undefined : vorauswahl?.id}
                    className="btn btn-primary mt-8"
                  >
                    Diesen Termin anfragen
                  </BookingLink>
                </Reveal>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
