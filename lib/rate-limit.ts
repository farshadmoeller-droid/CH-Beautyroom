/**
 * Sehr einfaches Rate-Limit pro IP-Adresse, bewusst ohne Datenbank: Die
 * Zähler liegen im Arbeitsspeicher der jeweiligen Serverinstanz und
 * verfallen von selbst. Für ein kleines Studio reicht das – es soll nur
 * verhindern, dass ein Bot das Formular hundertfach abschickt.
 */

type Eintrag = { anzahl: number; zuruecksetzenUm: number };

const speicher = new Map<string, Eintrag>();
const FENSTER_MS = 60 * 60 * 1000;
const MAX = 5;

export function pruefeRateLimit(kennung: string): boolean {
  const jetzt = Date.now();

  if (speicher.size > 500) {
    for (const [schluessel, eintrag] of speicher) {
      if (eintrag.zuruecksetzenUm <= jetzt) speicher.delete(schluessel);
    }
  }

  const eintrag = speicher.get(kennung);
  if (!eintrag || eintrag.zuruecksetzenUm <= jetzt) {
    speicher.set(kennung, { anzahl: 1, zuruecksetzenUm: jetzt + FENSTER_MS });
    return true;
  }
  if (eintrag.anzahl >= MAX) return false;

  eintrag.anzahl += 1;
  return true;
}

export function ipAus(kopfzeilen: Headers): string {
  const weitergeleitet = kopfzeilen.get('x-forwarded-for');
  const erste = weitergeleitet?.split(',')[0]?.trim();
  return erste || kopfzeilen.get('x-real-ip') || 'unbekannt';
}
