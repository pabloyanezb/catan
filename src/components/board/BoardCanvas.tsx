'use client';

import { useEffect, useRef } from 'react';
import { Board } from '@/engine/config/types';
import { axialToPixel } from '@/engine/utils/geometry';

const HEX_SIZE   = 50;
const SEA_RADIUS = HEX_SIZE * 5.8;
const PADDING    = HEX_SIZE * 2;

// Resuelve una variable CSS en runtime
function cssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// Calcula el viewBox a partir de las posiciones de los tiles
function computeBounds(board: Board) {
  const positions = board.tiles.map(t => axialToPixel(t.q, t.r));
  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);
  return {
    minX: Math.min(...xs) - PADDING,
    minY: Math.min(...ys) - PADDING,
    maxX: Math.max(...xs) + PADDING,
    maxY: Math.max(...ys) + PADDING,
  };
}

// Dibuja el hexágono del mar
function drawSea(ctx: CanvasRenderingContext2D) {
  const { x, y } = axialToPixel(0, 0);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i);
    const px = x + SEA_RADIUS * Math.cos(a);
    const py = y + SEA_RADIUS * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = cssVar('--color-catan-sea');
  ctx.fill();
}

interface Props {
  board: Board;
}

export default function BoardCanvas({ board }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { minX, minY, maxX, maxY } = computeBounds(board);
    const w = maxX - minX;
    const h = maxY - minY;

    // Ajustar tamaño del canvas al contenido
    canvas.width  = w;
    canvas.height = h;

    // Trasladar origen para que (minX, minY) quede en (0, 0)
    ctx.setTransform(1, 0, 0, 1, -minX, -minY);

    ctx.clearRect(minX, minY, w, h);
    drawSea(ctx);
  }, [board]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-2xl mx-auto"
      style={{ maxHeight: '85vh' }}
    />
  );
}
