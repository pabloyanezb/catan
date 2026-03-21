import { generateBoard } from './generator';
import { FRAME_PIECES, FRAME_SIDES } from '../config/constants';
import { MathRandomRNG } from '../utils/rng';
import { BoardSettings } from '../config/types';

const FIXED_SETTINGS: BoardSettings = {
  numberPlacement: 'standard',
  resourceBalance: 'balanced',
  portLayout: 'fixed',
};

const RANDOM_SETTINGS: BoardSettings = {
  numberPlacement: 'standard',
  resourceBalance: 'balanced',
  portLayout: 'random',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBoard(settings: BoardSettings) {
  return generateBoard(new MathRandomRNG(), settings);
}

// ─── Invariantes compartidas ──────────────────────────────────────────────────

describe('ports — invariantes', () => {
  it.each(['fixed', 'random'] as const)('genera exactamente 9 puertos (%s)', (layout) => {
    const board = getBoard({ ...FIXED_SETTINGS, portLayout: layout });
    expect(board.ports.length).toBe(9);
  });

  it.each(['fixed', 'random'] as const)('tiene exactamente 4 puertos generic 3:1 (%s)', (layout) => {
    const board = getBoard({ ...FIXED_SETTINGS, portLayout: layout });
    const generics = board.ports.filter(p => p.resource === 'generic');
    expect(generics.length).toBe(4);
  });

  it.each(['fixed', 'random'] as const)('tiene exactamente 5 puertos específicos 2:1 (%s)', (layout) => {
    const board = getBoard({ ...FIXED_SETTINGS, portLayout: layout });
    const specific = board.ports.filter(p => p.resource !== 'generic');
    expect(specific.length).toBe(5);
  });

  it.each(['fixed', 'random'] as const)('cada recurso específico aparece exactamente una vez (%s)', (layout) => {
    const board = getBoard({ ...FIXED_SETTINGS, portLayout: layout });
    const specific = board.ports.filter(p => p.resource !== 'generic');
    const resources = specific.map(p => p.resource).sort();
    expect(resources).toEqual(['brick', 'ore', 'sheep', 'wheat', 'wood']);
  });

  it.each(['fixed', 'random'] as const)('todos los ratios son correctos (%s)', (layout) => {
    const board = getBoard({ ...FIXED_SETTINGS, portLayout: layout });
    for (const port of board.ports) {
      if (port.resource === 'generic') expect(port.ratio).toBe('3:1');
      else expect(port.ratio).toBe('2:1');
    }
  });

  it.each(['fixed', 'random'] as const)('todas las directions son válidas (0-5) (%s)', (layout) => {
    const board = getBoard({ ...FIXED_SETTINGS, portLayout: layout });
    for (const port of board.ports) {
      expect(port.direction).toBeGreaterThanOrEqual(0);
      expect(port.direction).toBeLessThanOrEqual(5);
    }
  });

  it.each(['fixed', 'random'] as const)('no hay puertos duplicados en el mismo tile+direction (%s)', (layout) => {
    const board = getBoard({ ...FIXED_SETTINGS, portLayout: layout });
    const keys = board.ports.map(p => `${p.tile}:${p.direction}`);
    const unique = new Set(keys);
    expect(unique.size).toBe(board.ports.length);
  });
});

// ─── Fixed ────────────────────────────────────────────────────────────────────

describe('generatePortsFixed', () => {
  it('produce configuraciones distintas en distintas generaciones', () => {
    // Con seeds distintas puede haber distintas rotaciones (0, 2 o 4 pasos)
    const configs = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const board = getBoard(FIXED_SETTINGS);
      const key = board.ports.map(p => `${p.tile}:${p.direction}`).join('|');
      configs.add(key);
    }
    // Debería haber más de 1 configuración distinta
    expect(configs.size).toBeGreaterThan(1);
  });

  it('preserva la alternancia solo/doble del frame físico', () => {
    const board = getBoard(FIXED_SETTINGS);
    // Los lados solos tienen 1 puerto, los dobles 2
    // El frame tiene 3 solos y 3 dobles → 3×1 + 3×2 = 9
    const singleCount = FRAME_SIDES.filter(s => s.length === 1).length;
    const doubleCount = FRAME_SIDES.filter(s => s.length === 2).length;
    expect(singleCount).toBe(3);
    expect(doubleCount).toBe(3);
    expect(board.ports.length).toBe(singleCount + doubleCount * 2);
  });
});

// ─── Random ───────────────────────────────────────────────────────────────────

describe('generatePortsRandom', () => {
  it('produce configuraciones distintas de recursos entre generaciones', () => {
    const configs = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const board = getBoard(RANDOM_SETTINGS);
      // Key por recurso+tile para detectar si los recursos se mueven
      const key = board.ports.map(p => `${p.resource}:${p.tile}`).sort().join('|');
      configs.add(key);
    }
    expect(configs.size).toBeGreaterThan(1);
  });

  it('produce posiciones distintas entre generaciones', () => {
    const positions = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const board = getBoard(RANDOM_SETTINGS);
      const key = board.ports.map(p => `${p.tile}:${p.direction}`).sort().join('|');
      positions.add(key);
    }
    expect(positions.size).toBeGreaterThan(1);
  });
});

// ─── FRAME_PIECES + FRAME_SIDES ───────────────────────────────────────────────

describe('FRAME_PIECES y FRAME_SIDES', () => {
  it('tienen la misma longitud', () => {
    expect(FRAME_PIECES.length).toBe(FRAME_SIDES.length);
  });

  it('cada pieza tiene el mismo número de recursos que slots en su lado', () => {
    for (let i = 0; i < FRAME_PIECES.length; i++) {
      expect(FRAME_PIECES[i].length).toBe(FRAME_SIDES[i].length);
    }
  });

  it('alternan correctamente solo/doble', () => {
    const sizes = FRAME_PIECES.map(p => p.length);
    expect(sizes).toEqual([1, 2, 1, 2, 1, 2]);
  });

  it('todos los tiles de los slots existen en el tablero estándar', () => {
    // Tiles válidos del tablero estándar (radio 2)
    const validTiles = new Set([
      '0,0',
      '1,0', '-1,0', '0,1', '0,-1', '1,-1', '-1,1',
      '2,0', '-2,0', '0,2', '0,-2', '2,-2', '-2,2',
      '1,1', '-1,-1', '2,-1', '-2,1', '1,-2', '-1,2',
    ]);
    for (const side of FRAME_SIDES) {
      for (const slot of side) {
        expect(validTiles.has(slot.tile)).toBe(true);
      }
    }
  });
});
