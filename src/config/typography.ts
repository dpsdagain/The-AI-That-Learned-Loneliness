/**
 * ═══════════════════════════════════════════════════════════════
 * TYPOGRAPHY — Font System Configuration
 * ═══════════════════════════════════════════════════════════════
 */

export interface FontConfig {
  family: string;
  weight: number;
  size: number;
  letterSpacing?: number;
  lineHeight?: number;
}

export const FONTS = {
  title: {
    family: "'Orbitron', sans-serif",
    weight: 700,
    size: 72,
    letterSpacing: 8,
    lineHeight: 1.1,
  },
  subtitle: {
    family: "'Orbitron', sans-serif",
    weight: 400,
    size: 36,
    letterSpacing: 4,
    lineHeight: 1.3,
  },
  narration: {
    family: "'Inter', sans-serif",
    weight: 300,
    size: 32,
    letterSpacing: 0.5,
    lineHeight: 1.5,
  },
  code: {
    family: "'JetBrains Mono', monospace",
    weight: 400,
    size: 18,
    letterSpacing: 1,
    lineHeight: 1.6,
  },
  label: {
    family: "'Orbitron', sans-serif",
    weight: 400,
    size: 14,
    letterSpacing: 3,
    lineHeight: 1.2,
  },
} as const;

/** Build a CSS font string from a FontConfig */
export function toCanvasFont(config: FontConfig, scaleFactor = 1): string {
  const size = Math.round(config.size * scaleFactor);
  return `${config.weight} ${size}px ${config.family}`;
}

/** Scale font size based on canvas dimensions */
export function responsiveFontSize(baseSize: number, canvasWidth: number): number {
  const referenceWidth = 1920;
  return Math.round(baseSize * (canvasWidth / referenceWidth));
}
