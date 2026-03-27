import { RESOURCE_DISTRIBUTION, NUMBER_DISTRIBUTION } from '../config/constants';
import { Board, BoardSettings, Tile } from '../config/types';
import { DEFAULT_SETTINGS } from '../config/settings';
import { computeNeighbors, buildTileMap, shuffle } from '../utils/utils';
import { RNG } from '../utils/rng';
import { validateResourceBalance, validateAdjacency, validateHighValueZones } from './validators';
import { generatePortsFixed, generatePortsRandom } from './ports';
import { generateSeaTiles } from './seaTiles';
import { defineHex, Grid, spiral } from 'honeycomb-grid';

const Hex = defineHex({ dimensions: 1 });

// ─── Spiral paths ─────────────────────────────────────────────────────────────

// Camino espiral exterior (12 tiles, counterclockwise)
const STANDARD_PATH_EXTERIOR = [
  '0,-2', '1,-2', '2,-2', '2,-1', '2,0', '1,1',
  '0,2', '-1,2', '-2,2', '-2,1', '-2,0', '-1,-1',
];

// Camino espiral del anillo medio (6 tiles, counterclockwise)
const STANDARD_PATH_MIDDLE = [
  '0,-1', '1,-1', '1,0', '0,1', '-1,1', '-1,0',
];

// Inicio en cada esquina (cada 2 posiciones del exterior)
const CORNER_OFFSETS = [0, 2, 4, 6, 8, 10];

// Secuencia oficial de números A-R del juego físico
const STANDARD_SEQUENCE = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

/**
 * Construye el camino espiral completo rotando exterior y anillo medio
 * desde una esquina aleatoria. middleOffset = cornerIndex (exteriorOffset / 2)
 * para mantener continuidad del camino físico.
 */
function buildStandardPath(rng: RNG): string[] {
  const cornerIndex = Math.floor(rng.next() * CORNER_OFFSETS.length);
  const exteriorOffset = CORNER_OFFSETS[cornerIndex];
  const middleOffset = cornerIndex;

  const rotatedExterior = [
    ...STANDARD_PATH_EXTERIOR.slice(exteriorOffset),
    ...STANDARD_PATH_EXTERIOR.slice(0, exteriorOffset),
  ];

  const rotatedMiddle = [
    ...STANDARD_PATH_MIDDLE.slice(middleOffset),
    ...STANDARD_PATH_MIDDLE.slice(0, middleOffset),
  ];

  return [...rotatedExterior, ...rotatedMiddle, '0,0'];
}

/**
 * Asigna la secuencia oficial de números siguiendo el camino espiral.
 * Salta los tiles desierto.
 */
function placeNumbersStandard(tiles: Tile[], rng: RNG): void {
  const tileMap = buildTileMap(tiles);
  const path = buildStandardPath(rng);
  let sequenceIndex = 0;

  for (const id of path) {
    const tile = tileMap.get(id);
    if (!tile || tile.resource === 'desert') continue;
    tile.number = STANDARD_SEQUENCE[sequenceIndex++];
  }
}

/**
 * Cuenta vecinos compartidos entre todos los pares de tiles 6/8.
 * Menor score = tiles de alta probabilidad más dispersos.
 */
function scoreHighValueZones(tiles: Tile[]): number {
  const highTiles = tiles.filter(t => t.number === 6 || t.number === 8);
  let shared = 0;

  for (let i = 0; i < highTiles.length; i++) {
    for (let j = i + 1; j < highTiles.length; j++) {
      const neighborsA = new Set(highTiles[i].neighbors);
      shared += highTiles[j].neighbors.filter(id => neighborsA.has(id)).length;
    }
  }

  return shared;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function generateBoard(
  rng: RNG,
  settings: BoardSettings = DEFAULT_SETTINGS
): Board {
  const grid = new Grid(Hex, spiral({ radius: 2 }));

  let best: Tile[] | null = null;
  let candidates = 0;

  while (true) {
    // Fase 1 — Distribuir recursos aleatoriamente
    const resources = shuffle(RESOURCE_DISTRIBUTION, rng);

    const tiles: Tile[] = grid.toArray().map((hex, i) => ({
      id: `${hex.q},${hex.r}`,
      q: hex.q, r: hex.r,
      resource: resources[i],
      number: undefined,
      neighbors: [],
    }));

    computeNeighbors(tiles);

    // Fase 2 — Validar balance de recursos
    if (settings.resourceBalance === 'balanced' && !validateResourceBalance(tiles)) continue;

    // Fase 3 — Colocar números
    if (settings.numberPlacement === 'standard') {
      placeNumbersStandard(tiles, rng);
      const ports = settings.portLayout === 'fixed'
        ? generatePortsFixed(rng)
        : generatePortsRandom(rng);
      const seaTiles = generateSeaTiles(rng);
      return { tiles, ports, seaTiles };
    }

    // Modo random: brute force con candidate scoring
    const numbers = shuffle(NUMBER_DISTRIBUTION, rng);
    let numberIndex = 0;
    tiles.forEach(t => {
      if (t.resource !== 'desert') t.number = numbers[numberIndex++];
    });

    if (!validateAdjacency(tiles)) continue;
    if (!validateHighValueZones(tiles)) continue;

    // Fase 4 — Elegir el mejor de 5 candidatos válidos
    if (!best || scoreHighValueZones(tiles) < scoreHighValueZones(best)) {
      best = tiles.map(t => ({ ...t }));
    }

    if (++candidates >= 5) {
      const ports = settings.portLayout === 'fixed'
        ? generatePortsFixed(rng)
        : generatePortsRandom(rng);
      const seaTiles = generateSeaTiles(rng);
      return { tiles: best!, ports, seaTiles };
    }
  }
}
