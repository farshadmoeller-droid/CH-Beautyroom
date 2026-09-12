import Accordion from '@/components/Accordion';
import SectionHeading from '@/components/SectionHeading';
import { faq } from '@/content/faq';

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titel" className="section scroll-mt-24 bg-sand">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              id="faq-titel"
              eyebrow="Häufige Fragen"
              titel="Gut zu wissen"
              einleitung="Wenn deine Frage hier nicht dabei ist, schreib mir einfach. Ich antworte dir persönlich."
            />
          </div>

          <div className="lg:col-span-8">
            <Accordion
              variante="sand"
              eintraege={faq.map((eintrag) => ({
                titel: eintrag.frage,
                inhalt: <p>{eintrag.antwort}</p>,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
