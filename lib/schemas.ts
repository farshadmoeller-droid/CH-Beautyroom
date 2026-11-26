/**
 * Prüfregeln, die im Browser (react-hook-form) und auf dem Server
 * (Route Handler) unverändert verwendet werden. Die Prüfung im Browser ist
 * Komfort – verbindlich ist die auf dem Server.
 */

import { z } from 'zod';
import { formular, leistungen, termine } from '@/content/site';
import { fensterVerfuegbar, istFrei } from '@/lib/dates';

const pflicht = 'Dieses Feld brauche ich noch von dir.';

const name = z
  .string({ required_error: pflicht })
  .trim()
  .min(1, pflicht)
  .min(2, 'Bitte mindestens zwei Zeichen.')
  .max(80, 'Das ist etwas zu lang.');

const email = z
  .string({ required_error: pflicht })
  .trim()
  .min(1, pflicht)
  .email('Diese E-Mail-Adresse sieht noch nicht vollständig aus.')
  .max(120, 'Diese Adresse ist zu lang.');

const telefon = z
  .string({ required_error: pflicht })
  .trim()
  .min(1, pflicht)
  .max(40, 'Diese Nummer ist zu lang.')
  .regex(/^[0-9+()/\s-]+$/, 'Bitte nur Ziffern, Leerzeichen und + ( ) - / verwenden.');

const telefonOptional = z
  .string()
  .trim()
  .max(40, 'Diese Nummer ist zu lang.')
  .regex(/^[0-9+()/\s-]*$/, 'Bitte nur Ziffern, Leerzeichen und + ( ) - / verwenden.')
  .optional()
  .or(z.literal(''));

const datenschutz = z.literal(true, {
  errorMap: () => ({ message: 'Ohne deine Einwilligung darf ich die Anfrage leider nicht verarbeiten.' }),
});

/** Felder, die nur der Spam-Abwehr dienen und nie sichtbar sind. */
const spamSchutz = {
  /** Honeypot: muss leer bleiben. */
  webseite: z.string().max(0).optional().or(z.literal('')),
  /** Zeitpunkt des Formularaufbaus in Millisekunden. */
  gestartet: z.coerce.number().optional(),
};

const leistungsIds = leistungen.filter((l) => l.imFormular).map((l) => l.id) as [string, ...string[]];
const fensterIds = termine.zeitfenster.map((f) => f.id) as [string, ...string[]];

/* ─────────────────────────────────────────────────── Beauty-Termin */

export const beautySchema = z
  .object({
    art: z.literal('beauty'),
    ...spamSchutz,
    vorname: name,
    nachname: name,
    telefon,
    email,
    leistung: z.enum(leistungsIds, { errorMap: () => ({ message: 'Bitte wähle eine Leistung aus.' }) }),
    datum: z
      .string({ required_error: 'Bitte wähle einen Wunschtag im Kalender.' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte wähle einen Wunschtag im Kalender.')
      .refine((wert) => istFrei(wert), {
        message: 'Dieser Tag ist leider nicht buchbar. Bitte wähle einen anderen.',
      }),
    zeitfenster: z.enum(fensterIds, {
      errorMap: () => ({ message: 'Bitte wähle eines der beiden Zeitfenster.' }),
    }),
    ersterBesuch: z.enum(['ja', 'nein'], {
      errorMap: () => ({ message: 'Bitte wähle Ja oder Nein.' }),
    }),
    nachricht: z.string().trim().max(2000, 'Bitte auf 2000 Zeichen kürzen.').optional().or(z.literal('')),
    datenschutz,
  })
  .superRefine((werte, ctx) => {
    // Die Vorlaufzeit gilt für das konkrete Zeitfenster, nicht für den Tag.
    const fenster = termine.zeitfenster.find((f) => f.id === werte.zeitfenster);
    if (werte.datum && fenster && !fensterVerfuegbar(werte.datum, fenster.start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['zeitfenster'],
        message: 'Dieses Zeitfenster ist zu kurzfristig. Bitte wähle ein späteres.',
      });
    }
  });

export type BeautyAnfrage = z.infer<typeof beautySchema>;

/* ─────────────────────────────────────────────── Fineline-Tattoo */

export const tattooSchema = z.object({
  art: z.literal('tattoo'),
  ...spamSchutz,
  vorname: name,
  nachname: name,
  telefon: telefonOptional,
  email,
  motiv: z
    .string({ required_error: pflicht })
    .trim()
    .min(1, pflicht)
    .min(20, 'Erzähl mir bitte etwas ausführlicher von deiner Idee – mindestens 20 Zeichen.')
    .max(3000, 'Bitte auf 3000 Zeichen kürzen.'),
  koerperstelle: z.enum(formular.koerperstellen as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Bitte wähle eine Körperstelle.' }),
  }),
  groesse: z.enum(formular.groessen as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Bitte wähle eine ungefähre Größe.' }),
  }),
  zeitraum: z
    .string({ required_error: pflicht })
    .regex(/^\d{4}-\d{2}$/, 'Bitte wähle einen Wunschmonat.'),
  erstesTattoo: z.enum(['ja', 'nein'], {
    errorMap: () => ({ message: 'Bitte wähle Ja oder Nein.' }),
  }),
  volljaehrig: z.literal(true, {
    errorMap: () => ({ message: 'Ich tätowiere ausschließlich ab 18 Jahren.' }),
  }),
  datenschutz,
});

export type TattooAnfrage = z.infer<typeof tattooSchema>;

/* ────────────────────────────────────────────────────── Gemeinsam */

export type AnfrageErgebnis =
  | { status: 'ok'; referenz: string }
  | { status: 'fehler'; nachricht: string; felder?: Record<string, string> };

/** Prüft die hochgeladenen Referenzbilder – gilt im Browser und auf dem Server. */
export function pruefeDateien(dateien: { name: string; size: number; type: string }[]): string | null {
  if (dateien.length > formular.upload.maxDateien) {
    return `Bitte lade höchstens ${formular.upload.maxDateien} Bilder hoch.`;
  }
  for (const datei of dateien) {
    if (!(formular.upload.typen as readonly string[]).includes(datei.type)) {
      return `„${datei.name}“ hat ein Format, das ich nicht verarbeiten kann. Bitte JPG, PNG oder WebP.`;
    }
    if (datei.size > formular.upload.maxBytes) {
      return `„${datei.name}“ ist größer als 5 MB. Bitte lade eine kleinere Datei hoch.`;
    }
  }
  return null;
}

/** Mindestzeit zwischen Aufbau und Absenden – Zeitfalle gegen Bots. */
export const MINDEST_AUSFUELLZEIT_MS = 3000;
