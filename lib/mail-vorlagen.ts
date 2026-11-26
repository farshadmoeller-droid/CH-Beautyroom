/**
 * Aufbau der beiden E-Mails: die strukturierte Benachrichtigung an Carina
 * und die freundliche Eingangsbestätigung an die Kundin.
 */

import { business, termine } from '@/content/site';

const FARBEN = {
  creme: '#F7F2EE',
  blush: '#EAD9D0',
  akzent: '#8F5138',
  ink: '#1E1A18',
  leise: '#5F554F',
};

function schuetzen(wert: string): string {
  return wert
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function huelle(titel: string, inhalt: string): string {
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>${schuetzen(titel)}</title></head>
<body style="margin:0;padding:24px;background:${FARBEN.blush};font-family:Helvetica,Arial,sans-serif;color:${FARBEN.ink};line-height:1.65;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:${FARBEN.creme};border-radius:12px;">
    <tr><td style="padding:32px 32px 4px 32px;">
      <div style="font-size:19px;">${schuetzen(business.name)}</div>
      <div style="font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:${FARBEN.leise};margin-top:4px;">Ramsloh</div>
    </td></tr>
    <tr><td style="padding:16px 32px 32px 32px;">${inhalt}</td></tr>
    <tr><td style="padding:0 32px 28px 32px;border-top:1px solid ${FARBEN.blush};">
      <p style="font-size:12px;color:${FARBEN.leise};margin:16px 0 0 0;">
        ${schuetzen(business.name)} &middot; ${schuetzen(business.plz)} ${schuetzen(business.ort)}<br>
        ${schuetzen(business.email)} &middot; ${schuetzen(business.telefon)}
      </p>
    </td></tr>
  </table>
</body></html>`;
}

function tabelle(zeilen: [string, string][]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${zeilen
    .map(
      ([label, wert]) => `<tr>
        <td style="padding:8px 12px 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${FARBEN.leise};vertical-align:top;white-space:nowrap;">${schuetzen(label)}</td>
        <td style="padding:8px 0;font-size:15px;color:${FARBEN.ink};vertical-align:top;">${schuetzen(wert).replace(/\n/g, '<br>')}</td>
      </tr>`,
    )
    .join('')}</table>`;
}

function alsText(zeilen: [string, string][]): string {
  return zeilen.map(([l, w]) => `${l}: ${w}`).join('\n');
}

export function mailAnInhaberin(params: {
  betreff: string;
  ueberschrift: string;
  zeilen: [string, string][];
  referenz: string;
}) {
  return {
    betreff: params.betreff,
    text: `${params.ueberschrift}\n\n${alsText(params.zeilen)}\n\nReferenz: ${params.referenz}`,
    html: huelle(
      params.betreff,
      `<h1 style="font-size:21px;font-weight:normal;margin:0 0 20px 0;">${schuetzen(params.ueberschrift)}</h1>
       ${tabelle(params.zeilen)}
       <p style="font-size:12px;color:${FARBEN.leise};margin-top:24px;">Referenz: ${schuetzen(params.referenz)}</p>`,
    ),
  };
}

export function mailAnKundin(params: {
  vorname: string;
  istTattoo: boolean;
  zeilen: [string, string][];
  referenz: string;
}) {
  const betreff = params.istTattoo
    ? 'Deine Tattoo-Anfrage ist angekommen'
    : 'Deine Terminanfrage ist angekommen';

  const einleitung = params.istTattoo
    ? `Hallo ${params.vorname},\n\ndanke für deine Anfrage – ich habe sie bekommen und schaue sie mir in Ruhe an. Ich melde mich innerhalb von ${termine.antwortzeit} bei dir, dann besprechen wir deine Idee und finden gemeinsam einen passenden Termin.`
    : `Hallo ${params.vorname},\n\ndanke für deine Anfrage. Ich melde mich innerhalb von ${termine.antwortzeit} bei dir und bestätige dir den Termin verbindlich. Erst mit meiner persönlichen Rückmeldung ist der Termin fest – bis dahin ist alles ein Wunschtermin.`;

  return {
    betreff,
    text: `${einleitung}\n\nDeine Angaben\n${alsText(params.zeilen)}\n\nBis bald,\n${business.inhaberin}\n${business.email}\n\nReferenz: ${params.referenz}`,
    html: huelle(
      betreff,
      `<p style="font-size:16px;margin:0 0 24px 0;">${schuetzen(einleitung).replace(/\n\n/g, '<br><br>')}</p>
       <p style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:${FARBEN.leise};margin:0 0 8px 0;">Deine Angaben</p>
       ${tabelle(params.zeilen)}
       <p style="font-size:15px;margin:28px 0 0 0;">Bis bald,<br>${schuetzen(business.inhaberin)}</p>
       <p style="font-size:13px;color:${FARBEN.leise};margin:20px 0 0 0;">
         Du erreichst mich jederzeit unter ${schuetzen(business.email)} oder auf Instagram unter ${schuetzen(business.instagramHandle)}.
       </p>
       <p style="font-size:12px;color:${FARBEN.leise};margin-top:20px;">Referenz: ${schuetzen(params.referenz)}</p>`,
    ),
  };
}
