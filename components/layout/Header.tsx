'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/layout/Logo';
import { navigation } from '@/content/site';

/**
 * Kopfzeile: über dem Hero durchsichtig, danach mit Glas-Effekt.
 * Mobil öffnet sich ein Vollbildmenü mit großer Serif-Typo und Fokus-Falle.
 */
export default function Header() {
  const [gescrollt, setGescrollt] = useState(false);
  const [offen, setOffen] = useState(false);
  const pfad = usePathname();
  /**
   * Liegt unter der Kopfzeile ein Hero mit Bild?
   *
   * Der Startwert kommt aus dem Pfad, damit schon die vom Server gelieferte
   * Fassung stimmt und nichts aufblitzt. Danach entscheidet das Vorhandensein
   * der Hero-Sektion – das trägt auch, wenn die Seite nicht auf der Wurzel
   * einer Domain liegt, etwa in einer Vorschau unter einem Unterpfad.
   */
  const [hatHero, setHatHero] = useState(() => pfad === '/');
  const overlayRef = useRef<HTMLDivElement>(null);
  const vorherFokussiert = useRef<HTMLElement | null>(null);

  const ueberHero = hatHero && !gescrollt && !offen;
  const schliessen = useCallback(() => setOffen(false), []);

  useEffect(() => {
    const beiScroll = () => setGescrollt(window.scrollY > 40);
    beiScroll();
    window.addEventListener('scroll', beiScroll, { passive: true });
    return () => window.removeEventListener('scroll', beiScroll);
  }, []);

  useEffect(() => setOffen(false), [pfad]);

  useEffect(() => setHatHero(document.getElementById('hero') !== null), [pfad]);

  // Overlay: Scrollsperre, Fokus-Falle und Escape.
  useEffect(() => {
    if (!offen) return;
    const behaelter = overlayRef.current;
    if (!behaelter) return;

    vorherFokussiert.current = document.activeElement as HTMLElement | null;
    const vorherigesOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const fokussierbar = () =>
      Array.from(behaelter.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

    fokussierbar()[0]?.focus({ preventScroll: true });

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        schliessen();
        return;
      }
      if (e.key !== 'Tab') return;
      const liste = fokussierbar();
      if (liste.length === 0) return;
      const erstes = liste[0]!;
      const letztes = liste[liste.length - 1]!;
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault();
        letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault();
        erstes.focus();
      }
    };

    document.addEventListener('keydown', beiTaste);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.body.style.overflow = vorherigesOverflow;
      vorherFokussiert.current?.focus?.({ preventScroll: true });
    };
  }, [offen, schliessen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        ueberHero ? 'bg-transparent' : 'glas'
      }`}
      style={{ height: 'var(--kopf-hoehe)' }}
    >
      <div className="huelle flex h-full items-center justify-between gap-4">
        <Link href="/" className="flex min-h-11 shrink-0 items-center" aria-label={`${'CH Beautyroom'} – zur Startseite`}>
          <Logo hell={ueberHero} />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navigation.map((eintrag) => (
              <li key={eintrag.href}>
                <Link
                  href={eintrag.href}
                  className={`flex min-h-11 items-center text-[0.72rem] uppercase tracking-[0.18em] transition-opacity hover:opacity-60 ${
                    ueberHero ? 'text-creme' : 'text-ink'
                  }`}
                >
                  {eintrag.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="#termin" className={`knopf hidden sm:inline-flex ${ueberHero ? 'knopf-hell' : 'knopf-voll'}`}>
            Termin anfragen
          </Link>

          <button
            type="button"
            onClick={() => setOffen((o) => !o)}
            aria-expanded={offen}
            aria-controls="mobilmenue"
            className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{offen ? 'Menü schließen' : 'Menü öffnen'}</span>
            <span aria-hidden="true" className="relative block h-4 w-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`absolute left-0 block h-px w-6 transition-all duration-300 ${
                    offen
                      ? i === 1
                        ? 'top-2 opacity-0 bg-ink'
                        : `top-2 bg-ink ${i === 0 ? 'rotate-45' : '-rotate-45'}`
                      : `${['top-0', 'top-2', 'top-4'][i]} ${ueberHero ? 'bg-creme' : 'bg-ink'}`
                  }`}
                />
              ))}
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobilmenue"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        hidden={!offen}
        className="fixed inset-0 z-40 flex flex-col bg-creme lg:hidden"
        style={{ paddingTop: 'var(--kopf-hoehe)' }}
      >
        <nav aria-label="Navigation im Menü" className="huelle flex-1 overflow-y-auto py-10">
          <ul className="flex flex-col">
            {navigation.map((eintrag) => (
              <li key={eintrag.href} className="border-b border-ink/10">
                <Link href={eintrag.href} onClick={schliessen} className="block py-5 font-serif text-4xl text-ink">
                  {eintrag.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="#termin" onClick={schliessen} className="knopf knopf-voll mt-10 w-full">
            Termin anfragen
          </Link>

          <p className="mt-8 text-sm text-leise">
            Homestudio in 26683 Ramsloh. Termine nur nach Vereinbarung, ausschließlich vormittags.
          </p>
        </nav>
      </div>
    </header>
  );
}
