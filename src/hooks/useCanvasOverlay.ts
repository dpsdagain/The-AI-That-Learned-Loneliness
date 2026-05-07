/**
 * ═══════════════════════════════════════════════════════════════
 * useCanvasOverlay — 2D Canvas Overlay Hook
 * ═══════════════════════════════════════════════════════════════
 *
 * Creates and manages a 2D canvas overlay positioned over the
 * Three.js canvas. Used for rain, particles, fog, and other
 * 2D effects that are cheaper to render in Canvas 2D.
 */

import { useRef, useEffect, useCallback } from 'react';

export type DrawCallback = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  deltaTime: number
) => void;

export interface CanvasOverlayHandle {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  getContext: () => CanvasRenderingContext2D | null;
}

export function useCanvasOverlay(
  width: number,
  height: number,
): CanvasOverlayHandle {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
  }, [width, height]);

  const getContext = useCallback(() => {
    return canvasRef.current?.getContext('2d') ?? null;
  }, []);

  return { canvasRef, getContext };
}
