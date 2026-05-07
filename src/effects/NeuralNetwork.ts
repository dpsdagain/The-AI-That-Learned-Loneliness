/**
 * NeuralNetwork — Neural Pathway Visualization
 */

import { randomRange, noise2D, lerp, clamp } from '@/utils/math';
import { PALETTE } from '@/config/palette';

interface NeuralNode {
  x: number; y: number; baseX: number; baseY: number;
  radius: number; activation: number; phase: number;
}

interface NeuralConnection {
  from: number; to: number; strength: number;
  pulsePosition: number; pulseSpeed: number;
}

export class NeuralNetwork {
  private nodes: NeuralNode[];
  private connections: NeuralConnection[];
  private width: number;
  private height: number;
  private intensity = 0;
  private time = 0;

  constructor(width: number, height: number, nodeCount = 40) {
    this.width = width;
    this.height = height;
    this.nodes = Array.from({ length: nodeCount }, () => {
      const x = randomRange(width * 0.1, width * 0.9);
      const y = randomRange(height * 0.15, height * 0.75);
      return { x, y, baseX: x, baseY: y, radius: randomRange(2, 5), activation: 0, phase: randomRange(0, Math.PI * 2) };
    });
    this.connections = [];
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].baseX - this.nodes[j].baseX;
        const dy = this.nodes[i].baseY - this.nodes[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          this.connections.push({ from: i, to: j, strength: 1 - dist / 200, pulsePosition: randomRange(0, 1), pulseSpeed: randomRange(0.2, 0.8) });
        }
      }
    }
  }

  setIntensity(v: number): void { this.intensity = clamp(v, 0, 1); }

  update(dt: number): void {
    this.time += dt;
    for (const n of this.nodes) {
      n.x = n.baseX + Math.sin(this.time * 0.5 + n.phase) * 8;
      n.y = n.baseY + Math.cos(this.time * 0.3 + n.phase * 1.3) * 5;
      n.activation = lerp(n.activation, noise2D(n.baseX * 0.005, this.time * 0.5) * this.intensity, dt * 2);
    }
    for (const c of this.connections) {
      c.pulsePosition += c.pulseSpeed * dt;
      if (c.pulsePosition > 1) c.pulsePosition -= 1;
    }
  }

  render(ctx: CanvasRenderingContext2D, globalAlpha = 1): void {
    if (this.intensity < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const c of this.connections) {
      const f = this.nodes[c.from], t = this.nodes[c.to];
      const a = c.strength * this.intensity * globalAlpha * 0.3;
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.strokeStyle = PALETTE.neonCyan;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y); ctx.stroke();
      const px = lerp(f.x, t.x, c.pulsePosition), py = lerp(f.y, t.y, c.pulsePosition);
      ctx.globalAlpha = a * 2;
      ctx.fillStyle = PALETTE.neonCyan;
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    for (const n of this.nodes) {
      const a = (0.3 + n.activation * 0.7) * this.intensity * globalAlpha;
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = PALETTE.neonCyan;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = a * 0.3;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  resize(w: number, h: number): void {
    const sx = w / this.width, sy = h / this.height;
    this.width = w; this.height = h;
    for (const n of this.nodes) { n.baseX *= sx; n.baseY *= sy; n.x *= sx; n.y *= sy; }
  }
}
