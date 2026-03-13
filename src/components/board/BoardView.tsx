import { Board } from "@/engine/config/types";
import HexTile from "./HexTile";

type Props = {
  board: Board;
};

export default function BoardView({ board }: Props) {
  return (
    <svg
      viewBox="-250 -250 500 500"
      width="100%"
      height="600"
    >
      {board.tiles.map((tile) => (
        <HexTile key={tile.id} tile={tile} />
      ))}
    </svg>
  );
}
