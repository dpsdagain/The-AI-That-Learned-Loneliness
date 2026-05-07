/**
 * HOLOGRAM.FRAG — Holographic Material Shader
 * Fresnel edge glow, animated scan lines, noise transparency,
 * and color shift for floating UI elements.
 */

precision highp float;

uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;           // Primary hologram color
uniform float uScanSpeed;      // Scan line scroll speed

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

/* ── Inline noise ────────────────────────────────────────────── */
float hash2D(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash2D(i);
  float b = hash2D(i + vec2(1.0, 0.0));
  float c = hash2D(i + vec2(0.0, 1.0));
  float d = hash2D(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  // Fresnel effect (edge glow)
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);

  // Scrolling scan lines
  float scan = sin(vUv.y * 80.0 - uTime * uScanSpeed) * 0.5 + 0.5;
  scan = pow(scan, 8.0) * 0.3;

  // Noise-based transparency flickering
  float flicker = noise(vec2(uTime * 2.0, vUv.y * 10.0));
  float alpha = uOpacity * (0.3 + fresnel * 0.7) * (0.8 + flicker * 0.2);

  // Horizontal interference lines
  float interference = step(0.98, sin(vUv.y * 300.0 + uTime * 5.0));

  // Color composition
  vec3 color = uColor;
  color += uColor * fresnel * 0.5;          // Edge brightening
  color += vec3(0.3, 0.5, 1.0) * scan;      // Scan line color
  color += vec3(1.0) * interference * 0.2;   // Interference flash

  // Subtle color shift over time
  color.r += sin(uTime * 0.5) * 0.05;
  color.b += cos(uTime * 0.7) * 0.05;

  gl_FragColor = vec4(color, alpha);
}
