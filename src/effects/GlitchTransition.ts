/**
 * GlitchTransition — Scene Transition Glitch Effect
 */
import { randomRange, clamp } from '@/utils/math';
import { rgba } from '@/config/palette';

export class GlitchTransition {
  private width: number;
  private height: number;
  private intensity = 0;
  private time = 0;

  constructor(width: number, height: number) {
    this.width = width; this.height = height;
  }

  setIntensity(v: number): void { this.intensity = clamp(v, 0, 1); }

  update(dt: number): void {
    this.time += dt;
    this.intensity *= 0.92; // Natural decay
  }

  render(ctx: CanvasRenderingContext2D, globalAlpha = 1): void {
    if (this.intensity < 0.01) return;
    const w = this.width, h = this.height;

    // RGB split by copying strips with offset
    ctx.globalAlpha = this.intensity * 0.4 * globalAlpha;
    for (let i = 0; i < 5; i++) {
      const y = randomRange(0, h);
      const stripH = randomRange(2, 30) * this.intensity;
      const offsetX = randomRange(-20, 20) * this.intensity;
      ctx.drawImage(ctx.canvas, 0, y, w, stripH, offsetX, y, w, stripH);
    }

    // Horizontal white flash lines
    ctx.globalAlpha = this.intensity * 0.6 * globalAlpha;
    ctx.fillStyle = rgba('#ffffff', this.intensity * 0.3);
    for (let i = 0; i < 3; i++) {
      const y = randomRange(0, h);
      ctx.fillRect(0, y, w, randomRange(1, 3));
    }

    // Block corruption
    ctx.globalAlpha = this.intensity * 0.5 * globalAlpha;
    for (let i = 0; i < Math.floor(this.intensity * 8); i++) {
      const bx = randomRange(0, w);
      const by = randomRange(0, h);
      const bw = randomRange(10, 80);
      const bh = randomRange(5, 30);
      ctx.fillStyle = rgba(Math.random() > 0.5 ? '#00f0ff' : '#ff00aa', 0.15);
      ctx.fillRect(bx, by, bw, bh);
    }

    ctx.globalAlpha = 1;
  }

  resize(w: number, h: number): void { this.width = w; this.height = h; }
}
