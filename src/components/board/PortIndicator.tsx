import { Port } from '@/engine/config/types';
import { axialToPixel, getHexCorners } from '@/engine/utils/geometry';

const HEX_SIZE = 50;

// Posición del label relativa al punto medio de la arista
const PORT_LABEL_OFFSET = HEX_SIZE * 0.32;
const PORT_DOT_R        = HEX_SIZE * 0.08;
const PORT_LABEL_W      = HEX_SIZE * 0.6;
const PORT_LABEL_H      = HEX_SIZE * 0.4;
const PORT_LABEL_FONT   = PORT_LABEL_H * 0.6;

const PORT_COLORS: Record<string, string> = {
  wood:    'var(--color-catan-wood)',
  brick:   'var(--color-catan-brick)',
  sheep:   'var(--color-catan-sheep)',
  wheat:   'var(--color-catan-wheat)',
  ore:     'var(--color-catan-ore)',
  generic: 'var(--color-catan-parchment)',
};

export default function PortIndicator({ port }: { port: Port }) {
  const [q, r] = port.tile.split(',').map(Number);
  const center  = axialToPixel(q, r);
  const corners = getHexCorners(center);

  // Los dos vértices que definen la arista del puerto
  const v1 = corners[port.direction];
  const v2 = corners[(port.direction + 1) % 6];
  const ex = (v1.x + v2.x) / 2;
  const ey = (v1.y + v2.y) / 2;

  const edgeRad = Math.atan2(v2.y - v1.y, v2.x - v1.x);
  const perpRad = edgeRad - Math.PI / 2;
  const dot     = Math.cos(perpRad) * (ex - center.x) + Math.sin(perpRad) * (ey - center.y);
  const outRad  = dot >= 0 ? perpRad : perpRad + Math.PI;

  // Alinear label con la arista, invertir texto si queda boca abajo
  let edgeDeg = edgeRad * (180 / Math.PI);
  if (edgeDeg > 90 || edgeDeg < -90) edgeDeg += 180;

  const lx = ex + Math.cos(outRad) * PORT_LABEL_OFFSET;
  const ly = ey + Math.sin(outRad) * PORT_LABEL_OFFSET;

  return (
    <g>
      {/* Vértices */}
      <circle
        cx={v1.x}
        cy={v1.y}
        r={PORT_DOT_R}
      />
      <circle
        cx={v2.x}
        cy={v2.y}
        r={PORT_DOT_R}
      />

      {/* Label de ratio, rotado según el ángulo de la arista */}
      <g transform={`rotate(${edgeDeg}, ${lx}, ${ly})`}>
        <rect
          x={lx - PORT_LABEL_W / 2} y={ly - PORT_LABEL_H / 2}
          width={PORT_LABEL_W} height={PORT_LABEL_H}
          fill={PORT_COLORS[port.resource]}
          stroke="var(--color-catan-bg)"
          strokeWidth={1.4}
        />
        <text
          x={lx} y={ly}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={PORT_LABEL_FONT} fontWeight="700"
          fill="var(--color-catan-bg)" fontFamily="sans-serif"
        >
          {port.resource === 'generic' ? '3:1' : '2:1'}
        </text>
      </g>
    </g>
  );
}
