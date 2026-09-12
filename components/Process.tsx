import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { ablauf } from '@/content/ablauf';

export default function Process() {
  return (
    <section id="ablauf" aria-labelledby="ablauf-titel" className="section scroll-mt-24 bg-cream">
      <div className="container-page">
        <SectionHeading
          id="ablauf-titel"
          eyebrow="Ablauf"
          titel="So läuft es ab"
          einleitung="Von der Anfrage bis zum Folgetermin – damit du weißt, was dich erwartet."
        />

        <ol className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <li aria-hidden="true" className="absolute left-[0.6rem] top-2 hidden h-px w-full bg-taupe md:block" />
          {ablauf.map((schritt, index) => (
            <li key={schritt.nummer} className="relative pl-8 md:pl-0">
              <Reveal delay={index * 70}>
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 block h-2 w-2 rounded-full bg-clay md:relative md:top-0 md:mb-6"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-[0.22rem] top-4 block h-full w-px bg-taupe md:hidden"
                />
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-clay-dark md:mt-0">
                  Schritt {schritt.nummer}
                </p>
                <h3 className="mt-3 font-serif text-xl font-light text-espresso">{schritt.titel}</h3>
                <p className="mt-3 text-sm text-ink md:pr-6">{schritt.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
