import { RNG } from '../utils/rng';

export interface SeaTile {
  q: number;
  r: number;
}

/**
 * Genera todos los hexágonos a exactamente `radius` pasos del centro.
 * Usa el algoritmo estándar de anillo axial: empieza en (radius, 0)
 * y recorre las 6 direcciones dando `radius` pasos cada una.
 */
function ring(radius: number): SeaTile[] {
  const results: SeaTile[] = [];
  const directions = [
    [-1,  1], [-1,  0], [ 0, -1],
    [ 1, -1], [ 1,  0], [ 0,  1],
  ];

  let q = radius;
  let r = 0;

  for (const [dq, dr] of directions) {
    for (let i = 0; i < radius; i++) {
      results.push({ q, r });
      q += dq;
      r += dr;
    }
  }

  return results;
}

/**
 * Selecciona tiles del anillo exterior con espaciado aleatorio (1-3 entre cada uno).
 * Pueden tocarse pero no agruparse en clusters grandes.
 * El punto de inicio es aleatorio para variar la distribución.
 */
function selectSpaced(tiles: SeaTile[], count: number, rng: RNG): SeaTile[] {
  const n     = tiles.length;
  const start = Math.floor(rng.next() * n);
  const result: SeaTile[] = [];
  let   i     = 0;

  while (result.length < count && i < n) {
    const idx = (start + i) % n;
    result.push(tiles[idx]);
    // Gap aleatorio entre 1 y 3 — pueden tocarse pero no formar bloques grandes
    i += 1 + Math.floor(rng.next() * 3);
  }

  return result;
}

/**
 * Genera los tiles de mar:
 * - Radio 3: siempre completo (rodea el tablero)
 * - Radio 4: ~9 tiles distribuidos aleatoriamente sin clusters
 */
export function generateSeaTiles(rng: RNG): SeaTile[] {
  const mandatory = ring(3);
  const outer     = selectSpaced(ring(4), 9, rng);
  return [...mandatory, ...outer];
}
