import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = process.argv[2] ?? 'public/images';

// Warme Neutraltoene passend zum Design-System
const palettes = [
  ['#F3EBE0', '#DFCEBD', '#C4AC95'],
  ['#F7F1E8', '#E7D7C7', '#CBB49E'],
  ['#EFE6DA', '#D9C6B2', '#B49F8B'],
  ['#F5EFE6', '#E3CFC6', '#C9A995'],
  ['#F1EBE1', '#D8CCBC', '#B9A38D'],
];

function rand(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function svg(w, h, seed) {
  const r = rand(seed * 7919 + 13);
  const p = palettes[Math.floor(r() * palettes.length)];
  const blobs = [];
  const count = 4 + Math.floor(r() * 3);
  for (let i = 0; i < count; i++) {
    const cx = r() * w;
    const cy = r() * h;
    const rx = (0.18 + r() * 0.4) * w;
    const ry = (0.18 + r() * 0.4) * h;
    const fill = p[Math.floor(r() * p.length)];
    const op = (0.18 + r() * 0.4).toFixed(2);
    blobs.push(`<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="${fill}" opacity="${op}"/>`);
  }
  const lines = [];
  const lineCount = 3 + Math.floor(r() * 4);
  for (let i = 0; i < lineCount; i++) {
    const x1 = r() * w;
    const y1 = r() * h;
    const x2 = x1 + (r() - 0.5) * w * 0.9;
    const y2 = y1 + (r() - 0.5) * h * 0.9;
    const cx = (x1 + x2) / 2 + (r() - 0.5) * w * 0.4;
    const cy = (y1 + y2) / 2 + (r() - 0.5) * h * 0.4;
    lines.push(`<path d="M${x1.toFixed(0)} ${y1.toFixed(0)} Q${cx.toFixed(0)} ${cy.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}" fill="none" stroke="#8E7862" stroke-width="${(0.8 + r() * 1.6).toFixed(1)}" opacity="${(0.12 + r() * 0.2).toFixed(2)}" stroke-linecap="round"/>`);
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p[0]}"/>
      <stop offset="55%" stop-color="${p[1]}"/>
      <stop offset="100%" stop-color="${p[2]}"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="40%" r="75%">
      <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8A7358" stop-opacity="0.22"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g filter="none">${blobs.join('')}</g>
  ${lines.join('')}
  <rect width="${w}" height="${h}" fill="url(#v)"/>
</svg>`);
}

async function make(file, w, h, seed, { mono = false, quality = 78 } = {}) {
  const target = path.join(OUT, file);
  await mkdir(path.dirname(target), { recursive: true });
  let pipeline = sharp(svg(w, h, seed)).resize(w, h);
  if (mono) pipeline = pipeline.grayscale().modulate({ brightness: 1.05 });
  await pipeline.jpeg({ quality, mozjpeg: true, progressive: true }).toFile(target);
  return target;
}

const jobs = [
  ['hero.jpg', 2000, 1250, 1, {}],
  ['leistung-wimpern.jpg', 1200, 1500, 2, {}],
  ['leistung-lifting.jpg', 1200, 1500, 3, {}],
  ['leistung-fineline.jpg', 1200, 1500, 4, { mono: true }],
  ['leistung-ringana.jpg', 1200, 1500, 5, {}],
  ['portrait.jpg', 1000, 1400, 6, {}],
  ['fineline-atmosphaere.jpg', 1600, 1067, 7, { mono: true }],
  ['ringana.jpg', 1600, 1067, 8, {}],
  ['karte-ramsloh.jpg', 1200, 900, 9, {}],
  ['vergleich-lifting-vorher.jpg', 1200, 900, 10, {}],
  ['vergleich-lifting-nachher.jpg', 1200, 900, 11, {}],
  ['og-bild.jpg', 1200, 630, 12, {}],
];

const galerie = [
  ...['quer', 'hoch', 'quadrat', 'hoch', 'quer', 'quadrat', 'quer'].map((f, i) => [`galerie/wimpern-0${i + 1}.jpg`, f, false]),
  ...['quer', 'hoch', 'quadrat', 'hoch', 'quer'].map((f, i) => [`galerie/lifting-0${i + 1}.jpg`, f, false]),
  ...['hoch', 'quadrat', 'hoch', 'quer', 'quadrat', 'hoch', 'quadrat', 'hoch', 'quer', 'quadrat', 'hoch', 'hoch'].map((f, i) => [
    `galerie/fineline-${String(i + 1).padStart(2, '0')}.jpg`,
    f,
    true,
  ]),
];

const dims = { hoch: [1000, 1400], quer: [1400, 1000], quadrat: [1200, 1200] };

let seed = 20;
for (const [file, format, mono] of galerie) {
  const [w, h] = dims[format];
  jobs.push([file, w, h, seed++, { mono }]);
}

for (const [file, w, h, s, opts] of jobs) {
  await make(file, w, h, s, opts);
}

// Blur-Platzhalter (winziges JPEG als Data-URL)
const blur = await sharp(svg(16, 16, 1)).resize(12, 12).jpeg({ quality: 40 }).toBuffer();
await writeFile(
  path.join(OUT, '..', '..', 'lib', 'blur.ts'),
  `/**
 * Winziger, unscharfer Platzhalter fuer next/image.
 * Verhindert weisses Aufblitzen und Layout-Shift beim Laden.
 * Neu erzeugen mit: node scripts/generate-placeholders.mjs
 */
export const blurDataURL =
  'data:image/jpeg;base64,${blur.toString('base64')}';
`,
);

console.log(`${jobs.length} Platzhalterbilder erzeugt.`);
