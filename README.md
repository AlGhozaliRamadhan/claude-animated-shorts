# Claude Animated Shorts

> **Rules for AI:** read [`AGENTS.md`](AGENTS.md) first, then
> [`LESSONS.md`](LESSONS.md) for the failure log. Open the project's
> `PROJECT.md` for current status before starting any work.

This repository is two things:

- the free Claude skill from **"How to Make Viral Animated Shorts Using Claude
  (Full Workflow)"**, with the bridge short source and reference studies;
- a working video workspace with a runnable Remotion app, an HTML timeline
  starter, and small scripts for scaffolding, QA, and rendering.

The skill makes 55 to 70 second vertical animated stories: 2D characters in a
colourful 3D world, with ink outlines, a painted town, lens blur, gliding
cameras, a march score, and sound effects. Everything renders with three.js
inside Remotion on your own PC, with no AI video generator.

Proven on **The Bridge That Fell for a Song**, a 67 second short about the 1831
Broughton bridge. A 30 second trailer cut is included as a working example:
`projects/example-30s/render/final.mp4`, composition `Example30s`.

## What this makes

The output is an edited video, rendered with Remotion for three.js shorts or
with the deterministic HTML timeline for presentation videos. It is not a PPTX,
a slideshow, or a folder of stills with fades.

- Every new video starts with research: story references, visual references,
  and a short treatment.
- Every scene gets a real object or camera move, not just opacity.
- Cuts, text, sound, and QA are part of the work, and the deliverable is an MP4
  with verified metadata.

If you want a slide deck, say so explicitly. The default here is a rendered
video with edit effort.

## What's inside

| Path | What it is |
|---|---|
| `engine/` | Runnable Remotion app. Start here for three.js shorts. |
| `templates/bridge/` | Pristine source of the bridge short: world, characters, ink, lens blur, grade, story, camera |
| `templates/html/` | Generic 12 second HTML timeline starter, deterministic `window.setTime(t)` |
| `templates/project/` | `PROJECT.md` template used by `scripts/new_project.py` |
| `templates/audio/` | Synthesized sound: SFX, march music, the mix with ducking and loudness |
| `templates/scripts/` | Stills, side-by-side sheets, shot merge, and frame QA helpers |
| `scripts/` | Workspace scripts: doctor, scaffold, preview, HTML render, Remotion render, asset fetch |
| `projects/` | One folder per video. `PROJECT.md` is the status source of truth. |
| `projects/example-30s/` | 30 second trailer example, composition `Example30s`, 900 frames |
| `LESSONS.md` | Real failures, why they happened, and how to adapt without turning them into blind bans |
| `SKILL.md` | The skill: full pipeline, every rule, every fix, and the final look values |
| `references/STYLE_BIBLE.md` | Script and visual formula measured from 20 reference shorts |
| `references/reports/` | Seven measured reports: motion, depth, textures, characters, lighting, outlines, grade |
| `references/frames/` | 38 full size reference frames (540x960) |
| `references/sheets/` | 20 contact sheets, 60 frames each (1,200 frames) |

`references/` is private study material. Do not upload, publish, or send it to
another service.

## Quick start

```powershell
python -m pip install -r requirements.txt
python -m playwright install chromium
python scripts/doctor.py
cd engine
npm install
npm run typecheck
npm run dev
```

`npm run dev` opens Remotion Studio with the `Starter`, `BridgeShort`, and
`Example30s` compositions. Render a still before rendering video, always:

```powershell
cd engine
npm run still -- BridgeShort out/check.png --frame 60 --scale 0.5
```

Engine details, pinned versions, and troubleshooting live in
[`engine/README.md`](engine/README.md).

## See the example

`projects/example-30s/` is a 900 frame, 30 fps, 1080x1920 trailer cut of the
bridge short. It shows the excerpt pattern: the project has its own scaffolded
bridge copy, and `engine/src/videos/example-30s/Excerpt.tsx` imports `BridgeShort`
from `./Bridge`, then passes a `frameMap` that plays story frames 987-1406, cuts,
then plays 1545-2024. One canvas, one kit load, two segments.

```powershell
# inspect a title frame and the end credit
python scripts/render_remotion.py --still Example30s projects/example-30s/render/qa/f030.png --frame 30 --scale 0.5
python scripts/render_remotion.py --still Example30s projects/example-30s/render/qa/f885.png --frame 885 --scale 0.5

# render the full 30 seconds
python scripts/render_remotion.py Example30s projects/example-30s/render/final.mp4 --scale 1.0 --concurrency 1
```

The example is silent on purpose: the repo does not ship the bridge voice stem.
The visual pipeline, project scaffold, QA stills, and render command are the
point. Add `--scale 1.3333` for a 1440x2560 version. Keep `--concurrency 1`
for this three.js composition: four parallel browser tabs ran out of time on
frame 145 during the first render.

## Start a new video

Three project kinds:

```powershell
# three.js short, copied from templates/bridge and registered in the engine
python scripts/new_project.py my-short --title "My Short" --kind remotion

# HTML presentation video, copied from templates/html/starter.html
python scripts/new_project.py campus-talk --title "Campus Talk" --kind html

# only PROJECT.md, naskah.md, and aset/
python scripts/new_project.py notes --title "Notes" --kind blank
```

For a Remotion project, edit the copy in `engine/src/videos/<slug>/`, not the
pristine template. Then:

```powershell
python scripts/render_remotion.py MyShort projects/my-short/render/final.mp4 --scale 1.3333
```

For an HTML project, preview every key beat before exporting:

```powershell
python scripts/preview_video.py projects/campus-talk/aset/timeline.html --times 0,4,8,12,16 --out projects/campus-talk/aset/qa
python scripts/render_html.py projects/campus-talk/aset/timeline.html --out projects/campus-talk/render/video.mp4
```

Inspect the PNGs yourself or have the agent inspect them. The preview must report
`brokenImages: []`, `consoleErrors: []`, and `pageErrors: []` before a render.

## Rules that stay true

- No em dashes in prose or scripts.
- One paragraph, one idea. Active verbs. Numbers need a source.
- Every scene needs visible motion, not only a fade.
- Red is reserved for impossible or wrong findings, never decoration.
- Foreground over a busy background needs a scrim.
- Update `PROJECT.md` at the end of every session.

## Notes

- Set `REMOTION_TMP` to a folder on a big drive. Remotion copies `public/` into
  the temp folder for each bundle. `scripts/render_remotion.py` defaults to
  `D:\remotion-tmp`.
- The bridge assets are CC0 Kenney props. `scripts/fetch_bridge_assets.py`
  downloads only the GLBs the world uses.
- `projects/example-30s/` is the reference example. Keep it renderable. If you
  change the `BridgeShort` props, update the example and `templates/bridge/`
  together.
- `projects/data-sains-review-5min/` is a finished campus video. Do not modify
  its timeline, assets, or `render/final.mp4` when working on the workspace.
- The `engine` stack is pinned. Newer `@react-three/postprocessing` / `three`
  versions rendered a blank canvas with the bridge post chain.

## License

The code and docs are MIT (see `LICENSE`). The reference frames are included for
style study only.
