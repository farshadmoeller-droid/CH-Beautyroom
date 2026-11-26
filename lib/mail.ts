/**
 * Versand der Anfragen – zwei Wege, umschaltbar per .env.local.
 *
 *   MAIL_PROVIDER=resend     → eigener Versand über resend.com
 *   MAIL_PROVIDER=formspree  → Weiterleitung an einen Formspree-Endpunkt
 *
 * Beide Wege hinter derselben Funktion: Der restliche Code weiß nicht,
 * welcher gerade aktiv ist. Der API-Key wird ausschließlich hier gelesen,
 * also serverseitig, und gelangt nie in den Browser.
 */

import 'server-only';

export type Anhang = { dateiname: string; inhalt: Buffer; typ: string };

export type Auftrag = {
  betreff: string;
  text: string;
  html: string;
  /** Adresse der Kundin – landet als Antwort-An in der Benachrichtigung. */
  antwortAn?: string;
  anhaenge?: Anhang[];
  /** Strukturierte Felder – Formspree zeigt sie einzeln an. */
  felder: Record<string, string>;
};

export type Ergebnis = { ok: true } | { ok: false; fehler: string };

export function versandweg(): 'resend' | 'formspree' {
  return process.env.MAIL_PROVIDER === 'formspree' ? 'formspree' : 'resend';
}

/* ──────────────────────────────────────────────────────────── Resend */

async function perResend(auftrag: Auftrag, anKundin?: Auftrag): Promise<Ergebnis> {
  const apiKey = process.env.RESEND_API_KEY;
  const von = process.env.MAIL_FROM;
  const an = process.env.MAIL_TO;

  if (!apiKey) return { ok: false, fehler: 'RESEND_API_KEY ist nicht gesetzt.' };
  if (!von || !an) return { ok: false, fehler: 'MAIL_FROM oder MAIL_TO ist nicht gesetzt.' };

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: von,
    to: [an],
    subject: auftrag.betreff,
    text: auftrag.text,
    html: auftrag.html,
    ...(auftrag.antwortAn ? { replyTo: auftrag.antwortAn } : {}),
    ...(auftrag.anhaenge?.length
      ? {
          attachments: auftrag.anhaenge.map((a) => ({
            filename: a.dateiname,
            content: a.inhalt.toString('base64'),
          })),
        }
      : {}),
  });

  if (error) return { ok: false, fehler: error.message };

  // Die Eingangsbestätigung ist wichtig, aber nicht kritisch: Scheitert
  // sie, ist die Anfrage trotzdem angekommen.
  if (anKundin && auftrag.antwortAn) {
    const antwort = await resend.emails.send({
      from: von,
      to: [auftrag.antwortAn],
      subject: anKundin.betreff,
      text: anKundin.text,
      html: anKundin.html,
      replyTo: an,
    });
    if (antwort.error) {
      console.error('Eingangsbestätigung fehlgeschlagen:', antwort.error.message);
    }
  }

  return { ok: true };
}

/* ─────────────────────────────────────────────────────────── Formspree */

async function perFormspree(auftrag: Auftrag): Promise<Ergebnis> {
  const endpunkt = process.env.FORMSPREE_ENDPOINT;
  if (!endpunkt) return { ok: false, fehler: 'FORMSPREE_ENDPOINT ist nicht gesetzt.' };

  // Multipart, damit die Referenzbilder mitgehen können.
  const daten = new FormData();
  daten.set('_subject', auftrag.betreff);
  if (auftrag.antwortAn) daten.set('_replyto', auftrag.antwortAn);
  for (const [schluessel, wert] of Object.entries(auftrag.felder)) {
    daten.set(schluessel, wert);
  }
  for (const anhang of auftrag.anhaenge ?? []) {
    daten.append(
      'referenzbilder',
      new Blob([new Uint8Array(anhang.inhalt)], { type: anhang.typ }),
      anhang.dateiname,
    );
  }

  const antwort = await fetch(endpunkt, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: daten,
  });

  if (!antwort.ok) {
    const text = await antwort.text().catch(() => '');
    return { ok: false, fehler: `Formspree antwortete mit ${antwort.status}. ${text.slice(0, 200)}` };
  }

  // Formspree verschickt die Eingangsbestätigung selbst, wenn sie dort
  // eingerichtet ist – deshalb hier kein zweiter Versand.
  return { ok: true };
}

/* ───────────────────────────────────────────────── Einziger Einstieg */

export async function sendeAnfrage(anInhaberin: Auftrag, anKundin?: Auftrag): Promise<Ergebnis> {
  try {
    return versandweg() === 'formspree'
      ? await perFormspree(anInhaberin)
      : await perResend(anInhaberin, anKundin);
  } catch (fehler) {
    return {
      ok: false,
      fehler: fehler instanceof Error ? fehler.message : 'Unbekannter Fehler beim Versand.',
    };
  }
}
