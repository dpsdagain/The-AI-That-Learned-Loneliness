/**
 * CORRUPTION.FRAG — Data Corruption Transition Effect
 * Used for scene transitions — progressive pixel displacement,
 * color channel destruction, and noise takeover.
 */

precision highp float;

uniform sampler2D tDiffuse;
uniform float uProgress;      // 0.0 (clean) to 1.0 (fully corrupted)
uniform float uTime;
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
  float progress = uProgress;
  vec2 uv = vUv;

  // Phase 1 (0.0 - 0.3): Subtle displacement
  if (progress > 0.0) {
    float displaceAmount = progress * 0.05;
    float n = hash(floor(uv.y * 50.0) + uTime);
    if (n > 1.0 - progress * 0.5) {
      uv.x += (n - 0.5) * displaceAmount;
    }
  }

  // Phase 2 (0.3 - 0.7): Block decomposition
  if (progress > 0.3) {
    float blockProgress = (progress - 0.3) / 0.4;
    vec2 blockSize = mix(vec2(16.0), vec2(4.0), blockProgress);
    vec2 block = floor(uv * blockSize);
    float blockHash = hash2D(block + floor(uTime * 3.0));

    if (blockHash > 1.0 - blockProgress * 0.6) {
      // Displace this block
      uv += (vec2(hash(blockHash * 100.0), hash(blockHash * 200.0)) - 0.5) * blockProgress * 0.2;
    }
  }

  // Sample with displaced UVs
  vec4 color = texture2D(tDiffuse, clamp(uv, 0.0, 1.0));

  // Phase 3 (0.5 - 1.0): Color channel destruction
  if (progress > 0.5) {
    float channelProgress = (progress - 0.5) / 0.5;
    float rgbOffset = channelProgress * 0.02;
    color.r = texture2D(tDiffuse, clamp(uv + vec2(rgbOffset, 0.0), 0.0, 1.0)).r;
    color.b = texture2D(tDiffuse, clamp(uv - vec2(rgbOffset, 0.0), 0.0, 1.0)).b;

    // Random channel kill
    float channelKill = hash(floor(uTime * 20.0));
    if (channelKill > 0.8 - channelProgress * 0.3) {
      int killChannel = int(mod(floor(uTime * 30.0), 3.0));
      if (killChannel == 0) color.r *= 0.3;
      else if (killChannel == 1) color.g *= 0.3;
      else color.b *= 0.3;
    }
  }

  // Phase 4 (0.7 - 1.0): Noise takeover
  if (progress > 0.7) {
    float noiseProgress = (progress - 0.7) / 0.3;
    float staticNoise = hash2D(uv * uResolution + uTime * 100.0);
    color.rgb = mix(color.rgb, vec3(staticNoise), noiseProgress * 0.8);
  }

  // Final fade
  color.rgb *= 1.0 - progress * 0.3;

  gl_FragColor = color;
}
