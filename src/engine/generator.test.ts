import { generateBoard } from "./generator";
import { MathRandomRNG } from "./rng";

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

    const sixEightTiles = board.tiles.filter(
      (t) => t.number === 6 || t.number === 8
    );

    for (const tile of sixEightTiles) {
      const neighbors = board.tiles.filter(
        (t) =>
          Math.abs(t.q - tile.q) <= 1 &&
          Math.abs(t.r - tile.r) <= 1 &&
          !(t.q === tile.q && t.r === tile.r)
      );

      for (const neighbor of neighbors) {
        expect(neighbor.number).not.toBe(6);
        expect(neighbor.number).not.toBe(8);
      }
    }
  });
});
