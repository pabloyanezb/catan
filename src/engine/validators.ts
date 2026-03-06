import { Tile, AdjacencyRule } from "./types";
import { buildTileMap } from "./utils";

/**
 * Valida reglas de adyacencia de números.
 */
export function validateAdjacency(
  tiles: Tile[],
  rule: AdjacencyRule
): boolean {

  const tileMap = buildTileMap(tiles);

  for (const tile of tiles) {
    if (!tile.number) continue;

    for (const neighborId of tile.neighbors) {

      const neighbor = tileMap.get(neighborId);
      if (!neighbor || !neighbor.number) continue;

      if (isForbiddenPair(tile.number, neighbor.number, rule)) {
        return false;
      }
    }
  }

  return true;
}

function isForbiddenPair(
  a: number,
  b: number,
  rule: AdjacencyRule
): boolean {

  // Regla oficial obligatoria
  if ((a === 6 && b === 8) || (a === 8 && b === 6)) {
    return true;
  }

  if (rule === "extended") {
    const extendedPairs = [
      [5,9],[9,5],
      [4,10],[10,4]
    ];

    return extendedPairs.some(
      ([x,y]) => x === a && y === b
    );
  }

  return false;
}

/**
 * Evita clusters de 3+ recursos iguales conectados.
 */
export function validateResourceBalance(
  tiles: Tile[]
): boolean {

  const tileMap = buildTileMap(tiles);

  for (const tile of tiles) {

    const sameNeighbors = tile.neighbors.filter(id => {
      const neighbor = tileMap.get(id);
      return neighbor?.resource === tile.resource;
    });

    if (sameNeighbors.length >= 2) {
      return false;
    }
  }

  return true;
}
