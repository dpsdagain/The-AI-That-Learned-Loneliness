/**
 * Vignette — Cinematic Vignette Overlay
 */
import React from 'react';

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.5 }) => (
  <div
    style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20,
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
    }}
  />
);
