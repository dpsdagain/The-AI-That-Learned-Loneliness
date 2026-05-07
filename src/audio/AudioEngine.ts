/**
 * AudioEngine — Web Audio API Synthesized Ambience
 * Procedural drone, rain, and atmospheric sound generation.
 */

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private isRunning = false;

  async init(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15;
    this.masterGain.connect(this.ctx.destination);
  }

  async start(): Promise<void> {
    if (!this.ctx || this.isRunning) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    // Low drone
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.value = 55; // A1
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.3;
    this.droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain!);
    this.droneOsc.start();

    // Sub bass
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.value = 27.5; // A0
    const subGain = this.ctx.createGain();
    subGain.gain.value = 0.15;
    this.subOsc.connect(subGain);
    subGain.connect(this.masterGain!);
    this.subOsc.start();

    // Rain-like noise
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.1;
    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    this.noiseNode.start();

    this.isRunning = true;
  }

  stop(): void {
    this.droneOsc?.stop();
    this.subOsc?.stop();
    this.noiseNode?.stop();
    this.isRunning = false;
  }

  setVolume(v: number): void {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, v));
  }

  dispose(): void {
    this.stop();
    this.ctx?.close();
    this.ctx = null;
  }
}
