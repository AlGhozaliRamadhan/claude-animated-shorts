# Lessons for Future Agents

Last updated: 2026-11-06

This file is memory, not policy. Each entry records a real failure in this
workspace, the mechanism behind it, and a way to adapt next time. Read the
mechanism and decide for the current job. Do not turn one bad render into a
permanent ban on a setting that may be correct elsewhere.

## How to use this file

- Read it before changing the render pipeline, cutting a timeline, or updating
  project status.
- Treat **Adapt** as a decision prompt. It tells you what to check, not what to
  blindly refuse.
- Treat **Verify** as the proof. If you skip a check, say why in the handoff.
- Add an entry when something fails. Keep the evidence: frame number, error
  text, file path, command output.
- When a lesson conflicts with the user's request, explain the tradeoff and ask.
  A rule copied without context becomes the next mistake.

## 1. Render pipeline

### 1.1 Default concurrency killed a 900 frame 3D render

**What happened.** On 2026-11-06 the `Example30s` render at the default
concurrency of 4 stopped at frame 145 with
`TimeoutError: waiting for the page to render the React component at frame 145
failed: timeout 33000ms exceeded` and `Target closed`. The same composition
completed at `--concurrency 1`.

**Why.** Four browser tabs each held a WebGL canvas, a three.js world, and the
post chain. The GPU and CPU contended, one page missed the 33 second frame
deadline, and Remotion closed the target.

**Adapt.** For three.js compositions, start at `--concurrency 1`. If render time
matters, test a 30 to 60 frame range at 2 before committing to a full pass, and
only raise it when that range succeeds. A simple 2D composition may be fine at
higher concurrency. The number is a property of the scene, not a universal law.

**Verify.** A full render completes and encoded frames match the stills. If you
raise concurrency, run a short range first and report the result.

### 1.2 Bypassing the wrapper caused false failures and temp pressure

**What happened.** Calling Remotion through `npx.CMD` returned exit code 1 even
when the render succeeded. Calling the CLI directly also bundles into the system
temp drive, which is small on this machine.

**Why.** The Windows `npx` shim does not propagate the real exit code, and
Remotion copies `public/` into `TEMP` for every bundle.

**Adapt.** Use `scripts/render_remotion.py`. It calls
`node node_modules/@remotion/cli/remotion-cli.js` directly and moves
`TEMP`/`TMP` to `D:\remotion-tmp` (or `%REMOTION_TMP%`). If you must call the CLI
yourself, do both of those things explicitly.

**Verify.** Exit code 0, output file exists, and the wrapper prints the temp
path. Check `python scripts/doctor.py` for free space.

### 1.3 A stack bump can blank the canvas

**What happened.** Newer Remotion, three, and postprocessing versions rendered a
blank canvas with the bridge post chain. The pinned stack fixed it.

**Why.** The look depends on a specific combination of Remotion,
`@react-three/fiber`, `@react-three/postprocessing`, `postprocessing`, and
`three`. Their compatibility is narrower than each package's own version range.

**Adapt.** The pinned versions in `engine/package.json` are part of the look, not
housekeeping. If a bump is requested, render one still at a frame that exercises
ink lines, depth of field, bloom, and the grade before accepting it. If the still
is blank or the lines change, revert and report.

**Verify.** A still at `BridgeShort` frame 60 (or another frame with all passes)
is not blank and matches the reference look.

## 2. Cuts and timeline

### 2.1 A cut landed inside a crossfade

**What happened.** The first `Example30s` edit ended segment A at story frame
1410, composition frame 424. Frame 423 showed a ghosted double exposure: the
outgoing shot and the incoming shot were both half visible.

**Why.** `layersAt(f)` stacks a second canvas with alpha during place changes and
shot transitions. A cut at that frame preserves the blend instead of creating a
clean boundary.

**Adapt.** Before choosing in and out points, inspect `layersAt(f)` around the
boundary. End on a frame where one shot is fully opaque. If a blend is the point,
make it intentional and keep it short. Do not assume every story frame is a
clean shot.

**Verify.** Render the last frame before the cut and the first frame after it.
No half faded double image, no flash of a shot that does not belong.

