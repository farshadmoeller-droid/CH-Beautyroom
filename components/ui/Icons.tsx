/** Alle Icons als schlanke Inline-SVGs – kein Icon-Paket, kein Request. */

type Props = { className?: string };
const basis = 'h-5 w-5';

export function InstagramIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.34 4.95L2 22l5.23-1.37a9.9 9.9 0 0 0 4.8 1.23c5.5 0 9.96-4.46 9.96-9.96A9.9 9.9 0 0 0 19.08 4.9 9.9 9.9 0 0 0 12.04 2Zm0 1.84c2.17 0 4.2.85 5.74 2.38a8.07 8.07 0 0 1 2.38 5.74c0 4.48-3.64 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.07.8.82-2.99-.19-.31a8.06 8.06 0 0 1-1.24-4.31c0-4.48 3.64-8.12 8.11-8.12Zm-3.2 4.3c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46Z" />
    </svg>
  );
}

export function MailIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </svg>
  );
}

export function PhoneIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5.5 5.5L15 12.5l5 2v3.2A2.3 2.3 0 0 1 17.5 20 15 15 0 0 1 4 6.5 2.3 2.3 0 0 1 5 3Z" />
    </svg>
  );
}

export function PinIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function ClockIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  );
}

export function ChevronRightIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <path d="m9.5 5 7 7-7 7" />
    </svg>
  );
}

export function CloseIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function PlusIcon({ className = 'h-4 w-4' }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ className = basis }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
