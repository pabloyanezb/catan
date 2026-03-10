import { Tile, AdjacencyRule } from "./types";
import { buildTileMap } from "./utils";

const PROBABILITY: Record<number, number> = {
  2: 1, 3: 2, 4: 3, 5: 4,
  6: 5, 8: 5, 9: 4, 10: 3,
  11: 2, 12: 1,
};

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
  // Relaxed y strict: 6/8 no pueden estar juntos entre sí ni consigo mismos
  if ((a === 6 || a === 8) && (b === 6 || b === 8)) {
    return true;
  }

  if (rule === "strict") {
    // Prohibir cualquier par cuya probabilidad combinada supere un umbral
    const combined = (PROBABILITY[a] ?? 0) + (PROBABILITY[b] ?? 0);
    return combined >= 9;
  }

  return false;
}

// Calcula los vértices del tablero.
// Cada vértice es la intersección de exactamente 3 tiles.
function computeVertices(tiles: Tile[]): string[][] {
  const tileSet = new Set(tiles.map(t => t.id));
  const seen = new Set<string>();
  const vertices: string[][] = [];

  for (const tile of tiles) {
    const { q, r } = tile;

    const candidates: [string, string, string][] = [
      // tipo A
      [`${q},${r}`, `${q+1},${r-1}`, `${q+1},${r}`],
      // tipo B
      [`${q},${r}`, `${q-1},${r+1}`, `${q-1},${r}`],
    ];

    for (const group of candidates) {
      const key = [...group].sort().join("|");
      if (seen.has(key)) continue;

      // Solo vértices donde los 3 tiles existen en el tablero
      if (group.every(id => tileSet.has(id))) {
        seen.add(key);
        vertices.push(group);
      }
    }
  }

  return vertices;
}

export function validateNodeScore(
  tiles: Tile[],
  maxScore: number = 15
): boolean {
  const tileMap = buildTileMap(tiles);
  const vertices = computeVertices(tiles);

  for (const vertex of vertices) {
    const score = vertex.reduce((sum, id) => {
      const t = tileMap.get(id);
      return sum + (PROBABILITY[t?.number ?? 0] ?? 0);
    }, 0);

    if (score > maxScore) return false;
  }

  return true;
}

/**
 * Evita clusters de 2+ recursos iguales conectados.
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

    if (sameNeighbors.length >= 2) return false;
  }

  return true;
}

export function isValidNumberPlacement(
  tiles: Tile[],
  index: number,
  number: number,
  rule: AdjacencyRule
): boolean {
  const tile = tiles[index];
  const tileMap = buildTileMap(tiles);

  for (const neighborId of tile.neighbors) {
    const neighbor = tileMap.get(neighborId);
    if (!neighbor?.number) continue;

    if (isForbiddenPair(number, neighbor.number, rule)) return false;
  }

  return true;
}
