import { Tile } from "@/engine/types";
import { axialToPixel, getHexCorners } from "@/engine/geometry";

type Props = {
  tile: Tile;
};

const resourceColors: Record<string, string> = {
  wood: "#4CAF50",
  brick: "#D84315",
  sheep: "#AED581",
  wheat: "#FDD835",
  ore: "#757575",
  desert: "#E0C68C",
};

export default function HexTile({ tile }: Props) {
  const center = axialToPixel(tile.q, tile.r);
  const corners = getHexCorners(center);

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
          fontSize="20"
          fontWeight="bold"
        >
          {tile.number}
        </text>
      )}
    </>
  );
}
