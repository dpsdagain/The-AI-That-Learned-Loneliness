/**
 * EMISSIVE.FRAG — Animated Emissive Material
 * Pulsing glow, energy flow lines, and intensity-driven emission
 * for server LEDs, neural nodes, and neon elements.
 */

precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uIntensity;     // Emission intensity multiplier
uniform float uPulseSpeed;    // Heartbeat / breath speed

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
  // Base emission pulse (breathing rhythm)
  float pulse = sin(uTime * uPulseSpeed) * 0.3 + 0.7;

  // Energy flow lines along UV
  float flow = noise(vec2(vUv.x * 5.0 - uTime * 0.5, vUv.y * 5.0));
  flow = smoothstep(0.4, 0.6, flow) * 0.3;

  // Combine emission
  float emission = uIntensity * pulse + flow;

  // Fresnel edge glow
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

  vec3 color = uColor * emission;
  color += uColor * fresnel * 0.5 * uIntensity;

  // HDR bloom-friendly output (values > 1.0)
  color *= 1.0 + uIntensity * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
