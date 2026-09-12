'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Calendar from '@/components/booking/Calendar';
import Feld, { Checkbox, Fehlerzeile, Honeypot, RadioGruppe, SlotAuswahl } from '@/components/booking/Fields';
import Fortschritt from '@/components/booking/Fortschritt';
import Zusammenfassung from '@/components/booking/Zusammenfassung';
import { sendeAnfrage } from '@/app/actions/terminanfrage';
import { bookableTreatments, getTreatmentName } from '@/content/services';
import { siteConfig } from '@/content/site-config';
import { beautyAnfrageSchema, type BeautyAnfrage } from '@/lib/schemas';
import { formatiereDatumLang, verfuegbareZeitfenster, zeitfenster, zeitfensterLabel } from '@/lib/dates';

type BeautyFlowProps = {
  /** Vorausgewaehlte Behandlung, z. B. aus einem Leistungsabschnitt heraus. */
  vorauswahl?: string;
  onZurueckZurWahl: () => void;
};

const schritte = ['Was möchtest du?', 'Wann passt es dir?', 'Deine Daten'];

export default function BeautyFlow({ vorauswahl, onZurueckZurWahl }: BeautyFlowProps) {
  const [schritt, setSchritt] = useState(0);
  const [pruefen, setPruefen] = useState(false);
  const [gesendet, setGesendet] = useState<string | null>(null);
  const [serverFehler, setServerFehler] = useState<string | null>(null);
  const gestartetUm = useRef(Date.now());
  const ueberschriftRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BeautyAnfrage>({
    resolver: zodResolver(beautyAnfrageSchema),
    mode: 'onBlur',
    defaultValues: {
      art: 'beauty',
      behandlung: vorauswahl as BeautyAnfrage['behandlung'],
      alternativTermin: '',
      telefon: '',
      nachricht: '',
      webseite: '',
    },
  });

  const werte = watch();
  // Nur die Zeitfenster anbieten, die auch ausserhalb der Vorlaufzeit liegen.
  const fenster = werte.datum ? verfuegbareZeitfenster(werte.datum) : [];
  const alleFenster = zeitfenster();

  useEffect(() => {
    if (vorauswahl) {
      setValue('behandlung', vorauswahl as BeautyAnfrage['behandlung'], { shouldValidate: false });
      setSchritt(1);
    }
  }, [vorauswahl, setValue]);

  useEffect(() => {
    ueberschriftRef.current?.focus();
  }, [schritt, pruefen, gesendet]);

  async function weiter() {
    const felder: Record<number, (keyof BeautyAnfrage)[]> = {
      0: ['behandlung'],
      1: ['datum', 'zeitfenster'],
      2: ['vorname', 'nachname', 'email', 'telefon', 'bereitsKundin', 'datenschutz'],
    };
    const gueltig = await trigger(felder[schritt] ?? []);
    if (!gueltig) return;

    if (schritt === 2) {
      setPruefen(true);
      return;
    }
    setSchritt((aktuell) => aktuell + 1);
  }

  async function absenden(daten: BeautyAnfrage) {
    setServerFehler(null);

    const formData = new FormData();
    formData.set('art', 'beauty');
    formData.set('behandlung', daten.behandlung);
    formData.set('datum', daten.datum);
    formData.set('zeitfenster', daten.zeitfenster);
    formData.set('alternativTermin', daten.alternativTermin ?? '');
    formData.set('vorname', daten.vorname);
    formData.set('nachname', daten.nachname);
    formData.set('email', daten.email);
    formData.set('telefon', daten.telefon ?? '');
    formData.set('bereitsKundin', daten.bereitsKundin);
    formData.set('nachricht', daten.nachricht ?? '');
    formData.set('datenschutz', daten.datenschutz ? 'on' : '');
    formData.set('webseite', daten.webseite ?? '');
    formData.set('gestartetUm', String(gestartetUm.current));

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

  const zusammenfassungsZeilen = [
    { label: 'Leistung', wert: getTreatmentName(werte.behandlung) ?? '—', schritt: 0 },
    {
      label: 'Wunschtermin',
      wert: werte.datum
        ? `${formatiereDatumLang(werte.datum)}\n${zeitfensterLabel(werte.zeitfenster) ?? ''}`
        : '—',
      schritt: 1,
    },
    ...(werte.alternativTermin
      ? [{ label: 'Alternative', wert: werte.alternativTermin, schritt: 1 }]
      : []),
    { label: 'Name', wert: `${werte.vorname ?? ''} ${werte.nachname ?? ''}`.trim() || '—', schritt: 2 },
    { label: 'E-Mail', wert: werte.email ?? '—', schritt: 2 },
    ...(werte.telefon ? [{ label: 'Telefon', wert: werte.telefon, schritt: 2 }] : []),
    {
      label: 'Schon einmal da',
      wert: werte.bereitsKundin === 'ja' ? 'Ja' : werte.bereitsKundin === 'nein' ? 'Nein' : '—',
      schritt: 2,
    },
    ...(werte.nachricht ? [{ label: 'Nachricht', wert: werte.nachricht, schritt: 2 }] : []),
  ];

  if (gesendet) {
    return (
      <div className="border border-taupe bg-cream p-6 sm:p-10">
        <p ref={ueberschriftRef} tabIndex={-1} className="eyebrow">
          Anfrage verschickt
        </p>
        <h3 className="h-section mt-4">Deine Anfrage ist angekommen.</h3>
        <p className="measure mt-5 text-ink">
          Ich melde mich innerhalb von 24 Stunden bei dir. Erst mit meiner persönlichen Bestätigung ist dein
          Termin verbindlich. Eine Eingangsbestätigung liegt außerdem in deinem Postfach.
        </p>

        <div className="mt-8">
          <Zusammenfassung
            zeilen={zusammenfassungsZeilen.map((zeile) => ({ label: zeile.label, wert: zeile.wert }))}
          />
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
    <form noValidate onSubmit={handleSubmit(absenden)} className="relative">
      <Honeypot registrierung={register('webseite')} />
      <input type="hidden" {...register('art')} value="beauty" />

      <Fortschritt schritte={schritte} aktiv={pruefen ? 2 : schritt} />

      <p ref={ueberschriftRef} tabIndex={-1} className="sr-only" aria-live="polite">
        {pruefen ? 'Bitte prüfe deine Angaben' : `Schritt ${schritt + 1}: ${schritte[schritt]}`}
      </p>

      <div className="mt-10">
        {/* Schritt 1 – Leistung */}
        {!pruefen && schritt === 0 && (
          <div>
            <h3 className="h-card font-serif">Welche Behandlung möchtest du?</h3>
            <p className="measure mt-3 text-sm text-ink">
              Wähle aus, was am besten passt. Wenn du unsicher bist, nimm die Beratung – wir schauen dann
              gemeinsam.
            </p>

            <div className="mt-7">
              <RadioGruppe
                control={control}
                name="behandlung"
                legende="Behandlung"
                gross
                fehler={errors.behandlung?.message}
                optionen={bookableTreatments.map((treatment) => ({
                  wert: treatment.id,
                  label: treatment.name,
                  beschreibung: `Dauer ${treatment.dauer}`,
                }))}
              />
            </div>

            <button type="button" onClick={onZurueckZurWahl} className="link-underline mt-8 inline-block text-xs">
              Doch ein Tattoo? Zurück zur Auswahl
            </button>
          </div>
        )}

        {/* Schritt 2 – Termin */}
        {!pruefen && schritt === 1 && (
          <div>
            <h3 className="h-card font-serif">Wann passt es dir?</h3>
            <p className="measure mt-3 text-sm text-ink">
              Ich arbeite Montag bis Freitag vormittags, in zwei Zeitfenstern. Nachmittags und am Wochenende
              bin ich nicht im Studio.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <Calendar
                  beschriebenVon="datum-fehler"
                  wert={werte.datum ?? null}
                  onAuswahl={(iso) => {
                    setValue('datum', iso, { shouldValidate: true });
                    const weiterhinFrei = verfuegbareZeitfenster(iso).some(
                      (eintrag) => eintrag.start === werte.zeitfenster,
                    );
                    if (!weiterhinFrei) {
                      setValue('zeitfenster', '' as BeautyAnfrage['zeitfenster'], {
                        shouldValidate: false,
                      });
                    }
                  }}
                />
                <Fehlerzeile id="datum-fehler" fehler={errors.datum?.message} />
              </div>

              <div>
                <fieldset aria-describedby="zeitfenster-fehler" aria-invalid={Boolean(errors.zeitfenster)}>
                  <legend className="field-label">Zeitfenster</legend>

                  {!werte.datum ? (
                    <p className="text-sm text-ink">Wähle zuerst einen Tag im Kalender.</p>
                  ) : fenster.length === 0 ? (
                    <p className="text-sm text-ink">
                      An diesem Tag ist kein Zeitfenster mehr frei genug – ich brauche mindestens 24 Stunden
                      Vorlauf. Bitte wähle einen späteren Tag.
                    </p>
                  ) : (
                    <SlotAuswahl
                      control={control}
                      name="zeitfenster"
                      optionen={fenster.map((eintrag) => ({ wert: eintrag.start, label: eintrag.label }))}
                    />
                  )}

                  <Fehlerzeile id="zeitfenster-fehler" fehler={errors.zeitfenster?.message} />
                </fieldset>

                <div className="mt-7">
                  <Feld
                    id="alternativTermin"
                    label="Alternativer Wunschtermin"
                    hinweis="Falls dein erster Wunsch schon vergeben ist – schreib mir gern eine Alternative."
                    fehler={errors.alternativTermin?.message}
                  >
                    {(attribute) => (
                      <input
                        type="text"
                        className="field"
                        placeholder="z. B. auch Donnerstagvormittag in der Woche darauf"
                        {...attribute}
                        {...register('alternativTermin')}
                      />
                    )}
                  </Feld>
                </div>

                {fenster.length > 0 && fenster.length < alleFenster.length && (
                  <p className="mt-4 text-xs text-ink">
                    Ein Zeitfenster dieses Tages liegt bereits innerhalb der 24-Stunden-Vorlaufzeit und wird
                    deshalb nicht angeboten.
                  </p>
                )}

                <p className="mt-7 border-l border-clay pl-4 text-sm text-ink">
                  Alle Zeitfenster sind Wunschtermine. Ich melde mich innerhalb von 24 Stunden mit einer
                  verbindlichen Bestätigung.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Schritt 3 – Daten */}
        {!pruefen && schritt === 2 && (
          <div>
            <h3 className="h-card font-serif">Deine Daten</h3>
            <p className="measure mt-3 text-sm text-ink">
              Damit ich dir antworten kann. Mehr brauche ich nicht.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Feld id="vorname" label="Vorname" pflicht fehler={errors.vorname?.message}>
                {(attribute) => (
                  <input type="text" autoComplete="given-name" className="field" {...attribute} {...register('vorname')} />
                )}
              </Feld>

              <Feld id="nachname" label="Nachname" pflicht fehler={errors.nachname?.message}>
                {(attribute) => (
                  <input type="text" autoComplete="family-name" className="field" {...attribute} {...register('nachname')} />
                )}
              </Feld>

              <Feld id="email" label="E-Mail" pflicht fehler={errors.email?.message}>
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

              <Feld id="telefon" label="Telefon oder WhatsApp" fehler={errors.telefon?.message}>
                {(attribute) => (
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="field"
                    {...attribute}
                    {...register('telefon')}
                  />
                )}
              </Feld>

              <div className="sm:col-span-2">
                <RadioGruppe
                  control={control}
                  name="bereitsKundin"
                  legende="Warst du schon einmal bei mir?"
                  fehler={errors.bereitsKundin?.message}
                  optionen={[
                    { wert: 'ja', label: 'Ja' },
                    { wert: 'nein', label: 'Nein, das erste Mal' },
                  ]}
                />
              </div>

              <div className="sm:col-span-2">
                <Feld
                  id="nachricht"
                  label="Nachricht"
                  hinweis="Wünsche, Fragen, Besonderheiten – alles, was ich wissen sollte."
                  fehler={errors.nachricht?.message}
                >
                  {(attribute) => (
                    <textarea rows={5} className="field" {...attribute} {...register('nachricht')} />
                  )}
                </Feld>
              </div>

              <div className="sm:col-span-2">
                <Checkbox
                  id="datenschutz"
                  control={control}
                  name="datenschutz"
                  fehler={errors.datenschutz?.message}
                >
                  Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage per E-Mail
                  verarbeitet werden. Mehr dazu in der{' '}
                  <Link href="/datenschutz" className="link-underline">
                    Datenschutzerklärung
                  </Link>
                  .
                </Checkbox>
              </div>
            </div>
          </div>
        )}

        {/* Zusammenfassung */}
        {pruefen && (
          <div>
            <h3 className="h-card font-serif">Passt alles so?</h3>
            <p className="measure mt-3 text-sm text-ink">
              Schau noch einmal drüber. Danach schickst du mir die Anfrage – unverbindlich.
            </p>

            <div className="mt-7">
              <Zusammenfassung
                zeilen={zusammenfassungsZeilen}
                onAendern={(ziel) => {
                  setPruefen(false);
                  setSchritt(ziel);
                }}
              />
            </div>

            {serverFehler && (
              <p role="alert" className="mt-6 border border-[#9b2c19] bg-cream p-4 text-sm text-[#9b2c19]">
                {serverFehler}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-taupe pt-8">
        {pruefen ? (
          <>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Wird gesendet …' : 'Anfrage abschicken'}
            </button>
            <button
              type="button"
              onClick={() => setPruefen(false)}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Zurück
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={weiter} className="btn btn-primary">
              Weiter
            </button>
            {schritt > 0 && (
              <button
                type="button"
                onClick={() => setSchritt((aktuell) => aktuell - 1)}
                className="btn btn-secondary"
              >
                Zurück
              </button>
            )}
          </>
        )}

        <p className="w-full text-xs text-ink sm:w-auto sm:flex-1 sm:text-right">
          Unverbindliche Anfrage – kein verbindliches Buchungssystem.
        </p>
      </div>
    </form>
  );
}
