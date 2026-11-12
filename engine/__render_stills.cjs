process.env.TEMP = "D:/remotion-tmp";
process.env.TMP = process.env.TEMP;
const path = require("path");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");

const frames = [
  0, 6, 20, 45, 90, 170, 179, 180, 188, 300, 1179, 1180, 1188, 1380, 1500,
  1624, 1640, 1660, 1700, 1709, 1710, 1740, 1900, 1919, 1920, 1936, 3809,
  3810, 3828, 5579,
];

(async () => {
  const serveUrl = await bundle({
    entryPoint: path.resolve(__dirname, "src/index.ts"),
    onProgress: () => {},
  });
  const composition = await selectComposition({ serveUrl, id: "FifaVideo1" });
  for (const frame of frames) {
    const output = path.resolve(
      __dirname,
      `../projects/fifa-posisi-5min/render/qa-anim/f${String(frame).padStart(4, "0")}.png`
    );
    await renderStill({
      serveUrl,
      composition,
      output,
      frame,
      scale: 0.5,
      imageFormat: "png",
      overwrite: true,
    });
    console.log("done", frame);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
