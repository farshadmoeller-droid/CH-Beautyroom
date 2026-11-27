import { business } from '@/content/site';

/** Wortmarke. Die Helligkeit wechselt, wenn sie über dem Foto steht. */
export default function Logo({ hell = false }: { hell?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className="font-serif text-xl sm:text-[1.4rem]"
        style={{
          color: hell ? 'var(--color-creme)' : 'var(--color-ink)',
          transition: 'color var(--dauer-menue) ease',
        }}
      >
        {business.name}
      </span>
      <span
        className="label mt-1"
        style={{
          // Über dem Foto voll deckend: Bei 70 % Deckkraft fiel diese
          // Zeile auf 4,3:1 und damit unter die Grenze für kleine Schrift.
          color: hell ? 'var(--color-creme)' : 'var(--color-leise)',
          transition: 'color var(--dauer-menue) ease',
        }}
      >
        {business.ort}
      </span>
    </span>
  );
}
