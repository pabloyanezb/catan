import { Port, PortResource, PortSlot } from '../config/types';
import { FRAME_PIECES, FRAME_SIDES } from '../config/constants';
import { RNG } from '../utils/rng';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(array: T[], rng: RNG): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makePort(resource: PortResource, slot: PortSlot): Port {
  return {
    resource,
    ratio: resource === 'generic' ? '3:1' : '2:1',
    tile: slot.tile,
    direction: slot.direction,
  };
}

/**
 * Rota un slot 60° anticlockwise n veces.
 * Transformación axial: (q, r) → (-r, q + r)
 * Dirección: +1 por cada paso (mod 6)
 */
export function rotateSlot(slot: PortSlot, steps: number): PortSlot {
  let [q, r] = slot.tile.split(',').map(Number);
  let dir = slot.direction;

  for (let i = 0; i < steps; i++) {
    [q, r] = [-r, q + r];
    dir = (dir + 1) % 6;
  }

  return { tile: `${q},${r}`, direction: dir };
}

// ─── Generación ───────────────────────────────────────────────────────────────

/**
 * Fixed: todos los puertos rotan juntos (0, 2 o 4 pasos).
 * Los recursos mantienen su orden relativo original.
 */
export function generatePortsFixed(rng: RNG): Port[] {
  const steps = Math.floor(rng.next() * 3) * 2; // 0, 2, 4

  return FRAME_PIECES.flatMap((piece, i) =>
    FRAME_SIDES[i].map((slot, j) =>
      makePort(piece[j], rotateSlot(slot, steps))
    )
  );
}

/**
 * Random: todos los puertos rotan juntos (0-5 pasos),
 * pero los recursos se shufflean entre lados compatibles (solo↔solo, doble↔doble).
 */
export function generatePortsRandom(rng: RNG): Port[] {
  const steps = Math.floor(rng.next() * 6); // 0-5

  const soloPieces   = shuffle(FRAME_PIECES.filter(p => p.length === 1), rng);
  const doublePieces = shuffle(FRAME_PIECES.filter(p => p.length === 2), rng);

  let si = 0;
  let di = 0;

  return FRAME_PIECES.flatMap((original, i) => {
    const piece = original.length === 1 ? soloPieces[si++] : doublePieces[di++];
    return FRAME_SIDES[i].map((slot, j) =>
      makePort(piece[j], rotateSlot(slot, steps))
    );
  });
}
