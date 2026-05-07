/**
 * CHROMATIC.FRAG — Chromatic Aberration Post-Processing
 * Radial RGB offset from screen center with configurable intensity.
 */

precision highp float;

uniform sampler2D tDiffuse;
uniform float uIntensity;     // 0.0 to 1.0
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  vec2 dir = uv - center;
  float dist = length(dir);

  // Offset increases radially from center
  float offset = uIntensity * 0.005 * dist;

  vec2 rUv = uv + dir * offset;
  vec2 gUv = uv;
  vec2 bUv = uv - dir * offset;

  float r = texture2D(tDiffuse, rUv).r;
  float g = texture2D(tDiffuse, gUv).g;
  float b = texture2D(tDiffuse, bUv).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
