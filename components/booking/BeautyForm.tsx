'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Calendar from '@/components/booking/Calendar';
import Erfolg from '@/components/booking/Erfolg';
import Feld, { Checkbox, Fehlerzeile, FensterAuswahl, Honeypot, RadioGruppe } from '@/components/booking/Fields';
import { beautySchema, type AnfrageErgebnis, type BeautyAnfrage } from '@/lib/schemas';
import { formatiereDatumLang, verfuegbareFenster } from '@/lib/dates';
import { business, formular, leistungen, termine } from '@/content/site';

export default function BeautyForm({ vorauswahl }: { vorauswahl?: string }) {
  const [gesendet, setGesendet] = useState<{ vorname: string; referenz: string } | null>(null);
  const [serverFehler, setServerFehler] = useState<string | null>(null);
  const gestartet = useRef(Date.now());

  const buchbar = useMemo(() => leistungen.filter((l) => l.imFormular), []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BeautyAnfrage>({
    resolver: zodResolver(beautySchema),
    mode: 'onBlur',
    defaultValues: {
      art: 'beauty',
      leistung: vorauswahl as BeautyAnfrage['leistung'],
      nachricht: '',
      webseite: '',
    },
  });

  const werte = watch();

  useEffect(() => {
    if (vorauswahl) setValue('leistung', vorauswahl as BeautyAnfrage['leistung']);
  }, [vorauswahl, setValue]);

  const fenster = werte.datum ? verfuegbareFenster(werte.datum) : [];

  async function absenden(daten: BeautyAnfrage) {
    setServerFehler(null);

    const koerper = new FormData();
    koerper.set('art', 'beauty');
    koerper.set('vorname', daten.vorname);
    koerper.set('nachname', daten.nachname);
    koerper.set('telefon', daten.telefon);
    koerper.set('email', daten.email);
    koerper.set('leistung', daten.leistung);
    koerper.set('datum', daten.datum);
    koerper.set('zeitfenster', daten.zeitfenster);
    koerper.set('ersterBesuch', daten.ersterBesuch);
    koerper.set('nachricht', daten.nachricht ?? '');
    koerper.set('datenschutz', daten.datenschutz ? 'on' : '');
    koerper.set('webseite', daten.webseite ?? '');
    koerper.set('gestartet', String(gestartet.current));

    try {
      const antwort = await fetch('/api/anfrage', { method: 'POST', body: koerper });
      const ergebnis: AnfrageErgebnis = await antwort.json();
      if (ergebnis.status === 'ok') {
        setGesendet({ vorname: daten.vorname, referenz: ergebnis.referenz });
      } else {
        setServerFehler(ergebnis.nachricht);
      }
    } catch {
      setServerFehler(
        `Die Anfrage konnte gerade nicht verschickt werden. Schreib mir alternativ direkt an ${business.email}.`,
      );
    }
  }

  if (gesendet) {
    return <Erfolg vorname={gesendet.vorname} referenz={gesendet.referenz} istTattoo={false} />;
  }

  return (
    <form noValidate onSubmit={handleSubmit(absenden)} className="relative">
      <Honeypot registrierung={register('webseite')} />
      <input type="hidden" {...register('art')} value="beauty" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Feld id="b-vorname" label="Vorname" fehler={errors.vorname?.message}>
          {(a) => <input type="text" autoComplete="given-name" className="feld" {...a} {...register('vorname')} />}
        </Feld>

        <Feld id="b-nachname" label="Nachname" fehler={errors.nachname?.message}>
          {(a) => <input type="text" autoComplete="family-name" className="feld" {...a} {...register('nachname')} />}
        </Feld>

        <Feld id="b-telefon" label="Telefon" fehler={errors.telefon?.message}>
          {(a) => <input type="tel" inputMode="tel" autoComplete="tel" className="feld" {...a} {...register('telefon')} />}
        </Feld>

        <Feld id="b-email" label="E-Mail" fehler={errors.email?.message}>
          {(a) => (
            <input type="email" inputMode="email" autoComplete="email" className="feld" {...a} {...register('email')} />
          )}
        </Feld>

        <div className="sm:col-span-2">
          <Feld id="b-leistung" label="Leistung" fehler={errors.leistung?.message}>
            {(a) => (
              <select className="feld" defaultValue="" {...a} {...register('leistung')}>
                <option value="" disabled>
                  Bitte auswählen
                </option>
                {buchbar.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.titel} – {l.kurz}
                  </option>
                ))}
              </select>
            )}
          </Feld>
        </div>

        {/* Kalender und Zeitfenster */}
        <div className="sm:col-span-2">
          <p className="feld-label">Wunschtag</p>
          <Calendar
            beschriebenVon="b-datum-fehler"
            wert={werte.datum ?? null}
            onAuswahl={(iso) => {
              setValue('datum', iso, { shouldValidate: true });
              const nochFrei = verfuegbareFenster(iso).some((f) => f.id === werte.zeitfenster);
              if (!nochFrei) setValue('zeitfenster', '' as BeautyAnfrage['zeitfenster']);
            }}
          />
          <Fehlerzeile id="b-datum-fehler" fehler={errors.datum?.message} />
        </div>

        <div className="sm:col-span-2">
          <fieldset aria-describedby="b-fenster-fehler" aria-invalid={Boolean(errors.zeitfenster)}>
            <legend className="feld-label">Zeitfenster</legend>
            {werte.datum ? (
              <FensterAuswahl
                control={control}
                name="zeitfenster"
                optionen={fenster.map((f) => ({ wert: f.id, label: f.label }))}
              />
            ) : (
              <p className="text-sm text-leise-stark">Wähle zuerst einen Tag im Kalender.</p>
            )}
            <Fehlerzeile id="b-fenster-fehler" fehler={errors.zeitfenster?.message} />
          </fieldset>

          {werte.datum && (
            <p className="mt-1 text-xs text-leise-stark">
              Gewählt: {formatiereDatumLang(werte.datum)}
              {fenster.length > 0 && fenster.length < termine.zeitfenster.length
                ? ' · Ein Zeitfenster dieses Tages liegt bereits innerhalb der Vorlaufzeit.'
                : ''}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <RadioGruppe
            control={control}
            name="ersterBesuch"
            legende="Bist du zum ersten Mal bei mir?"
            fehler={errors.ersterBesuch?.message}
            optionen={[
              { wert: 'ja', label: 'Ja, das erste Mal' },
              { wert: 'nein', label: 'Nein, ich war schon da' },
            ]}
          />
        </div>

        <div className="sm:col-span-2">
          <Feld
            id="b-nachricht"
            label="Nachricht"
            optional
            hinweis="Wünsche, Fragen, Besonderheiten – alles, was ich wissen sollte."
            fehler={errors.nachricht?.message}
          >
            {(a) => <textarea rows={4} className="feld" {...a} {...register('nachricht')} />}
          </Feld>
        </div>

        <div className="sm:col-span-2">
          <Checkbox id="b-datenschutz" control={control} name="datenschutz" fehler={errors.datenschutz?.message}>
            Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage per E-Mail
            verarbeitet werden. Mehr dazu in der{' '}
            <Link href="/datenschutz" className="underline decoration-akzent-rand underline-offset-4">
              Datenschutzerklärung
            </Link>
            .
          </Checkbox>
        </div>
      </div>

      {serverFehler && (
        <p role="alert" className="mt-4 rounded-lg border border-[#9b2c19] bg-white/60 p-4 text-sm text-[#9b2c19]">
          {serverFehler}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="knopf knopf-voll">
          {isSubmitting ? 'Wird gesendet …' : 'Anfrage abschicken'}
        </button>
        <p className="text-xs text-leise-stark sm:flex-1">{formular.hinweis}</p>
      </div>
    </form>
  );
}
