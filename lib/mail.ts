/**
 * E-Mail-Versand, sauber vom Rest getrennt.
 *
 * Standardweg ist Resend. Wer lieber ueber einen eigenen Postausgang
 * verschickt, setzt MAIL_TRANSPORT=smtp in .env.local, installiert
 * "nodemailer" und traegt die SMTP-Zugangsdaten ein – der restliche Code
 * bleibt unveraendert.
 *
 * Der API-Key wird ausschliesslich hier, also serverseitig, gelesen.
 */

import 'server-only';

export type MailAnhang = {
  dateiname: string;
  inhalt: Buffer;
  typ: string;
};

export type MailAuftrag = {
  an: string;
  betreff: string;
  text: string;
  html: string;
  antwortAn?: string;
  anhaenge?: MailAnhang[];
};

export type MailErgebnis = { ok: true } | { ok: false; fehler: string };

function absender(): string {
  return process.env.MAIL_FROM ?? 'CH Beautyroom <onboarding@resend.dev>';
}

/** Postfach der Inhaberin. */
export function empfaengerInhaberin(): string | undefined {
  return process.env.MAIL_TO;
}

async function versendeMitResend(auftrag: MailAuftrag): Promise<MailErgebnis> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, fehler: 'RESEND_API_KEY ist nicht gesetzt.' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: absender(),
    to: [auftrag.an],
    subject: auftrag.betreff,
    text: auftrag.text,
    html: auftrag.html,
    ...(auftrag.antwortAn ? { replyTo: auftrag.antwortAn } : {}),
    ...(auftrag.anhaenge?.length
      ? {
          attachments: auftrag.anhaenge.map((anhang) => ({
            filename: anhang.dateiname,
            content: anhang.inhalt.toString('base64'),
          })),
        }
      : {}),
  });

  if (error) {
    return { ok: false, fehler: error.message };
  }
  return { ok: true };
}

/** Minimale Form dessen, was hier von Nodemailer gebraucht wird. */
type NodemailerModul = {
  createTransport: (optionen: Record<string, unknown>) => {
    sendMail: (nachricht: Record<string, unknown>) => Promise<unknown>;
  };
};

async function versendeMitSmtp(auftrag: MailAuftrag): Promise<MailErgebnis> {
  try {
    // Nodemailer ist eine optionale Abhaengigkeit und wird nur geladen, wenn
    // dieser Weg auch konfiguriert ist. Der Modulname steht bewusst in einer
    // Variablen, damit der Build nicht fehlschlaegt, solange das Paket fehlt.
    const modulName = 'nodemailer';
    const nodemailer = (await import(/* webpackIgnore: true */ modulName)) as unknown as NodemailerModul;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transport.sendMail({
      from: absender(),
      to: auftrag.an,
      subject: auftrag.betreff,
      text: auftrag.text,
      html: auftrag.html,
      replyTo: auftrag.antwortAn,
      attachments: auftrag.anhaenge?.map((anhang) => ({
        filename: anhang.dateiname,
        content: anhang.inhalt,
        contentType: anhang.typ,
      })),
    });

    return { ok: true };
  } catch (fehler) {
    return {
      ok: false,
      fehler: fehler instanceof Error ? fehler.message : 'Unbekannter SMTP-Fehler.',
    };
  }
}

/** Einziger Einstiegspunkt fuer den Versand. */
export async function sendeMail(auftrag: MailAuftrag): Promise<MailErgebnis> {
  if (process.env.MAIL_TRANSPORT === 'smtp') {
    return versendeMitSmtp(auftrag);
  }
  return versendeMitResend(auftrag);
}
