/**
 * Remotion Root — Composition Registration
 */
import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';

const FPS = 30;
const TOTAL_DURATION_SECONDS = 85; // 25 + 30 + 30 (initial 3 scenes)
const TOTAL_FRAMES = TOTAL_DURATION_SECONDS * FPS;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AILoneliness"
        component={Video}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Preview-quality composition */}
      <Composition
        id="AILoneliness_Preview"
        component={Video}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={{}}
      />
    </>
  );
};
