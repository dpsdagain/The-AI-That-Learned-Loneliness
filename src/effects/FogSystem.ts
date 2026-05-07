/**
 * ═══════════════════════════════════════════════════════════════
 * FogSystem — Layered Volumetric Fog Effect
 * ═══════════════════════════════════════════════════════════════
 *
 * Multiple semi-transparent fog layers with parallax scrolling.
 */

import { clamp, noise2D } from '@/utils/math';
import { rgba } from '@/config/palette';

interface FogLayer {
  y: number;
  height: number;
  scrollSpeed: number;
  offset: number;
  opacity: number;
  color: string;
}

export class FogSystem {
  private layers: FogLayer[];
  private width: number;
  private height: number;
  private intensity = 0.5;
  private time = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.layers = [
      { y: height * 0.7, height: height * 0.15, scrollSpeed: 0.3, offset: 0, opacity: 0.08, color: '#0a1020' },
      { y: height * 0.75, height: height * 0.12, scrollSpeed: -0.2, offset: 100, opacity: 0.06, color: '#061218' },
      { y: height * 0.6, height: height * 0.2, scrollSpeed: 0.15, offset: 200, opacity: 0.04, color: '#080c18' },
      { y: height * 0.8, height: height * 0.1, scrollSpeed: 0.4, offset: 50, opacity: 0.1, color: '#0a0e1a' },
    ];
  }

  setIntensity(value: number): void {
    this.intensity = clamp(value, 0, 1);
  }

  update(dt: number): void {
    this.time += dt;
    for (const layer of this.layers) {
      layer.offset += layer.scrollSpeed * dt * 60;
      if (layer.offset > this.width) layer.offset -= this.width * 2;
      if (layer.offset < -this.width) layer.offset += this.width * 2;
    }
  }

  render(ctx: CanvasRenderingContext2D, globalAlpha = 1): void {
    for (const layer of this.layers) {
      const alpha = layer.opacity * this.intensity * globalAlpha;
      if (alpha < 0.005) continue;

      // Main fog band
      const gradient = ctx.createLinearGradient(0, layer.y, 0, layer.y + layer.height);
      gradient.addColorStop(0, rgba(layer.color, 0));
      gradient.addColorStop(0.3, rgba(layer.color, alpha));
      gradient.addColorStop(0.7, rgba(layer.color, alpha));
      gradient.addColorStop(1, rgba(layer.color, 0));

      ctx.fillStyle = gradient;
      ctx.fillRect(0, layer.y, this.width, layer.height);

      // Noise-based fog wisps
      ctx.globalAlpha = alpha * 0.5;
      for (let x = 0; x < this.width; x += 40) {
        const n = noise2D((x + layer.offset) * 0.01, this.time * 0.3);
        const wispHeight = n * layer.height * 0.5;
        const wispY = layer.y + layer.height * 0.5 + (n - 0.5) * layer.height;

        ctx.fillStyle = rgba(layer.color, alpha * n);
        ctx.fillRect(x, wispY, 40, wispHeight);
      }
    }
    ctx.globalAlpha = 1;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    // Recalculate layer positions
    this.layers[0].y = height * 0.7;
    this.layers[0].height = height * 0.15;
    this.layers[1].y = height * 0.75;
    this.layers[1].height = height * 0.12;
    this.layers[2].y = height * 0.6;
    this.layers[2].height = height * 0.2;
    this.layers[3].y = height * 0.8;
    this.layers[3].height = height * 0.1;
  }
}
