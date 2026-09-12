'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Feld, { Checkbox, Fehlerzeile, Honeypot, RadioGruppe } from '@/components/booking/Fields';
import Fortschritt from '@/components/booking/Fortschritt';
import Zusammenfassung from '@/components/booking/Zusammenfassung';
import { CloseIcon } from '@/components/Icons';
import { sendeAnfrage } from '@/app/actions/terminanfrage';
import { koerperstellen, uploadLimits } from '@/content/booking-config';
import { siteConfig } from '@/content/site-config';
import { pruefeDateien, tattooAnfrageSchema, type TattooAnfrage } from '@/lib/schemas';
import { monatsAuswahl } from '@/lib/dates';

type TattooFormProps = {
  onZurueckZurWahl: () => void;
};

const schritte = ['Was möchtest du?', 'Deine Idee', 'Prüfen & senden'];

export default function TattooForm({ onZurueckZurWahl }: TattooFormProps) {
  const [dateien, setDateien] = useState<File[]>([]);
  const [dateiFehler, setDateiFehler] = useState<string | null>(null);
  const [vorschauen, setVorschauen] = useState<string[]>([]);
  const [pruefen, setPruefen] = useState(false);
  const [gesendet, setGesendet] = useState<string | null>(null);
  const [serverFehler, setServerFehler] = useState<string | null>(null);

  const gestartetUm = useRef(Date.now());
  const dateiFeldRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const monate = useMemo(() => monatsAuswahl(), []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<TattooAnfrage>({
    resolver: zodResolver(tattooAnfrageSchema),
    mode: 'onBlur',
    defaultValues: { art: 'tattoo', telefon: '', webseite: '' },
  });

  const werte = watch();

  // Objekt-URLs der Vorschaubilder wieder freigeben, sobald sie nicht mehr gebraucht werden.
  useEffect(() => {
    const urls = dateien.map((datei) => URL.createObjectURL(datei));
    setVorschauen(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [dateien]);

  useEffect(() => {
    statusRef.current?.focus();
  }, [pruefen, gesendet]);

  function dateienHinzufuegen(neue: FileList | null) {
    if (!neue) return;
    const zusammen = [...dateien, ...Array.from(neue)].slice(0, uploadLimits.maxFiles);
    const fehler = pruefeDateien(zusammen);
    setDateiFehler(fehler);
    setDateien(fehler ? dateien : zusammen);
    if (dateiFeldRef.current) dateiFeldRef.current.value = '';
  }

  function dateiEntfernen(index: number) {
    setDateien((aktuell) => aktuell.filter((_, position) => position !== index));
    setDateiFehler(null);
  }

  async function weiterZurPruefung() {
    const gueltig = await trigger([
      'vorname',
      'nachname',
      'email',
      'telefon',
      'motividee',
      'koerperstelle',
      'groesseCm',
      'farbe',
      'erweiterung',
      'wunschzeitraum',
      'volljaehrig',
      'datenschutz',
    ]);
    if (!gueltig || dateiFehler) return;
    setPruefen(true);
  }

  async function absenden(daten: TattooAnfrage) {
    setServerFehler(null);

    const formData = new FormData();
    formData.set('art', 'tattoo');
    formData.set('vorname', daten.vorname);
    formData.set('nachname', daten.nachname);
    formData.set('email', daten.email);
    formData.set('telefon', daten.telefon ?? '');
    formData.set('motividee', daten.motividee);
    formData.set('koerperstelle', daten.koerperstelle);
    formData.set('groesseCm', daten.groesseCm);
    formData.set('farbe', daten.farbe);
    formData.set('erweiterung', daten.erweiterung);
    formData.set('wunschzeitraum', daten.wunschzeitraum);
    formData.set('volljaehrig', daten.volljaehrig ? 'on' : '');
    formData.set('datenschutz', daten.datenschutz ? 'on' : '');
    formData.set('webseite', daten.webseite ?? '');
    formData.set('gestartetUm', String(gestartetUm.current));
    dateien.forEach((datei) => formData.append('referenzbilder', datei));

    try {
      const ergebnis = await sendeAnfrage(formData);
      if (ergebnis.status === 'ok') {
        setGesendet(ergebnis.referenz);
      } else {
        setServerFehler(ergebnis.nachricht);
      }
    } catch {
      setServerFehler(
        `Die Anfrage konnte gerade nicht verschickt werden. Schreib mir alternativ direkt an ${siteConfig.email}.`,
      );
    }
  }

  const farbeLabel: Record<string, string> = {
    'schwarz-grau': 'Schwarz-Grau',
    farbe: 'Farbe',
    unentschieden: 'Noch unentschieden',
  };

  const zusammenfassungsZeilen = [
    { label: 'Name', wert: `${werte.vorname ?? ''} ${werte.nachname ?? ''}`.trim() || '—' },
    { label: 'E-Mail', wert: werte.email ?? '—' },
    ...(werte.telefon ? [{ label: 'Telefon', wert: werte.telefon }] : []),
    { label: 'Motividee', wert: werte.motividee ?? '—' },
    { label: 'Körperstelle', wert: werte.koerperstelle ?? '—' },
    { label: 'Größe', wert: werte.groesseCm ?? '—' },
    { label: 'Ausführung', wert: farbeLabel[werte.farbe ?? ''] ?? '—' },
    {
      label: 'Erweiterung',
      wert: werte.erweiterung === 'ja' ? 'Ja, bestehendes Tattoo' : werte.erweiterung === 'nein' ? 'Nein, neues Motiv' : '—',
    },
    {
      label: 'Wunschzeitraum',
      wert: monate.find((monat) => monat.wert === werte.wunschzeitraum)?.label ?? '—',
    },
    { label: 'Referenzbilder', wert: dateien.length > 0 ? `${dateien.length} ausgewählt` : 'keine' },
  ];

  if (gesendet) {
    return (
      <div className="border border-taupe bg-cream p-6 sm:p-10">
        <p ref={statusRef} tabIndex={-1} className="eyebrow">
          Anfrage verschickt
        </p>
        <h3 className="h-section mt-4">Deine Anfrage ist angekommen.</h3>
        <p className="measure mt-5 text-ink">
          Ich melde mich innerhalb von 24 Stunden bei dir. Dann besprechen wir deine Idee in Ruhe und suchen
          gemeinsam einen Termin, der zum Aufwand deines Motivs passt.
        </p>

        <div className="mt-8">
          <Zusammenfassung zeilen={zusammenfassungsZeilen} />
        </div>

        <p className="mt-6 text-xs text-ink">Referenz: {gesendet}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Auf Instagram vorbeischauen
          </a>
          <Link href="/galerie" className="btn btn-secondary">
            Galerie ansehen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(absenden)}>
      <Honeypot registrierung={register('webseite')} />
      <input type="hidden" {...register('art')} value="tattoo" />

      <Fortschritt schritte={schritte} aktiv={pruefen ? 2 : 1} />

      <p ref={statusRef} tabIndex={-1} className="sr-only" aria-live="polite">
        {pruefen ? 'Bitte prüfe deine Angaben' : 'Schritt 2: Erzähl mir von deiner Idee'}
      </p>

      {!pruefen ? (
        <div className="mt-10">
          <h3 className="h-card font-serif">Erzähl mir von deiner Idee</h3>
          <p className="measure mt-3 text-sm text-ink">
            Jedes Tattoo ist unterschiedlich aufwendig. Deshalb gibt es hier keinen Kalender – erzähl mir
            zuerst von deiner Idee, den passenden Termin finden wir dann gemeinsam.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Feld id="t-vorname" label="Vorname" pflicht fehler={errors.vorname?.message}>
              {(attribute) => (
                <input type="text" autoComplete="given-name" className="field" {...attribute} {...register('vorname')} />
              )}
            </Feld>

            <Feld id="t-nachname" label="Nachname" pflicht fehler={errors.nachname?.message}>
              {(attribute) => (
                <input type="text" autoComplete="family-name" className="field" {...attribute} {...register('nachname')} />
              )}
            </Feld>

            <Feld id="t-email" label="E-Mail" pflicht fehler={errors.email?.message}>
              {(attribute) => (
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="field"
                  {...attribute}
                  {...register('email')}
                />
              )}
            </Feld>

            <Feld id="t-telefon" label="Telefon oder WhatsApp" fehler={errors.telefon?.message}>
              {(attribute) => (
                <input type="tel" inputMode="tel" autoComplete="tel" className="field" {...attribute} {...register('telefon')} />
              )}
            </Feld>

            <div className="sm:col-span-2">
              <Feld
                id="t-motividee"
                label="Deine Motividee"
                pflicht
                hinweis="Was schwebt dir vor? Je mehr du erzählst, desto besser kann ich den Entwurf vorbereiten."
                fehler={errors.motividee?.message}
              >
                {(attribute) => (
                  <textarea
                    rows={6}
                    className="field"
                    placeholder="z. B. ein feiner Zweig mit drei kleinen Blüten, dazu die Geburtsjahre meiner Kinder"
                    {...attribute}
                    {...register('motividee')}
                  />
                )}
              </Feld>
            </div>

            <Feld id="t-koerperstelle" label="Körperstelle" pflicht fehler={errors.koerperstelle?.message}>
              {(attribute) => (
                <select className="field" defaultValue="" {...attribute} {...register('koerperstelle')}>
                  <option value="" disabled>
                    Bitte auswählen
                  </option>
                  {koerperstellen.map((stelle) => (
                    <option key={stelle} value={stelle}>
                      {stelle}
                    </option>
                  ))}
                </select>
              )}
            </Feld>

            <Feld
              id="t-groesse"
              label="Ungefähre Größe"
              pflicht
              hinweis="In Zentimetern, eine Schätzung genügt."
              fehler={errors.groesseCm?.message}
            >
              {(attribute) => (
                <input type="text" className="field" placeholder="z. B. ca. 8 cm" {...attribute} {...register('groesseCm')} />
              )}
            </Feld>

            <div className="sm:col-span-2">
              <RadioGruppe
                control={control}
                name="farbe"
                legende="Schwarz-Grau oder Farbe?"
                fehler={errors.farbe?.message}
                optionen={[
                  { wert: 'schwarz-grau', label: 'Schwarz-Grau' },
                  { wert: 'farbe', label: 'Mit Farbe' },
                  { wert: 'unentschieden', label: 'Noch unentschieden' },
                ]}
              />
            </div>

            <div className="sm:col-span-2">
              <RadioGruppe
                control={control}
                name="erweiterung"
                legende="Ist es die Erweiterung eines bestehenden Tattoos?"
                fehler={errors.erweiterung?.message}
                optionen={[
                  { wert: 'nein', label: 'Nein, ein neues Motiv' },
                  { wert: 'ja', label: 'Ja, es soll an ein bestehendes anschließen' },
                ]}
              />
            </div>

            <Feld id="t-zeitraum" label="Wunschzeitraum" pflicht fehler={errors.wunschzeitraum?.message}>
              {(attribute) => (
                <select className="field" defaultValue="" {...attribute} {...register('wunschzeitraum')}>
                  <option value="" disabled>
                    Bitte einen Monat wählen
                  </option>
                  {monate.map((monat) => (
                    <option key={monat.wert} value={monat.wert}>
                      {monat.label}
                    </option>
                  ))}
                </select>
              )}
            </Feld>

            {/* Referenzbilder */}
            <div className="sm:col-span-2">
              <label htmlFor="referenzbilder" className="field-label">
                Referenzbilder
                <span className="ml-2 normal-case tracking-normal text-ink/70">(optional)</span>
              </label>
              <p id="referenzbilder-hinweis" className="mb-2 text-xs text-ink">
                Bis zu {uploadLimits.maxFiles} Bilder, je höchstens 5 MB, als JPG, PNG oder WebP.
              </p>

              <input
                ref={dateiFeldRef}
                id="referenzbilder"
                type="file"
                multiple
                accept={uploadLimits.acceptAttribute}
                aria-describedby="referenzbilder-hinweis referenzbilder-fehler"
                aria-invalid={Boolean(dateiFehler)}
                onChange={(event) => dateienHinzufuegen(event.target.files)}
                className="field h-auto py-2.5 file:mr-4 file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:text-espresso"
              />

              <Fehlerzeile id="referenzbilder-fehler" fehler={dateiFehler ?? undefined} />

              {dateien.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-4">
                  {dateien.map((datei, index) => (
                    <li key={`${datei.name}-${index}`} className="relative">
                      <span className="block h-24 w-24 overflow-hidden border border-taupe bg-sand">
                        {vorschauen[index] && (
                          // Lokale Vorschau aus dem Browser-Speicher – hier ist next/image
                          // bewusst nicht im Einsatz, weil die Datei nie auf dem Server liegt.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={vorschauen[index]}
                            alt={`Vorschau von ${datei.name}`}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => dateiEntfernen(index)}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center border border-control bg-cream text-espresso transition-colors hover:border-espresso"
                      >
                        <span className="sr-only">{`${datei.name} entfernen`}</span>
                        <CloseIcon className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="sm:col-span-2">
              <Checkbox
                id="volljaehrig"
                control={control}
                name="volljaehrig"
                fehler={errors.volljaehrig?.message}
              >
                Ich bin mindestens 18 Jahre alt. Bitte bring zum Termin einen gültigen Ausweis mit.
              </Checkbox>
            </div>

            <div className="sm:col-span-2">
              <Checkbox
                id="t-datenschutz"
                control={control}
                name="datenschutz"
                fehler={errors.datenschutz?.message}
              >
                Ich bin damit einverstanden, dass meine Angaben und hochgeladenen Bilder zur Bearbeitung
                meiner Anfrage per E-Mail verarbeitet werden. Mehr dazu in der{' '}
                <Link href="/datenschutz" className="link-underline">
                  Datenschutzerklärung
                </Link>
                .
              </Checkbox>
            </div>
          </div>

          <button type="button" onClick={onZurueckZurWahl} className="link-underline mt-8 inline-block text-xs">
            Doch eine Beauty-Behandlung? Zurück zur Auswahl
          </button>
        </div>
      ) : (
        <div className="mt-10">
          <h3 className="h-card font-serif">Passt alles so?</h3>
          <p className="measure mt-3 text-sm text-ink">
            Schau noch einmal drüber. Danach schickst du mir die Anfrage – unverbindlich.
          </p>

          <div className="mt-7">
            <Zusammenfassung zeilen={zusammenfassungsZeilen} />
          </div>

          {serverFehler && (
            <p role="alert" className="mt-6 border border-[#9b2c19] bg-cream p-4 text-sm text-[#9b2c19]">
              {serverFehler}
            </p>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-taupe pt-8">
        {pruefen ? (
          <>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Wird gesendet …' : 'Anfrage abschicken'}
            </button>
            <button type="button" onClick={() => setPruefen(false)} disabled={isSubmitting} className="btn btn-secondary">
              Zurück
            </button>
          </>
        ) : (
          <button type="button" onClick={weiterZurPruefung} className="btn btn-primary">
            Weiter zur Übersicht
          </button>
        )}

        <p className="w-full text-xs text-ink sm:w-auto sm:flex-1 sm:text-right">
          Unverbindliche Anfrage – ein Termin wird erst mit meiner Bestätigung fest.
        </p>
      </div>
    </form>
  );
}
