/**
 * Sehr einfaches, serverseitiges Rate-Limit pro IP-Adresse.
 *
 * Bewusst ohne Datenbank und ohne externe Dienste: Die Zaehler liegen im
 * Arbeitsspeicher der jeweiligen Serverinstanz und verfallen automatisch.
 * Fuer ein kleines Studio reicht das voellig aus – es soll nur verhindern,
 * dass ein Bot das Formular hundertfach abschickt.
 */

type Eintrag = { anzahl: number; zuruecksetzenUm: number };

const speicher = new Map<string, Eintrag>();

const FENSTER_MS = 60 * 60 * 1000; // eine Stunde
const MAX_ANFRAGEN = 5;

function aufraeumen(jetzt: number): void {
  for (const [schluessel, eintrag] of speicher) {
    if (eintrag.zuruecksetzenUm <= jetzt) {
      speicher.delete(schluessel);
    }
  }
}

export function pruefeRateLimit(kennung: string): { erlaubt: boolean; verbleibend: number } {
  const jetzt = Date.now();

  if (speicher.size > 500) {
    aufraeumen(jetzt);
  }

  const eintrag = speicher.get(kennung);

  if (!eintrag || eintrag.zuruecksetzenUm <= jetzt) {
    speicher.set(kennung, { anzahl: 1, zuruecksetzenUm: jetzt + FENSTER_MS });
    return { erlaubt: true, verbleibend: MAX_ANFRAGEN - 1 };
  }

  if (eintrag.anzahl >= MAX_ANFRAGEN) {
    return { erlaubt: false, verbleibend: 0 };
  }

  eintrag.anzahl += 1;
  return { erlaubt: true, verbleibend: MAX_ANFRAGEN - eintrag.anzahl };
}

/** Liest die IP-Adresse aus den ueblichen Proxy-Headern (Vercel setzt sie). */
export function ipAusHeadern(headerListe: Headers): string {
  const forwarded = headerListe.get('x-forwarded-for');
  if (forwarded) {
    const erste = forwarded.split(',')[0]?.trim();
    if (erste) return erste;
  }
  return headerListe.get('x-real-ip') ?? 'unbekannt';
}
