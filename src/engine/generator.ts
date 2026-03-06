import { Board, BoardSettings, Tile } from "./types";
import { validateAdjacency, validateResourceBalance } from "./validators";
import { RNG } from "./rng";
import { computeNeighbors } from "./utils";
import {
  RESOURCE_DISTRIBUTION,
  NUMBER_DISTRIBUTION,
} from "./constants";
import { DEFAULT_SETTINGS } from "./settings";

import {
  defineHex,
  Grid,
  spiral,
} from "honeycomb-grid";


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

export function generateBoard(
  rng: RNG,
  settings: BoardSettings = DEFAULT_SETTINGS
): Board {

  const grid = createHexagonGrid();

  let tiles: Tile[] = [];
  let valid = false;

  while (!valid) {
    const resources = shuffle(RESOURCE_DISTRIBUTION, rng);
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
        neighbors: [],
      };

    });

    computeNeighbors(tiles);

    valid =
      validateAdjacency(tiles, settings.adjacencyRule) &&
      (
        settings.resourceBalance === "random" ||
        validateResourceBalance(tiles)
      );
  }

  return { tiles };
}
