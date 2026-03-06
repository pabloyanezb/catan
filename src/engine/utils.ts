import { defineHex, Grid } from "honeycomb-grid";
import { Tile } from "./types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Hex = defineHex({ dimensions: 1 });
type GameHex = InstanceType<typeof Hex>;

/**
 * Construye un mapa rápido id -> tile
 * para acceder a tiles sin recorrer el array.
 */
export function buildTileMap(tiles: Tile[]): Map<string, Tile> {
  return new Map(
    tiles.map(tile => [tile.id, tile])
  );
}

export function computeNeighbors(
  tiles: Tile[],
  grid: Grid<GameHex>
) {
  const tileMap = new Map<string, Tile>(
    tiles.map((t) => [`${t.q},${t.r}`, t])
  );

  const directions = [0, 1, 2, 3, 4, 5] as const;

  for (const tile of tiles) {
    tile.neighbors = [];

    const hex = grid.getHex({ q: tile.q, r: tile.r });
    if (!hex) continue;

    for (const dir of directions) {
      const neighbor = grid.neighborOf(hex, dir);
      if (!neighbor) continue;

      const neighborTile = tileMap.get(
        `${neighbor.q},${neighbor.r}`
      );

      if (neighborTile) {
        tile.neighbors.push(neighborTile.id);
      }
    }
  }
}
