import { Tile } from "./types";

/**
 * Construye un mapa rápido id -> tile
 * para acceder a tiles sin recorrer el array.
 */
export function buildTileMap(tiles: Tile[]): Map<string, Tile> {
  return new Map(
    tiles.map(tile => [tile.id, tile])
  );
}
