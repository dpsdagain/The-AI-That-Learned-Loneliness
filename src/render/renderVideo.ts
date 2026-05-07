/**
 * Render Video — Remotion CLI render script
 * Usage: npx ts-node src/render/renderVideo.ts
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';

async function render() {
  const compositionId = process.argv[2] || 'AILoneliness';
  const outputPath = process.argv[3] || 'out/video.mp4';

  console.log(`🎬 Bundling project...`);
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/remotion/index.ts'),
    webpackOverride: (config) => config,
  });

  console.log(`📐 Selecting composition: ${compositionId}`);
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
  });

  console.log(`🎥 Rendering ${composition.width}x${composition.height} @ ${composition.fps}fps`);
  console.log(`   Duration: ${composition.durationInFrames} frames (${composition.durationInFrames / composition.fps}s)`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    imageFormat: 'jpeg',
    jpegQuality: 95,
    concurrency: 4,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r   Progress: ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log(`\n✅ Render complete: ${outputPath}`);
}

render().catch(console.error);
