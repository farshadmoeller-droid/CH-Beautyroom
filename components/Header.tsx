'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { hauptnavigation } from '@/lib/navigation';
import { useFocusTrap, useScrollLock } from '@/lib/use-focus-trap';

export default function Header() {
  const [gescrollt, setGescrollt] = useState(false);
  const [menueOffen, setMenueOffen] = useState(false);
  const pfad = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  /** Nur auf der Startseite startet der Header transparent ueber dem Hero. */
  const ueberHero = pfad === '/' && !gescrollt && !menueOffen;

  const schliessen = useCallback(() => setMenueOffen(false), []);

  useEffect(() => {
    function beiScroll() {
      setGescrollt(window.scrollY > 24);
    }
    beiScroll();
    window.addEventListener('scroll', beiScroll, { passive: true });
    return () => window.removeEventListener('scroll', beiScroll);
  }, []);

  useEffect(() => {
    setMenueOffen(false);
  }, [pfad]);

  useScrollLock(menueOffen);
  useFocusTrap(overlayRef, menueOffen, schliessen);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        ueberHero ? 'bg-transparent' : 'border-b border-taupe bg-cream'
      }`}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="container-page flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="-ml-1 flex min-h-11 shrink-0 items-center rounded-[2px] px-1 py-1"
          aria-label="CH Beautyroom – zur Startseite"
        >
          <Logo kompakt hell={ueberHero} />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {hauptnavigation.map((eintrag) => (
              <li key={eintrag.href}>
                <Link
                  href={eintrag.href}
                  className={`flex min-h-11 items-center text-[0.72rem] uppercase tracking-[0.16em] transition-opacity hover:opacity-60 ${
                    ueberHero ? 'text-cream' : 'text-espresso'
                  }`}
                >
                  {eintrag.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#termin"
            className={`btn hidden sm:inline-flex ${ueberHero ? 'btn-on-image' : 'btn-primary'}`}
          >
            Termin anfragen
          </Link>

          <button
            type="button"
            onClick={() => setMenueOffen((offen) => !offen)}
            aria-expanded={menueOffen}
            aria-controls="mobilmenue"
            aria-label={menueOffen ? 'Menü schließen' : 'Menü öffnen'}
            className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{menueOffen ? 'Menü schließen' : 'Menü öffnen'}</span>
            <span aria-hidden="true" className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-px w-6 transition-all duration-300 ${
                  menueOffen ? 'top-2 rotate-45 bg-espresso' : `top-0 ${ueberHero ? 'bg-cream' : 'bg-espresso'}`
                }`}
              />
              <span
                className={`absolute left-0 top-2 block h-px w-6 transition-all duration-300 ${
                  menueOffen ? 'opacity-0' : ueberHero ? 'bg-cream' : 'bg-espresso'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 transition-all duration-300 ${
                  menueOffen ? 'top-2 -rotate-45 bg-espresso' : `top-4 ${ueberHero ? 'bg-cream' : 'bg-espresso'}`
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Vollbild-Overlay fuer mobile Geraete */}
      <div
        id="mobilmenue"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        hidden={!menueOffen}
        className="fixed inset-0 z-40 flex flex-col bg-cream lg:hidden"
        style={{ paddingTop: 'var(--header-height)' }}
      >
        <nav aria-label="Navigation im Menü" className="container-page flex-1 overflow-y-auto py-10">
          <ul className="flex flex-col gap-1">
            {hauptnavigation.map((eintrag, index) => (
              <li key={eintrag.href} className="border-b border-taupe/60">
                <Link
                  href={eintrag.href}
                  onClick={schliessen}
                  className="block py-4 font-serif text-3xl font-light text-espresso"
                  style={{ transitionDelay: `${index * 20}ms` }}
                >
                  {eintrag.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/#termin" onClick={schliessen} className="btn btn-primary mt-10 w-full">
            Termin anfragen
          </Link>

          <p className="mt-8 text-sm text-ink">
            Homestudio in 26683 Ramsloh. Termine ausschließlich nach Vereinbarung.
          </p>
        </nav>
      </div>
    </header>
  );
}
