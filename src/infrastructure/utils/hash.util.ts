/**
 * Hash Utils
 * @description Deterministic string hashing — the same seed always maps to
 * the same number, powering stable generated artwork variants
 */

export const hashSeed = (input: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
};
