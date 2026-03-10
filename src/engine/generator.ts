import { Board, BoardSettings, Tile } from "./types";
import { validateResourceBalance, validateAdjacency, validateHighValueZones } from "./validators";
import { RNG } from "./rng";
import { computeNeighbors, buildTileMap } from "./utils";
import { RESOURCE_DISTRIBUTION, NUMBER_DISTRIBUTION } from "./constants";
import { DEFAULT_SETTINGS } from "./settings";
import { defineHex, Grid, spiral } from "honeycomb-grid";

const Hex = defineHex({ dimensions: 1 });

// Camino espiral del juego físico desde el exterior al centro
const STANDARD_PATH = [
  "0,-2", "1,-2", "2,-2", "2,-1", "2,0", "1,1",
  "0,2", "-1,2", "-2,2", "-2,1", "-2,0", "-1,-1",
  "0,-1", "1,-1", "1,0", "0,1", "-1,1", "-1,0",
  "0,0"
];

// Secuencia oficial de números A-R del juego físico
const STANDARD_SEQUENCE = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

/**
 * Asigna la secuencia oficial de números siguiendo el camino espiral.
 * Salta los tiles desierto — el siguiente número se asigna al siguiente tile no-desierto.
 */
function placeNumbersStandard(tiles: Tile[]): void {
  const tileMap = buildTileMap(tiles);
  let sequenceIndex = 0;

  for (const id of STANDARD_PATH) {
    const tile = tileMap.get(id);
    if (!tile || tile.resource === "desert") continue;
    tile.number = STANDARD_SEQUENCE[sequenceIndex++];
  }
}

function shuffle<T>(array: T[], rng: RNG): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

    // Fase 2 — Validar balance de recursos antes de intentar colocar números
    if (settings.resourceBalance === "balanced" && !validateResourceBalance(tiles)) continue;

    // Fase 3 — Modo standard: secuencia oficial, solo recursos aleatorios
    if (settings.numberPlacement === "standard") {
      placeNumbersStandard(tiles);
      return { tiles };
    }

    // Fase 3 — Modo random: brute force con candidate scoring
    const numbers = shuffle(NUMBER_DISTRIBUTION, rng);
    let numberIndex = 0;
    tiles.forEach(t => {
      if (t.resource !== "desert") t.number = numbers[numberIndex++];
    });

    if (!validateAdjacency(tiles)) continue;
    if (!validateHighValueZones(tiles)) continue;

    // Fase 4 — Elegir el mejor de 5 candidatos válidos
    if (!best || scoreHighValueZones(tiles) < scoreHighValueZones(best)) {
      best = tiles.map(t => ({ ...t }));
    }

    if (++candidates >= 5) return { tiles: best! };
  }
}
