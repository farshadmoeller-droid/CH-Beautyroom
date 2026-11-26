'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CheckIcon } from '@/components/ui/Icons';
import { business, termine } from '@/content/site';

/**
 * Ruhiger Erfolgszustand nach dem Absenden – kein Alert, kein Seitenwechsel.
 * Die Animation entfällt vollständig, wenn Bewegung reduziert werden soll.
 */
export default function Erfolg({
  vorname,
  referenz,
  istTattoo,
}: {
  vorname: string;
  referenz: string;
  istTattoo: boolean;
}) {
  const reduziert = useReducedMotion();

  const auftritt = (verzug: number) =>
    reduziert
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay: verzug, ease: [0.22, 0.61, 0.36, 1] as const },
        };

  return (
    <div className="py-6 text-center" role="status" aria-live="polite">
      <motion.span
        {...(reduziert
          ? {}
          : {
              initial: { scale: 0.6, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const },
            })}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink text-creme"
      >
        <CheckIcon className="h-7 w-7" />
      </motion.span>

      <motion.h3 {...auftritt(0.12)} className="h-mittel mt-8 font-serif">
        Danke, {vorname}.
      </motion.h3>

      <motion.p {...auftritt(0.2)} className="mass mx-auto mt-4 text-leise-stark">
        {istTattoo
          ? `Deine Anfrage ist angekommen. Ich schaue sie mir in Ruhe an und melde mich innerhalb von ${termine.antwortzeit} bei dir – dann besprechen wir deine Idee und finden gemeinsam einen Termin.`
          : `Deine Anfrage ist angekommen. Ich melde mich innerhalb von ${termine.antwortzeit} mit einer verbindlichen Bestätigung. Bis dahin ist der Termin ein Wunschtermin.`}
      </motion.p>

      <motion.p {...auftritt(0.28)} className="mt-6 text-xs text-leise">
        Eine Eingangsbestätigung liegt in deinem Postfach. Referenz: {referenz}
      </motion.p>

      <motion.a
        {...auftritt(0.34)}
        href={business.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="knopf knopf-linie mt-8"
      >
        Auf Instagram vorbeischauen
      </motion.a>
    </div>
  );
}
