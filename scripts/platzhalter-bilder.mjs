/**
 * Erzeugt neutrale Platzhalterbilder, damit die Seite sofort läuft.
 *
 * Es sind bewusst einfarbige Flächen mit Beschriftung – keine Stockfotos
 * von Personen. Sobald echte Bilder da sind, einfach überschreiben.
 *
 *   npm run platzhalter
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const WURZEL = 'public';

const TOENE = {
  creme: '#F7F2EE',
  blush: '#EAD9D0',
  akzent: '#C08A75',
  ink: '#1E1A18',
  leise: '#6B605A',
};

function flaeche({ breite, hoehe, grund, text, unterzeile, mono = false }) {
  const kurz = Math.min(breite, hoehe);
  const schrift = Math.max(13, Math.round(kurz * 0.055));
  const klein = Math.max(10, Math.round(kurz * 0.03));
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stop-color="${grund}"/>
        <stop offset="100%" stop-color="${mono ? '#DED6D0' : TOENE.blush}"/>
      </linearGradient>
    </defs>
    <rect width="${breite}" height="${hoehe}" fill="url(#g)"/>
    <rect x="${breite * 0.04}" y="${hoehe * 0.04}" width="${breite * 0.92}" height="${hoehe * 0.92}"
          fill="none" stroke="${TOENE.akzent}" stroke-width="1" opacity="0.5"/>
    <text x="50%" y="${hoehe / 2}" text-anchor="middle" fill="${TOENE.ink}"
          font-family="DejaVu Serif, serif" font-size="${schrift}" opacity="0.72">${text}</text>
    ${unterzeile
      ? `<text x="50%" y="${hoehe / 2 + schrift * 1.6}" text-anchor="middle" fill="${TOENE.leise}"
             font-family="DejaVu Sans, sans-serif" font-size="${klein}" letter-spacing="2"
             opacity="0.7">${unterzeile}</text>`
      : ''}
  </svg>`);
}

/**
 * Ein Frame der Hero-Sequenz. Die angedeutete Kopfform dreht sich über die
 * Sequenz hinweg, damit der Scroll-Effekt sichtbar ist, bevor echte Frames
 * vorliegen.
 */
