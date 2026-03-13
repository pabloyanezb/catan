export type Point = {
  x: number;
  y: number;
};

const HEX_SIZE = 50;

export function axialToPixel(q: number, r: number): Point {
  const x = HEX_SIZE * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = HEX_SIZE * ((3 / 2) * r);

  return { x, y };
}

export function getHexCorners(
  center: Point,
  size: number = HEX_SIZE
): Point[] {
  const corners: Point[] = [];

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    corners.push({
      x: center.x + size * Math.cos(angle),
      y: center.y + size * Math.sin(angle),
    });
  }

  return corners;
}