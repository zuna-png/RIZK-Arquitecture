/**
 * Extrae, en tiempo de compilación, los tonos de una imagen:
 * - palette: 5 colores representativos (k-means), ordenados de oscuro a claro.
 * - average: color promedio (fondo mientras carga la imagen).
 * - dark / light / accent: tonos derivados para teñir la interfaz.
 * - placeholder: miniatura borrosa (LQIP) en base64, ~0.5 KB.
 *
 * Los resultados se cachean por archivo para no recalcular en cada página.
 */
import fs from 'node:fs';
import sharp from 'sharp';

type RGB = [number, number, number];

export interface ImageTones {
  palette: string[];
  average: string;
  dark: RGB;
  light: RGB;
  accent: string;
  placeholder: string;
}

const cache = new Map<string, Promise<ImageTones | null>>();

export function getImageTones(filePath: string | undefined): Promise<ImageTones | null> {
  if (!filePath || !fs.existsSync(filePath)) return Promise.resolve(null);
  if (!cache.has(filePath)) cache.set(filePath, compute(filePath).catch(() => null));
  return cache.get(filePath)!;
}

async function compute(filePath: string): Promise<ImageTones> {
  const [{ data }, lqip] = await Promise.all([
    sharp(filePath).resize(48, 48, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(filePath).resize(24).blur(1.2).webp({ quality: 45 }).toBuffer(),
  ]);

  const pixels: RGB[] = [];
  for (let i = 0; i < data.length; i += 3) pixels.push([data[i], data[i + 1], data[i + 2]]);

  const centers = kmeans(pixels, 5).sort((a, b) => luminance(a) - luminance(b));
  const average = mean(pixels);
  const accent = [...centers].sort((a, b) => chroma(b) - chroma(a))[0];

  return {
    palette: centers.map(hex),
    average: hex(average),
    dark: centers[0],
    light: centers[centers.length - 1],
    accent: hex(accent),
    placeholder: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
}

/* ---------- utilidades de color ---------- */

const luminance = ([r, g, b]: RGB) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const chroma = ([r, g, b]: RGB) => Math.max(r, g, b) - Math.min(r, g, b);
const dist = (a: RGB, b: RGB) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
const hex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function mean(points: RGB[]): RGB {
  const s = points.reduce<RGB>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
  return [s[0] / points.length, s[1] / points.length, s[2] / points.length];
}

/** k-means determinista: centros iniciales en cuantiles de luminancia (evita reflejos sueltos). */
function kmeans(points: RGB[], k: number, iterations = 12): RGB[] {
  const sorted = [...points].sort((a, b) => luminance(a) - luminance(b));
  const centers: RGB[] = Array.from({ length: k }, (_, i) => [
    ...sorted[Math.floor(((i + 0.5) / k) * sorted.length)],
  ] as RGB);

  for (let it = 0; it < iterations; it++) {
    const groups: RGB[][] = centers.map(() => []);
    for (const p of points) {
      let idx = 0;
      for (let c = 1; c < k; c++) if (dist(p, centers[c]) < dist(p, centers[idx])) idx = c;
      groups[idx].push(p);
    }
    groups.forEach((g, i) => g.length && (centers[i] = mean(g)));
  }
  return centers;
}
