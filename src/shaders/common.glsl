/**
 * ═══════════════════════════════════════════════════════════════
 * COMMON.GLSL — Shared GLSL Utilities
 * ═══════════════════════════════════════════════════════════════
 *
 * Noise functions, hash functions, UV manipulation, and animation
 * helpers shared across all fragment shaders.
 */

/* ── Pseudo-random hash ──────────────────────────────────────── */
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float hash2D(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

/* ── Simplex-like noise 2D ───────────────────────────────────── */
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f); // Hermite interpolation

  float a = hash2D(i);
  float b = hash2D(i + vec2(1.0, 0.0));
  float c = hash2D(i + vec2(0.0, 1.0));
  float d = hash2D(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* ── Fractional Brownian Motion ──────────────────────────────── */
float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

/* ── Smoothstep variants ─────────────────────────────────────── */
float smoothPulse(float edge0, float edge1, float x) {
  return smoothstep(edge0, (edge0 + edge1) * 0.5, x) *
         (1.0 - smoothstep((edge0 + edge1) * 0.5, edge1, x));
}

/* ── UV distortion ───────────────────────────────────────────── */
vec2 barrelDistortion(vec2 uv, float strength) {
  vec2 cc = uv - 0.5;
  float dist = dot(cc, cc);
  return uv + cc * dist * strength;
}

/* ── Scanline ────────────────────────────────────────────────── */
float scanline(vec2 uv, float count, float intensity) {
  return 1.0 - intensity * abs(sin(uv.y * count * 3.14159));
}
