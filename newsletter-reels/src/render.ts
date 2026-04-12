/**
 * Programmatic render script.
 * Usage: npx tsx src/render.ts [--props '{"slides":[...]}'] [--id NewsRecapReel]
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const main = async () => {
  const args = process.argv.slice(2);
  let propsArg = "";
  let compositionId = "NewsRecapReel";
  let outputFile = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--props" && args[i + 1]) propsArg = args[++i];
    if (args[i] === "--id" && args[i + 1]) compositionId = args[++i];
    if (args[i] === "--output" && args[i + 1]) outputFile = args[++i];
  }

  const inputProps = propsArg ? JSON.parse(propsArg) : undefined;

  if (!outputFile) {
    const timestamp = new Date().toISOString().slice(0, 10);
    outputFile = `out/${compositionId}-${timestamp}.mp4`;
  }

  // Ensure output directory
  const outDir = path.dirname(outputFile);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Bundling...`);
  const bundled = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    onProgress: (p) => {
      if (p % 25 === 0) process.stdout.write(`  bundle: ${p}%\r`);
    },
  });

  console.log(`\nSelecting composition: ${compositionId}`);
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps: inputProps || {},
  });

  // If props provided, recalculate duration
  if (inputProps?.slides) {
    const dps = inputProps.durationPerSlide || 5;
    const fps = 30;
    const totalFrames = (inputProps.slides.length * dps + 4) * fps;
    (composition as any).durationInFrames = totalFrames;
  }

  console.log(`Rendering ${composition.durationInFrames} frames...`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputFile,
    inputProps: inputProps || {},
    onProgress: ({ progress }) => {
      process.stdout.write(`  render: ${(progress * 100).toFixed(0)}%\r`);
    },
  });

  console.log(`\nDone! Output: ${outputFile}`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
