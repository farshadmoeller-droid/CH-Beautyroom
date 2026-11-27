'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * Lässt einen Abschnitt beim Hereinscrollen erscheinen.
 *
 * Bewusst ohne Animationsbibliothek: Ein IntersectionObserver setzt ein
 * Attribut, den Rest macht ein CSS-Übergang auf `transform` und `opacity`.
 * Beide laufen auf dem Compositor und bleiben deshalb flüssig, während der
 * Browser noch lädt – eine Animation über `requestAnimationFrame` verliert
 * in genau diesem Moment Bilder.
 *
 * Es läuft genau einmal. Eine Seite, die bei jedem Vorbeiscrollen neu
 * animiert, kämpft gegen ihre Leserin.
 */
type Props = {
  children: ReactNode;
  /**
   * Verzögerung in Millisekunden.
   *
   * Nicht gleichmäßig vergeben! Gleiche Abstände lesen sich mechanisch.
   * Die Hauptsache beginnt bei 0, Begleitendes folgt mit kürzer werdenden
   * Schritten (z. B. 0 · 90 · 150 · 190).
   */
  stufe?: number;
  /** Weg in Pixeln. Die Hauptsache darf weiter reisen als das Beiwerk. */
  weg?: number;
  as?: ElementType;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
};

export default function Enthuellen({
  children,
  stufe = 0,
  weg = 14,
  as: Tag = 'div',
  className = '',
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Ohne Unterstützung sofort zeigen, statt etwas unsichtbar zu lassen.
    if (typeof IntersectionObserver === 'undefined') {
      element.setAttribute('data-sichtbar', '');
      return;
    }

    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          // Sichtbar, oder beim Sprung in die Seite schon überholt: Was
          // oberhalb des Fensters liegt, darf nicht unsichtbar bleiben.
          const ueberholt = eintrag.boundingClientRect.bottom < 0;
          if (!eintrag.isIntersecting && !ueberholt) continue;
          eintrag.target.setAttribute('data-sichtbar', '');
          beobachter.unobserve(eintrag.target);
        }
      },
      // Etwas vor der Unterkante auslösen, damit die Bewegung fertig ist,
      // wenn der Abschnitt wirklich im Blick steht.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );

    beobachter.observe(element);
    return () => beobachter.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`enthuellen ${className}`}
      style={{ '--stufe': `${stufe}ms`, '--weg': `${weg}px` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
