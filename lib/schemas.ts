/**
 * Validierungsschemata – werden unveraendert im Browser (react-hook-form)
 * und auf dem Server (Server Action) verwendet. Fehlermeldungen sind deutsch
 * und werden direkt unter dem jeweiligen Feld ausgegeben.
 */

import { z } from 'zod';
import { bookableTreatments } from '@/content/services';
import { koerperstellen, uploadLimits } from '@/content/booking-config';
import { istAuswaehlbar, slotIstVerfuegbar, zeitfenster } from '@/lib/dates';

const pflicht = 'Dieses Feld brauche ich noch von dir.';

const nameFeld = z
  .string({ required_error: pflicht })
  .trim()
  .min(1, pflicht)
  .min(2, 'Bitte mindestens zwei Zeichen.')
  .max(60, 'Das ist etwas zu lang – bitte kürzer fassen.');

const emailFeld = z
  .string({ required_error: pflicht })
  .trim()
  .min(1, pflicht)
  .email('Diese E-Mail-Adresse sieht noch nicht vollständig aus.')
  .max(120, 'Diese Adresse ist zu lang.');

const telefonOptional = z
  .string()
  .trim()
  .max(40, 'Diese Nummer ist zu lang.')
  .regex(/^[0-9+()/\s-]*$/, 'Bitte nur Ziffern, Leerzeichen und + ( ) - / verwenden.')
  .optional()
  .or(z.literal(''));

const datenschutzFeld = z.literal(true, {
  errorMap: () => ({ message: 'Ohne deine Einwilligung darf ich die Anfrage leider nicht verarbeiten.' }),
});

/** Felder, die nur zur Spam-Abwehr dienen und nie angezeigt werden. */
export const spamSchutzSchema = z.object({
  /** Honeypot: muss leer bleiben. */
  webseite: z.string().max(0).optional().or(z.literal('')),
  /** Zeitstempel des Formular-Aufbaus in Millisekunden. */
  gestartetUm: z.coerce.number().optional(),
});

const behandlungsIds = bookableTreatments.map((treatment) => treatment.id) as [string, ...string[]];
const zeitfensterWerte = zeitfenster().map((fenster) => fenster.start) as [string, ...string[]];

/** Terminanfrage fuer Beauty-Behandlungen (mit Kalender). */
export const beautyAnfrageSchema = spamSchutzSchema.extend({
  art: z.literal('beauty'),
  behandlung: z.enum(behandlungsIds, {
    errorMap: () => ({ message: 'Bitte wähle eine Behandlung aus.' }),
  }),
  datum: z
    .string({ required_error: 'Bitte wähle einen Wunschtag im Kalender.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte wähle einen Wunschtag im Kalender.')
    .refine((wert) => istAuswaehlbar(wert), {
      message: 'Dieser Tag ist leider nicht buchbar. Bitte wähle einen anderen.',
    }),
  zeitfenster: z.enum(zeitfensterWerte, {
    errorMap: () => ({ message: 'Bitte wähle eines der beiden Zeitfenster.' }),
  }),
  alternativTermin: z.string().trim().max(200, 'Bitte etwas kürzer fassen.').optional().or(z.literal('')),
  vorname: nameFeld,
  nachname: nameFeld,
  email: emailFeld,
  telefon: telefonOptional,
  bereitsKundin: z.enum(['ja', 'nein'], {
    errorMap: () => ({ message: 'Bitte wähle Ja oder Nein.' }),
  }),
  nachricht: z.string().trim().max(2000, 'Bitte auf 2000 Zeichen kürzen.').optional().or(z.literal('')),
  datenschutz: datenschutzFeld,
}).superRefine((werte, ctx) => {
  // Die Vorlaufzeit gilt fuer das konkrete Zeitfenster, nicht pauschal fuer
  // den ganzen Tag – sonst waere "morgen frueh um 8" faelschlich erlaubt.
  if (werte.datum && werte.zeitfenster && !slotIstVerfuegbar(werte.datum, werte.zeitfenster)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['zeitfenster'],
      message: 'Dieses Zeitfenster ist zu kurzfristig. Bitte wähle ein späteres.',
    });
  }
});

export type BeautyAnfrage = z.infer<typeof beautyAnfrageSchema>;

/** Terminanfrage fuer Fineline-Tattoos (ohne Kalender, mit Motividee). */
export const tattooAnfrageSchema = spamSchutzSchema.extend({
  art: z.literal('tattoo'),
  vorname: nameFeld,
  nachname: nameFeld,
  email: emailFeld,
  telefon: telefonOptional,
  motividee: z
    .string({ required_error: pflicht })
    .trim()
    .min(1, pflicht)
    .min(20, 'Erzähl mir bitte etwas ausführlicher von deiner Idee – mindestens 20 Zeichen.')
    .max(3000, 'Bitte auf 3000 Zeichen kürzen.'),
  koerperstelle: z.enum(koerperstellen as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Bitte wähle eine Körperstelle.' }),
  }),
  groesseCm: z
    .string({ required_error: pflicht })
    .trim()
    .min(1, 'Eine ungefähre Größe hilft mir sehr.')
    .max(30, 'Bitte kürzer angeben, z. B. "ca. 8 cm".'),
  farbe: z.enum(['schwarz-grau', 'farbe', 'unentschieden'], {
    errorMap: () => ({ message: 'Bitte triff eine Auswahl.' }),
  }),
  erweiterung: z.enum(['ja', 'nein'], {
    errorMap: () => ({ message: 'Bitte wähle Ja oder Nein.' }),
  }),
  wunschzeitraum: z
    .string({ required_error: pflicht })
    .regex(/^\d{4}-\d{2}$/, 'Bitte wähle einen Wunschmonat.'),
  volljaehrig: z.literal(true, {
    errorMap: () => ({ message: 'Ich tätowiere ausschließlich ab 18 Jahren.' }),
  }),
  datenschutz: datenschutzFeld,
});

export type TattooAnfrage = z.infer<typeof tattooAnfrageSchema>;

export type Anfrage = BeautyAnfrage | TattooAnfrage;

/** Ergebnis der Server Action – wird im Formular ausgewertet. */
export type AnfrageErgebnis =
  | { status: 'ok'; referenz: string }
  | { status: 'fehler'; nachricht: string; felder?: Record<string, string> };

/** Pruefung der hochgeladenen Referenzbilder. Gilt im Browser und auf dem Server. */
export function pruefeDateien(dateien: { name: string; size: number; type: string }[]): string | null {
  if (dateien.length > uploadLimits.maxFiles) {
    return `Bitte lade höchstens ${uploadLimits.maxFiles} Bilder hoch.`;
  }
  for (const datei of dateien) {
    if (!(uploadLimits.acceptedTypes as readonly string[]).includes(datei.type)) {
      return `„${datei.name}“ hat ein Format, das ich nicht verarbeiten kann. Bitte JPG, PNG oder WebP.`;
    }
    if (datei.size > uploadLimits.maxFileSizeBytes) {
      return `„${datei.name}“ ist größer als 5 MB. Bitte lade eine kleinere Datei hoch.`;
    }
  }
  return null;
}

/** Mindestzeit zwischen Formularaufbau und Absenden (Zeitfalle gegen Bots). */
export const MINDEST_AUSFUELLZEIT_MS = 3000;
