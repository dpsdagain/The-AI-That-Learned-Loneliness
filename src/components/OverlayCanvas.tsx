/**
 * OverlayCanvas — 2D Canvas Layer for particle/rain/fog effects
 */
import React, { useRef, useEffect, useCallback } from 'react';

interface Props {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  className?: string;
}

export const OverlayCanvas: React.FC<Props> = ({ width, height, draw, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    draw(ctx, width, height);
  });

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 5,
      }}
    />
  );
};
