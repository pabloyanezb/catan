import { Tile } from "../config/types";
import { buildTileMap } from "../utils/utils";

/**
 * Verifica que ningún tile tenga números idénticos o combinaciones
 * prohibidas (6/8) entre sus vecinos directos.
 */
export function validateAdjacency(tiles: Tile[]): boolean {
  const tileMap = buildTileMap(tiles);

  for (const tile of tiles) {
    if (!tile.number) continue;

    for (const neighborId of tile.neighbors) {
      const neighbor = tileMap.get(neighborId);
      if (!neighbor || !neighbor.number) continue;

      if (isForbiddenPair(tile.number, neighbor.number)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Define los pares de números que no pueden ser adyacentes.
 */
function isForbiddenPair(a: number, b: number): boolean {
  // Ningún número puede estar junto a sí mismo
  if (a === b) return true;

  // 6/8 no pueden estar juntos entre sí
  if ((a === 6 || a === 8) && (b === 6 || b === 8)) return true;

  return false;
}

/**
 * Verifica que ningún par de tiles 6/8 comparta más de un vecino.
 * Dos tiles que comparten 2+ vecinos forman un cluster demasiado denso.
 */
export function validateHighValueZones(tiles: Tile[]): boolean {
  const highTiles = tiles.filter(t => t.number === 6 || t.number === 8);

  for (let i = 0; i < highTiles.length; i++) {
    for (let j = i + 1; j < highTiles.length; j++) {
      const setA = new Set(highTiles[i].neighbors);
      const shared = highTiles[j].neighbors.filter(id => setA.has(id));

      if (shared.length > 1) return false;
    }
  }

  return true;
}

/**
 * Evita clusters de 3+ recursos iguales conectados.
 * Ningún tile puede tener 2 o más vecinos con el mismo recurso.
 */
export function validateResourceBalance(tiles: Tile[]): boolean {
  const tileMap = buildTileMap(tiles);

  for (const tile of tiles) {
    const sameNeighbors = tile.neighbors.filter(id => {
      const neighbor = tileMap.get(id);
      return neighbor?.resource === tile.resource;
    });

    if (sameNeighbors.length >= 2) return false;
  }

  return true;
}
