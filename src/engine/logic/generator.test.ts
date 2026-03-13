import { generateBoard } from "./generator";
import { MathRandomRNG } from "../utils/rng";

describe("generateBoard", () => {
  it("should generate 19 tiles", () => {
    const board = generateBoard(new MathRandomRNG());

    expect(board.tiles.length).toBe(19);
  });

  it("should have exactly one desert", () => {
    const board = generateBoard(new MathRandomRNG());

    const deserts = board.tiles.filter(
      (t) => t.resource === "desert"
    );
    expect(deserts.length).toBe(1);
  });

  it("should not have adjacent 6 and 8 tiles", () => {
    const board = generateBoard(new MathRandomRNG());

    const highValueTiles = board.tiles.filter(
      (t) => t.number === 6 || t.number === 8
    );

    for (const tile of highValueTiles) {
      const neighbors = tile.neighbors
        .map((id) => board.tiles.find((t) => t.id === id))
        .filter(Boolean);

      for (const neighbor of neighbors) {
        expect(neighbor!.number === 6 || neighbor!.number === 8).toBe(false);
      }
    }
  });
});
