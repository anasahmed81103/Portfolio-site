/**
 * Generates SVG path data for the intro signature from a real script font.
 *
 * Why opentype.js (devDependency): glyph outlines must come from the font
 * file — not hand-authored letter approximations. Run after changing the
 * name or font:
 *
 *   node scripts/generateSignaturePaths.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FONT_PATH = path.join(root, 'src/assets/fonts/Allura-Regular.ttf');
const OUT_PATH = path.join(root, 'src/components/intro/signaturePaths.ts');

const NAME = 'Anas Ahmed';
const FONT_SIZE = 180;
const PAD_X = 40;
const PAD_Y = 36;
const UNDERLINE_GAP = 20;

const font = opentype.parse(fs.readFileSync(FONT_PATH).buffer);
const baseline = FONT_SIZE * 0.78;

/** Serialize opentype path commands without relying on buggy toPathData(). */
function pathToSvgD(path) {
  let d = '';
  for (const cmd of path.commands) {
    switch (cmd.type) {
      case 'M':
        d += `M${fmt(cmd.x)} ${fmt(cmd.y)}`;
        break;
      case 'L':
        // Skip zero-length line segments (common in hinted outlines).
        if (d.endsWith(`M${fmt(cmd.x)} ${fmt(cmd.y)}`)) break;
        d += `L${fmt(cmd.x)} ${fmt(cmd.y)}`;
        break;
      case 'Q':
        d += `Q${fmt(cmd.x1)} ${fmt(cmd.y1)} ${fmt(cmd.x)} ${fmt(cmd.y)}`;
        break;
      case 'C':
        d += `C${fmt(cmd.x1)} ${fmt(cmd.y1)} ${fmt(cmd.x2)} ${fmt(cmd.y2)} ${fmt(cmd.x)} ${fmt(cmd.y)}`;
        break;
      case 'Z':
        d += 'Z';
        break;
      default:
        break;
    }
  }
  if (d.includes('NaN')) {
    throw new Error('Path serialization produced NaN — check glyph commands.');
  }
  return d;
}

function fmt(n) {
  if (!Number.isFinite(n)) {
    throw new Error(`Non-finite path coordinate: ${n}`);
  }
  return Number(n.toFixed(2));
}

/** @type {string[]} */
const letterPaths = [];

font.forEachGlyph(NAME, 0, 0, FONT_SIZE, {}, (glyph, gX, gY) => {
  if (glyph.unicode === 32 || glyph.name === 'space') return;

  const pathData = pathToSvgD(glyph.getPath(gX, baseline + gY, FONT_SIZE));
  if (pathData.length > 2) {
    letterPaths.push(pathData);
  }
});

const measured = font.getPath(NAME, 0, baseline, FONT_SIZE).getBoundingBox();
const minX = measured.x1 - PAD_X;
const minY = measured.y1 - PAD_Y;
const maxX = measured.x2 + PAD_X;
const maxY = measured.y2 + PAD_Y + UNDERLINE_GAP + 28;
const viewWidth = maxX - minX;
const viewHeight = maxY - minY;

const underlineY = measured.y2 + UNDERLINE_GAP;
const left = measured.x1 + 8;
const right = measured.x2 - 8;
const mid = (left + right) / 2;

const underline = [
  `M ${left.toFixed(2)} ${underlineY.toFixed(2)}`,
  `C ${(left + (mid - left) * 0.45).toFixed(2)} ${(underlineY + 14).toFixed(2)}`,
  `${(mid - 20).toFixed(2)} ${(underlineY - 8).toFixed(2)}`,
  `${mid.toFixed(2)} ${(underlineY + 4).toFixed(2)}`,
  `S ${(right - 30).toFixed(2)} ${(underlineY + 12).toFixed(2)}`,
  `${right.toFixed(2)} ${(underlineY - 2).toFixed(2)}`,
].join(' ');

const flourish = [
  `M ${(right - 18).toFixed(2)} ${underlineY.toFixed(2)}`,
  `C ${(right + 12).toFixed(2)} ${(underlineY - 12).toFixed(2)}`,
  `${(right + 28).toFixed(2)} ${(underlineY + 14).toFixed(2)}`,
  `${(right - 4).toFixed(2)} ${(underlineY + 10).toFixed(2)}`,
].join(' ');

const file = `/**
 * AUTO-GENERATED — do not edit by hand.
 * Source font: Allura Regular (SIL OFL 1.1) — src/assets/fonts/Allura-Regular.ttf
 * License: src/assets/fonts/OFL-Allura.txt
 * Regenerate: node scripts/generateSignaturePaths.mjs
 *
 * Letterforms are real glyph outlines from the font (opentype.js),
 * not manually approximated handwriting paths.
 */

export const SIGNATURE_TEXT = ${JSON.stringify(NAME)};

export const SIGNATURE_FONT = {
  family: 'Allura',
  file: 'src/assets/fonts/Allura-Regular.ttf',
  license: 'SIL Open Font License 1.1',
} as const;

/** viewBox min-x min-y width height */
export const SIGNATURE_VIEWBOX = {
  minX: ${minX.toFixed(2)},
  minY: ${minY.toFixed(2)},
  width: ${viewWidth.toFixed(2)},
  height: ${viewHeight.toFixed(2)},
} as const;

/** One SVG path \`d\` per visible glyph, in left-to-right draw order. */
export const SIGNATURE_LETTER_PATHS: readonly string[] = ${JSON.stringify(letterPaths, null, 2)};

export const SIGNATURE_UNDERLINE_PATH = ${JSON.stringify(underline)};

export const SIGNATURE_FLOURISH_PATH = ${JSON.stringify(flourish)};
`;

fs.writeFileSync(OUT_PATH, file, 'utf8');
console.log(
  `Wrote ${letterPaths.length} glyph paths → ${path.relative(root, OUT_PATH)}`,
);
console.log(
  `viewBox: ${minX.toFixed(1)} ${minY.toFixed(1)} ${viewWidth.toFixed(1)} ${viewHeight.toFixed(1)}`,
);
