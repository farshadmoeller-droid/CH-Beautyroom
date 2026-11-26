import type { Metadata } from 'next';
import RechtsSeite from '@/components/layout/RechtsSeite';
import { business } from '@/content/site';
import { breadcrumbSchema } from '@/lib/jsonld';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Impressum',
  description: `Anbieterkennzeichnung nach § 5 DDG für ${business.name} in ${business.plz} ${business.ort}.`,
  alternates: { canonical: '/impressum' },
};

export default function ImpressumSeite() {
  return (
    <>
      <RechtsSeite
        titel="Impressum"
        einleitung="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG, vormals § 5 TMG)."
        stand="November 2026"
      >
        <section>
          <h2>Diensteanbieterin</h2>
          <p>
            {/* TODO: Name und vollständige Anschrift in content/site.ts eintragen. */}
            {business.inhaberin}
            <br />
            {business.name}
            <br />
            {business.strasse}
            <br />
            {business.plz} {business.ort}
            <br />
            {business.land}
          </p>
          <p>
            Das Studio wird als Homestudio in der oben genannten Privatanschrift betrieben. Ein Besuch
            ist ausschließlich nach vorheriger Terminvereinbarung möglich.
          </p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>
            Telefon: <a href={`tel:${business.telefon.replace(/\s/g, '')}`}>{business.telefon}</a>
            <br />
            E-Mail: <a href={`mailto:${business.email}`}>{business.email}</a>
            <br />
            Instagram:{' '}
            <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer">
              {business.instagramHandle}
            </a>
          </p>
        </section>

        <section>
          <h2>Umsatzsteuer</h2>
          <p>{business.umsatzsteuer}</p>
        </section>

        <section>
          <h2>Berufsbezeichnung und zuständige Aufsichtsbehörde</h2>
          <p>Kosmetische Dienstleistungen und Tätowierungen, erbracht in der Bundesrepublik Deutschland.</p>
          <p>
            {/* TODO: Nur beibehalten, wenn für die Tätowier-Tätigkeit eine Anzeige nach
                § 4 Infektionsschutzgesetz beim Landkreis vorliegt. Sonst Absatz entfernen. */}
            Zuständige Aufsichtsbehörde für die Tätowier-Tätigkeit:
            <br />
            {business.aufsichtsbehoerde}
          </p>
          <p>
            Es werden ausschließlich Tätowiermittel verwendet, die den Anforderungen der
            Tätowiermittel-Verordnung und der Verordnung (EG) Nr. 1907/2006 (REACH) entsprechen, sowie
            steriles Einwegmaterial.
          </p>
        </section>

        <section>
          <h2>Verantwortlich für den Inhalt</h2>
          <p>{business.inhaberin}, Anschrift wie oben.</p>
        </section>

        <section>
          <h2>Streitbeilegung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Meine E-Mail-Adresse findest du oben unter „Kontakt“.
          </p>
          <p>
            Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieterin bin ich nach § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach
            den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
            Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
            Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
            hiervon unberührt. Eine diesbezügliche Haftung ist erst ab dem Zeitpunkt der Kenntnis einer
            konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werde
            ich diese Inhalte umgehend entfernen.
          </p>
        </section>

        <section>
          <h2>Haftung für Links</h2>
          <p>
            Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen
            Einfluss habe. Deshalb kann ich für diese fremden Inhalte keine Gewähr übernehmen. Für die
            Inhalte der verlinkten Seiten ist stets die jeweilige Anbieterin oder der jeweilige Anbieter
            verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
            Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von
            Rechtsverletzungen werde ich derartige Links umgehend entfernen.
          </p>
        </section>

        <section>
          <h2>Urheberrecht</h2>
          <p>
            Die auf dieser Website erstellten Inhalte, Texte und Bilder unterliegen dem deutschen
            Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb
            der Grenzen des Urheberrechts bedürfen meiner schriftlichen Zustimmung. Downloads und Kopien
            dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
        </section>

        <section>
          <h2>Hinweis zu Preisen</h2>
          <p>
            Auf dieser Website werden keine Preise angegeben. Preise nenne ich individuell im
            Beratungsgespräch oder auf Anfrage, da sie insbesondere bei Tätowierungen vom jeweiligen
            Motiv und Aufwand abhängen.
          </p>
        </section>
      </RechtsSeite>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Startseite', pfad: '/' },
              { name: 'Impressum', pfad: '/impressum' },
            ]),
          ),
        }}
      />
    </>
  );
}
