/**
 * CRT.FRAG — CRT Scanline Post-Processing Effect
 * Simulates CRT monitor aesthetics with scanlines,
 * screen curvature, phosphor glow, and vignette.
 */

precision highp float;

uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uIntensity;      // 0.0 to 1.0
uniform vec2 uResolution;

varying vec2 vUv;

/* ── Inline utilities ────────────────────────────────────────── */
float hash2D(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 barrelDistortion(vec2 uv, float strength) {
  vec2 cc = uv - 0.5;
  float dist = dot(cc, cc);
  return uv + cc * dist * strength;
}

void main() {
  float intensity = uIntensity;

  // Screen curvature
  vec2 uv = barrelDistortion(vUv, 0.05 * intensity);

  // Base color
  vec4 color = texture2D(tDiffuse, uv);

  // Scanlines
  float scanline = sin(uv.y * uResolution.y * 1.5) * 0.5 + 0.5;
  scanline = pow(scanline, 1.5) * 0.15 * intensity;
  color.rgb -= scanline;

  // Horizontal scanline band (slow moving)
  float band = smoothstep(0.0, 0.02, abs(sin(uv.y * 2.0 + uTime * 0.3)));
  color.rgb *= mix(1.0, band, 0.03 * intensity);

  // Phosphor RGB sub-pixel simulation
  float subPixel = mod(gl_FragCoord.x, 3.0);
  vec3 phosphor = vec3(
    subPixel < 1.0 ? 1.0 : 0.85,
    subPixel >= 1.0 && subPixel < 2.0 ? 1.0 : 0.85,
    subPixel >= 2.0 ? 1.0 : 0.85
  );
  color.rgb *= mix(vec3(1.0), phosphor, 0.1 * intensity);

  // Film grain
  float grain = hash2D(uv * uTime * 100.0) * 0.03 * intensity;
  color.rgb += grain;

  // Vignette
  vec2 vigUv = vUv * (1.0 - vUv);
  float vig = vigUv.x * vigUv.y * 15.0;
  vig = pow(vig, 0.25 * (1.0 + intensity));
  color.rgb *= vig;

  gl_FragColor = color;
}
