import { axialToPixel } from '@/engine/utils/geometry';

// Ligeramente más grande que el tablero para formar el marco del océano
const SEA_RADIUS = 50 * 5.8;

// Hexágono renderizado detrás del tablero
export default function SeaBackground() {
  const { x, y } = axialToPixel(0, 0);
  const points = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return `${x + SEA_RADIUS * Math.cos(a)},${y + SEA_RADIUS * Math.sin(a)}`;
  }).join(' ');
  return <polygon points={points} fill="var(--color-catan-sea)" />;
}
