import { Tile } from "@/engine/config/types";
import { axialToPixel, getHexCorners } from "@/engine/utils/geometry";

type Props = {
  tile: Tile;
};

const RESOURCE_COLORS: Record<string, string> = {
  wood:    'var(--color-catan-wood)',
  brick:   'var(--color-catan-brick)',
  sheep:   'var(--color-catan-sheep)',
  wheat:   'var(--color-catan-wheat)',
  ore:     'var(--color-catan-ore)',
  desert:  'var(--color-catan-sand)',
};

// Número de combinaciones de dados que producen cada número
const PIPS_BY_NUMBER: Record<number, number> = {
  2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
  8: 5, 9: 4, 10: 3, 11: 2, 12: 1,
};

export default function HexTile({ tile }: Props) {
  const center  = axialToPixel(tile.q, tile.r);
  const corners = getHexCorners(center);
  const points  = corners.map(p => `${p.x},${p.y}`).join(' ');

  const pips      = tile.number ? PIPS_BY_NUMBER[tile.number] : 0;
  const fontSize  = 18 + pips * 2;

  const textColor = pips >= 5 ? 'var(--color-catan-high-number)' : 'var(--color-catan-text-dark)';

  return (
    <>
      <polygon
        points={points}
        fill={RESOURCE_COLORS[tile.resource]}
      />
      {tile.number && (
        <text
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill={textColor}
        >
          {tile.number}
        </text>
      )}
    </>
  );
}
