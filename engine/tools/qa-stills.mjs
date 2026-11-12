/**
 * Render several QA stills from one Remotion bundle.
 *
 * Usage (from engine/):
 *   node tools/qa-stills.mjs FifaVideo1 ../projects/fifa-posisi-5min/render/qa-v1 0,90,175,260
 *
 * Bundling once is the whole point: `remotion still` rebuilds for every frame,
 * which makes a 20-frame QA pass take fifteen minutes instead of two.
 */
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [, , compositionId, outDir, framesArg, scaleArg] = process.argv;

if (!compositionId || !outDir || !framesArg) {
  console.error(
    "usage: node tools/qa-stills.mjs <CompositionId> <outDir> <frame,frame,...> [scale]"
  );
  process.exit(1);
}

const frames = framesArg
  .split(",")
  .map((v) => parseInt(v.trim(), 10))
  .filter((v) => Number.isFinite(v) && v >= 0);

const scale = scaleArg ? parseFloat(scaleArg) : 0.5;

const entry = path.resolve("src/index.ts");
const out = path.resolve(outDir);
fs.mkdirSync(out, { recursive: true });

const serveUrl = await bundle({
  entryPoint: entry,
  publicDir: path.resolve("public"),
});

const composition = await selectComposition({
  serveUrl,
  id: compositionId,
});

for (const frame of frames) {
  const clamped = Math.min(frame, composition.durationInFrames - 1);
  const output = path.join(out, `f${String(clamped).padStart(4, "0")}.png`);
  await renderStill({
    serveUrl,
    composition,
    output,
    frame: clamped,
    scale,
    imageFormat: "png",
  });
  console.log(output);
}
