/**
 * ═══════════════════════════════════════════════════════════════
 * RainSystem — Cinematic Rain Particle Effect
 * ═══════════════════════════════════════════════════════════════
 *
 * Velocity-stretched rain drops with wind influence, splash
 * effects, and configurable density for different scenes.
 */

import { randomRange, clamp } from '@/utils/math';
import { rgba } from '@/config/palette';

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  wind: number;
  active: boolean;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  active: boolean;
}

export class RainSystem {
  private drops: RainDrop[];
  private splashes: Splash[];
  private width: number;
  private height: number;
  private intensity = 0.5;
  private maxDrops: number;
  private maxSplashes = 30;
  private windForce = 0.3;

  constructor(width: number, height: number, multiplier = 1.0) {
    this.width = width;
    this.height = height;
    this.maxDrops = Math.round(400 * multiplier);

    this.drops = Array.from({ length: this.maxDrops }, () => ({
      x: 0, y: 0, speed: 0, length: 0, opacity: 0, wind: 0, active: false,
    }));

    this.splashes = Array.from({ length: this.maxSplashes }, () => ({
      x: 0, y: 0, radius: 0, maxRadius: 0, opacity: 0, active: false,
    }));
  }

  setIntensity(value: number): void {
    this.intensity = clamp(value, 0, 1);
  }

  setWind(force: number): void {
    this.windForce = force;
  }

  update(dt: number): void {
    const activeTarget = Math.floor(this.maxDrops * this.intensity);

    // Emit drops
    let activeCount = 0;
    for (const drop of this.drops) {
      if (drop.active) {
        activeCount++;
        continue;
      }
      if (activeCount < activeTarget) {
        this.emitDrop(drop);
        activeCount++;
      }
    }

    // Update drops
    for (const drop of this.drops) {
      if (!drop.active) continue;

      drop.y += drop.speed * dt * 60;
      drop.x += drop.wind * dt * 60;

      // Hit ground
      if (drop.y > this.height) {
        // Create splash
        const splash = this.splashes.find(s => !s.active);
        if (splash) {
          splash.x = drop.x;
          splash.y = this.height - randomRange(0, 20);
          splash.radius = 0;
          splash.maxRadius = randomRange(3, 8);
          splash.opacity = drop.opacity * 0.6;
          splash.active = true;
        }
        drop.active = false;
      }
    }

    // Update splashes
    for (const splash of this.splashes) {
      if (!splash.active) continue;
      splash.radius += dt * 30;
      splash.opacity -= dt * 2;
      if (splash.radius >= splash.maxRadius || splash.opacity <= 0) {
        splash.active = false;
      }
    }
  }

  private emitDrop(drop: RainDrop): void {
    drop.x = randomRange(-50, this.width + 50);
    drop.y = randomRange(-100, -10);
    drop.speed = randomRange(6, 14);
    drop.length = randomRange(10, 30);
    drop.opacity = randomRange(0.15, 0.45);
    drop.wind = this.windForce + randomRange(-0.2, 0.2);
    drop.active = true;
  }

  render(ctx: CanvasRenderingContext2D, globalAlpha = 1): void {
    const prevComposite = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'lighter';

    // Rain drops
    ctx.strokeStyle = rgba('#88ccff', 1);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    for (const drop of this.drops) {
      if (!drop.active) continue;
      ctx.globalAlpha = drop.opacity * globalAlpha;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(
        drop.x + drop.wind * drop.length * 0.3,
        drop.y + drop.length
      );
      ctx.stroke();
    }

    // Splashes
    for (const splash of this.splashes) {
      if (!splash.active) continue;
      ctx.globalAlpha = splash.opacity * globalAlpha;
      ctx.strokeStyle = rgba('#88ccff', splash.opacity);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(splash.x, splash.y, splash.radius, 0, Math.PI);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = prevComposite;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}
