import { Board, BoardSettings, Tile } from "./types";
import { validateResourceBalance, validateAdjacency, validateHighValueZones } from "./validators";
import { RNG } from "./rng";
import { computeNeighbors } from "./utils";
import { RESOURCE_DISTRIBUTION, NUMBER_DISTRIBUTION } from "./constants";
import { DEFAULT_SETTINGS } from "./settings";
import { defineHex, Grid, spiral } from "honeycomb-grid";

const Hex = defineHex({ dimensions: 1 });

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
    // Fase 1 — distribuir recursos y números aleatoriamente
    const resources = shuffle(RESOURCE_DISTRIBUTION, rng);
    const numbers = shuffle(NUMBER_DISTRIBUTION, rng);
    let numberIndex = 0;

    const tiles: Tile[] = grid.toArray().map((hex, i) => ({
      id: `${hex.q},${hex.r}`,
      q: hex.q, r: hex.r,
      resource: resources[i],
      number: resources[i] !== "desert" ? numbers[numberIndex++] : undefined,
      neighbors: [],
    }));

    computeNeighbors(tiles);

    // Fase 2 — validar reglas base
    if (settings.resourceBalance === "balanced" && !validateResourceBalance(tiles)) continue;
    if (!validateAdjacency(tiles)) continue;
    if (!validateHighValueZones(tiles)) continue;

    // Fase 3 — elegir el mejor de 5 candidatos válidos
    if (!best || scoreHighValueZones(tiles) < scoreHighValueZones(best)) {
      best = tiles.map(t => ({ ...t }));
    }

    if (++candidates >= 5) return { tiles: best };
  }
}
