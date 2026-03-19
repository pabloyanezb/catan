import { PortResource, PortSlot } from '../config/types';

export const RESOURCE_DISTRIBUTION: import('../config/types').Resource[] = [
  'wood', 'wood', 'wood', 'wood',
  'brick', 'brick', 'brick',
  'sheep', 'sheep', 'sheep', 'sheep',
  'wheat', 'wheat', 'wheat', 'wheat',
  'ore', 'ore', 'ore',
  'desert',
];

export const NUMBER_DISTRIBUTION: number[] = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12,
];

/**
 * Los recursos de cada pieza física del frame (anticlockwise desde arriba).
 * Alternan solo/doble
 */
export const FRAME_PIECES: PortResource[][] = [
  ['wood'],
  ['brick', 'generic'],
  ['generic'],
  ['sheep', 'generic'],
  ['ore'],
  ['wheat', 'generic'],
];

/**
 * Las posiciones geométricas de cada lado (anticlockwise desde arriba).
 * Cada slot define tile + direction — dónde se dibuja el puerto en el SVG.
 * Alternan solo/doble en el mismo orden que FRAME_PIECES.
 */
export const FRAME_SIDES: PortSlot[][] = [
  // Lado 1 (top) — solo
  [{ tile: '1,-2',  direction: 4 }],
  // Lado 2 (upper-left) — doble
  [{ tile: '-1,-1', direction: 4 }, { tile: '-2,0', direction: 3 }],
  // Lado 3 (lower-left) — solo
  [{ tile: '-2,1',  direction: 2 }],
  // Lado 4 (bottom) — doble
  [{ tile: '-1,2',  direction: 2 }, { tile: '0,2',  direction: 1 }],
  // Lado 5 (lower-right) — solo
  [{ tile: '1,1',   direction: 0 }],
  // Lado 6 (upper-right) — doble
  [{ tile: '2,-1',  direction: 0 }, { tile: '2,-2', direction: 5 }],
];
