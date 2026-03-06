export type Resource =
  | 'wood'
  | 'brick'
  | 'sheep'
  | 'wheat'
  | 'ore'
  | 'desert';

export interface Tile {
  id: string;
  q: number;
  r: number;
  resource: Resource;
  number?: number;
  neighbors: string[];
}

export interface Board {
  tiles: Tile[];
}

export type AdjacencyRule = 'standard' | 'extended';

export type ResourceBalanceMode = 'random' | 'balanced';

export interface BoardSettings {
  adjacencyRule: AdjacencyRule;
  resourceBalance: ResourceBalanceMode;
}
