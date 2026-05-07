/**
 * GLITCH.FRAG — Digital Glitch Distortion Effect
 * Horizontal line displacement, RGB splitting, block corruption,
 * and noise injection. Intensity parameter drives animation.
 */

precision highp float;

uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uIntensity;      // 0.0 = none, 1.0 = maximum
uniform vec2 uResolution;

varying vec2 vUv;

/* ── Inline noise ────────────────────────────────────────────── */
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float hash2D(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float intensity = uIntensity;
  vec2 uv = vUv;

  // Skip all effects when intensity is near zero
  if (intensity < 0.001) {
    gl_FragColor = texture2D(tDiffuse, uv);
    return;
  }

  // Horizontal line displacement
  float lineJitter = hash(floor(uv.y * 80.0) + floor(uTime * 15.0));
  if (lineJitter > (1.0 - intensity * 0.3)) {
    uv.x += (hash(uv.y * 100.0 + uTime) - 0.5) * intensity * 0.1;
  }

  // Block corruption — large rectangular glitch blocks
  vec2 blockCoord = floor(uv * vec2(8.0, 6.0));
  float blockNoise = hash2D(blockCoord + floor(uTime * 4.0));
  if (blockNoise > (1.0 - intensity * 0.15)) {
    uv.x += (blockNoise - 0.5) * intensity * 0.15;
    uv.y += (hash(blockNoise * 100.0) - 0.5) * intensity * 0.05;
  }

  // RGB channel splitting (chromatic aberration on steroids)
  float rgbOffset = intensity * 0.015;
  float r = texture2D(tDiffuse, uv + vec2(rgbOffset, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2(rgbOffset, 0.0)).b;
  vec4 color = vec4(r, g, b, 1.0);

  // Horizontal tear lines
  float tear = step(0.99 - intensity * 0.04, hash(floor(uv.y * 200.0) + uTime * 7.0));
  color.rgb = mix(color.rgb, vec3(1.0), tear * 0.5);

  // Noise injection
  float noise = hash2D(uv * 1000.0 + uTime * 50.0);
  color.rgb = mix(color.rgb, vec3(noise), intensity * 0.08);

  // Color corruption (random channel boost)
  float corrupt = hash(floor(uTime * 20.0));
  if (corrupt > (1.0 - intensity * 0.1)) {
    int channel = int(mod(floor(uTime * 30.0), 3.0));
    if (channel == 0) color.r *= 1.5;
    else if (channel == 1) color.g *= 1.5;
    else color.b *= 1.5;
  }

  gl_FragColor = color;
}
