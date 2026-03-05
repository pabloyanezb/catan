export interface RNG {
  next(): number; // 0–1
}

export class MathRandomRNG implements RNG {
  next(): number {
    return Math.random();
  }
}