### 2.2 Constants and prose drifted apart

**What happened.** After moving the cut from 424 to 420, comments and notes still
said 424 and 1549 while the constants said 420 and 1545. The project docs had to
be re-synced by hand.

**Why.** The frame map lived in several places: constants, comments, `PROJECT.md`,
`naskah.md`, `README.md`, and `AGENTS.md`.

**Adapt.** Keep the map in one source in code and derive prose from it where
possible. When a constant changes, search the repo for the old number before
continuing.

**Verify.** `rg "424|1549"` returns only historical notes, or nothing. All docs
show the current cut.

### 2.3 Stale QA stills survived an edit

**What happened.** Stills for frames 424, 812, 840, and 880 remained in
`render/qa/` after the cut moved and the title timing changed. They no longer
represented the timeline.

**Why.** QA files were named by frame and old files were not removed.

**Adapt.** Treat the QA set as part of the edit. When the edit changes, delete or
overwrite stills that no longer match. Keep a small set tied to current key
frames: opening, title, cut, credit, last frame.

**Verify.** The QA folder contains no frame outside the current plan.

## 3. Text and layout

### 3.1 The title crowded the right edge and outlived its background

**What happened.** The first title was two lines at 82 px. The second line ran
close to the right edge, and the card stayed visible into a bright shot where the
scrim no longer protected it. The fix stacked the title over three lines, exited
at frames 46 to 60 instead of 58 to 78, and strengthened the scrim.

**Why.** Width was estimated by eye, and the exit was timed to a fixed duration
instead of the shot behind it.

**Adapt.** Measure the longest line against the frame width minus safe margins.
Time the exit against the background luminance or the shot boundary, not just a
timer. A scrim must fade with its text, not appear or disappear on its own.

**Verify.** Stills at entry, middle, and exit, rendered at 0.5 scale or full
size. A 0.25 scale preview hides edge crowding. Check the right edge, contrast
at the brightest background, and that the scrim is gone when the text is gone.

### 3.2 Fixed elements overlapped in the data-sains project

**What happened.** Historical bugs in `projects/data-sains-review-5min/`:
the warning bar covered a red circle in Scene 1, the Scene 2 question text ran
full width and hit the white journal on the left, and the identity badge covered
the `NVDA / NASDAQ` label in the top right.

**Why.** Absolutely positioned elements were placed without checking the regions
and z-order of everything else in the scene.

**Adapt.** Inventory the fixed elements per scene and their rough bounding boxes
before placing new text. Check at the real render size, not at a zoomed out
preview. When two elements compete, move one or add a scrim, do not just lower
opacity.

**Verify.** Preview at every scene boundary and at the densest moment. Look for
text collisions, covered labels, and lines behind letters.

### 3.3 Foreground over a busy background needs a scrim

**What happened.** In the data-sains timeline, text over journal pages and moving
graphics became hard to read without a backdrop.

**Why.** Opacity alone does not separate foreground from a busy, moving, or high
contrast background.

**Adapt.** Any text, card, or number placed over a graph, document, texture, or
moving line gets a dark or paper scrim. The scrim animates in and out with its
element.

**Verify.** Check contrast at the brightest and busiest frame, not only the first
frame.

## 4. Scaffolding and shared code

### 4.1 The scaffold registered the wrong component

**What happened.** `scripts/new_project.py` created `Example30s` pointing at
module `Bridge` and component `BridgeShort`. The actual wrapper was
`Excerpt.tsx` exporting `Example30s`.

**Why.** The scaffold assumes one composition per copied bridge. A second cut in
the same folder needs different registry fields.

**Adapt.** After scaffolding, open `engine/video-registry.json` and confirm
`module`, `component`, and `framesExport` match the file you intend to render. If
you add a second cut, update the JSON and regenerate `registry.ts`.

**Verify.** `npm run compositions` shows the id, duration, and size you expect.

### 4.2 Shared bridge changes need propagation

**What happened.** Adding the optional `frameMap` prop required edits to
`templates/bridge/Bridge.tsx`, `engine/src/videos/bridge/Bridge.tsx`, and the
scaffolded `engine/src/videos/example-30s/Bridge.tsx`.

