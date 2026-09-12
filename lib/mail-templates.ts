/**
 * Aufbau der beiden E-Mails: die strukturierte Benachrichtigung an die
 * Inhaberin und die freundliche Eingangsbestaetigung an die Kundin.
 */

import { siteConfig } from '@/content/site-config';
import { getTreatmentName } from '@/content/services';
import { formatiereDatumLang, zeitfensterLabel, monatsnamen } from '@/lib/dates';
import type { BeautyAnfrage, TattooAnfrage } from '@/lib/schemas';

const farben = {
  cream: '#FAF8F4',
  sand: '#F1EBE1',
  taupe: '#D8CCBC',
  espresso: '#2B2420',
  ink: '#584C42',
};

function escape(wert: string): string {
  return wert
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function huelle(titel: string, inhalt: string): string {
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>${escape(titel)}</title></head>
<body style="margin:0;padding:24px;background:${farben.sand};font-family:Helvetica,Arial,sans-serif;color:${farben.espresso};line-height:1.7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:${farben.cream};border:1px solid ${farben.taupe};">
    <tr><td style="padding:32px 32px 8px 32px;">
      <div style="font-size:20px;letter-spacing:0.2em;">CH</div>
      <div style="font-size:11px;letter-spacing:0.28em;color:${farben.ink};text-transform:uppercase;">Beautyroom</div>
    </td></tr>
    <tr><td style="padding:8px 32px 32px 32px;">${inhalt}</td></tr>
    <tr><td style="padding:0 32px 28px 32px;border-top:1px solid ${farben.taupe};">
      <p style="font-size:12px;color:${farben.ink};margin:16px 0 0 0;">
        ${escape(siteConfig.studioName)} &middot; ${escape(siteConfig.ortOeffentlich)}<br>
        ${escape(siteConfig.email)} &middot; ${escape(siteConfig.telefon)}
      </p>
    </td></tr>
  </table>
</body></html>`;
}

function zeile(label: string, wert: string): string {
  return `<tr>
    <td style="padding:8px 12px 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:${farben.ink};vertical-align:top;white-space:nowrap;">${escape(label)}</td>
    <td style="padding:8px 0;font-size:15px;color:${farben.espresso};vertical-align:top;">${escape(wert).replace(/\n/g, '<br>')}</td>
  </tr>`;
}

function tabelle(zeilen: [string, string][]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${zeilen
    .map(([label, wert]) => zeile(label, wert))
    .join('')}</table>`;
}

function textBlock(zeilen: [string, string][]): string {
  return zeilen.map(([label, wert]) => `${label}: ${wert}`).join('\n');
}

function monatLabel(wert: string): string {
  const [jahr, monat] = wert.split('-').map(Number);
  return `${monatsnamen[(monat ?? 1) - 1]} ${jahr}`;
}

export function beautyZeilen(anfrage: BeautyAnfrage): [string, string][] {
  const zeilen: [string, string][] = [
    ['Leistung', getTreatmentName(anfrage.behandlung) ?? anfrage.behandlung],
    ['Wunschtag', formatiereDatumLang(anfrage.datum)],
    ['Zeitfenster', zeitfensterLabel(anfrage.zeitfenster) ?? anfrage.zeitfenster],
    ['Name', `${anfrage.vorname} ${anfrage.nachname}`],
    ['E-Mail', anfrage.email],
  ];
  if (anfrage.telefon) zeilen.push(['Telefon', anfrage.telefon]);
  if (anfrage.alternativTermin) zeilen.push(['Alternativtermin', anfrage.alternativTermin]);
  zeilen.push(['Schon einmal da', anfrage.bereitsKundin === 'ja' ? 'Ja' : 'Nein']);
  if (anfrage.nachricht) zeilen.push(['Nachricht', anfrage.nachricht]);
  return zeilen;
}

export function tattooZeilen(anfrage: TattooAnfrage, anzahlBilder: number): [string, string][] {
  const farbe =
    anfrage.farbe === 'schwarz-grau'
      ? 'Schwarz-Grau'
      : anfrage.farbe === 'farbe'
        ? 'Farbe'
        : 'Noch unentschieden';

  const zeilen: [string, string][] = [
    ['Name', `${anfrage.vorname} ${anfrage.nachname}`],
    ['E-Mail', anfrage.email],
  ];
  if (anfrage.telefon) zeilen.push(['Telefon', anfrage.telefon]);
  zeilen.push(
    ['Motividee', anfrage.motividee],
    ['Körperstelle', anfrage.koerperstelle],
    ['Größe', anfrage.groesseCm],
    ['Ausführung', farbe],
    ['Erweiterung', anfrage.erweiterung === 'ja' ? 'Ja, bestehendes Tattoo' : 'Nein, neues Motiv'],
    ['Wunschzeitraum', monatLabel(anfrage.wunschzeitraum)],
    ['Referenzbilder', anzahlBilder > 0 ? `${anzahlBilder} im Anhang` : 'keine'],
    ['Volljährigkeit', 'bestätigt'],
  );
  return zeilen;
}

/** Benachrichtigung an die Inhaberin. */
export function mailAnInhaberin(params: {
  betreff: string;
  ueberschrift: string;
  zeilen: [string, string][];
  referenz: string;
}): { betreff: string; text: string; html: string } {
  const html = huelle(
    params.betreff,
    `<h1 style="font-size:22px;font-weight:normal;margin:0 0 20px 0;">${escape(params.ueberschrift)}</h1>
     ${tabelle(params.zeilen)}
     <p style="font-size:12px;color:${farben.ink};margin-top:24px;">Referenz: ${escape(params.referenz)}</p>`,
  );

  const text = `${params.ueberschrift}\n\n${textBlock(params.zeilen)}\n\nReferenz: ${params.referenz}`;

  return { betreff: params.betreff, text, html };
}

/** Eingangsbestaetigung an die Kundin. */
export function mailAnKundin(params: {
  vorname: string;
  istTattoo: boolean;
  zeilen: [string, string][];
  referenz: string;
}): { betreff: string; text: string; html: string } {
  const betreff = params.istTattoo
    ? 'Deine Tattoo-Anfrage ist angekommen'
    : 'Deine Terminanfrage ist angekommen';

  const einleitung = params.istTattoo
    ? `Hallo ${params.vorname},<br><br>danke für deine Anfrage – ich habe sie bekommen und schaue sie mir in Ruhe an. Ich melde mich innerhalb von 24 Stunden bei dir, dann besprechen wir deine Idee und finden gemeinsam einen passenden Termin.`
    : `Hallo ${params.vorname},<br><br>danke für deine Anfrage. Ich melde mich innerhalb von 24 Stunden bei dir und bestätige dir den Termin verbindlich. Erst mit meiner persönlichen Rückmeldung ist der Termin fest – bis dahin ist alles ein Wunschtermin.`;

  const html = huelle(
    betreff,
    `<p style="font-size:16px;margin:0 0 24px 0;">${einleitung}</p>
     <p style="font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:${farben.ink};margin:0 0 8px 0;">Deine Angaben</p>
     ${tabelle(params.zeilen)}
     <p style="font-size:15px;margin:28px 0 0 0;">Bis bald,<br>${escape(siteConfig.inhaberinName)}</p>
     <p style="font-size:13px;color:${farben.ink};margin:20px 0 0 0;">
       Du erreichst mich jederzeit unter ${escape(siteConfig.email)} oder auf Instagram unter ${escape(siteConfig.instagramHandle)}.
     </p>
     <p style="font-size:12px;color:${farben.ink};margin-top:20px;">Referenz: ${escape(params.referenz)}</p>`,
  );

  const textEinleitung = params.istTattoo
    ? `Hallo ${params.vorname},\n\ndanke für deine Anfrage – ich habe sie bekommen und schaue sie mir in Ruhe an. Ich melde mich innerhalb von 24 Stunden bei dir, dann besprechen wir deine Idee und finden gemeinsam einen passenden Termin.`
    : `Hallo ${params.vorname},\n\ndanke für deine Anfrage. Ich melde mich innerhalb von 24 Stunden bei dir und bestätige dir den Termin verbindlich. Erst mit meiner persönlichen Rückmeldung ist der Termin fest – bis dahin ist alles ein Wunschtermin.`;

  const text = `${textEinleitung}\n\nDeine Angaben\n${textBlock(params.zeilen)}\n\nBis bald,\n${siteConfig.inhaberinName}\n${siteConfig.email}\n\nReferenz: ${params.referenz}`;

  return { betreff, text, html };
}
