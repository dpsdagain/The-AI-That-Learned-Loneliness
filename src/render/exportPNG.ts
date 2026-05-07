/**
 * Export PNG Sequence — Remotion CLI export script
 * Usage: npx ts-node src/render/exportPNG.ts
 */

import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

async function exportPNG() {
  const compositionId = process.argv[2] || 'AILoneliness';
  const outputDir = process.argv[3] || 'out/frames';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

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

  const totalFrames = composition.durationInFrames;
  console.log(`📸 Exporting ${totalFrames} PNG frames to ${outputDir}`);

  for (let frame = 0; frame < totalFrames; frame++) {
    const outputPath = path.join(outputDir, `frame_${frame.toString().padStart(6, '0')}.png`);
    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: outputPath,
      frame,
      imageFormat: 'png',
    });

    if (frame % 30 === 0) {
      console.log(`   Frame ${frame}/${totalFrames} (${((frame / totalFrames) * 100).toFixed(1)}%)`);
    }
  }

  console.log(`\n✅ PNG export complete: ${outputDir}`);
}

exportPNG().catch(console.error);
