'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, bewegungReduziert } from '@/lib/gsap';

type RevealProps = {
  children: ReactNode;
  /** Verzögerung in Sekunden, damit Elemente leicht versetzt erscheinen. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Sanftes Einblenden beim Scrollen. Ist „Bewegung reduzieren“ aktiv,
 * steht der Inhalt sofort da – ohne Animation und ohne ScrollTrigger.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (bewegungReduziert()) {
      element.dataset.sichtbar = 'true';
      return;
    }

    const ausloeser = ScrollTrigger.create({
      trigger: element,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.delayedCall(delay, () => {
          element.dataset.sichtbar = 'true';
        });
      },
    });

    return () => ausloeser.kill();
  }, [delay]);

  return (
    <Tag ref={ref} className={`zeig ${className}`} data-sichtbar="false">
      {children}
    </Tag>
  );
}
