import { Tile } from "@/engine/types";
import { axialToPixel, getHexCorners } from "@/engine/geometry";

type Props = {
  tile: Tile;
};

const resourceColors: Record<string, string> = {
  wood: "#8DC68D",
  brick: "#E1957C",
  sheep: "#CEE8A0",
  wheat: "#F3D97F",
  ore: "#A9A9B8",
  desert: "#E4CEA3",
};

export default function HexTile({ tile }: Props) {
  const center = axialToPixel(tile.q, tile.r);
  const corners = getHexCorners(center);
  const probabilityByNumber: Record<number, number> = {
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    8: 5,
    9: 4,
    10: 3,
    11: 2,
    12: 1,
  };
  const numberProbability = tile.number ? probabilityByNumber[tile.number] : 0;
  const numberFontSize = 18 + numberProbability * 2;
  const numberColor = numberProbability >= 5 ? "#9F1D1D" : "#1F2937";

  const points = corners.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <>
      <polygon
        points={points}
        fill={resourceColors[tile.resource]}
        stroke="#333"
        strokeWidth={2}
      />
      {tile.number && (
        <text
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={numberFontSize}
          fontWeight='700'
          fill={numberColor}
        >
          {tile.number}
        </text>
      )}
    </>
  );
}
