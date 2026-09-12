'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Verzoegerung in Millisekunden, damit Elemente leicht versetzt erscheinen. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Sanftes Einblenden beim Scrollen – umgesetzt mit IntersectionObserver und
 * reinem CSS. Wer "Bewegung reduzieren" im System aktiviert hat, sieht die
 * Inhalte sofort und ohne jede Animation (siehe globals.css).
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setSichtbar(true);
      return;
    }

    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const eintrag of eintraege) {
          if (eintrag.isIntersecting) {
            setSichtbar(true);
            beobachter.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    beobachter.observe(element);
    return () => beobachter.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-visible={sichtbar ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
