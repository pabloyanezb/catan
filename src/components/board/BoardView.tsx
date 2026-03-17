'use client';

import { Board } from '@/engine/config/types';
import { axialToPixel } from '@/engine/utils/geometry';
import HexTile from './HexTile';
import SeaBackground from './SeaBackground';
import PortIndicator from './PortIndicator';

const HEX_SIZE = 50;
const PADDING  = HEX_SIZE * 2;

export default function BoardView({ board }: { board: Board }) {
  const positions = board.tiles.map(t => axialToPixel(t.q, t.r));
  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);

  const minX = Math.min(...xs) - PADDING;
  const minY = Math.min(...ys) - PADDING;
  const maxX = Math.max(...xs) + PADDING;
  const maxY = Math.max(...ys) + PADDING;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className="w-full max-w-2xl mx-auto overflow-visible"
      style={{ maxHeight: '85vh' }}
    >
      <SeaBackground />
      {board.tiles.map((tile) =>
        <HexTile
          key={tile.id}
          tile={tile}
        />
      )}
      {board.ports.map((port, i) =>
        <PortIndicator
          key={i}
          port={port}
        />
      )}
    </svg>
  );
}
