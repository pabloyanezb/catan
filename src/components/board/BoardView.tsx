'use client';

import { Board, Port } from '@/engine/config/types';
import { axialToPixel, getHexCorners } from '@/engine/utils/geometry';
import HexTile from './HexTile';

const HEX_SIZE = 50;
const SEA_RADIUS = HEX_SIZE * 5.8;

const PORT_COLORS: Record<string, string> = {
  wood:    'var(--color-catan-wood)',
  brick:   'var(--color-catan-brick)',
  sheep:   'var(--color-catan-sheep)',
  wheat:   'var(--color-catan-wheat)',
  ore:     'var(--color-catan-ore)',
  generic: 'var(--color-catan-parchment)',
};

function SeaBackground() {
  const origin = axialToPixel(0, 0);
  const corners = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return {
      x: origin.x + SEA_RADIUS * Math.cos(angle),
      y: origin.y + SEA_RADIUS * Math.sin(angle),
    };
  });
  const points = corners.map(c => `${c.x},${c.y}`).join(' ');
  return <polygon points={points} fill="var(--color-catan-sea)" />;
}

interface PortIndicatorProps {
  port: Port;
}

function PortIndicator({ port }: PortIndicatorProps) {
  const [q, r] = port.tile.split(',').map(Number);
  const center = axialToPixel(q, r);
  const corners = getHexCorners(center);

  const v1 = corners[port.direction];
  const v2 = corners[(port.direction + 1) % 6];

  const ex = (v1.x + v2.x) / 2;
  const ey = (v1.y + v2.y) / 2;

  // Perpendicular real a la arista — garantiza label siempre centrado
  const edgeRad = Math.atan2(v2.y - v1.y, v2.x - v1.x);
  const perpRad = edgeRad - Math.PI / 2;

  // Elegir la perpendicular que apunta away del centro del tile
  const dot = Math.cos(perpRad) * (ex - center.x) + Math.sin(perpRad) * (ey - center.y);
  const outRad = dot >= 0 ? perpRad : perpRad + Math.PI;

  // Ángulo para rotar el label — texto nunca boca abajo
  let edgeDeg = edgeRad * (180 / Math.PI);
  if (edgeDeg > 90 || edgeDeg < -90) edgeDeg += 180;

  const labelOffset = HEX_SIZE * 0.32;
  const lx = ex + Math.cos(outRad) * labelOffset;
  const ly = ey + Math.sin(outRad) * labelOffset;

  const color = PORT_COLORS[port.resource];
  const dotR = HEX_SIZE * 0.08;
  const labelW = HEX_SIZE * 0.6;
  const labelH = HEX_SIZE * 0.4;

  return (
    <g>
      {/* Arista */}
      <line
        x1={v1.x} y1={v1.y}
        x2={v2.x} y2={v2.y}
        strokeWidth={4.6}
        strokeLinecap="round"
      />

      {/* Vértices */}
      <circle cx={v1.x} cy={v1.y} r={dotR}/>
      <circle cx={v2.x} cy={v2.y} r={dotR}/>

      {/* Label rotado según la arista */}
      <g transform={`rotate(${edgeDeg}, ${lx}, ${ly})`}>
        <rect
          x={lx - labelW / 2}
          y={ly - labelH / 2}
          width={labelW}
          height={labelH}
          fill={color}
          stroke='#1C1A17'
          strokeWidth={1.4}
        />
        <text
          x={lx}
          y={ly}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={labelH * 0.6}
          fontWeight="700"
          fill="#1C1A17"
          fontFamily="sans-serif"
        >
          {port.resource === 'generic' ? '3:1' : '2:1'}
        </text>
      </g>
    </g>
  );
}

interface Props {
  board: Board;
}

export default function BoardView({ board }: Props) {
  const positions = board.tiles.map(t => axialToPixel(t.q, t.r));
  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);

  const padding = HEX_SIZE * 2;
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + padding;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className="w-full max-w-2xl mx-auto overflow-visible"
      style={{ maxHeight: '85vh' }}
    >
      <SeaBackground />
      {board.tiles.map(tile => (
        <HexTile key={tile.id} tile={tile} />
      ))}
      {board.ports.map((port, i) => (
        <PortIndicator key={i} port={port} />
      ))}
    </svg>
  );
}
