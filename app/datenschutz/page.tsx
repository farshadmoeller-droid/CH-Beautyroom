import type { Metadata } from 'next';
import Link from 'next/link';
import RechtsSeite from '@/components/layout/RechtsSeite';
import { business, formular } from '@/content/site';
import { breadcrumbSchema } from '@/lib/jsonld';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: `Informationen zur Verarbeitung personenbezogener Daten nach Art. 13 DSGVO auf der Website des ${business.name}.`,
  alternates: { canonical: '/datenschutz' },
};

export default function DatenschutzSeite() {
  return (
    <>
      <RechtsSeite
        titel="Datenschutzerklärung"
        einleitung="Diese Website kommt ohne Tracking, ohne Werbe-Cookies und ohne eingebettete Dienste Dritter aus. Hier steht trotzdem im Detail, was mit deinen Daten passiert, wenn du mir schreibst."
        stand="November 2026"
      >
        <section>
          <h2>1. Verantwortliche Stelle</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der
            Datenschutz-Grundverordnung (DSGVO) ist:
          </p>
          <p>
            {business.inhaberin}
            <br />
            {business.name}
            <br />
            {business.strasse}
            <br />
            {business.plz} {business.ort}
            <br />
            E-Mail: <a href={`mailto:${business.email}`}>{business.email}</a>
            <br />
            Telefon: <a href={`tel:${business.telefon.replace(/\s/g, '')}`}>{business.telefon}</a>
          </p>
          <p>
            Eine Datenschutzbeauftragte ist gesetzlich nicht erforderlich und daher nicht bestellt.
          </p>
        </section>

        <section>
          <h2>2. Hosting und Server-Logfiles</h2>
          <p>
            Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA,
            gehostet. Vercel verarbeitet dabei Daten in meinem Auftrag; es besteht ein
            Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Die Auslieferung erfolgt nach Möglichkeit
            über Serverstandorte innerhalb der Europäischen Union. Soweit Daten in die USA übermittelt
            werden, stützt sich die Übermittlung auf die Standardvertragsklauseln der Europäischen
            Kommission sowie auf das EU-US Data Privacy Framework.
          </p>
          <p>Beim Aufruf dieser Website erhebt der Hoster automatisch Server-Logfiles:</p>
          <ul>
            <li>gekürzte oder vollständige IP-Adresse des anfragenden Geräts</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>übertragene Datenmenge und Meldung über den erfolgreichen Abruf</li>
            <li>verwendeter Browsertyp, Browserversion und Betriebssystem</li>
            <li>Referrer-URL, also die zuvor besuchte Seite</li>
          </ul>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt im
            technisch fehlerfreien Betrieb, in der Sicherheit und in der Stabilität dieser Website. Eine
            Zusammenführung mit anderen Datenquellen findet nicht statt, und es erfolgt keine Auswertung
            zu Marketing- oder Analysezwecken. Die Logfiles werden nach kurzer Zeit automatisch gelöscht.
          </p>
        </section>

        <section>
          <h2>3. Terminanfrage und Kontaktaufnahme</h2>
          <h3>Welche Daten verarbeitet werden</h3>
          <p>
            Beim Formular für einen Beauty-Termin verarbeite ich: Vor- und Nachnamen, Telefonnummer,
            E-Mail-Adresse, die gewählte Leistung, deinen Wunschtag und das gewünschte Zeitfenster, die
            Angabe, ob du zum ersten Mal kommst, sowie eine freiwillige Nachricht.
          </p>
          <p>
            Beim Tattoo-Formular verarbeite ich zusätzlich: deine Motividee, die gewünschte Körperstelle,
            die ungefähre Größe, deinen Wunschzeitraum, die Angabe, ob es dein erstes Tattoo ist, deine
            Bestätigung der Volljährigkeit sowie – sofern du sie hochlädst – bis zu{' '}
            {formular.upload.maxDateien} Referenzbilder.
          </p>

          <h3>Zweck und Rechtsgrundlage</h3>
          <p>
            Die Verarbeitung dient ausschließlich der Bearbeitung deiner Anfrage, der persönlichen
            Rückmeldung und der Vorbereitung eines Termins. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
            DSGVO (Durchführung vorvertraglicher Maßnahmen auf deine Anfrage hin). Soweit du darüber
            hinaus freiwillig Angaben machst, ist Rechtsgrundlage deine Einwilligung nach Art. 6 Abs. 1
            lit. a DSGVO, die du jederzeit für die Zukunft widerrufen kannst.
          </p>
          <p>
            Angaben zu einer Tätowierung können Rückschlüsse auf deine Person zulassen; Gesundheitsdaten
            frage ich über das Formular bewusst nicht ab. Bitte teile mir gesundheitliche Besonderheiten
            erst im persönlichen Aufklärungsgespräch mit.
          </p>

          <h3>Empfänger</h3>
          <p>
            Deine Angaben werden per E-Mail an mein Postfach übermittelt. Je nach Einstellung dieser
            Website nutze ich dafür einen der folgenden Auftragsverarbeiter nach Art. 28 DSGVO:
          </p>
          <ul>
            <li>
              <strong>Resend</strong> (Resend, Inc., 2261 Market Street, San Francisco, CA 94114, USA)
              für den direkten Versand. Die Übermittlung in die USA stützt sich auf die
              Standardvertragsklauseln der Europäischen Kommission.
            </li>
            <li>
              <strong>Formspree</strong> (Formspree, Inc., USA) als Weiterleitungsdienst, falls dieser
              Weg aktiv ist. Auch hier gelten die Standardvertragsklauseln.
            </li>
          </ul>
          <p>
            {/* TODO: Nach der Entscheidung für einen Weg den jeweils anderen Absatz entfernen. */}
            Welcher der beiden Dienste eingesetzt wird, erfährst du jederzeit auf Nachfrage unter der
            oben genannten E-Mail-Adresse.
          </p>

          <h3>Speicherdauer</h3>
          <p>
            Es findet <strong>keine Speicherung in einer Datenbank</strong> statt. Diese Website
            betreibt keine Datenbank; deine Eingaben werden nur zur Erzeugung der E-Mail im
            Arbeitsspeicher verarbeitet und danach verworfen. Die E-Mail selbst bleibt in meinem
            Postfach, bis deine Anfrage vollständig erledigt ist und keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen – in der Regel lösche ich Anfragen, aus denen kein
            Termin entstanden ist, spätestens nach sechs Monaten. Kommt ein Termin zustande, gelten die
            handels- und steuerrechtlichen Aufbewahrungsfristen von bis zu zehn Jahren.
          </p>

          <h3>Referenzbilder im Tattoo-Formular</h3>
          <p>
            Hochgeladene Bilder werden nicht dauerhaft auf dem Server gespeichert, sondern unmittelbar
            als Anhang der E-Mail weitergeleitet und danach verworfen. Erlaubt sind bis zu{' '}
            {formular.upload.maxDateien} Dateien in den Formaten JPG, PNG oder WebP mit jeweils
            höchstens 5 MB. Bitte lade keine Bilder hoch, die Dritte erkennbar zeigen, ohne dass diese
            damit einverstanden sind.
          </p>

          <h3>Spam-Schutz</h3>
          <p>
            Zum Schutz vor automatisierten Anfragen enthält das Formular ein für Menschen unsichtbares
            Feld (Honeypot), es wird die Zeit zwischen Aufruf und Absenden geprüft und die Zahl der
            Anfragen pro IP-Adresse begrenzt. Die IP-Adresse wird dafür nur kurzzeitig im
            Arbeitsspeicher gezählt und nicht dauerhaft gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1
            lit. f DSGVO; mein berechtigtes Interesse liegt in der Abwehr von Missbrauch. Ein
            Captcha-Dienst kommt nicht zum Einsatz.
          </p>

          <h3>Kontakt per E-Mail, Telefon oder WhatsApp</h3>
          <p>
            Wenn du mir direkt schreibst oder anrufst, verarbeite ich deine Angaben ebenfalls nur zur
            Bearbeitung deines Anliegens, auf Grundlage von Art. 6 Abs. 1 lit. b bzw. f DSGVO. Für die
            Nutzung von WhatsApp gelten zusätzlich die Datenschutzbestimmungen der WhatsApp Ireland
            Limited. Wenn du das nicht möchtest, nutze bitte E-Mail oder Telefon.
          </p>
        </section>

        <section>
          <h2>4. Keine Cookies, kein Tracking</h2>
          <p>
            Diese Website setzt keine Cookies, die einer Einwilligung bedürfen. Es werden keine
            Analyse-Werkzeuge, keine Werbenetzwerke, keine Social-Media-Plugins und keine Profilbildung
            eingesetzt. Deshalb erscheint hier auch kein Einwilligungsbanner. Technisch notwendige
            Speichervorgänge im Browser finden nur statt, soweit sie für die Darstellung erforderlich sind.
          </p>
          <p>
            Sollte künftig eine Reichweitenmessung ergänzt werden, wird ausschließlich eine
            datenschutzfreundliche, cookiefreie Lösung ohne personenbezogene Profile eingesetzt, und
            diese Erklärung wird vorher entsprechend ergänzt.
          </p>
        </section>

        <section>
          <h2>5. Schriften und Bilder</h2>
          <p>
            Die verwendeten Schriften werden nicht von einem externen Server nachgeladen, sondern beim
            Erstellen der Website fest eingebunden und von meinem eigenen Server ausgeliefert. Es wird{' '}
            <strong>keine Verbindung zu Google oder zu Google Fonts aufgebaut</strong>, und es werden
            keine Daten an Google übertragen. Ebenso werden alle Bilder von diesem Server ausgeliefert.
          </p>
        </section>

        <section>
          <h2>6. Instagram</h2>
          <p>
            Auf dieser Website ist kein Instagram-Widget und kein Instagram-Feed eingebunden. Die im
            Abschnitt „Instagram“ gezeigten Bilder liegen als gewöhnliche Bilddateien auf diesem Server.
            Erst wenn du einen der Links anklickst, wird eine Verbindung zu den Servern der Meta
            Platforms Ireland Limited aufgebaut, und es gilt deren Datenschutzerklärung. Vor dem Klick
            werden keinerlei Daten an Instagram übertragen.
          </p>
        </section>

        <section>
          <h2>7. Deine Rechte</h2>
          <p>Dir stehen jederzeit folgende Rechte zu:</p>
          <ul>
            <li>
              <strong>Auskunft</strong> über die zu deiner Person verarbeiteten Daten (Art. 15 DSGVO)
            </li>
            <li>
              <strong>Berichtigung</strong> unrichtiger oder unvollständiger Daten (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Löschung</strong>, soweit keine Aufbewahrungspflicht entgegensteht (Art. 17 DSGVO)
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> in einem gängigen Format (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruch</strong> gegen Verarbeitungen auf Grundlage berechtigter Interessen
              (Art. 21 DSGVO)
            </li>
            <li>
              <strong>Widerruf</strong> einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)
            </li>
          </ul>
          <p>
            Für die Ausübung genügt eine formlose Nachricht an{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a>.
          </p>
        </section>

        <section>
          <h2>8. Beschwerderecht bei der Aufsichtsbehörde</h2>
          <p>
            Unbeschadet anderer Rechtsbehelfe hast du das Recht, dich bei einer
            Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig ist:
          </p>
          <p>
            Die Landesbeauftragte für den Datenschutz Niedersachsen
            <br />
            Prinzenstraße 5, 30159 Hannover
            <br />
            <a href="https://www.lfd.niedersachsen.de" target="_blank" rel="noopener noreferrer">
              www.lfd.niedersachsen.de
            </a>
          </p>
        </section>

        <section>
          <h2>9. Verschlüsselung und Aktualität</h2>
          <p>
            Diese Website nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung, erkennbar am
            Schlosssymbol in der Adresszeile. Diese Erklärung wird angepasst, sobald sich die Rechtslage
            oder die Verarbeitung ändert.
          </p>
          <p>
            Zurück zur{' '}
            <Link href="/">Startseite</Link> oder zum <Link href="/impressum">Impressum</Link>.
          </p>
        </section>
      </RechtsSeite>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Startseite', pfad: '/' },
              { name: 'Datenschutzerklärung', pfad: '/datenschutz' },
            ]),
          ),
        }}
      />
    </>
  );
}