**Why.** Each project works on its own copy, while the template remains the
source for future scaffolds.

**Adapt.** Change the template first, then propagate to the engine demo and any
scaffolded copy that must stay compatible. When copies are meant to be identical,
compare hashes. When a project intentionally diverges, record why.

**Verify.** `sha256` of the copies matches when they should, and `frameMap`
remains optional so existing compositions render unchanged.

### 4.3 Docs described the wrong import path

**What happened.** `README.md` and `AGENTS.md` said the example imports
`BridgeShort` from `../bridge`. The scaffolded copy is actually imported from
`./Bridge`.

**Why.** The reuse pattern was documented from memory instead of from the file.

**Adapt.** Before documenting an import, open the file and copy the real path.
Prefer describing the pattern and linking to the file over restating code that
will drift.

**Verify.** Search the docs for the path and compare with the source.

## 5. Assets and paths

### 5.1 Relative asset paths broke images

**What happened.** In the data-sains timeline, `../paper_pages/page_6.png`
produced blank journal images. From a file in `aset/`, the correct path is
`paper_pages/page_6.png`.

**Why.** The path is resolved against the HTML file's directory, not the project
root or the repo root.

**Adapt.** Resolve every asset path against the file that uses it. Test by
opening the timeline from its real location. A path that works from the repo root
may still fail in the browser.

**Verify.** The preview report has `brokenImages: []`, `consoleErrors: []`, and
`pageErrors: []`.

### 5.2 Recursive scans time out on this workspace

**What happened.** A `Get-ChildItem -Recurse` for audio files ran past the
120 second timeout because `projects/` holds hundreds of megabytes of video,
frames, and references.

**Why.** The scan walked the whole workspace instead of the folder that mattered.

**Adapt.** Scope searches to the folder you need. Use `rg` or `grep` with a path.
Exclude `projects/`, `references/`, and `node_modules/` when looking for engine
code or assets.

**Verify.** The command returns quickly. If not, narrow the path instead of
raising the timeout.

### 5.3 Shell and ffmpeg assumptions differ on this machine

**What happened.** `Get-FileHash` was not available in PowerShell, and the
bundled ffmpeg rejected `-vsync 0` with `Unrecognized option 'vsync'`.
`-fps_mode passthrough` worked.

**Why.** The PowerShell profile is constrained, and `imageio-ffmpeg` ships
ffmpeg 9, which uses the newer flag name.

**Adapt.** Use Python `hashlib` for file hashes and Python `subprocess` for
ffmpeg calls. Use `-fps_mode passthrough` when extracting a single encoded
frame. Get the exact ffmpeg path from `scripts/doctor.py` instead of assuming it
is on `PATH`.

**Verify.** The command exits 0 and prints the expected hash, frame, or metadata.

## 6. Proof and claims

### 6.1 Typecheck is not render QA

**What happened.** `npm run typecheck` passed while the full render crashed at
frame 145. Typecheck also cannot catch a blank canvas, a missing GLB, a text
collision, or a bad cut.

**Why.** TypeScript checks types. It does not run WebGL, resolve public assets, or
evaluate frame timing.

**Adapt.** Use the gate: stills at key frames, a short render segment when the
composition is heavy, then the full render. Treat the encoded file as the only
proof of end to end success.

**Verify.** Extract frames from the final MP4, not only from the still renderer.

### 6.2 Do not normalize a number that only looks wrong

**What happened.** The data-sains baseline reports LSTM MAE 9.15 and RMSE 6.72.
MAE greater than RMSE is unusual, and an agent could be tempted to "correct" it.

**Why.** The numbers come from the reviewed paper. The unusual relationship is
part of the review finding, not a typo.

**Adapt.** Treat surprising numbers as claims to check against the source, not
errors to fix. If the source says it, keep it and explain it. Change a number
only with a citation that supports the change.

**Verify.** Every number has a table, figure, or page reference.

### 6.3 Final metadata comes from the encoded file

**What happened.** The stills looked correct, but the delivered MP4 needed its
own check for duration, frame count, resolution, codec, and audio.