function sequenzFrame({ breite, hoehe, nummer, gesamt }) {
  const t = gesamt > 1 ? (nummer - 1) / (gesamt - 1) : 0;
  // Erst zur Seite schauen, dann zurück in die Kamera – wie im Drehbuch.
  const drehung = Math.sin(t * Math.PI) * 26 - 13;
  const mx = breite / 2 + drehung * (breite * 0.006);
  const my = hoehe * 0.42;
  const kopfB = breite * 0.26;
  const kopfH = hoehe * 0.21;
  const augenY = my - kopfH * 0.12;
  const augenAbstand = kopfB * 0.42;
  const versatz = drehung * (breite * 0.0016);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="#F7F2EE"/>
        <stop offset="100%" stop-color="#E7DCD4"/>
      </linearGradient>
    </defs>
    <rect width="${breite}" height="${hoehe}" fill="url(#bg)"/>
    <g transform="rotate(${drehung.toFixed(2)} ${mx.toFixed(1)} ${my.toFixed(1)})" opacity="0.5">
      <ellipse cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" rx="${kopfB.toFixed(1)}" ry="${kopfH.toFixed(1)}"
               fill="#D9C8BD"/>
      <path d="M ${(mx - kopfB * 1.15).toFixed(1)} ${hoehe}
               Q ${mx.toFixed(1)} ${(my + kopfH * 1.25).toFixed(1)}
                 ${(mx + kopfB * 1.15).toFixed(1)} ${hoehe} Z" fill="#D9C8BD"/>
      <ellipse cx="${(mx - augenAbstand + versatz).toFixed(1)}" cy="${augenY.toFixed(1)}"
               rx="${(kopfB * 0.14).toFixed(1)}" ry="${(kopfH * 0.07).toFixed(1)}" fill="#8F7E72"/>
      <ellipse cx="${(mx + augenAbstand + versatz).toFixed(1)}" cy="${augenY.toFixed(1)}"
               rx="${(kopfB * 0.14).toFixed(1)}" ry="${(kopfH * 0.07).toFixed(1)}" fill="#8F7E72"/>
    </g>
    <text x="${breite * 0.5}" y="${hoehe * 0.86}" text-anchor="middle" fill="${TOENE.leise}"
          font-family="DejaVu Sans, sans-serif" font-size="${Math.round(breite * 0.032)}"
          letter-spacing="3" opacity="0.6">PLATZHALTER-SEQUENZ</text>
    <text x="${breite * 0.5}" y="${hoehe * 0.91}" text-anchor="middle" fill="${TOENE.leise}"
          font-family="DejaVu Sans, sans-serif" font-size="${Math.round(breite * 0.026)}"
          opacity="0.45">Frame ${String(nummer).padStart(4, '0')} / ${gesamt}</text>
  </svg>`);
}

async function schreibe(svg, zielPfad, qualitaet = 76) {
  await mkdir(path.dirname(zielPfad), { recursive: true });
  const bild = sharp(svg);
  await (zielPfad.endsWith('.jpg')
    ? bild.jpeg({ quality: qualitaet + 6, mozjpeg: true })
    : bild.webp({ quality: qualitaet })
  ).toFile(zielPfad);
}

/* ------------------------------------------------------------- Sequenz */

const FRAMES = Number(process.env.FRAMES ?? 150);
const MOBIL_SCHRITT = 2;

async function sequenz() {
  for (let i = 1; i <= FRAMES; i++) {
    await schreibe(
      sequenzFrame({ breite: 720, hoehe: 900, nummer: i, gesamt: FRAMES }),
      path.join(WURZEL, 'sequence', `frame_${String(i).padStart(4, '0')}.webp`),
      68,
    );
  }
  // Mobil: jedes zweite Frame, kleiner. Die Nummerierung bleibt die des
  // Originals, damit sich beide Ordner demselben Fortschritt zuordnen lassen.
  for (let i = 1; i <= FRAMES; i += MOBIL_SCHRITT) {
    await schreibe(
      sequenzFrame({ breite: 420, hoehe: 525, nummer: i, gesamt: FRAMES }),
      path.join(WURZEL, 'sequence-mobile', `frame_${String(i).padStart(4, '0')}.webp`),
      62,
    );
  }
  console.log(`Sequenz: ${FRAMES} Frames + ${Math.ceil(FRAMES / MOBIL_SCHRITT)} mobile Frames`);
}

/* ------------------------------------------------------------- Einzelne */

const EINZELN = [
  ['hero-fallback.webp', 1440, 1800, 'Hero-Fallback', 'HOCHFORMAT · 1440 × 1800'],
  // Als JPG, nicht als WebP: WhatsApp zeigt WebP-Vorschauen nicht zuverlässig.
  ['og-bild.jpg', 1200, 630, 'CH Beautyroom', 'TEILEN-BILD · 1200 × 630'],
  ['about/portrait.webp', 1000, 1400, 'Porträt Carina', 'HOCHFORMAT · 1000 × 1400'],
  ['services/wimpern.webp', 1200, 1500, 'Wimpernverlängerung', 'LEISTUNG · 1200 × 1500'],
  ['services/lash-lifting.webp', 1200, 1500, 'Lash Lifting', 'LEISTUNG · 1200 × 1500'],
  ['services/brow-lifting.webp', 1200, 1500, 'Brow Lifting', 'LEISTUNG · 1200 × 1500'],
  ['services/fineline.webp', 1200, 1500, 'Fineline-Tattoo', 'LEISTUNG · 1200 × 1500'],
  ['process/beratung.webp', 1000, 1250, 'Beratung', 'ABLAUF 01'],
  ['process/behandlung.webp', 1000, 1250, 'Behandlung', 'ABLAUF 02'],
  ['process/pflege.webp', 1000, 1250, 'Pflege', 'ABLAUF 03'],
  ['statement/pille-1.webp', 400, 400, 'Wimpern', 'INLINE'],
  ['statement/pille-2.webp', 400, 400, 'Fineline', 'INLINE'],
];

const MASSE = { hoch: [1000, 1400], quer: [1400, 1000], quadrat: [1200, 1200] };

async function einzelne() {
  for (const [datei, b, h, text, unter] of EINZELN) {
    await schreibe(flaeche({ breite: b, hoehe: h, grund: TOENE.creme, text, unterzeile: unter }),
      path.join(WURZEL, datei));
  }
  for (let i = 1; i <= 6; i++) {
    await schreibe(
      flaeche({ breite: 800, hoehe: 800, grund: TOENE.blush, text: `Instagram ${i}`, unterzeile: 'QUADRAT · 800 × 800' }),
      path.join(WURZEL, 'instagram', `0${i}.webp`),
    );
  }
  console.log(`Einzelbilder: ${EINZELN.length + 6}`);
}

/* -------------------------------------------------------------- Galerie */

async function galerie() {
  // Die Liste spiegelt die Einträge in content/site.ts. Kommt dort ein Bild
  // dazu, hier eine Zeile ergänzen – oder das echte Bild direkt ablegen.
  const eintraege = [
    ...['01', '02', '03', '04', '05'].map((n, i) => [`wimpern-${n}`, ['quer', 'hoch', 'quadrat', 'hoch', 'quer'][i], 'Wimpern']),
    ...['01', '02', '03', '04'].map((n, i) => [`lifting-${n}`, ['quer', 'hoch', 'quadrat', 'hoch'][i], 'Lifting']),
    ...['01', '02', '03', '04', '05', '06', '07', '08'].map((n, i) => [
      `fineline-${n}`,
      ['hoch', 'quadrat', 'hoch', 'quer', 'quadrat', 'hoch', 'hoch', 'quer'][i],
      'Fineline',
    ]),
  ];

  for (const [name, format, label] of eintraege) {
    const [b, h] = MASSE[format];
    await schreibe(
      flaeche({
        breite: b,
        hoehe: h,
        grund: TOENE.creme,
        text: label,
        unterzeile: `${name.toUpperCase()} · ${b} × ${h}`,
        mono: label === 'Fineline',
      }),
      path.join(WURZEL, 'gallery', `${name}.webp`),
    );
  }

  // Vorher-Bilder für den Vergleichsregler
  for (const [name, format] of [['lifting-01-vorher', 'quer'], ['lifting-03-vorher', 'quadrat']]) {
    const [b, h] = MASSE[format];
    await schreibe(
      flaeche({ breite: b, hoehe: h, grund: '#EFE7E1', text: 'Vorher', unterzeile: name.toUpperCase() }),
      path.join(WURZEL, 'gallery', `${name}.webp`),
    );
  }
  console.log(`Galerie: ${eintraege.length + 2} Bilder`);
}

await sequenz();
await einzelne();
await galerie();
console.log('Fertig. Echte Bilder einfach gleichnamig überschreiben.');
