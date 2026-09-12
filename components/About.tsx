import Image from 'next/image';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { iconRegister } from '@/components/Icons';
import { vertrauensmerkmale } from '@/content/ablauf';
import { siteConfig } from '@/content/site-config';
import { blurDataURL } from '@/lib/blur';

export default function About() {
  return (
    <section id="ueber-mich" aria-labelledby="ueber-mich-titel" className="section scroll-mt-24 bg-sand">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="arch relative mx-auto aspect-[5/7] w-full max-w-sm bg-taupe lg:mx-0 lg:max-w-none">
              <Image
                src="/images/portrait.jpg"
                alt={`Portrait von ${siteConfig.inhaberinName}, Inhaberin des CH Beautyroom`}
                fill
                sizes="(min-width: 1024px) 38vw, 80vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHeading id="ueber-mich-titel" eyebrow="Über mich" titel="Schön, dass du da bist" />

            <div className="measure mt-7 space-y-4 text-ink">
              <p>
                Ich bin {siteConfig.inhaberinName} und führe den CH Beautyroom als mein eigenes kleines
                Studio – zu Hause, in 26683 Ramsloh. Angefangen hat alles mit Wimpern, dazu kamen Lifting und
                schließlich das Tätowieren. Was gleich geblieben ist: Ich arbeite lieber gründlich mit einer
                Kundin als schnell mit dreien.
              </p>
              <p>
                Ein Homestudio war für mich die richtige Entscheidung. Keine Laufkundschaft, kein Wartebereich,
                keine Tür, die nebenbei aufgeht. Du kommst an, wir haben Zeit, und du bist die Einzige hier.
                Für viele ist genau das der Unterschied zu einem Salon.
              </p>
              <p>
                Mir ist wichtig, dass du am Ende kein Ergebnis mitnimmst, das gerade in Mode ist, sondern
                eines, das zu deinem Gesicht und deinem Alltag passt. Dafür frage ich lieber einmal mehr nach,
                bevor wir anfangen. Und wenn ich etwas nicht für sinnvoll halte, sage ich dir das.
              </p>
            </div>

            <blockquote className="mt-10 border-l border-clay pl-6">
              <p className="quote text-espresso">
                „Ein Termin bei mir ist kein Durchlauf. Wir nehmen uns Zeit — für dein Motiv, für deine
                Wimpern, für ein Ergebnis, das zu dir passt.“
              </p>
            </blockquote>

            <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {vertrauensmerkmale.map((merkmal, index) => {
                const Icon = iconRegister[merkmal.icon];
                return (
                  <li key={merkmal.titel}>
                    <Reveal delay={index * 60}>
                      <Icon className="h-6 w-6 text-clay-dark" />
                      <p className="mt-4 font-serif text-lg font-light text-espresso">{merkmal.titel}</p>
                      <p className="mt-2 text-sm text-ink">{merkmal.text}</p>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
