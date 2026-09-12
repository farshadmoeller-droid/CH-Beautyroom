import { siteConfig } from '@/content/site-config';

type LogoProps = {
  /** Kompakte Variante ohne Namenszeile – fuer Header und Mobilmenue. */
  kompakt?: boolean;
  /** Auf dunklem Grund (Hero) wird die helle Variante gesetzt. */
  hell?: boolean;
  className?: string;
};

/**
 * Das Logo ist bewusst rein typografisch aufgebaut: CH-Monogramm,
 * darunter "BEAUTYROOM" gesperrt, darunter der Name der Inhaberin.
 *
 * Sobald eine SVG-Datei vorliegt, kann der Inhalt dieser Komponente durch
 * ein <Image>- oder Inline-SVG ersetzt werden – alle Aufrufe bleiben gleich.
 */
export default function Logo({ kompakt = false, hell = false, className = '' }: LogoProps) {
  const farbe = hell ? 'text-cream' : 'text-espresso';
  const zweitfarbe = hell ? 'text-cream/80' : 'text-ink';

  return (
    <span className={`flex flex-col items-center leading-none ${farbe} ${className}`}>
      <span
        className="font-serif font-light"
        style={{ fontSize: kompakt ? '1.35rem' : '2.25rem', letterSpacing: '0.12em', textIndent: '0.12em' }}
      >
        CH
      </span>
      <span
        className="font-serif uppercase"
        style={{
          fontSize: kompakt ? '0.5rem' : '0.68rem',
          letterSpacing: '0.28em',
          textIndent: '0.28em',
          marginTop: kompakt ? '0.15rem' : '0.35rem',
        }}
      >
        Beautyroom
      </span>
      {!kompakt && (
        <span
          className={`font-sans uppercase ${zweitfarbe}`}
          style={{ fontSize: '0.5rem', letterSpacing: '0.22em', textIndent: '0.22em', marginTop: '0.5rem' }}
        >
          {siteConfig.inhaberinName}
        </span>
      )}
    </span>
  );
}
