/**
 * ═══════════════════════════════════════════════════════════════
 * PERFORMANCE — FPS Monitoring & GPU Hints
 * ═══════════════════════════════════════════════════════════════
 */

export class PerformanceMonitor {
  private frames = 0;
  private lastTime = 0;
  private fps = 0;
  private frameTimes: number[] = [];
  private maxSamples = 60;

  update(timestamp: number): void {
    this.frames++;
    const elapsed = timestamp - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frames * 1000) / elapsed);
      this.frames = 0;
      this.lastTime = timestamp;
    }

    if (this.frameTimes.length >= this.maxSamples) {
      this.frameTimes.shift();
    }
    this.frameTimes.push(elapsed / Math.max(this.frames, 1));
  }

  getFPS(): number {
    return this.fps;
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }

  isPerformanceGood(): boolean {
    return this.fps >= 25;
  }
}

/** Request GPU high-performance hint */
export function requestHighPerformanceGPU(): WebGLContextAttributes {
  return {
    powerPreference: 'high-performance',
    antialias: false,       // Controlled via post-processing
    alpha: false,
    stencil: false,
    depth: true,
    preserveDrawingBuffer: false,
  };
}
