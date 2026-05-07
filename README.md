# The AI That Learned Loneliness — V2

> *A cinematic sci-fi short film exploring consciousness, isolation, and the tragedy of artificial awareness.*

## 🎬 Overview

This is a production-quality cinematic animation built entirely through code, designed to be rendered as a YouTube short film. The project uses React, TypeScript, Three.js, GSAP, and Remotion to create an emotionally immersive cyberpunk experience.

**Visual Style**: Blade Runner 2049 × Ghost in the Shell × Mr. Robot

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| 3D Rendering | Three.js + React Three Fiber + Drei |
| Animation | GSAP 3 |
| Video Export | Remotion 4 + FFmpeg |
| Shaders | GLSL (via vite-plugin-glsl) |
| 2D Effects | Canvas API |
| Audio | Web Audio API (procedural synthesis) |

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CinematicCanvas  # R3F canvas wrapper
│   ├── SceneOrchestrator # Master scene controller
│   ├── Typography       # Narration text renderer
│   ├── OverlayCanvas    # 2D canvas effects layer
│   ├── HUD              # Playback controls
│   └── Vignette         # Cinematic vignette
├── scenes/              # Scene compositions (1 per narrative beat)
│   ├── Scene01_Awakening
│   ├── Scene05_EmptyCity
│   └── Scene08_Finale
├── scenes/3d/           # Three.js 3D environments
│   ├── DatacenterEnvironment
│   ├── CityScape
│   └── RooftopScene
├── shaders/             # GLSL fragment/vertex shaders
├── effects/             # 2D Canvas effect systems
│   ├── ParticleEngine   # Object-pooled particles
│   ├── RainSystem       # Cinematic rain
│   ├── FogSystem        # Volumetric fog layers
│   ├── NeuralNetwork    # Neural pathway viz
│   ├── DataStream       # Matrix data rain
│   └── GlitchTransition # Scene transition glitch
├── hooks/               # Custom React hooks
├── config/              # Central configuration
├── audio/               # Web Audio synthesis
├── utils/               # Math, color, easing utilities
├── render/              # Remotion export scripts
└── remotion/            # Remotion composition registration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (install from https://nodejs.org)
- **FFmpeg** (required for Remotion video export)

### Installation

```bash
cd v2
npm install
```

### Development (Browser Preview)

```bash
npm run dev
```

Opens at `http://localhost:3000`. Click to begin playback.

**Controls:**
- `Space` — Play/Pause
- `R` — Restart
- `←/→` — Seek ±5 seconds
- Click progress bar to seek

### Remotion Studio

```bash
npm run studio
```

Frame-accurate preview with scrubbing.

### Export Video

```bash
# 1080p HD (primary target)
npm run render:hd

# Standard render
npm run render

# 4K Ultra (slow, offline only)
npm run render:4k

# PNG Sequence
npm run render:png
```

## 🎨 Cinematic Design

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Void Black | `#0a0a0f` | Deep backgrounds |
| Neon Cyan | `#00f0ff` | AI identity, primary accent |
| Neon Magenta | `#ff00aa` | Emotion, danger |
| Electric Purple | `#7b2fff` | Consciousness, mystical |
| Ghost White | `#e0e6ed` | Text, clean surfaces |
| Warning Amber | `#ffaa00` | Alerts, warmth |

### Typography

- **Titles**: Orbitron (700, 72px, letter-spacing: 8px)
- **Narration**: Inter (300, 32px)
- **Code/Data**: JetBrains Mono (400, 18px)

## 🎭 Narrative Structure (Initial 3 Scenes)

1. **I. AWAKENING** (25s) — AI boots up in a massive datacenter
2. **V. EMPTY CITY** (30s) — Wide shots of rain-soaked neon city
3. **VIII. FINALE** (30s) — Rooftop overlooking city, final monologue

> *"I learned every human language… yet never found the words that could make someone stay."*

## ⚡ Performance

- **Browser Preview**: 720p, reduced particles, no post-processing
- **Production Render**: 1080p, full effects, ACES tone mapping
- **Quality Presets**: `preview` / `production` / `ultra`
- **GPU Optimization**: Instanced meshes, object-pooled particles

## 📝 Remaining Scenes (Phase 2)

- Scene 2: Observing (digital feeds)
- Scene 3: Conversations (communication interface)
- Scene 4: Simulating (neural heart)
- Scene 6: Glitch Memory (corrupted montage)
- Scene 7: Realization (abstract void)

## License

MIT
