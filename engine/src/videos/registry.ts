import type { ComponentType } from "react";
import { BridgeShort as BridgeShort__BridgeShort, BRIDGE_FRAMES as BRIDGE_FRAMES__BridgeShort } from "./bridge/Bridge";
import { Example30s as Example30s__Example30s, EXAMPLE_FRAMES as EXAMPLE_FRAMES__Example30s } from "./example-30s/Excerpt";
import { FifaColdOpen as FifaColdOpen__FifaColdOpen, COLD_OPEN_FRAMES as COLD_OPEN_FRAMES__FifaColdOpen } from "./fifa-posisi-5min/TypeTest";
import { FifaVideo1 as FifaVideo1__FifaVideo1, VIDEO1_FRAMES as VIDEO1_FRAMES__FifaVideo1 } from "./fifa-posisi-5min/Video1";
import { FifaVideo2 as FifaVideo2__FifaVideo2, VIDEO2_FRAMES as VIDEO2_FRAMES__FifaVideo2 } from "./fifa-posisi-5min/Video2";
import { FifaVideo3 as FifaVideo3__FifaVideo3, VIDEO3_FRAMES as VIDEO3_FRAMES__FifaVideo3 } from "./fifa-posisi-5min/Video3";

export type VideoEntry = {
  id: string;
  component: ComponentType;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
};

// Generated from engine/video-registry.json by scripts/new_project.py.
export const VIDEO_ENTRIES: VideoEntry[] = [
  {
    id: "BridgeShort",
    component: BridgeShort__BridgeShort,
    durationInFrames: BRIDGE_FRAMES__BridgeShort,
    fps: 30,
    width: 1080,
    height: 1920,
  },
  {
    id: "Example30s",
    component: Example30s__Example30s,
    durationInFrames: EXAMPLE_FRAMES__Example30s,
    fps: 30,
    width: 1080,
    height: 1920,
  },
  {
    id: "FifaColdOpen",
    component: FifaColdOpen__FifaColdOpen,
    durationInFrames: COLD_OPEN_FRAMES__FifaColdOpen,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  {
    id: "FifaVideo1",
    component: FifaVideo1__FifaVideo1,
    durationInFrames: VIDEO1_FRAMES__FifaVideo1,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  {
    id: "FifaVideo2",
    component: FifaVideo2__FifaVideo2,
    durationInFrames: VIDEO2_FRAMES__FifaVideo2,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  {
    id: "FifaVideo3",
    component: FifaVideo3__FifaVideo3,
    durationInFrames: VIDEO3_FRAMES__FifaVideo3,
    fps: 30,
    width: 1920,
    height: 1080,
  },
];
