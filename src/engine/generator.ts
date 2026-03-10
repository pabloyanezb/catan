import { Board, BoardSettings, Tile } from "./types";
import { validateNodeScore, validateResourceBalance, isValidNumberPlacement } from "./validators";
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

function placeNumbers(
  tiles: Tile[],
  nonDesertIndices: number[],
  available: number[],
  position: number,
  rule: BoardSettings["adjacencyRule"],
  rng: RNG
): boolean {
  if (position === nonDesertIndices.length) return true;

  const tileIndex = nonDesertIndices[position];

  for (const number of shuffle(available, rng)) {
    if (!isValidNumberPlacement(tiles, tileIndex, number, rule)) continue;

    tiles[tileIndex].number = number;

    const placed = placeNumbers(
      tiles,
      nonDesertIndices,
      available.filter(n => n !== number),
      position + 1,
      rule,
      rng
    );

    if (placed) return true;
    tiles[tileIndex].number = undefined;
  }

  return false;
}

export function generateBoard(
  rng: RNG,
  settings: BoardSettings = DEFAULT_SETTINGS
): Board {
  const grid = new Grid(Hex, spiral({ radius: 2 }));

  while (true) {
    const resources = shuffle(RESOURCE_DISTRIBUTION, rng);

    const tiles: Tile[] = grid.toArray().map((hex, i) => ({
      id: `${hex.q},${hex.r}`,
      q: hex.q,
      r: hex.r,
      resource: resources[i],
      number: undefined,
      neighbors: [],
    }));

    computeNeighbors(tiles);

    if (settings.resourceBalance === "balanced" && !validateResourceBalance(tiles)) continue;

    const nonDesertIndices = tiles
      .map((t, i) => t.resource !== "desert" ? i : -1)
      .filter(i => i !== -1);

    const placed = placeNumbers(
      tiles,
      nonDesertIndices,
      [...NUMBER_DISTRIBUTION],
      0,
      settings.adjacencyRule,
      rng,
    );
    if (!placed) continue;

    if (settings.adjacencyRule === "strict" && !validateNodeScore(tiles)) continue;

    return { tiles };
  }
}
