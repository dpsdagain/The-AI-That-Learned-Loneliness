/**
 * ═══════════════════════════════════════════════════════════════
 * RENDERING — Resolution & Quality Configuration
 * ═══════════════════════════════════════════════════════════════
 *
 * Adaptive quality presets optimized for mid-range 2020 GPU.
 * Browser preview runs at 720p, export targets 1080p/4K.
 */

export type QualityPreset = 'preview' | 'production' | 'ultra';

export interface RenderConfig {
  width: number;
  height: number;
  fps: number;
  pixelRatio: number;
  shadowMapSize: number;
  particleMultiplier: number;
  enablePostProcessing: boolean;
  enableShadows: boolean;
  antialias: boolean;
}

/* ── Quality presets ─────────────────────────────────────────── */
export const QUALITY_PRESETS: Record<QualityPreset, RenderConfig> = {
  preview: {
    width: 1280,
    height: 720,
    fps: 30,
    pixelRatio: 1,
    shadowMapSize: 512,
    particleMultiplier: 0.5,
    enablePostProcessing: false,
    enableShadows: false,
    antialias: false,
  },
  production: {
    width: 1920,
    height: 1080,
    fps: 30,
    pixelRatio: Math.min(window?.devicePixelRatio ?? 1, 2),
    shadowMapSize: 1024,
    particleMultiplier: 1.0,
    enablePostProcessing: true,
    enableShadows: true,
    antialias: true,
  },
  ultra: {
    width: 3840,
    height: 2160,
    fps: 30,
    pixelRatio: 1,
    shadowMapSize: 2048,
    particleMultiplier: 1.5,
    enablePostProcessing: true,
    enableShadows: true,
    antialias: true,
  },
};

/* ── Active render config (detect context) ──────────────────── */
export function getActiveRenderConfig(): RenderConfig {
  // Remotion renders use production preset
  if (typeof window !== 'undefined' && (window as any).__REMOTION_RENDER__) {
    return QUALITY_PRESETS.production;
  }
  // Browser preview uses preview preset for performance
  return QUALITY_PRESETS.preview;
}

/* ── Aspect ratio constant ──────────────────────────────────── */
export const ASPECT_RATIO = 16 / 9;

/* ── Camera constants ────────────────────────────────────────── */
export const CAMERA = {
  fov: 35,
  near: 0.1,
  far: 1000,
} as const;
