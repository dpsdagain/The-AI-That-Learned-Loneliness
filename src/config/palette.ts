/**
 * ═══════════════════════════════════════════════════════════════
 * PALETTE — Cinematic Color System
 * "The AI That Learned Loneliness"
 * ═══════════════════════════════════════════════════════════════
 *
 * Blade Runner 2049 / Ghost in the Shell inspired palette.
 * All colors are defined as constants and as Three.js-ready values.
 */

import * as THREE from 'three';

/* ── Hex tokens ──────────────────────────────────────────────── */
export const PALETTE = {
  voidBlack:      '#0a0a0f',
  deepMidnight:   '#0d1117',
  darkSurface:    '#12151c',
  neonCyan:       '#00f0ff',
  neonCyanDim:    '#007a82',
  neonMagenta:    '#ff00aa',
  neonMagentaDim: '#80005e',
  electricPurple: '#7b2fff',
  hologramBlue:   '#1a8fff',
  ghostWhite:     '#e0e6ed',
  mutedSteel:     '#4a5568',
  warmSteel:      '#6b7280',
  warningAmber:   '#ffaa00',
  darkGlow:       '#061218',
  rackMetal:      '#0a0c12',
  skyDark:        '#020305',
  horizonGlow:    '#0a0e18',
} as const;

/* ── Three.js Color instances (cached) ──────────────────────── */
export const COLORS_THREE = {
  voidBlack:      new THREE.Color(PALETTE.voidBlack),
  deepMidnight:   new THREE.Color(PALETTE.deepMidnight),
  neonCyan:       new THREE.Color(PALETTE.neonCyan),
  neonMagenta:    new THREE.Color(PALETTE.neonMagenta),
  electricPurple: new THREE.Color(PALETTE.electricPurple),
  hologramBlue:   new THREE.Color(PALETTE.hologramBlue),
  ghostWhite:     new THREE.Color(PALETTE.ghostWhite),
  warningAmber:   new THREE.Color(PALETTE.warningAmber),
  fogColor:       new THREE.Color(0x050510),
} as const;

/* ── RGBA helpers for Canvas 2D ─────────────────────────────── */
export function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Glow color with adjustable intensity ───────────────────── */
export function glowColor(hex: string, intensity: number): string {
  return rgba(hex, Math.min(intensity, 1));
}
