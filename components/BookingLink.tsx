'use client';

import type { ReactNode } from 'react';

export type Vorauswahl = {
  art: 'beauty' | 'tattoo';
  /** ID aus bookableTreatments – nur beim Beauty-Weg relevant. */
  behandlung?: string;
};

export const VORAUSWAHL_EVENT = 'chb:termin-vorauswahl';

type BookingLinkProps = Vorauswahl & {
  children: ReactNode;
  className?: string;
};

/**
 * Springt zum Buchungsmodul und waehlt dort gleich den passenden Weg vor.
 *
 * Ohne JavaScript bleibt es ein ganz normaler Anker-Link zum Formular – die
 * Vorauswahl faellt dann weg, bedienbar ist es trotzdem.
 */
export default function BookingLink({ art, behandlung, children, className = 'btn btn-secondary' }: BookingLinkProps) {
  return (
    <a
      href="#termin"
      className={className}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent<Vorauswahl>(VORAUSWAHL_EVENT, { detail: { art, behandlung } }),
        );
      }}
    >
      {children}
    </a>
  );
}
