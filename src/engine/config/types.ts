export type Resource =
  | 'wood'
  | 'brick'
  | 'sheep'
  | 'wheat'
  | 'ore'
  | 'desert';

export type PortResource = Exclude<Resource, 'desert'> | 'generic';

export type NumberPlacementMode = 'standard' | 'random';
export type ResourceBalanceMode = 'balanced' | 'random';
export type PortLayoutMode = 'fixed' | 'random';

export interface Tile {
  id: string; // "q,r"
  q: number;
  r: number;
  resource: Resource;
  number?: number;
  neighbors: string[]; // ids of adjacent tiles
}

export interface PortSlot {
  tile: string;
  direction: 0 | 1 | 2 | 3 | 4 | 5;
}
 
export interface Port {
  resource: PortResource;
  ratio: '2:1' | '3:1';
  tile: string;
  direction: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface SeaTile {
  q: number;
  r: number;
}
 
export interface Board {
  seaTiles: SeaTile[];
  tiles: Tile[];
  ports: Port[];
}
 
export interface BoardSettings {
  numberPlacement: NumberPlacementMode;
  resourceBalance: ResourceBalanceMode;
  portLayout: PortLayoutMode;
}
