# Engine

Runnable Remotion workspace for the bridge-style three.js shorts. The source of
truth for the starter code is still `templates/bridge/`; this folder has a working
copy at `src/videos/bridge/` so the demo composition runs out of the box. The
30 second example is at `src/videos/example-30s/` (composition `Example30s`).

## Requirements

- Node 20 or newer
- Python 3.10 or newer, with the packages in `../requirements.txt`
- A folder on a drive with at least 20 GB free for Remotion temp files

On a fresh machine:

```powershell
python -m pip install -r requirements.txt
python -m playwright install chromium
```

Check everything before starting, from the repo root:

```powershell
python scripts/doctor.py
```

## Install

```powershell
cd engine
npm install
npm run typecheck
```

The three.js and post-processing packages are pinned on purpose. Newer
`@react-three/postprocessing` / `three` combinations rendered a blank canvas with
the bridge `EffectComposer`; do not bump them without rendering a still first.

## Commands

Run from `engine/`:

```powershell
npm run dev            # Remotion Studio
npm run compositions   # list composition ids
npm run typecheck      # tsc --noEmit
npm run still -- BridgeShort out/check.png --frame 60 --scale 0.5
npm run render -- BridgeShort out/bridge.mp4 --scale 1.3333
npm run still -- Example30s out/example-f030.png --frame 30 --scale 0.5
npm run render -- Example30s out/example-30s.mp4 --scale 1.0
```

The `still` and `render` scripts call `../scripts/render_remotion.py`, which
moves `TEMP`/`TMP` to `D:\remotion-tmp` (or `%REMOTION_TMP%`) so the system
drive does not fill up. From the repo root the same commands are:

```powershell
python scripts/render_remotion.py --still BridgeShort projects/<slug>/render/qa/check.png --frame 60 --scale 0.5
python scripts/render_remotion.py BridgeShort projects/<slug>/render/final.mp4 --scale 1.3333
```

Relative output paths are resolved from the directory you run the command in, so
the examples above write into the project folder when run from the repo root.

`--scale 1.3333` turns the 1080x1920 composition into 1440x2560. Use
`--scale 0.5` for quick checks.

## Adding a video

Scaffold the project and the composition together:

```powershell
python scripts/new_project.py my-short --title "My Short" --kind remotion
```

That creates `projects/my-short/`, copies `templates/bridge/` into
`engine/src/videos/my-short/`, and registers a composition id (`MyShort`) in
`engine/video-registry.json` and `engine/src/videos/registry.ts`.

Then open Remotion Studio, edit the copy under `src/videos/my-short/`, and render
with the new id. The demo copy `src/videos/bridge/` is only a working example;
changes made there do not flow back into `templates/bridge/`.

The scaffold registers one composition. To add a second cut in the same folder,
add an entry to `video-registry.json` with `module`, `component`, and
`framesExport` pointing at the new file, then mirror the entry in
`src/videos/registry.ts`. The `Example30s` entry is the working template for that
shape.

## Reusing the bridge in a shorter cut

`BridgeShort` accepts an optional `frameMap` prop that maps composition-local
frames to story frames. A wrapper composition can therefore excerpt the 67 second
timeline, or skip a beat, without mounting a second canvas or loading the kit
twice:

```tsx
import { BridgeShort } from "./Bridge";

const storyFrame = (local: number) =>
  local < 420 ? 987 + local : 1545 + (local - 420);

export const MyCut = () => <BridgeShort frameMap={storyFrame} />;
```

`src/videos/example-30s/Excerpt.tsx` is the working reference: 420 frames from
story 987-1406, a hard cut, then 480 frames from 1545-2024. Segment A stops one
frame before the shot 11 to 12 crossfade so the cut has no half-faded frame. The
composition is 900 frames at 30 fps, rendered to
`../projects/example-30s/render/final.mp4`.

The prop is optional, so existing compositions keep the default
`local frame = story frame` behavior. When you change `Bridge.tsx`, keep
`templates/bridge/` and `src/videos/bridge/` identical so new scaffolds inherit
the same props.

## Assets

Kenney props live in `public/bridge/kenney/`. The bridge world loads them through
Remotion `staticFile("bridge/kenney/<name>.glb")`, and the GLTF loader also needs
`public/bridge/kenney/Textures/colormap.png`.

If the folder is missing or incomplete, run this from `engine/`:

```powershell
python ../scripts/fetch_bridge_assets.py --force
```

Only the props referenced by `world.ts` are downloaded. Trees and bushes are
drawn procedurally by `build.ts`, so their GLBs are optional.

## Troubleshooting

- Blank canvas: confirm the pinned versions are installed (`npm run doctor`),
  then render a still. The `composer` input prop (default `true`) disables the
  whole post chain:
  `--props='{"post":{"composer":false}}'`
- `delayRender()` timeout on first render: the GLB fetch is slow on a cold cache.
  Re-run once; the browser cache will have the assets.
- Full three.js render dies partway with `TimeoutError: ... 33000ms exceeded` and
  `Target closed`: the default concurrency can starve four WebGL tabs. Retry with
  `--concurrency 1` before changing the scene or the stack.
- Disk full on `C:`: make sure `REMOTION_TMP` points to a big drive before
  running the CLI, or use the Python wrapper above.
- `npm run typecheck` fails after scaffolding: the generated registry may be
  stale. Re-run `scripts/new_project.py` on a clean project, or check that every
  entry in `video-registry.json` has `module`, `component` and `framesExport`.

More failure notes and the reasoning behind them are in
[`../LESSONS.md`](../LESSONS.md).
