import type { ReactNode } from 'react';
import Reveal from '@/components/Reveal';

type SectionHeadingProps = {
  eyebrow?: string;
  titel: ReactNode;
  /** Die Ueberschrift bekommt diese ID, damit die Section sie referenzieren kann. */
  id: string;
  einleitung?: string;
  zentriert?: boolean;
  stufe?: 'h2' | 'h3';
};

export default function SectionHeading({
  eyebrow,
  titel,
  id,
  einleitung,
  zentriert = false,
  stufe = 'h2',
}: SectionHeadingProps) {
  const Ueberschrift = stufe;

  return (
    <Reveal className={zentriert ? 'flex flex-col items-center text-center' : ''}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <Ueberschrift id={id} className="h-section max-w-[22ch]">
        {titel}
      </Ueberschrift>
      {einleitung && (
        <p className={`measure mt-6 text-ink ${zentriert ? 'mx-auto' : ''}`}>{einleitung}</p>
      )}
    </Reveal>
  );
}
