import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { ueberMich } from '@/content/site';

export default function About() {
  return (
    <section id="ueber-mich" aria-labelledby="ueber-mich-titel" className="abschnitt bg-blush">
      <div className="huelle">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="bogen relative mx-auto aspect-5/7 w-full max-w-sm bg-creme lg:mx-0 lg:max-w-none">
              <Image
                src={ueberMich.portrait}
                alt={ueberMich.portraitAlt}
                fill
                sizes="(min-width: 1024px) 38vw, 80vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="label">{ueberMich.label}</p>
              <h2 id="ueber-mich-titel" className="h-gross mt-5 max-w-[14ch]">
                {ueberMich.titel}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mass mt-8 flex flex-col gap-4 text-leise-stark">
                {ueberMich.absaetze.map((absatz) => (
                  <p key={absatz.slice(0, 40)}>{absatz}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <blockquote className="mt-12 border-l border-akzent-rand pl-6">
                <p className="font-serif italic text-ink" style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2.1rem)', lineHeight: 1.3 }}>
                  „{ueberMich.zitat}“
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {ueberMich.merkmale.map((merkmal) => (
                  <div key={merkmal.titel} className="border-t border-ink/15 pt-4">
                    <dt className="font-serif text-lg">{merkmal.titel}</dt>
                    <dd className="mt-1.5 text-sm text-leise-stark">{merkmal.text}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
