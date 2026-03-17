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
 * Las 6 piezas físicas del frame (anticlockwise desde arriba).
 * El orden dentro de cada array corresponde al orden de los slots en FRAME_SIDES.
 * Las piezas alternan solo/doble — nunca se puede asignar una pieza doble
 * a un lado solo ni viceversa.
 */
export const FRAME_PIECES: PortResource[][] = [
  ['wood'],                  // Pieza 1 — solo
  ['brick', 'generic'],      // Pieza 2 — doble
  ['generic'],               // Pieza 3 — solo
  ['sheep', 'generic'],      // Pieza 4 — doble
  ['ore'],                   // Pieza 5 — solo
  ['wheat', 'generic'],      // Pieza 6 — doble
];

/**
 * Los 6 lados del hexágono grande (anticlockwise desde arriba).
 * Cada lado tiene 1 o 2 PortSlots que coinciden 1:1 con los ports de FRAME_PIECES.
 */
export const FRAME_SIDES: PortSlot[][] = [
  // Lado 1 (top)
  [
    { tile: '1,-2',  direction: 4 }
  ],
  // Lado 2 (upper-left)
  [
    { tile: '-1,-1', direction: 4 },
    { tile: '-2,0',  direction: 3 },
  ],
  // Lado 3 (lower-left)
  [
    { tile: '-2,1',  direction: 2 }
  ],
  // Lado 4 (bottom)
  [
    { tile: '-1,2',  direction: 2 },
    { tile: '0,2',   direction: 1 },
  ],
  // Lado 5 (lower-right)
  [
    { tile: '1,1',   direction: 0 }
  ],
  // Lado 6 (upper-right)
  [
    { tile: '2,-1',  direction: 0 },
    { tile: '2,-2',  direction: 5 },
  ],
];

