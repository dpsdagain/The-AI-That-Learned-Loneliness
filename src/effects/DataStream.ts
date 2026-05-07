/**
 * DataStream — Flowing Data Stream Visualization
 */
import { randomRange } from '@/utils/math';
import { PALETTE, rgba } from '@/config/palette';

interface StreamColumn {
  x: number; speed: number; chars: string[]; offset: number; opacity: number;
}

const CHARS = '01アイウエオカキクケコ∑∏∫∂∇ABCDEF0123456789';

export class DataStream {
  private columns: StreamColumn[];
  private width: number;
  private height: number;
  private intensity = 0.5;

  constructor(width: number, height: number) {
    this.width = width; this.height = height;
    const colCount = Math.floor(width / 20);
    this.columns = Array.from({ length: colCount }, (_, i) => ({
      x: i * 20 + 10,
      speed: randomRange(30, 100),
      chars: Array.from({ length: 30 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      offset: randomRange(0, height),
      opacity: randomRange(0.1, 0.5),
    }));
  }

  setIntensity(v: number): void { this.intensity = Math.max(0, Math.min(1, v)); }

  update(dt: number): void {
    for (const col of this.columns) {
      col.offset += col.speed * dt;
      if (col.offset > this.height + 400) col.offset = -200;
      if (Math.random() < 0.02) {
        const idx = Math.floor(Math.random() * col.chars.length);
        col.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, globalAlpha = 1): void {
    if (this.intensity < 0.01) return;
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (const col of this.columns) {
      for (let i = 0; i < col.chars.length; i++) {
        const y = col.offset + i * 18;
        if (y < -20 || y > this.height + 20) continue;
        const fade = i === 0 ? 1 : Math.max(0.1, 1 - i / col.chars.length);
        ctx.globalAlpha = col.opacity * fade * this.intensity * globalAlpha;
        ctx.fillStyle = i === 0 ? PALETTE.ghostWhite : PALETTE.neonCyan;
        ctx.fillText(col.chars[i], col.x, y);
      }
    }
    ctx.globalAlpha = 1;
  }

  resize(w: number, h: number): void { this.width = w; this.height = h; }
}
