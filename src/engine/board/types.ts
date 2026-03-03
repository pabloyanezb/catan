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
}

export interface Board {
  tiles: Tile[];
}
