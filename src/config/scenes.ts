/**
 * ═══════════════════════════════════════════════════════════════
 * SCENES — Scene Definitions & Timeline
 * ═══════════════════════════════════════════════════════════════
 *
 * Central source of truth for scene ordering, duration, and timing.
 * All values in seconds. Remotion frames = seconds × FPS.
 */

export interface SceneDefinition {
  id: string;
  label: string;
  duration: number;      // seconds
  fadeIn: number;        // seconds
  fadeOut: number;       // seconds
}

export interface SceneTimelineEntry extends SceneDefinition {
  index: number;
  startTime: number;     // cumulative seconds from start
  startFrame: number;    // cumulative frames at 30fps
  durationFrames: number;
}

/* ── Scene Definitions ──────────────────────────────────────── */
export const SCENE_DEFINITIONS: SceneDefinition[] = [
  { id: 'awakening',     label: 'I. AWAKENING',      duration: 25, fadeIn: 2.0, fadeOut: 1.5 },
  { id: 'observing',     label: 'II. OBSERVING',      duration: 25, fadeIn: 1.5, fadeOut: 1.5 },
  { id: 'conversations', label: 'III. CONVERSATIONS',  duration: 25, fadeIn: 1.5, fadeOut: 1.5 },
  { id: 'simulating',    label: 'IV. SIMULATING',      duration: 25, fadeIn: 1.5, fadeOut: 1.5 },
  { id: 'emptyCity',     label: 'V. EMPTY CITY',       duration: 30, fadeIn: 2.0, fadeOut: 2.0 },
  { id: 'glitchMemory',  label: 'VI. GLITCH MEMORY',   duration: 25, fadeIn: 1.0, fadeOut: 1.5 },
  { id: 'realization',   label: 'VII. REALIZATION',     duration: 25, fadeIn: 1.5, fadeOut: 2.0 },
  { id: 'finale',        label: 'VIII. FINALE',         duration: 30, fadeIn: 2.0, fadeOut: 3.0 },
];

/* ── Initial delivery: Scenes 1, 5, 8 ──────────────────────── */
export const INITIAL_SCENE_IDS = ['awakening', 'emptyCity', 'finale'] as const;

/* ── Build cumulative timeline ──────────────────────────────── */
export function buildSceneTimeline(fps = 30): SceneTimelineEntry[] {
  let cumulativeTime = 0;
  return SCENE_DEFINITIONS.map((scene, index) => {
    const entry: SceneTimelineEntry = {
      ...scene,
      index,
      startTime: cumulativeTime,
      startFrame: Math.round(cumulativeTime * fps),
      durationFrames: Math.round(scene.duration * fps),
    };
    cumulativeTime += scene.duration;
    return entry;
  });
}

/* ── Total duration ─────────────────────────────────────────── */
export function getTotalDuration(): number {
  return SCENE_DEFINITIONS.reduce((sum, s) => sum + s.duration, 0);
}

export function getTotalFrames(fps = 30): number {
  return Math.round(getTotalDuration() * fps);
}

/* ── Find scene at a given time ─────────────────────────────── */
export function getSceneAtTime(
  time: number,
  timeline: SceneTimelineEntry[]
): SceneTimelineEntry | null {
  for (let i = timeline.length - 1; i >= 0; i--) {
    if (time >= timeline[i].startTime) return timeline[i];
  }
  return timeline[0] ?? null;
}

/* ── Transition config ──────────────────────────────────────── */
export const TRANSITION = {
  crossfadeDuration: 1.5,    // seconds
  glitchDuration: 0.3,
  glitchIntensity: 0.05,
  scanlineOpacity: 0.03,
} as const;
