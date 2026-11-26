import { business } from '@/content/site';

type LogoProps = {
  /** Auf dunklem Grund wird die helle Variante gesetzt. */
  hell?: boolean;
  className?: string;
};

/**
 * Rein typografisches Logo. Sobald eine SVG-Datei vorliegt, wird nur diese
 * Komponente ausgetauscht – alle Aufrufe bleiben unverändert.
 */
export default function Logo({ hell = false, className = '' }: LogoProps) {
  return (
    <span className={`flex flex-col leading-none ${hell ? 'text-creme' : 'text-ink'} ${className}`}>
      <span className="font-serif text-xl tracking-tight sm:text-2xl">{business.name}</span>
      <span
        className={`mt-1 text-[0.5rem] uppercase ${hell ? 'text-creme/70' : 'text-leise'}`}
        style={{ letterSpacing: '0.3em' }}
      >
        Ramsloh
      </span>
    </span>
  );
}
