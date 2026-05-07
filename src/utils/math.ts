/**
 * ═══════════════════════════════════════════════════════════════
 * MATH — Core Mathematical Utilities
 * ═══════════════════════════════════════════════════════════════
 */

/** Linear interpolation between a and b by t ∈ [0,1] */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Hermite smoothstep: 0 when x≤edge0, 1 when x≥edge1, smooth in between */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Remap value from one range to another */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

/** Sine-based pulse: returns 0→1→0 over period */
export function pulse(time: number, frequency: number = 1): number {
  return (Math.sin(time * frequency * Math.PI * 2) + 1) * 0.5;
}

/** Random float between min and max */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Random integer between min (inclusive) and max (exclusive) */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max));
}

/** 2D Simplex-like noise (fast hash-based approximation) */
export function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Fractional Brownian Motion (layered noise) */
export function fbm(x: number, y: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

/** Exponential decay */
export function expDecay(value: number, rate: number, dt: number): number {
  return value * Math.exp(-rate * dt);
}

/** Convert degrees to radians */
export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/** Ping-pong value between 0 and length */
export function pingPong(t: number, length: number): number {
  const mod = t % (length * 2);
  return length - Math.abs(mod - length);
}
