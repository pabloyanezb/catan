import { Tile } from "../config/types";
import { validateAdjacency, validateHighValueZones, validateResourceBalance } from "./validators";

function makeTile(id: string, overrides: Partial<Tile> = {}): Tile {
  return {
    id,
    q: 0, r: 0,
    resource: "wood",
    number: undefined,
    neighbors: [],
    ...overrides,
  };
}

function link(a: Tile, b: Tile) {
  a.neighbors.push(b.id);
  b.neighbors.push(a.id);
}

describe("validateAdjacency", () => {

  it("acepta tiles sin números", () => {
    const a = makeTile("a");
    const b = makeTile("b");
    link(a, b);
    expect(validateAdjacency([a, b])).toBe(true);
  });

  it("acepta números distintos no prohibidos", () => {
    const a = makeTile("a", { number: 5 });
    const b = makeTile("b", { number: 9 });
    link(a, b);
    expect(validateAdjacency([a, b])).toBe(true);
  });

  it("rechaza números iguales adyacentes", () => {
    const a = makeTile("a", { number: 4 });
    const b = makeTile("b", { number: 4 });
    link(a, b);
    expect(validateAdjacency([a, b])).toBe(false);
  });

  it("rechaza 6 adyacente a 8", () => {
    const a = makeTile("a", { number: 6 });
    const b = makeTile("b", { number: 8 });
    link(a, b);
    expect(validateAdjacency([a, b])).toBe(false);
  });

  it("rechaza 8 adyacente a 6", () => {
    const a = makeTile("a", { number: 8 });
    const b = makeTile("b", { number: 6 });
    link(a, b);
    expect(validateAdjacency([a, b])).toBe(false);
  });

  it("acepta 6 y 8 sin adyacencia directa", () => {
    const a = makeTile("a", { number: 6 });
    const b = makeTile("b", { number: 5 });
    const c = makeTile("c", { number: 8 });
    link(a, b);
    link(b, c);
    expect(validateAdjacency([a, b, c])).toBe(true);
  });

  it("ignora tiles sin número (desierto)", () => {
    const a = makeTile("a", { number: 6 });
    const b = makeTile("b", { resource: "desert" });
    const c = makeTile("c", { number: 8 });
    link(a, b);
    link(b, c);
    expect(validateAdjacency([a, b, c])).toBe(true);
  });
});

describe("validateHighValueZones", () => {

  it("acepta tiles 6/8 sin vecinos compartidos", () => {
    const a = makeTile("a", { number: 6 });
    const b = makeTile("b", { number: 8 });
    const n1 = makeTile("n1");
    const n2 = makeTile("n2");
    link(a, n1);
    link(b, n2);
    expect(validateHighValueZones([a, b, n1, n2])).toBe(true);
  });

  it("acepta tiles 6/8 que comparten exactamente un vecino", () => {
    const a = makeTile("a", { number: 6 });
    const b = makeTile("b", { number: 8 });
    const shared = makeTile("shared");
    link(a, shared);
    link(b, shared);
    expect(validateHighValueZones([a, b, shared])).toBe(true);
  });

  it("rechaza tiles 6/8 que comparten 2 vecinos", () => {
    const a = makeTile("a", { number: 6 });
    const b = makeTile("b", { number: 8 });
    const s1 = makeTile("s1");
    const s2 = makeTile("s2");
    link(a, s1); link(b, s1);
    link(a, s2); link(b, s2);
    expect(validateHighValueZones([a, b, s1, s2])).toBe(false);
  });

  it("acepta board sin tiles 6/8", () => {
    const a = makeTile("a", { number: 4 });
    const b = makeTile("b", { number: 5 });
    link(a, b);
    expect(validateHighValueZones([a, b])).toBe(true);
  });

  it("acepta un único tile 6 sin pares", () => {
    const a = makeTile("a", { number: 6 });
    const b = makeTile("b", { number: 5 });
    link(a, b);
    expect(validateHighValueZones([a, b])).toBe(true);
  });
});

describe("validateResourceBalance", () => {

  it("acepta tiles sin vecinos del mismo recurso", () => {
    const a = makeTile("a", { resource: "wood" });
    const b = makeTile("b", { resource: "brick" });
    const c = makeTile("c", { resource: "sheep" });
    link(a, b);
    link(b, c);
    expect(validateResourceBalance([a, b, c])).toBe(true);
  });

  it("acepta un tile con un solo vecino del mismo recurso", () => {
    const a = makeTile("a", { resource: "wood" });
    const b = makeTile("b", { resource: "wood" });
    const c = makeTile("c", { resource: "brick" });
    link(a, b);
    link(a, c);
    expect(validateResourceBalance([a, b, c])).toBe(true);
  });

  it("rechaza un tile con 2 vecinos del mismo recurso", () => {
    const a = makeTile("a", { resource: "wood" });
    const b = makeTile("b", { resource: "wood" });
    const c = makeTile("c", { resource: "wood" });
    link(a, b);
    link(a, c);
    expect(validateResourceBalance([a, b, c])).toBe(false);
  });

  it("no confunde recursos distintos", () => {
    const a = makeTile("a", { resource: "wood" });
    const b = makeTile("b", { resource: "brick" });
    const c = makeTile("c", { resource: "brick" });
    link(a, b);
    link(a, c);
    expect(validateResourceBalance([a, b, c])).toBe(true);
  });
});
