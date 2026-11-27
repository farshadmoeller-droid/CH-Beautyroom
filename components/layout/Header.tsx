'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from '@/components/layout/Logo';
import { navigation } from '@/content/site';

/**
 * Kopfzeile.
 *
 * Über dem Hero durchsichtig, danach als Glasfläche. Ob darunter ein Hero
 * liegt, entscheidet das Vorhandensein der Sektion – nicht der Pfad. So
 * stimmt es auch, wenn die Seite in einer Vorschau unter einem Unterpfad
 * liegt. Der Startwert kommt aus dem Pfad, damit die vom Server
 * gelieferte Fassung schon richtig ist und nichts aufblitzt.
 *
 * Das Menü auf dem Telefon fährt von unten herein, wie eine Schublade,
 * und verlässt die Seite auf demselben Weg. Symmetrie ist das, was ein
 * Wischen zum Schließen später selbsterklärend machen würde.
 */
export default function Header() {
  const [gescrollt, setGescrollt] = useState(false);
  const [offen, setOffen] = useState(false);
  const pfad = usePathname();
  const [hatHero, setHatHero] = useState(() => pfad === '/');
  const overlayRef = useRef<HTMLDivElement>(null);
  const vorherFokus = useRef<HTMLElement | null>(null);

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

  // Scrollsperre, Fokus-Falle und Escape, solange das Menü offen ist.
  useEffect(() => {
    if (!offen) return;
    const behaelter = overlayRef.current;
    if (!behaelter) return;

    vorherFokus.current = document.activeElement as HTMLElement | null;
    const vorherOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ziele = () => Array.from(behaelter.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    ziele()[0]?.focus({ preventScroll: true });

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return schliessen();
      if (e.key !== 'Tab') return;
      const liste = ziele();
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
      document.body.style.overflow = vorherOverflow;
      vorherFokus.current?.focus?.({ preventScroll: true });
    };
  }, [offen, schliessen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${ueberHero ? 'bg-transparent' : 'glas'}`}
      style={{
        height: 'var(--kopf-hoehe)',
        transition: 'background-color var(--dauer-flaeche) var(--ease-out)',
      }}
    >
      {/* Nur über dem Foto: schmaler Verlauf, damit die Wortmarke trägt. */}
      <div
        aria-hidden="true"
        className="kopf-schutz pointer-events-none absolute inset-x-0 top-0 h-[150%]"
        style={{
          opacity: ueberHero ? 1 : 0,
          transition: 'opacity var(--dauer-flaeche) var(--ease-out)',
        }}
      />

      <div className="huelle relative flex h-full items-center justify-between gap-4">
        <Link href="/" className="flex min-h-11 shrink-0 items-center" aria-label="CH Beautyroom – zur Startseite">
          <Logo hell={ueberHero} />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navigation.map((eintrag) => (
              <li key={eintrag.href}>
                <Link
                  href={eintrag.href}
                  className="label flex min-h-11 items-center"
                  style={{
                    color: ueberHero ? 'rgb(247 242 238 / 0.92)' : 'var(--color-ink)',
                    transition: 'color var(--dauer-menue) ease, opacity var(--dauer-klein) ease',
                  }}
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
            <span className="nur-sr">{offen ? 'Menü schließen' : 'Menü öffnen'}</span>
            <span aria-hidden="true" className="relative block h-4 w-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute left-0 block h-px w-6"
                  style={{
                    top: offen ? '8px' : ['0px', '8px', '16px'][i],
                    opacity: offen && i === 1 ? 0 : 1,
                    transform: offen ? (i === 0 ? 'rotate(45deg)' : i === 2 ? 'rotate(-45deg)' : 'none') : 'none',
                    backgroundColor: ueberHero ? 'var(--color-creme)' : 'var(--color-ink)',
                    transition:
                      'top var(--dauer-klein) var(--ease-out), opacity var(--dauer-klein) var(--ease-out), transform var(--dauer-klein) var(--ease-out), background-color var(--dauer-menue) ease',
                  }}
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
        inert={!offen ? true : undefined}
        className="fixed inset-0 z-40 flex flex-col bg-creme lg:hidden"
        style={{
          paddingTop: 'var(--kopf-hoehe)',
          transform: offen ? 'translateY(0)' : 'translateY(100%)',
          visibility: offen ? 'visible' : 'hidden',
          transition: offen
            ? 'transform 420ms var(--ease-drawer), visibility 0s'
            : 'transform 420ms var(--ease-drawer), visibility 0s linear 420ms',
        }}
      >
        <nav aria-label="Navigation im Menü" className="huelle flex-1 overflow-y-auto py-10">
          <ul className="flex flex-col">
            {navigation.map((eintrag) => (
              <li key={eintrag.href} className="border-b border-ink/10">
                <Link href={eintrag.href} onClick={schliessen} className="block py-5 font-serif text-4xl">
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
