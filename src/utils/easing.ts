/**
 * ═══════════════════════════════════════════════════════════════
 * EASING — Custom Easing Functions
 * ═══════════════════════════════════════════════════════════════
 *
 * Cinematic easing curves for GSAP and manual animations.
 */

export type EasingFn = (t: number) => number;

/** Smooth cinematic ease (cubic) */
export const easeSmooth: EasingFn = (t) => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/** Dramatic slow-reveal (expo out) */
export const easeSlowReveal: EasingFn = (t) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/** Breathing rhythm (sine in-out) */
export const easeBreathe: EasingFn = (t) => {
  return -(Math.cos(Math.PI * t) - 1) / 2;
};

/** Glitch snap (back in-out) */
export const easeGlitch: EasingFn = (t) => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

/** Dramatic quint in-out */
export const easeDramatic: EasingFn = (t) => {
  return t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

/** Linear (no easing) */
export const easeLinear: EasingFn = (t) => t;

/** Power curve with configurable exponent */
export function easePow(exponent: number): EasingFn {
  return (t) => Math.pow(t, exponent);
}

/** GSAP-compatible custom ease string */
export const GSAP_EASING = {
  cinematic:  'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  slowReveal: 'expo.out',
  breathe:    'sine.inOut',
  glitch:     'back.inOut',
  dramatic:   'quint.inOut',
} as const;
