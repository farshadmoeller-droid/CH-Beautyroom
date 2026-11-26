'use client';

import type { ReactNode } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';

/**
 * Fehlermeldung mit fest reserviertem Platz.
 *
 * Die Zeile steht immer im Dokument, auch ohne Fehler. So springt das
 * Layout nicht, sobald eine Meldung erscheint oder verschwindet – wer
 * gerade auf „Absenden“ tippt, trifft den Knopf auch dann noch. Außerdem
 * ist der Live-Bereich schon da, wenn der Text hineinkommt; nur so lesen
 * Screenreader ihn zuverlässig vor.
 */
export function Fehlerzeile({ id, fehler }: { id: string; fehler?: string }) {
  return (
    <p id={id} role="alert" className="feld-fehler">
      {fehler ?? ''}
    </p>
  );
}

type FeldProps = {
  id: string;
  label: string;
  hinweis?: string;
  fehler?: string;
  optional?: boolean;
  children: (attribute: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string;
  }) => ReactNode;
};

export default function Feld({ id, label, hinweis, fehler, optional = false, children }: FeldProps) {
  const hinweisId = hinweis ? `${id}-hinweis` : undefined;
  const fehlerId = `${id}-fehler`;

  return (
    <div>
      <label htmlFor={id} className="feld-label">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-leise/80">(optional)</span>}
      </label>

      {hinweis && (
        <p id={hinweisId} className="mb-2 text-xs text-leise-stark">
          {hinweis}
        </p>
      )}

      {children({
        id,
        'aria-invalid': Boolean(fehler),
        'aria-describedby': [hinweisId, fehlerId].filter(Boolean).join(' '),
      })}

      <Fehlerzeile id={fehlerId} fehler={fehler} />
    </div>
  );
}

/**
 * Auswahlgruppe als echte Radio-Buttons.
 *
 * Eingabefeld und Beschriftung sind über id/htmlFor verknüpft und bewusst
 * nicht ineinander verschachtelt: Liegt das Feld im Label, leitet das Label
 * den Klick ein zweites Mal weiter – React erkennt die Änderung dann nicht
 * mehr, wenn direkt auf den Punkt geklickt wird. Bitte so lassen.
 */
export function RadioGruppe<T extends FieldValues>({
  control,
  name,
  legende,
  optionen,
  fehler,
  gross = false,
}: {
  control: Control<T>;
  name: Path<T>;
  legende: string;
  optionen: { wert: string; label: string; zusatz?: string }[];
  fehler?: string;
  gross?: boolean;
}) {
  const { field } = useController({ control, name });
  const fehlerId = `${name}-fehler`;

  return (
    <fieldset aria-describedby={fehlerId} aria-invalid={Boolean(fehler)}>
      <legend className="feld-label">{legende}</legend>

      <div className={gross ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'flex flex-wrap gap-3'}>
        {optionen.map((option) => {
          const optionId = `${name}-${option.wert}`;
          return (
            <div
              key={option.wert}
              className="flex min-h-11 flex-1 items-start gap-3 rounded-lg border border-akzent-rand bg-white/50 px-4 py-3 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-creme"
            >
              <input
                id={optionId}
                type="radio"
                name={field.name}
                value={option.wert}
                checked={field.value === option.wert}
                onChange={() => field.onChange(option.wert)}
                onBlur={field.onBlur}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-ink)]"
              />
              <label htmlFor={optionId} className="flex-1 cursor-pointer">
                <span className="block text-sm">{option.label}</span>
                {option.zusatz && <span className="mt-0.5 block text-xs opacity-75">{option.zusatz}</span>}
              </label>
            </div>
          );
        })}
      </div>

      <Fehlerzeile id={fehlerId} fehler={fehler} />
    </fieldset>
  );
}

/** Große, gut tippbare Auswahl der Zeitfenster. */
export function FensterAuswahl<T extends FieldValues>({
  control,
  name,
  optionen,
}: {
  control: Control<T>;
  name: Path<T>;
  optionen: { wert: string; label: string }[];
}) {
  const { field } = useController({ control, name });

  if (optionen.length === 0) {
    return (
      <p className="text-sm text-leise-stark">
        An diesem Tag ist kein Zeitfenster mehr frei genug – ich brauche mindestens{' '}
        24 Stunden Vorlauf. Bitte wähle einen späteren Tag.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {optionen.map((option) => {
        const optionId = `${name}-${option.wert}`;
        return (
          <div
            key={option.wert}
            className="flex min-h-[3.5rem] items-center gap-3 rounded-lg border border-akzent-rand bg-white/50 px-5 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-creme"
          >
            <input
              id={optionId}
              type="radio"
              name={field.name}
              value={option.wert}
              checked={field.value === option.wert}
              onChange={() => field.onChange(option.wert)}
              onBlur={field.onBlur}
              className="h-4 w-4 cursor-pointer accent-[var(--color-ink)]"
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

export function Checkbox<T extends FieldValues>({
  id,
  control,
  name,
  fehler,
  children,
}: {
  id: string;
  control: Control<T>;
  name: Path<T>;
  fehler?: string;
  children: ReactNode;
}) {
  const { field } = useController({ control, name });
  const fehlerId = `${id}-fehler`;

  return (
    <div>
      <div className="flex items-start gap-3 text-sm text-leise-stark">
        <input
          id={id}
          type="checkbox"
          name={field.name}
          checked={field.value === true}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
          aria-invalid={Boolean(fehler)}
          aria-describedby={fehlerId}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-ink)]"
        />
        <label htmlFor={id} className="flex-1 cursor-pointer">
          {children}
        </label>
      </div>
      <Fehlerzeile id={fehlerId} fehler={fehler} />
    </div>
  );
}

/** Unsichtbares Honeypot-Feld gegen Bots. */
export function Honeypot({ registrierung }: { registrierung: Record<string, unknown> }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="webseite">Bitte dieses Feld leer lassen</label>
      <input id="webseite" type="text" tabIndex={-1} autoComplete="off" {...registrierung} />
    </div>
  );
}
