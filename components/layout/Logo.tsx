import Image from 'next/image';
import { business } from '@/content/site';

/**
 * Wortmarke in der Kopfzeile.
 *
 * Links Carinas Monogramm als Bild, rechts der Name gesetzt. Warum nicht
 * das ganze Logo? Weil darin unter „BEAUTYROOM" noch eine zweite Zeile
 * steht. Bei der Höhe, die eine Kopfzeile hergibt, wären das knapp vier
 * Pixel – ein Logo, das man nicht lesen kann, ist nur noch ein Fleck.
 * Die vollständige Wortmarke steht deshalb in der Fußzeile, wo sie Platz
 * hat.
 *
 * Über dem Foto wechseln Monogramm und Schrift gemeinsam auf Creme.
 */
export default function Logo({ hell = false }: { hell?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Image
        src={hell ? business.logoMarkeHell : business.logoMarke}
        alt=""
        width={222}
        height={126}
        priority
        className="h-[30px] w-auto sm:h-[34px]"
      />

      <span className="flex flex-col leading-none">
        <span
          className="font-serif text-xl sm:text-[1.4rem]"
          style={{
            color: hell ? 'var(--color-creme)' : 'var(--color-ink)',
            transition: 'color var(--dauer-menue) ease',
          }}
        >
          Beautyroom
        </span>
        <span
          className="label mt-1"
          style={{
            color: hell ? 'var(--color-creme)' : 'var(--color-leise)',
            transition: 'color var(--dauer-menue) ease',
          }}
        >
          {business.ort}
        </span>
      </span>
    </span>
  );
}
