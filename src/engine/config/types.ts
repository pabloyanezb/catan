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
  tiles: [string] | [string, string]; // 1 tile si esquina, 2 si borde compartido
}
 
export interface Port {
  resource: PortResource;
  ratio: '2:1' | '3:1';
  tiles: [string] | [string, string];
}
 
export interface Board {
  tiles: Tile[];
  ports: Port[];
}
 
export interface BoardSettings {
  numberPlacement: NumberPlacementMode;
  resourceBalance: ResourceBalanceMode;
  portLayout: PortLayoutMode;
}
