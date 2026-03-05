import { Board, Tile } from "./types";
import {
  RESOURCE_DISTRIBUTION,
  NUMBER_DISTRIBUTION,
} from "./constants";

import {
  defineHex,
  Grid,
  spiral,
} from "honeycomb-grid";
import { RNG } from "./rng";

/**
 * Definimos el tipo de hex
 */
const Hex = defineHex({ dimensions: 1 });

type GameHex = InstanceType<typeof Hex>;

function shuffle<T>(array: T[], rng: RNG): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/**
 * Creamos un hexágono radio 2 (19 tiles)
 */
function createHexagonGrid(): Grid<GameHex> {
  const hexes = spiral({ radius: 2 });
  return new Grid(Hex, hexes);
}

function hasInvalidSixEightAdjacency(
  tiles: Tile[],
  grid: Grid<GameHex>
): boolean {
  const tileMap = new Map<string, Tile>(
    tiles.map((t) => [`${t.q},${t.r}`, t])
  );

  const directions = [0, 1, 2, 3, 4, 5] as const;

  for (const tile of tiles) {
    if (tile.number !== 6 && tile.number !== 8) continue;

    const hex = grid.getHex({ q: tile.q, r: tile.r });
    if (!hex) continue;

    for (const dir of directions) {
      const neighbor = grid.neighborOf(hex, dir);
      if (!neighbor) continue;

      const neighborTile = tileMap.get(
        `${neighbor.q},${neighbor.r}`
      );

      if (!neighborTile) continue;

      if (neighborTile.number === 6 || neighborTile.number === 8) {
        return true;
      }
    }
  }

  return false;
}

export function generateBoard(rng: RNG): Board {
  const grid = createHexagonGrid();

  const resources = shuffle(RESOURCE_DISTRIBUTION, rng);

  let tiles: Tile[] = [];
  let valid = false;

  while (!valid) {
    const numbers = shuffle(NUMBER_DISTRIBUTION, rng);
    let numberIndex = 0;

    tiles = grid.toArray().map((hex, i) => {
      const resource = resources[i];

      let number: number | undefined;
      if (resource !== "desert") {
        number = numbers[numberIndex++];
      }

      return {
        id: `${hex.q},${hex.r}`,
        q: hex.q,
        r: hex.r,
        resource,
        number,
      };
    });

    valid = !hasInvalidSixEightAdjacency(tiles, grid);
  }

  return { tiles };
}
