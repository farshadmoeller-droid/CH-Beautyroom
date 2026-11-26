'use client';

import { hero } from '@/content/site';

type Props = {
  /** Fortschritt der angehefteten Sektion, 0 bis 1. */
  fortschritt: number;
};

/**
 * Dünne Ringe, die über das Porträt wandern und auf Augen, Wimpern und
 * Brauen zeigen. Positionen und Zeitpunkte stehen in content/site.ts unter
 * hero.fokusRinge – dort anzupassen, sobald die echten Frames da sind.
 */
export default function FocusRings({ fortschritt }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {hero.fokusRinge.map((ring) => {
        const spanne = ring.bis - ring.bei;
        const roh = (fortschritt - ring.bei) / spanne;

        // Ein- und Ausblenden an den Rändern des eigenen Zeitfensters.
        let deckkraft = 0;
        let skalierung = 1.35;
        if (roh > -0.25 && roh < 1.25) {
          const ein = Math.min(Math.max(roh / 0.25, 0), 1);
          const aus = Math.min(Math.max((1 - roh) / 0.25, 0), 1);
          deckkraft = Math.min(ein, aus);
          skalierung = 1.35 - 0.35 * ein;
        }

        if (deckkraft <= 0.01) return null;

        const r = ring.r * skalierung;

        return (
          <g key={ring.id} opacity={deckkraft}>
            <ellipse
              cx={ring.x}
              cy={ring.y}
              rx={r}
              ry={r * 0.8}
              fill="none"
              stroke="#F7F2EE"
              strokeWidth={0.3}
              vectorEffect="non-scaling-stroke"
              opacity={0.9}
            />
            <ellipse
              cx={ring.x}
              cy={ring.y}
              rx={r * 1.22}
              ry={r * 0.98}
              fill="none"
              stroke="#C08A75"
              strokeWidth={0.2}
              strokeDasharray="1.5 2.5"
              vectorEffect="non-scaling-stroke"
              opacity={0.75}
            />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Die Beschriftungen liegen bewusst außerhalb des SVG: So bleiben sie
 * echte Textknoten in normaler Schriftgröße und werden nicht mit dem
 * viewBox verzerrt.
 */
export function FocusLabels({ fortschritt }: Props) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {hero.fokusRinge.map((ring) => {
        const spanne = ring.bis - ring.bei;
        const roh = (fortschritt - ring.bei) / spanne;
        const ein = Math.min(Math.max(roh / 0.25, 0), 1);
        const aus = Math.min(Math.max((1 - roh) / 0.25, 0), 1);
        const deckkraft = roh > -0.25 && roh < 1.25 ? Math.min(ein, aus) : 0;

        if (deckkraft <= 0.01) return null;

        return (
          <span
            key={ring.id}
            className="glas-dunkel absolute -translate-x-1/2 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-creme"
            style={{
              left: `${ring.x}%`,
              top: `calc(${ring.y}% + ${ring.r * 0.9}%)`,
              opacity: deckkraft,
              transform: `translate(-50%, ${(1 - ein) * 8}px)`,
            }}
          >
            {ring.label}
          </span>
        );
      })}
    </div>
  );
}
