import Image from 'next/image';
import Reveal from '@/components/Reveal';
import Accordion from '@/components/Accordion';
import BookingLink from '@/components/BookingLink';
import SectionHeading from '@/components/SectionHeading';
import { motivwelten, pflege, tattooAblauf, tattooHinweise, vorbereitung } from '@/content/fineline';
import { blurDataURL } from '@/lib/blur';

function Liste({ punkte }: { punkte: string[] }) {
  return (
    <ul className="space-y-2.5">
      {punkte.map((punkt) => (
        <li key={punkt} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 block h-px w-3 shrink-0 bg-clay" />
          <span>{punkt}</span>
        </li>
      ))}
    </ul>
  );
}

export default function FinelineSection() {
  return (
    <section id="fineline" aria-labelledby="fineline-titel" className="section scroll-mt-24 bg-sand">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              id="fineline-titel"
              eyebrow="Schwerpunkt"
              titel="Fineline — feine Linien, die etwas bedeuten"
            />

            <div className="measure mt-7 space-y-4 text-ink">
              <p>
                Fineline heißt: eine einzelne, sehr feine Nadel. Dadurch entstehen zarte Linien und filigrane
                Motive, die eher wie eine Zeichnung auf der Haut wirken als wie ein klassisches Tattoo.
              </p>
              <p>
                Feine Arbeiten brauchen eine ruhige Hand und eine ehrliche Beratung: Nicht jedes Motiv
                funktioniert an jeder Stelle, und feine Linien verändern sich mit den Jahren. Ich sage dir
                vorher, was ich für gut umsetzbar halte — und was nicht.
              </p>
              <p>
                Fast jedes Motiv trägt eine Bedeutung. Die Lotusblüte steht für Reinheit, Wachstum und Stärke.
                Geburtsblumen tragen die Eigenschaften ihres Monats. Mandalas stehen für innere Ruhe und
                Ordnung. Wenn du magst, erzähle ich dir zu deinem Motiv seine Geschichte.
              </p>
            </div>

            <BookingLink art="tattoo" className="btn btn-primary mt-8">
              Tattoo-Idee schicken
            </BookingLink>
          </div>

          <Reveal delay={80} className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-taupe">
              <Image
                src="/images/fineline-atmosphaere.jpg"
                alt="Schwarz-weiße Aufnahme feiner Tattoo-Linien auf heller Haut"
                fill
                sizes="(min-width: 1024px) 45vw, 92vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="object-cover grayscale"
              />
            </div>
          </Reveal>
        </div>

        {/* Motivwelten */}
        <div className="mt-20 lg:mt-28">
          <h3 className="eyebrow">Motivwelten</h3>
          <ul className="mt-7 grid grid-cols-1 gap-px overflow-hidden border border-taupe bg-taupe sm:grid-cols-2 lg:grid-cols-4">
            {motivwelten.map((motiv, index) => (
              <li key={motiv.titel} className="bg-sand">
                <Reveal delay={index * 40} className="h-full p-6">
                  <p className="font-serif text-xl font-light text-espresso">{motiv.titel}</p>
                  <p className="mt-2 text-sm text-ink">{motiv.beschreibung}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Ablauf */}
        <div className="mt-20 lg:mt-28">
          <h3 className="h-card font-serif">So läuft dein Tattoo-Termin ab</h3>
          <ol className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {tattooAblauf.map((schritt, index) => (
              <li key={schritt.nummer}>
                <Reveal delay={index * 60}>
                  <p className="font-serif text-3xl font-light text-clay-dark">{schritt.nummer}</p>
                  <hr className="hairline my-4" />
                  <p className="font-serif text-lg font-light text-espresso">{schritt.titel}</p>
                  <p className="mt-2 text-sm text-ink">{schritt.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* Vorbereitung und Pflege */}
        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-4 lg:mt-28 lg:grid-cols-2">
          <Accordion
            variante="sand"
            eintraege={[
              { titel: 'Vorbereitung auf deinen Termin', inhalt: <Liste punkte={vorbereitung} /> },
            ]}
          />
          <Accordion
            variante="sand"
            eintraege={[{ titel: 'Pflege danach', inhalt: <Liste punkte={pflege} /> }]}
          />
        </div>

        {/* Rechtliche und gesundheitliche Hinweise */}
        <aside
          aria-label="Wichtige Hinweise zum Tätowieren"
          className="mt-16 border border-espresso/25 bg-cream p-6 sm:p-8"
        >
          <p className="eyebrow">Bitte beachte</p>
          <ul className="measure mt-4 space-y-2.5 text-sm text-espresso">
            {tattooHinweise.map((hinweis) => (
              <li key={hinweis} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 block h-px w-3 shrink-0 bg-espresso" />
                <span>{hinweis}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