**Why.** Encoding can change levels, drop frames, or produce a file with no audio
stream even when the composition looked right.

**Adapt.** Run `ffmpeg -i` on the final file and extract a few encoded frames.
Report duration, resolution, fps, codec, size, and whether audio exists.

**Verify.** The encoded frames match the stills, and the metadata matches the
composition.

## 7. Repository and delivery

### 7.1 `projects/` is huge, do not add it blindly

**What happened.** The workspace holds roughly 900 MB under `projects/` plus the
70 MB example render. A blind `git add .` would stage video, frames, and
private study material.

**Why.** Video assets and renders live in the working tree, not in a build
artifact folder.

**Adapt.** Check `git status` and `.gitignore` first. Add source and docs
deliberately. Keep renders out unless the user asks for them. Never upload
`references/`.

**Verify.** `git diff --cached --stat` before any commit. If large binaries
appear, unstage them.

### 7.2 The clone pointed at someone else's remote

**What happened.** On 2026-11-06 `origin` was
`https://github.com/mromidev/claude-animated-shorts.git`, the repo this
workspace was cloned from. A push would have gone to the original author.

**Why.** Cloning preserves the source remote.

**Adapt.** Check `git remote -v` before any push. Use your own remote or none.
In this workspace the remote was removed at the user's request.

**Verify.** `git remote -v` is empty or points to the user's repo. No commit or
push happens without an explicit instruction.

### 7.3 `PROJECT.md` was updated last

**What happened.** `projects/example-30s/PROJECT.md` stayed as scaffold
placeholder while most of the work was done. The brief, deliverables, and status
were filled near the end.

**Why.** The render and docs took priority, and the status file was treated as a
final report instead of a working handoff.

**Adapt.** Fill Brief and Deliverables at scaffold time. Update Status after each
meaningful step: composition registered, stills checked, render done, docs
updated. A future session should be able to resume from the file alone.

**Verify.** `PROJECT.md` matches the files on disk and the current render state.

## 8. When a lesson does not fit

A lesson is a record of one failure, not a universal prohibition. Before applying
one, ask what the current job actually needs.

- `--concurrency 1` is slower. If the user has a deadline, test 2 on a short
  range, measure it, and report the tradeoff. Do not silently accept a 3 hour
  render because a note said "always 1".
- "Red only for findings" is an editorial rule for the data-sains project. A
  different project may use red as a brand colour. Follow that project's brief
  and say why the rule does not apply.
- "Do not edit `templates/bridge/`" applies while working on a project. If the
  task is to improve the starter itself, editing the template is correct. Then
  propagate the change to the engine copy and the example.
- "Never push" means do not push to a remote you do not own. If the user adds
  their own remote and asks for a push, that is a different situation. Confirm
  the remote first.
- A cut inside a crossfade is wrong only when the blend is accidental. A
  deliberate dissolve can be the right edit. Check `layersAt` and decide.

If a rule and the request conflict, state the risk, propose the adaptation, and
ask. Silence is worse than a documented tradeoff.

## 9. Adding a new lesson

Use this shape:

```markdown
### Short title

**What happened.** Date, file, frame, error, or command output.

**Why.** The mechanism, not just the symptom.

**Adapt.** The decision rule. What to check, when to deviate, what to ask.

**Verify.** The cheapest check that would have caught it.
```

Keep one failure per entry. Do not write "always" or "never" unless the failure
is truly unconditional. Prefer "start with", "test", "prefer", "confirm". If the
same mistake happens twice, merge the entries and say what the first entry
missed.

## 10. Minimum proof before delivery

This is a floor, not a ritual. Adapt it to the job.

- `python scripts/doctor.py` passes, or the failure is understood.
- `PROJECT.md` is current.
- `git remote -v` and `git status` are known before any commit or push.
- `npm run compositions` shows the intended id, duration, and size.
- Stills at opening, title, every cut, every transition, credit, and last frame.
- Full render succeeds. Use `--concurrency 1` for the three.js short.
- `ffmpeg -i` metadata is correct, and encoded frames match the stills.
- `PROJECT.md` Status is updated with what finished and what remains.
