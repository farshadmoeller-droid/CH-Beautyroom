'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Erfolg from '@/components/booking/Erfolg';
import Feld, { Checkbox, Fehlerzeile, Honeypot, RadioGruppe } from '@/components/booking/Fields';
import { CloseIcon } from '@/components/ui/Icons';
import { pruefeDateien, tattooSchema, type AnfrageErgebnis, type TattooAnfrage } from '@/lib/schemas';
import { monatsAuswahl } from '@/lib/dates';
import { business, formular } from '@/content/site';

export default function TattooForm() {
  const [dateien, setDateien] = useState<File[]>([]);
  const [dateiFehler, setDateiFehler] = useState<string | null>(null);
  const [vorschauen, setVorschauen] = useState<string[]>([]);
  const [gesendet, setGesendet] = useState<{ vorname: string; referenz: string } | null>(null);
  const [serverFehler, setServerFehler] = useState<string | null>(null);

  const gestartet = useRef(Date.now());
  const dateiFeld = useRef<HTMLInputElement>(null);
  const monate = useMemo(() => monatsAuswahl(), []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TattooAnfrage>({
    resolver: zodResolver(tattooSchema),
    mode: 'onBlur',
    defaultValues: { art: 'tattoo', telefon: '', webseite: '' },
  });

  // Objekt-URLs wieder freigeben, sobald sie nicht mehr gebraucht werden.
  useEffect(() => {
    const urls = dateien.map((d) => URL.createObjectURL(d));
    setVorschauen(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [dateien]);

  function hinzufuegen(neue: FileList | null) {
    if (!neue) return;
    const zusammen = [...dateien, ...Array.from(neue)].slice(0, formular.upload.maxDateien);
    const fehler = pruefeDateien(zusammen);
    setDateiFehler(fehler);
    if (!fehler) setDateien(zusammen);
    if (dateiFeld.current) dateiFeld.current.value = '';
  }

  async function absenden(daten: TattooAnfrage) {
    setServerFehler(null);
    if (dateiFehler) return;

    const koerper = new FormData();
    koerper.set('art', 'tattoo');
    koerper.set('vorname', daten.vorname);
    koerper.set('nachname', daten.nachname);
    koerper.set('telefon', daten.telefon ?? '');
    koerper.set('email', daten.email);
    koerper.set('motiv', daten.motiv);
    koerper.set('koerperstelle', daten.koerperstelle);
    koerper.set('groesse', daten.groesse);
    koerper.set('zeitraum', daten.zeitraum);
    koerper.set('erstesTattoo', daten.erstesTattoo);
    koerper.set('volljaehrig', daten.volljaehrig ? 'on' : '');
    koerper.set('datenschutz', daten.datenschutz ? 'on' : '');
    koerper.set('webseite', daten.webseite ?? '');
    koerper.set('gestartet', String(gestartet.current));
    dateien.forEach((d) => koerper.append('referenzbilder', d));

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
    return <Erfolg vorname={gesendet.vorname} referenz={gesendet.referenz} istTattoo />;
  }

  return (
    <form noValidate onSubmit={handleSubmit(absenden)} className="relative">
      <Honeypot registrierung={register('webseite')} />
      <input type="hidden" {...register('art')} value="tattoo" />

      <p className="mass mb-7 text-sm text-leise-stark">
        Jedes Tattoo ist unterschiedlich aufwendig, deshalb gibt es hier keinen Kalender. Erzähl mir
        zuerst von deiner Idee – den passenden Termin finden wir dann gemeinsam. Ich tätowiere
        ausschließlich Frauen und ausschließlich ab 18 Jahren.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Feld id="t-vorname" label="Vorname" fehler={errors.vorname?.message}>
          {(a) => <input type="text" autoComplete="given-name" className="feld" {...a} {...register('vorname')} />}
        </Feld>

        <Feld id="t-nachname" label="Nachname" fehler={errors.nachname?.message}>
          {(a) => <input type="text" autoComplete="family-name" className="feld" {...a} {...register('nachname')} />}
        </Feld>

        <Feld id="t-email" label="E-Mail" fehler={errors.email?.message}>
          {(a) => (
            <input type="email" inputMode="email" autoComplete="email" className="feld" {...a} {...register('email')} />
          )}
        </Feld>

        <Feld id="t-telefon" label="Telefon oder WhatsApp" optional fehler={errors.telefon?.message}>
          {(a) => <input type="tel" inputMode="tel" autoComplete="tel" className="feld" {...a} {...register('telefon')} />}
        </Feld>

        <div className="sm:col-span-2">
          <Feld
            id="t-motiv"
            label="Deine Motividee"
            hinweis="Je mehr du erzählst, desto besser kann ich den Entwurf vorbereiten."
            fehler={errors.motiv?.message}
          >
            {(a) => (
              <textarea
                rows={5}
                className="feld"
                placeholder="z. B. ein feiner Zweig mit drei kleinen Blüten, dazu die Geburtsjahre meiner Kinder"
                {...a}
                {...register('motiv')}
              />
            )}
          </Feld>
        </div>

        <Feld id="t-koerperstelle" label="Körperstelle" fehler={errors.koerperstelle?.message}>
          {(a) => (
            <select className="feld" defaultValue="" {...a} {...register('koerperstelle')}>
              <option value="" disabled>
                Bitte auswählen
              </option>
              {formular.koerperstellen.map((stelle) => (
                <option key={stelle} value={stelle}>
                  {stelle}
                </option>
              ))}
            </select>
          )}
        </Feld>

        <Feld id="t-groesse" label="Ungefähre Größe" fehler={errors.groesse?.message}>
          {(a) => (
            <select className="feld" defaultValue="" {...a} {...register('groesse')}>
              <option value="" disabled>
                Bitte auswählen
              </option>
              {formular.groessen.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}
        </Feld>

        <Feld id="t-zeitraum" label="Wunschzeitraum" fehler={errors.zeitraum?.message}>
          {(a) => (
            <select className="feld" defaultValue="" {...a} {...register('zeitraum')}>
              <option value="" disabled>
                Bitte einen Monat wählen
              </option>
              {monate.map((m) => (
                <option key={m.wert} value={m.wert}>
                  {m.label}
                </option>
              ))}
            </select>
          )}
        </Feld>

        <div className="sm:col-span-2">
          <RadioGruppe
            control={control}
            name="erstesTattoo"
            legende="Ist es dein erstes Tattoo?"
            fehler={errors.erstesTattoo?.message}
            optionen={[
              { wert: 'ja', label: 'Ja, mein erstes' },
              { wert: 'nein', label: 'Nein, ich habe schon welche' },
            ]}
          />
        </div>

        {/* Referenzbilder */}
        <div className="sm:col-span-2">
          <label htmlFor="referenzbilder" className="feld-label">
            Referenzbilder <span className="ml-2 normal-case tracking-normal text-leise/80">(optional)</span>
          </label>
          <p id="referenzbilder-hinweis" className="mb-2 text-xs text-leise-stark">
            Bis zu {formular.upload.maxDateien} Bilder, je höchstens 5 MB, als JPG, PNG oder WebP.
          </p>

          <input
            ref={dateiFeld}
            id="referenzbilder"
            type="file"
            multiple
            accept={formular.upload.accept}
            aria-describedby="referenzbilder-hinweis referenzbilder-fehler"
            aria-invalid={Boolean(dateiFehler)}
            onChange={(e) => hinzufuegen(e.target.files)}
            className="feld h-auto py-2.5 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blush file:px-4 file:py-1.5 file:text-sm file:text-ink"
          />
          <Fehlerzeile id="referenzbilder-fehler" fehler={dateiFehler ?? undefined} />

          {dateien.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-4">
              {dateien.map((datei, index) => (
                <li key={`${datei.name}-${index}`} className="relative">
                  <span className="block h-24 w-24 overflow-hidden rounded-lg border border-akzent-rand bg-blush">
                    {vorschauen[index] && (
                      // Lokale Vorschau aus dem Browser-Speicher: Die Datei liegt
                      // nie auf dem Server, deshalb hier bewusst kein next/image.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={vorschauen[index]} alt={`Vorschau von ${datei.name}`} className="h-full w-full object-cover" />
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDateien((a) => a.filter((_, i) => i !== index));
                      setDateiFehler(null);
                    }}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-akzent-rand bg-creme text-ink transition-colors hover:border-ink"
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
          <Checkbox id="t-volljaehrig" control={control} name="volljaehrig" fehler={errors.volljaehrig?.message}>
            Ich bin mindestens 18 Jahre alt. Bitte bring zum Termin einen gültigen Ausweis mit.
          </Checkbox>
        </div>

        <div className="sm:col-span-2">
          <Checkbox id="t-datenschutz" control={control} name="datenschutz" fehler={errors.datenschutz?.message}>
            Ich bin damit einverstanden, dass meine Angaben und hochgeladenen Bilder zur Bearbeitung
            meiner Anfrage per E-Mail verarbeitet werden. Mehr dazu in der{' '}
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
