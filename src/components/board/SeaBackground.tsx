
import { SeaTile } from '@/engine/config/types';
import { axialToPixel, getHexCorners } from '@/engine/utils/geometry';

const HEX_SIZE = 50;

// Hexágono de mar individual — mismo tamaño que los tiles del tablero
function SeaHex({ q, r }: SeaTile) {
  const center  = axialToPixel(q, r);
  const corners = getHexCorners(center, HEX_SIZE);
  const points  = corners.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <polygon
      points={points}
      fill="var(--color-catan-sea)"
    />
  );
}

export default function SeaBackground({ tiles }: { tiles: SeaTile[] }) {
  return (
    <>
      {tiles.map(t => (
        <SeaHex
          key={`${t.q},${t.r}`}
          q={t.q}
          r={t.r} />
      ))}
    </>
  );
}
