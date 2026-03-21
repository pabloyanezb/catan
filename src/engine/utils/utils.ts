import { Tile } from "../config/types";
import { RNG } from "./rng";

/**
 * Shufflea un array. No muta el array original.
 */
export function shuffle<T>(array: T[], rng: RNG): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Construye un mapa rápido id -> tile
 * para acceder a tiles sin recorrer el array.
 */
export function buildTileMap(tiles: Tile[]): Map<string, Tile> {
  return new Map(
    tiles.map(tile => [tile.id, tile])
  );
}

export function computeNeighbors(tiles: Tile[]) {
  const tileMap = buildTileMap(tiles);

  // Los 6 vecinos en coordenadas axiales
  const AXIAL_DIRECTIONS = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  for (const tile of tiles) {
    tile.neighbors = [];

    for (const dir of AXIAL_DIRECTIONS) {
      const neighborId = `${tile.q + dir.q},${tile.r + dir.r}`;
      if (tileMap.has(neighborId)) {
        tile.neighbors.push(neighborId);
      }
    }
  }
}
