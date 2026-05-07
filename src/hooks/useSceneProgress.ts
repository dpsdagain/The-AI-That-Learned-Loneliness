/**
 * ═══════════════════════════════════════════════════════════════
 * useSceneProgress — Scene Progress Hook
 * ═══════════════════════════════════════════════════════════════
 *
 * Provides scene-local progress, time, and fade values.
 * Works in both Remotion and browser-preview modes.
 */

import { useMemo } from 'react';
import { smoothstep, clamp } from '@/utils/math';

export interface SceneProgressData {
  /** 0→1 progress through the scene */
  progress: number;
  /** Scene-local time in seconds */
  sceneTime: number;
  /** Fade-in/out alpha multiplier (0→1) */
  fadeAlpha: number;
  /** Whether the scene is currently active */
  isActive: boolean;
}

/**
 * Calculate scene progress from global frame/time.
 * @param globalTime - Current global time in seconds
 * @param sceneStart - Scene start time in seconds
 * @param sceneDuration - Scene duration in seconds
 * @param fadeIn - Fade-in duration in seconds
 * @param fadeOut - Fade-out duration in seconds
 */
export function useSceneProgress(
  globalTime: number,
  sceneStart: number,
  sceneDuration: number,
  fadeIn: number,
  fadeOut: number,
): SceneProgressData {
  return useMemo(() => {
    const sceneTime = globalTime - sceneStart;
    const progress = clamp(sceneTime / sceneDuration, 0, 1);
    const isActive = sceneTime >= 0 && sceneTime <= sceneDuration;

    // Compute fade alpha
    let fadeAlpha = 1;
    if (sceneTime < fadeIn) {
      fadeAlpha = smoothstep(0, fadeIn, sceneTime);
    }
    if (sceneTime > sceneDuration - fadeOut) {
      fadeAlpha = smoothstep(sceneDuration, sceneDuration - fadeOut, sceneTime);
    }
    fadeAlpha = clamp(fadeAlpha, 0, 1);

    return { progress, sceneTime, fadeAlpha, isActive };
  }, [globalTime, sceneStart, sceneDuration, fadeIn, fadeOut]);
}
