'use client';

import type { ReactNode } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';

/**
 * Fehlermeldung mit fest reserviertem Platz.
 *
 * Die Zeile ist immer im Dokument – auch ohne Fehler. Damit springt das
 * Layout nicht, sobald eine Meldung erscheint oder verschwindet: Wer gerade
 * auf "Weiter" tippt, trifft auch dann noch den Knopf, wenn sich im selben
 * Moment eine Meldung ueber dem Knopf aufloest. Ausserdem ist der
 * Live-Bereich dadurch schon vorhanden, wenn der Text hineingeschrieben wird –
 * nur so lesen Screenreader ihn zuverlaessig vor.
 */
export function Fehlerzeile({ id, fehler }: { id: string; fehler?: string }) {
  return (
    <p id={id} role="alert" className="field-error min-h-[1.15rem]">
      {fehler ?? ''}
    </p>
  );
}

type FeldProps = {
  id: string;
  label: string;
  /** Wird unter dem Label angezeigt, z. B. "optional". */
  hinweis?: string;
  fehler?: string;
  pflicht?: boolean;
  children: (hilfsAttribute: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
  }) => ReactNode;
};

/**
 * Einheitlicher Rahmen fuer Formularfelder: Label, optionaler Hinweis und
 * Fehlermeldung – korrekt ueber aria-describedby und aria-invalid verknuepft.
 */
export default function Feld({ id, label, hinweis, fehler, pflicht = false, children }: FeldProps) {
  const hinweisId = hinweis ? `${id}-hinweis` : undefined;
  const fehlerId = `${id}-fehler`;
  const beschriebenVon = [hinweisId, fehlerId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {!pflicht && <span className="ml-2 normal-case tracking-normal text-ink/70">(optional)</span>}
      </label>

      {hinweis && (
        <p id={hinweisId} className="mb-2 text-xs text-ink">
          {hinweis}
        </p>
      )}

      {children({ id, 'aria-invalid': Boolean(fehler), 'aria-describedby': beschriebenVon })}

      <Fehlerzeile id={fehlerId} fehler={fehler} />
    </div>
  );
}

type RadioGruppeProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  legende: string;
  optionen: { wert: string; label: string; beschreibung?: string }[];
  fehler?: string;
  /** Grosse Kacheln statt schlanker Zeilen. */
  gross?: boolean;
};

/**
 * Auswahlgruppe als echte Radio-Buttons.
 *
 * Die Gruppe wird ueber useController an react-hook-form angebunden: bei
 * mehreren Eingabefeldern mit demselben Namen ist das deutlich robuster,
 * als ein und dieselbe register()-Referenz auf alle Felder zu verteilen.
 *
 * Eingabefeld und Beschriftung sind bewusst ueber id/htmlFor verknuepft und
 * nicht ineinander verschachtelt: Liegt das Feld im Label, leitet das Label
 * den Klick ein zweites Mal an das Feld weiter – React erkennt die Aenderung
 * dann nicht mehr und onChange bleibt aus, wenn direkt auf den Punkt geklickt
 * wird. Ueber id/htmlFor funktionieren beide Klickziele zuverlaessig.
 */
export function RadioGruppe<T extends FieldValues>({
  control,
  name,
  legende,
  optionen,
  fehler,
  gross = false,
}: RadioGruppeProps<T>) {
  const { field } = useController({ control, name });
  const fehlerId = `${name}-fehler`;

  return (
    <fieldset aria-describedby={fehlerId} aria-invalid={Boolean(fehler)}>
      <legend className="field-label">{legende}</legend>

      <div className={gross ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'flex flex-wrap gap-3'}>
        {optionen.map((option) => {
          const optionId = `${name}-${option.wert}`;
          return (
            <div
              key={option.wert}
              className="flex min-h-11 items-start gap-3 border border-control bg-cream px-4 py-3 transition-colors hover:border-ink has-[:checked]:border-espresso has-[:checked]:bg-espresso has-[:checked]:text-cream"
            >
              <input
                id={optionId}
                type="radio"
                name={field.name}
                value={option.wert}
                checked={field.value === option.wert}
                onChange={() => field.onChange(option.wert)}
                onBlur={field.onBlur}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-espresso)]"
              />
              <label htmlFor={optionId} className="flex-1 cursor-pointer">
                <span className="block text-sm">{option.label}</span>
                {option.beschreibung && (
                  <span className="mt-0.5 block text-xs opacity-75">{option.beschreibung}</span>
                )}
              </label>
            </div>
          );
        })}
      </div>

      <Fehlerzeile id={fehlerId} fehler={fehler} />
    </fieldset>
  );
}

type SlotAuswahlProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  optionen: { wert: string; label: string }[];
};

/**
 * Grosse, gut tippbare Auswahl der Zeitfenster.
 * Die Fehlermeldung setzt das Formular selbst am umgebenden fieldset –
 * aria-invalid ist an einem Radio-Button nicht zulaessig.
 */
export function SlotAuswahl<T extends FieldValues>({ control, name, optionen }: SlotAuswahlProps<T>) {
  const { field } = useController({ control, name });

  return (
    <div className="grid grid-cols-1 gap-3">
      {optionen.map((option) => {
        const optionId = `${name}-${option.wert.replace(':', '')}`;
        return (
          <div
            key={option.wert}
            className="flex min-h-[3.25rem] items-center gap-3 border border-control bg-cream px-5 text-base transition-colors hover:border-ink has-[:checked]:border-espresso has-[:checked]:bg-espresso has-[:checked]:text-cream"
          >
            <input
              id={optionId}
              type="radio"
              name={field.name}
              value={option.wert}
              checked={field.value === option.wert}
              onChange={() => field.onChange(option.wert)}
              onBlur={field.onBlur}
              className="h-4 w-4 cursor-pointer accent-[var(--color-espresso)]"
            />
            <label htmlFor={optionId} className="flex-1 cursor-pointer py-4">
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

type CheckboxProps<T extends FieldValues> = {
  id: string;
  control: Control<T>;
  name: Path<T>;
  fehler?: string;
  children: ReactNode;
};

export function Checkbox<T extends FieldValues>({ id, control, name, fehler, children }: CheckboxProps<T>) {
  const { field } = useController({ control, name });
  const fehlerId = `${id}-fehler`;

  return (
    <div>
      <div className="flex items-start gap-3 text-sm text-ink">
        <input
          id={id}
          type="checkbox"
          name={field.name}
          checked={field.value === true}
          onChange={(event) => field.onChange(event.target.checked)}
          onBlur={field.onBlur}
          aria-invalid={Boolean(fehler)}
          aria-describedby={fehlerId}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-espresso)]"
        />
        <label htmlFor={id} className="flex-1 cursor-pointer">
          {children}
        </label>
      </div>

      <Fehlerzeile id={fehlerId} fehler={fehler} />
    </div>
  );
}

/** Unsichtbares Honeypot-Feld gegen Bots. Wird von Menschen nie ausgefuellt. */
export function Honeypot({ registrierung }: { registrierung: Record<string, unknown> }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="webseite">Bitte dieses Feld leer lassen</label>
      <input id="webseite" type="text" tabIndex={-1} autoComplete="off" {...registrierung} />
    </div>
  );
}
