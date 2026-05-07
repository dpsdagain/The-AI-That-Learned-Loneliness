/**
 * ═══════════════════════════════════════════════════════════════
 * COLORS — Color Utility Functions
 * ═══════════════════════════════════════════════════════════════
 */

/** Parse hex color to RGB tuple */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/** RGB tuple to hex string */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v =>
    Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')
  ).join('');
}

/** Mix two hex colors by factor t ∈ [0,1] */
export function mixColors(colorA: string, colorB: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(colorA);
  const [r2, g2, b2] = hexToRgb(colorB);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
  );
}

/** Create a CSS radial gradient string */
export function radialGradient(
  cx: number, cy: number,
  innerRadius: number, outerRadius: number,
  innerColor: string, outerColor: string
): string {
  return `radial-gradient(circle at ${cx}px ${cy}px, ${innerColor} ${innerRadius}px, ${outerColor} ${outerRadius}px)`;
}

/** Adjust brightness of a hex color */
export function adjustBrightness(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * factor, g * factor, b * factor);
}
