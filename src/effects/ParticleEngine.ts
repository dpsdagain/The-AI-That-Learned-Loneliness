/**
 * ═══════════════════════════════════════════════════════════════
 * ParticleEngine — Object-Pooled Particle System
 * ═══════════════════════════════════════════════════════════════
 *
 * Generic particle engine with configurable emission, lifetime,
 * velocity, size, opacity, and color. Uses object pooling for
 * zero-allocation rendering.
 */

import { randomRange, lerp, clamp } from '@/utils/math';
import { PALETTE, rgba } from '@/config/palette';

export interface ParticleConfig {
  maxCount: number;
  emitRate: number;       // particles per second
  lifetime: [number, number];
  speed: [number, number];
  size: [number, number];
  opacity: [number, number];
  color: string;
  direction: { x: [number, number]; y: [number, number] };
  fadeIn: number;         // 0→1, fraction of lifetime for fade in
  fadeOut: number;        // 0→1, fraction of lifetime for fade out
  blendMode: GlobalCompositeOperation;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  active: boolean;
}

export const PARTICLE_PRESETS: Record<string, ParticleConfig> = {
  ambient: {
    maxCount: 150,
    emitRate: 8,
    lifetime: [3, 8],
    speed: [0.1, 0.5],
    size: [1, 3],
    opacity: [0.1, 0.4],
    color: PALETTE.neonCyan,
    direction: { x: [-0.5, 0.5], y: [-0.3, -0.1] },
    fadeIn: 0.2,
    fadeOut: 0.3,
    blendMode: 'lighter',
  },
  data: {
    maxCount: 80,
    emitRate: 15,
    lifetime: [1, 4],
    speed: [1, 3],
    size: [1, 2],
    opacity: [0.3, 0.8],
    color: PALETTE.neonCyan,
    direction: { x: [-0.2, 0.2], y: [0.5, 1.5] },
    fadeIn: 0.1,
    fadeOut: 0.2,
    blendMode: 'lighter',
  },
  neural: {
    maxCount: 60,
    emitRate: 5,
    lifetime: [2, 6],
    speed: [0.2, 0.8],
    size: [2, 4],
    opacity: [0.2, 0.6],
    color: PALETTE.electricPurple,
    direction: { x: [-0.5, 0.5], y: [-0.5, 0.5] },
    fadeIn: 0.3,
    fadeOut: 0.4,
    blendMode: 'lighter',
  },
};

export class ParticleEngine {
  private pool: Particle[];
  private config: ParticleConfig;
  private width: number;
  private height: number;
  private emitAccumulator = 0;
  private multiplier: number;

  constructor(
    config: ParticleConfig,
    width: number,
    height: number,
    multiplier = 1.0
  ) {
    this.config = config;
    this.width = width;
    this.height = height;
    this.multiplier = multiplier;

    const count = Math.round(config.maxCount * multiplier);
    this.pool = Array.from({ length: count }, () => this.createParticle(false));
  }

  private createParticle(active: boolean): Particle {
    return {
      x: 0, y: 0,
      vx: 0, vy: 0,
      size: 1,
      opacity: 0,
      maxOpacity: 0,
      life: 0,
      maxLife: 1,
      active,
    };
  }

  private emit(p: Particle): void {
    const cfg = this.config;
    p.x = randomRange(0, this.width);
    p.y = randomRange(0, this.height);
    const speed = randomRange(...cfg.speed);
    p.vx = randomRange(...cfg.direction.x) * speed;
    p.vy = randomRange(...cfg.direction.y) * speed;
    p.size = randomRange(...cfg.size);
    p.maxOpacity = randomRange(...cfg.opacity);
    p.opacity = 0;
    p.life = 0;
    p.maxLife = randomRange(...cfg.lifetime);
    p.active = true;
  }

  /** Emit a particle at a specific position */
  emitAt(x: number, y: number): void {
    const p = this.pool.find(p => !p.active);
    if (!p) return;
    this.emit(p);
    p.x = x;
    p.y = y;
  }

  update(dt: number): void {
    const cfg = this.config;

    // Accumulate emission
    this.emitAccumulator += cfg.emitRate * this.multiplier * dt;
    while (this.emitAccumulator >= 1) {
      const p = this.pool.find(p => !p.active);
      if (p) this.emit(p);
      this.emitAccumulator -= 1;
    }

    // Update active particles
    for (const p of this.pool) {
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        continue;
      }

      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;

      // Fade in/out
      const lifeRatio = p.life / p.maxLife;
      if (lifeRatio < cfg.fadeIn) {
        p.opacity = lerp(0, p.maxOpacity, lifeRatio / cfg.fadeIn);
      } else if (lifeRatio > 1 - cfg.fadeOut) {
        p.opacity = lerp(p.maxOpacity, 0, (lifeRatio - (1 - cfg.fadeOut)) / cfg.fadeOut);
      } else {
        p.opacity = p.maxOpacity;
      }

      // Wrap around edges
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;
    }
  }

  render(ctx: CanvasRenderingContext2D, globalAlpha = 1): void {
    const prevComposite = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = this.config.blendMode;

    for (const p of this.pool) {
      if (!p.active || p.opacity < 0.01) continue;

      ctx.globalAlpha = p.opacity * globalAlpha;
      ctx.fillStyle = this.config.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Subtle glow
      if (p.size > 1.5) {
        ctx.globalAlpha = p.opacity * globalAlpha * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = prevComposite;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  setMultiplier(m: number): void {
    this.multiplier = clamp(m, 0, 2);
  }
}
