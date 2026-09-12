'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon, WhatsAppIcon } from '@/components/Icons';
import { whatsappLink } from '@/content/site-config';

/**
 * Zwei schwebende Elemente: der WhatsApp-Kontakt ab Tablet-Breite und der
 * Sprung nach oben ab 1200 px Scrolltiefe.
 */
export default function FloatingActions() {
  const [zeigeNachOben, setZeigeNachOben] = useState(false);

  useEffect(() => {
    function beiScroll() {
      setZeigeNachOben(window.scrollY > 1200);
    }
    beiScroll();
    window.addEventListener('scroll', beiScroll, { passive: true });
    return () => window.removeEventListener('scroll', beiScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <button
        type="button"
        onClick={() => {
          const reduziert = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: reduziert ? 'auto' : 'smooth' });
        }}
        hidden={!zeigeNachOben}
        className="pointer-events-auto flex h-11 w-11 items-center justify-center border border-control bg-cream text-espresso shadow-sm transition-colors hover:border-espresso"
      >
        <span className="sr-only">Zurück nach oben</span>
        <ArrowUpIcon className="h-4 w-4" />
      </button>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto hidden h-12 items-center gap-2 rounded-[2px] border border-control bg-cream px-4 text-[0.7rem] uppercase tracking-[0.14em] text-espresso shadow-sm transition-colors hover:border-espresso md:inline-flex"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  );
}
