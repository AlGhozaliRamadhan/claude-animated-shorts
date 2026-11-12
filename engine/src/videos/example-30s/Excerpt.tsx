// A 30 second trailer cut of "The Bridge That Fell for a Song".
// It reuses the bridge world in ./Bridge through the frameMap prop: the first 420 frames play story
// frames 987-1406 (the bolt, the snap, the fall, the river), then a hard cut skips the middle of the
// park beat and the last 480 frames play story frames 1545-2024 (swing, golden march, the rule,
// the rebuilt bridge and the crane out). One canvas, one kit load, two segments. Segment A ends one
// frame before the shot 11 -> 12 crossfade so the cut never shows a half-faded double exposure.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BridgeShort } from "./Bridge";

export const EXAMPLE_FRAMES = 900;

const CUT = 420;
const SEGMENT_A = 987;
const SEGMENT_B = 1545;

const storyFrame = (local: number) =>
  local < CUT ? SEGMENT_A + local : SEGMENT_B + (local - CUT);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.out(Easing.cubic);

const CREAM = "#f2e8d5";
const BRASS = "#c9a45c";

const scrim = (strength: number, height: string): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height,
  background: `linear-gradient(to top, rgba(9, 8, 6, ${strength}) 0%, rgba(9, 8, 6, ${strength * 0.62}) 38%, rgba(9, 8, 6, 0) 100%)`,
});

const IntroTitle: React.FC<{ frame: number }> = ({ frame }) => {
  const fadeIn = interpolate(frame, [8, 28], [0, 1], { ...clamp, easing: easeOut });
  const fadeOut = interpolate(frame, [46, 60], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const opacity = fadeIn * (1 - fadeOut);
  if (opacity <= 0) return null;
  const rise = interpolate(frame, [8, 32], [30, 0], { ...clamp, easing: easeOut }) - 14 * fadeOut;
  const rule = interpolate(frame, [14, 42], [0, 172], { ...clamp, easing: easeOut });
  const eyebrow = interpolate(frame, [6, 22], [0, 1], { ...clamp, easing: easeOut });
  const sub = interpolate(frame, [24, 40], [0, 1], { ...clamp, easing: easeOut });

  return (
    <>
      <AbsoluteFill style={{ ...scrim(0.9, "64%"), opacity: 1 - fadeOut }} />
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          bottom: 172,
          opacity,
          transform: `translateY(${rise}px)`,
          color: CREAM,
        }}
      >
        <div
          style={{
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: 23,
            fontWeight: 600,
            letterSpacing: "0.28em",
            color: BRASS,
            opacity: eyebrow,
            marginBottom: 26,
          }}
        >
          A THIRTY SECOND CUT
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 86,
            lineHeight: 1.0,
            letterSpacing: "-0.012em",
            textShadow: "0 2px 24px rgba(0, 0, 0, 0.35)",
          }}
        >
          The Bridge
          <br />
          That Fell
          <br />
          for a Song
        </div>
        <div
          style={{
            width: rule,
            height: 1,
            margin: "30px 0 24px",
            background: `rgba(201, 164, 92, 0.72)`,
          }}
        />
        <div
          style={{
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: 25,
            fontWeight: 400,
            letterSpacing: "0.01em",
            color: "rgba(242, 232, 213, 0.7)",
            opacity: sub,
          }}
        >
          An excerpt from the 67 second short
        </div>
      </div>
    </>
  );
};

const EndCredit: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [812, 840], [0, 1], { ...clamp, easing: easeOut });
  if (opacity <= 0) return null;
  const rise = interpolate(frame, [812, 842], [20, 0], { ...clamp, easing: easeOut });
  return (
    <>
      <AbsoluteFill style={{ ...scrim(0.92, "42%"), opacity }} />
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          bottom: 146,
          opacity,
          transform: `translateY(${rise}px)`,
          color: CREAM,
          fontFamily: "'Segoe UI', Arial, sans-serif",
          textShadow: "0 2px 18px rgba(0, 0, 0, 0.45)",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "rgba(242, 232, 213, 0.95)",
          }}
        >
          THE BRIDGE THAT FELL FOR A SONG
        </div>
        <div
          style={{
            marginTop: 15,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.03em",
            color: "rgba(242, 232, 213, 0.72)",
          }}
        >
          30 seconds · 900 frames · 30 fps
        </div>
      </div>
    </>
  );
};

export const Example30s: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [1, 0], clamp);
  const fadeOut = interpolate(frame, [890, 900], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <BridgeShort frameMap={storyFrame} />
      <IntroTitle frame={frame} />
      <EndCredit frame={frame} />
      <AbsoluteFill style={{ background: "#000000", opacity: Math.max(fadeIn, fadeOut) }} />
    </AbsoluteFill>
  );
};
