import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  ALERT,
  BONE,
  GRAIN,
  HAIRLINE,
  INK,
  MUTED,
  PAPER,
  Vignette,
  clamp01,
  easeInOutQuint,
  easeOut,
  easeOutQuint,
  mono,
  prog,
  useLoadedFonts,
} from "./theme";

/**
 * Video 2, scenes 4-6. 1920x1080, 30 fps, 5550 frames (3:05).
 *
 * Scene 4    0..2100    tiga pembaca: pohon, tetangga, hutan
 * Scene 5 2100..3750    skor, lalu kalimat yang membongkarnya
 * Scene 6 3750..5550    confusion matrix dan kasus Lamela
 *
 * Standalone: not wired into Video1. Same palette, fonts, and cut grammar.
 */

export const VIDEO2_FRAMES = 5550;

const S5 = 2100;
const S6 = 3750;
/** Cut inside scene 5 and scene 6. */
const S5_STAT = 960;
const S6_ODDS = 870;
const S6_LAMELA = 1170;

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

/** The 29 attributes, same order and values as Video 1. */
const ATTRS: Array<[string, number]> = [
  ["Crossing", 79],
  ["Finishing", 74],
  ["HeadingAccuracy", 62],
  ["ShortPassing", 80],
  ["Volleys", 70],
  ["Dribbling", 85],
  ["Curve", 76],
  ["FKAccuracy", 70],
  ["LongPassing", 75],
  ["BallControl", 84],
  ["Acceleration", 72],
  ["SprintSpeed", 64],
  ["Agility", 82],
  ["Reactions", 80],
  ["Balance", 79],
  ["ShotPower", 81],
  ["Jumping", 64],
  ["Stamina", 69],
  ["Strength", 58],
  ["LongShots", 72],
  ["Aggression", 61],
  ["Interceptions", 53],
  ["Positioning", 76],
  ["Vision", 78],
  ["Penalties", 68],
  ["Composure", 78],
  ["Marking", 52],
  ["StandingTackle", 50],
  ["SlidingTackle", 54],
];

const READERS: Array<[string, string]> = [
  ["DECISION TREE", "bertanya, satu cabang tiap jawaban"],
  ["K-NEAREST NEIGHBOR", "mencari lima profil paling mirip"],
  ["RANDOM FOREST", "200 pohon, satu suara"],
];

const SCORES: Array<{
  name: string;
  acc: number;
  f1: number;
  f1Text: string;
  time: string;
}> = [
  { name: "DECISION TREE", acc: 85.43, f1: 0.8498, f1Text: "0,8498", time: "0,27 s" },
  { name: "K-NEAREST NEIGHBOR", acc: 89.03, f1: 0.8855, f1Text: "0,8855", time: "0,05 s" },
  { name: "RANDOM FOREST", acc: 90.53, f1: 0.9006, f1Text: "0,9006", time: "1,92 s" },
];

const RATINGS = [
  "STRating",
  "LWRating",
  "LFRating",
  "CFRating",
  "RFRating",
  "RWRating",
  "CAMRating",
  "CMRating",
  "LMRating",
  "RMRating",
  "CDMRating",
  "LBRating",
  "LCBRating",
  "CBRating",
  "RCBRating",
  "RBRating",
  "GKRating",
];

const CLASSES = ["DEFENDER", "MIDFIELDER", "FORWARD"];

/** Confusion matrix, Random Forest on the test split. */
const MATRIX = [
  [1165, 81, 0],
  [78, 1275, 49],
  [1, 101, 524],
];

const LAMELA: Array<[string, number]> = [
  ["Finishing", 74],
  ["Dribbling", 85],
  ["ShortPassing", 80],
  ["Vision", 78],
  ["StandingTackle", 50],
];

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

const Page: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  zoom?: number;
  zoomOrigin?: string;
}> = ({ children, bg = BONE, color = INK, zoom = 1, zoomOrigin = "50% 50%" }) => (
  <AbsoluteFill
    style={{
      background: bg,
      color,
      fontFamily: '"Inter Tight", sans-serif',
      overflow: "hidden",
      transform: zoom === 1 ? undefined : `scale(${zoom})`,
      transformOrigin: zoomOrigin,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Label: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 14, color = MUTED, opacity = 1, style }) => (
  <div style={{ ...mono(size), color, opacity, ...style }}>{children}</div>
);

/* ------------------------------------------------------------------ */
/* scene 4 a: the 29-number tape                                       */
/* ------------------------------------------------------------------ */

const TAPE_X = 118;
const TAPE_PITCH = 58;
const TAPE_Y = 140;

const tapePos = (i: number) => ({
  x: TAPE_X + i * TAPE_PITCH,
  y: TAPE_Y,
});

const Tape: React.FC<{ frame: number; dim: number }> = ({ frame, dim }) => {
  const rail = prog(frame, -34, 40, easeOutQuint);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: dim }}>
      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: TAPE_Y + 22,
          width: TAPE_PITCH * 28 + 26,
          height: 1,
          background: HAIRLINE,
          transform: `scaleX(${rail})`,
          transformOrigin: "0% 50%",
        }}
      />
      {ATTRS.map(([, value], i) => {
        const p = prog(frame, -32 + i * 1.4, 12, easeOutQuint);
        if (p <= 0) return null;
        const { x, y } = tapePos(i);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: x + 8,
                top: y - 26,
                width: 1,
                height: 10,
                background: "rgba(23,24,26,0.28)",
                opacity: p,
                transform: `scaleY(${p})`,
                transformOrigin: "50% 100%",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x,
                top: y - 4,
                width: TAPE_PITCH,
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: "0.02em",
                fontVariantNumeric: "tabular-nums",
                color: "rgba(23,24,26,0.70)",
                opacity: p,
                transform: `translateY(${(1 - p) * 9}px)`,
              }}
            >
              {value}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene 4 b: three readers roll in place                              */
/* ------------------------------------------------------------------ */

const ReaderRoll: React.FC<{ frame: number }> = ({ frame }) => {
  const first = 240;
  const step = 60;
  const itemH = 260;
  let pos = 0;
  for (let i = 0; i < READERS.length - 1; i += 1) {
    const at = first + i * step;
    if (frame >= at) pos = i + 1;
    if (frame >= at - 7 && frame < at) pos = i + easeOut((frame - (at - 7)) / 7);
  }
  const inP = prog(frame, 166, 16, easeOutQuint);
  const noteIn = prog(frame, 90, 16);
  const lead = prog(frame, -8, 18, easeOutQuint);
  const leadOut = prog(frame, 146, 18, (t) => t);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 226,
          width: 900,
          opacity: noteIn,
        }}
      >
        <Label size={15} color="rgba(23,24,26,0.50)">
          29 angka / tanpa nama / tanpa klub
        </Label>
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 400,
          width: 1300,
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.06,
          opacity: lead * (1 - leadOut),
          transform: `translateY(${(1 - lead) * 26 - leadOut * 40}px)`,
        }}
      >
        <div>29 angka yang sama.</div>
        <div>tiga cara membaca.</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 430,
          width: 1500,
          height: 190,
          overflow: "hidden",
          opacity: inP,
        }}
      >
        <div style={{ transform: `translateY(${-pos * itemH}px)` }}>
          {READERS.map(([name, note]) => (
            <div key={name} style={{ height: itemH }}>
              <div
                style={{
                  fontSize: 118,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  lineHeight: "128px",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </div>
              <div
                style={{
                  ...mono(19),
                  color: MUTED,
                  marginTop: 22,
                  letterSpacing: "0.10em",
                }}
              >
                {note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* scene 4 c: decision tree                                            */
/* ------------------------------------------------------------------ */

type Node = { x: number; y: number };

const ROOT: Node = { x: 960, y: 392 };
const L2: Node[] = [
  { x: 640, y: 528 },
  { x: 1280, y: 528 },
];
const L3: Node[] = [
  { x: 480, y: 664 },
  { x: 800, y: 664 },
  { x: 1120, y: 664 },
  { x: 1440, y: 664 },
];
const L4: Node[] = [400, 560, 720, 880, 1040, 1200, 1360, 1520].map((x) => ({
  x,
  y: 800,
}));

const LEAF_CLASS = [
  "BEK",
  "BEK",
  "GELANDANG",
  "GELANDANG",
  "GELANDANG",
  "GELANDANG",
  "PENYERANG",
  "PENYERANG",
];

const Edge: React.FC<{
  from: Node;
  to: Node;
  at: number;
  frame: number;
  weight?: number;
}> = ({ from, to, at, frame, weight = 1.6 }) => {
  const p = prog(frame, at, 14, (t) => t);
  if (p <= 0) return null;
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={from.x + (to.x - from.x) * p}
      y2={from.y + (to.y - from.y) * p}
      stroke="rgba(23,24,26,0.55)"
      strokeWidth={weight}
      strokeLinecap="round"
    />
  );
};

const NODE_R = 5;

const NodeDot: React.FC<{ n: Node; at: number; frame: number }> = ({
  n,
  at,
  frame,
}) => {
  const p = prog(frame, at, 12);
  if (p <= 0) return null;
  return (
    <circle
      cx={n.x}
      cy={n.y}
      r={NODE_R * (0.4 + p * 0.6)}
      fill={INK}
      opacity={p}
    />
  );
};

const TreeShot: React.FC<{ frame: number }> = ({ frame }) => {
  const dim = 1;
  const kicker = prog(frame, 26, 18);
  const sub = prog(frame, 40, 18);
  const path = prog(frame, 400, 20);
  const note = prog(frame, 424, 18);

  return (
    <Page>
      <Tape frame={200} dim={dim} />

      <div style={{ position: "absolute", left: TAPE_X, top: 250, opacity: kicker }}>
        <Label size={16} color={INK}>
          satu jalur, satu jawaban
        </Label>
      </div>
      <div style={{ position: "absolute", left: TAPE_X, top: 282, opacity: sub }}>
        <Label size={13} color="rgba(23,24,26,0.46)">
          kedalaman dibatasi 12 / tiap simpul satu pertanyaan
        </Label>
      </div>

      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <Edge from={ROOT} to={L2[0]} at={14} frame={frame} />
        <Edge from={ROOT} to={L2[1]} at={26} frame={frame} />
        <Edge from={L2[0]} to={L3[0]} at={50} frame={frame} />
        <Edge from={L2[0]} to={L3[1]} at={62} frame={frame} />
        <Edge from={L2[1]} to={L3[2]} at={74} frame={frame} />
        <Edge from={L2[1]} to={L3[3]} at={86} frame={frame} />
        {L3.map((n, i) => (
          <React.Fragment key={`e3-${i}`}>
            <Edge from={n} to={L4[i * 2]} at={112 + i * 10} frame={frame} />
            <Edge from={n} to={L4[i * 2 + 1]} at={118 + i * 10} frame={frame} />
          </React.Fragment>
        ))}

        <NodeDot n={ROOT} at={22} frame={frame} />
        {L2.map((n, i) => (
          <NodeDot key={`n2-${i}`} n={n} at={40 + i * 10} frame={frame} />
        ))}
        {L3.map((n, i) => (
          <NodeDot key={`n3-${i}`} n={n} at={78 + i * 10} frame={frame} />
        ))}
        {L4.map((n, i) => (
          <NodeDot key={`n4-${i}`} n={n} at={140 + i * 6} frame={frame} />
        ))}

        {/* the single path the tree actually takes */}
        {path > 0 && (
          <g
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            opacity={path}
            strokeDasharray={1}
            pathLength={1}
          >
            <line x1={ROOT.x} y1={ROOT.y} x2={L2[0].x} y2={L2[0].y} />
            <line x1={L2[0].x} y1={L2[0].y} x2={L3[1].x} y2={L3[1].y} />
            <line x1={L3[1].x} y1={L3[1].y} x2={L4[3].x} y2={L4[3].y} />
          </g>
        )}
      </svg>

      <QTag at={34} frame={frame} text="Finishing?" x={ROOT.x + 20} y={ROOT.y - 38} />
      <QTag
        at={74}
        frame={frame}
        text="StandingTackle?"
        x={L2[0].x - 178}
        y={L2[0].y - 40}
      />
      <QTag at={86} frame={frame} text="Vision?" x={L2[1].x + 20} y={L2[1].y - 38} />

      {L4.map((n, i) => {
        const p = prog(frame, 300 + i * 4, 16);
        if (p <= 0) return null;
        const hot = i === 3;
        return (
          <div
            key={`leaf-${i}`}
            style={{
              position: "absolute",
              left: n.x - 90,
              top: 840,
              width: 180,
              textAlign: "center",
              ...mono(17),
              color: hot ? INK : "rgba(23,24,26,0.42)",
              fontWeight: hot ? 600 : 500,
              opacity: p,
              transform: `translateY(${(1 - p) * 8}px)`,
            }}
          >
            {LEAF_CLASS[i]}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 900,
          opacity: note,
          transform: `translateY(${(1 - note) * 10}px)`,
        }}
      >
        <Label size={13} color="rgba(23,24,26,0.46)">
          empat kedalaman cukup untuk memisahkan sebagian besar kasus
        </Label>
      </div>
    </Page>
  );
};

const QTag: React.FC<{
  at: number;
  frame: number;
  text: string;
  x: number;
  y: number;
}> = ({ at, frame, text, x, y }) => {
  const p = prog(frame, at, 16);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "4px 10px",
        background: BONE,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 16,
        letterSpacing: "0.04em",
        color: INK,
        whiteSpace: "nowrap",
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
      }}
    >
      {text}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene 4 d: k-nearest neighbor                                       */
/* ------------------------------------------------------------------ */

const PLOT = { x0: 400, x1: 1180, y0: 340, y1: 880, min: 48, max: 86 };

const scatterX = (v: number) =>
  PLOT.x0 + ((v - PLOT.min) / (PLOT.max - PLOT.min)) * (PLOT.x1 - PLOT.x0);
const scatterY = (v: number) =>
  PLOT.y1 - ((v - PLOT.min) / (PLOT.max - PLOT.min)) * (PLOT.y1 - PLOT.y0);

/** 29 dots placed on the same two axes as the notebook chart. */
const SCATTER = ATTRS.map(([, value], i) => ({
  x: scatterX(value),
  y: scatterY(ATTRS[(i + 7) % ATTRS.length][1]),
}));

const CX = SCATTER.reduce((s, p) => s + p.x, 0) / SCATTER.length;
const CY = SCATTER.reduce((s, p) => s + p.y, 0) / SCATTER.length;
const dist2 = (p: { x: number; y: number }) => (p.x - CX) ** 2 + (p.y - CY) ** 2;
/** The query point sits inside the cloud, so five neighbours read as around it. */
const QUERY = SCATTER.reduce(
  (best, p, i) => (dist2(p) < dist2(SCATTER[best]) ? i : best),
  0
);

const NEIGHBORS = SCATTER.map((p, i) => ({
  i,
  d: (p.x - SCATTER[QUERY].x) ** 2 + (p.y - SCATTER[QUERY].y) ** 2,
}))
  .filter((n) => n.i !== QUERY)
  .sort((a, b) => a.d - b.d)
  .slice(0, 5)
  .map((n) => n.i);

const KnnShot: React.FC<{ frame: number }> = ({ frame }) => {
  const collapse = prog(frame, 0, 20, (t) => t);
  const axis = prog(frame, 10, 30, easeOutQuint);
  const ghost = prog(frame, 108, 10) * (1 - prog(frame, 153, 12));
  const ring = prog(frame, 96, 16);
  const caption = prog(frame, 170, 18);
  const q = SCATTER[QUERY];

  return (
    <Page>
      <Tape frame={200} dim={0.34 + collapse * 0.66} />

      <div
        style={{
          position: "absolute",
          left: 1250,
          top: 350,
          width: 620,
          height: 438,
          opacity: ghost * 0.3,
          mixBlendMode: "multiply",
        }}
      >
        <Img
          src={staticFile("fifa/assets/notebook-03-sebaran-atribut.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "grayscale(1)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: PLOT.x0,
          top: PLOT.y1,
          width: PLOT.x1 - PLOT.x0,
          height: 1,
          background: "rgba(23,24,26,0.22)",
          transform: `scaleX(${axis})`,
          transformOrigin: "0% 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PLOT.x0,
          top: PLOT.y0,
          width: 1,
          height: PLOT.y1 - PLOT.y0,
          background: "rgba(23,24,26,0.22)",
          transform: `scaleY(${axis})`,
          transformOrigin: "50% 100%",
        }}
      />
      <div style={{ position: "absolute", left: PLOT.x0, top: PLOT.y0 - 34, opacity: axis }}>
        <Label size={13} color="rgba(23,24,26,0.44)">
          standing tackle
        </Label>
      </div>
      <div
        style={{
          position: "absolute",
          left: PLOT.x1 - 120,
          top: PLOT.y1 + 14,
          opacity: axis,
        }}
      >
        <Label size={13} color="rgba(23,24,26,0.44)">
          finishing
        </Label>
      </div>

      {SCATTER.map((p, i) => {
        const start = 12 + i * 1.6;
        const t = prog(frame, start, 34, easeInOutQuint);
        if (t <= 0) return null;
        if (i === QUERY) return null;
        const from = tapePos(i);
        const x = from.x + 8 + (p.x - from.x - 8) * t;
        const y = from.y + 6 + (p.y - from.y - 6) * t;
        const near = NEIGHBORS.includes(i);
        const nearIn = near ? prog(frame, 112 + NEIGHBORS.indexOf(i) * 7, 14) : 0;
        const r = 4.2 + nearIn * 2.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: near ? "rgba(23,24,26,0.92)" : "rgba(23,24,26,0.48)",
            }}
          />
        );
      })}

      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {NEIGHBORS.map((idx, k) => {
          const p = prog(frame, 108 + k * 7, 18, (t) => t);
          if (p <= 0) return null;
          const n = SCATTER[idx];
          return (
            <line
              key={idx}
              x1={q.x}
              y1={q.y}
              x2={q.x + (n.x - q.x) * p}
              y2={q.y + (n.y - q.y) * p}
              stroke="rgba(23,24,26,0.52)"
              strokeWidth={1.7}
            />
          );
        })}
      </svg>

      {ring > 0 && (
        <>
          <div
            style={{
              position: "absolute",
              left: q.x - 11,
              top: q.y - 11,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: PAPER,
              border: `2px solid ${INK}`,
              transform: `scale(${0.4 + ring * 0.6})`,
            }}
          />
        </>
      )}

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 946,
          opacity: caption,
          transform: `translateY(${(1 - caption) * 10}px)`,
        }}
      >
        <Label size={14} color="rgba(23,24,26,0.50)">
          k = 5 / jarak terdekat, lalu suara terbanyak
        </Label>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 4 e: random forest tally                                      */
/* ------------------------------------------------------------------ */

const FOREST_N = 200;
const FOREST_BASE = 880;
const GROUP_X = [520, 960, 1420];

const groupOf = (i: number) => {
  const m = i % 7;
  if (m < 2) return 0;
  if (m < 5) return 1;
  return 2;
};

/** Index inside its own group, and the size of that group. */
const groupIndex = (i: number) => {
  const g = groupOf(i);
  let before = 0;
  let total = 0;
  for (let k = 0; k < FOREST_N; k += 1) {
    if (groupOf(k) === g) {
      if (k < i) before += 1;
      total += 1;
    }
  }
  return { before, total };
};

const ForestShot: React.FC<{ frame: number }> = ({ frame }) => {
  const cluster = prog(frame, 116, 74, easeInOutQuint);
  const win = prog(frame, 206, 22);
  const note = prog(frame, 232, 18);
  const caption = prog(frame, 250, 16);

  return (
    <Page>
      <Tape frame={200} dim={0.3} />

      <div style={{ position: "absolute", left: TAPE_X, top: 226, opacity: note }}>
        <Label size={15} color="rgba(23,24,26,0.55)">
          200 pohon / masing-masing memungut satu suara
        </Label>
      </div>

      {Array.from({ length: FOREST_N }, (_, i) => {
        const grow = prog(frame, 4 + i * 0.55, 20, easeOutQuint);
        if (grow <= 0) return null;
        const h = 46 + ((i * 37) % 96);
        const { before, total } = groupIndex(i);
        const g = groupOf(i);
        const startX = TAPE_X + i * 8.35;
        const targetX = GROUP_X[g] - (total * 3.2) / 2 + before * 3.2;
        const x = startX + (targetX - startX) * cluster;
        const hot = g === 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: FOREST_BASE - h,
              width: 2,
              height: h,
              background: hot
                ? "rgba(23,24,26,0.78)"
                : "rgba(23,24,26,0.34)",
              transform: `scaleY(${grow})`,
              transformOrigin: "50% 100%",
            }}
          />
        );
      })}

      {CLASSES.map((name, i) => {
        const p = prog(frame, 200 + i * 10, 18);
        if (p <= 0) return null;
        const hot = i === 1;
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: GROUP_X[i] - 160,
              top: 912,
              width: 320,
              textAlign: "center",
              ...mono(18),
              color: hot ? INK : "rgba(23,24,26,0.42)",
              fontWeight: hot ? 600 : 500,
              opacity: p,
            }}
          >
            {name}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: GROUP_X[1] - 170,
          top: 960,
          width: 340,
          height: 6,
          background: INK,
          transform: `scaleX(${win})`,
          transformOrigin: "50% 50%",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 990,
          opacity: caption,
        }}
      >
        <Label size={13} color="rgba(23,24,26,0.44)">
          kelas dengan suara terbanyak dipilih tanpa ambang khusus
        </Label>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 4 f: the leak, then the split                                 */
/* ------------------------------------------------------------------ */

const LeakShot: React.FC<{ frame: number }> = ({ frame }) => {
  const blockIn = prog(frame, 6, 22);
  const red = prog(frame, 150, 34, (t) => t);
  const redLabel = prog(frame, 186, 16);
  const split = prog(frame, 240, 34, (t) => t);
  const splitLabel = prog(frame, 268, 18);

  const cols = 6;
  const colW = 210;
  const rowH = 46;

  return (
    <Page>
      <div style={{ position: "absolute", left: TAPE_X, top: 168, opacity: blockIn }}>
        <Label size={13} color="rgba(23,24,26,0.46)">
          kolom rating posisi / ikut terbuang
        </Label>
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 200,
          width: cols * colW,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${colW}px)`,
          rowGap: 10,
          opacity: blockIn,
          transform: `translateY(${(1 - blockIn) * 12}px)`,
        }}
      >
        {RATINGS.map((name, i) => {
          const p = prog(frame, 10 + i * 2.4, 14);
          return (
            <div
              key={name}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 15,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: `rgba(23,24,26,${0.30 + p * 0.26})`,
              }}
            >
              {name}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 200 + Math.ceil(RATINGS.length / cols) * rowH + 16,
          width: cols * colW - 30,
          height: 7,
          background: ALERT,
          transform: `scaleX(${red})`,
          transformOrigin: "0% 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 200 + Math.ceil(RATINGS.length / cols) * rowH + 38,
          opacity: redLabel,
        }}
      >
        <Label size={15} color={ALERT}>
          kunci jawaban
        </Label>
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 700,
          width: 1684,
          opacity: split,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <Label size={14} color="rgba(23,24,26,0.50)">
            split stratified 80:20
          </Label>
          <Label size={14} color="rgba(23,24,26,0.50)">
            satu kali di awal, dipakai tiga model
          </Label>
        </div>
        <div style={{ display: "flex", height: 24 }}>
          <div
            style={{
              width: "80%",
              background: INK,
              transform: `scaleX(${split})`,
              transformOrigin: "0% 50%",
            }}
          />
          <div style={{ width: "20%", display: "flex" }}>
            <div
              style={{
                width: "100%",
                background: "rgba(23,24,26,0.34)",
                transform: `scaleX(${split})`,
                transformOrigin: "0% 50%",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
            opacity: splitLabel,
          }}
        >
          <Label size={22} color={INK}>
            13.093 latih
          </Label>
          <Label size={22} color={MUTED}>
            3.274 uji
          </Label>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 560,
          width: 900,
          opacity: redLabel,
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.18,
            color: "rgba(23,24,26,0.72)",
          }}
        >
          Kolom rating sudah berisi jawabannya. Kalau masuk, model tinggal
          menyalin.
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 5 a: the score ledger                                         */
/* ------------------------------------------------------------------ */

const ScoreLedger: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;

  return (
    <Page zoom={1 + local * 0.000022}>
      {SCORES.map((row, i) => {
        const y = 190 + i * 230;
        const accStart = 46 + i * 14;
        const acc = interpolate(local, [accStart, accStart + 46], [0, row.acc], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const f1Start = 480 + i * 10;
        const f1 = interpolate(local, [f1Start, f1Start + 32], [0, row.f1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const nameIn = prog(local, 6 + i * 12, 20);
        const f1In = prog(local, f1Start, 18);
        const timeIn = prog(local, 720 + i * 8, 20);
        const hot = i === 2;
        const rule = prog(local, 300 + i * 20, 24, (t) => t);

        return (
          <React.Fragment key={row.name}>
            <div
              style={{
                position: "absolute",
                left: TAPE_X,
                top: y + 58,
                width: 430,
                ...mono(21),
                color: INK,
                fontWeight: hot ? 600 : 500,
                opacity: nameIn,
                transform: `translateY(${(1 - nameIn) * 10}px)`,
              }}
            >
              {row.name}
            </div>

            <div
              style={{
                position: "absolute",
                left: 560,
                top: y,
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 104,
                fontWeight: hot ? 600 : 500,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                color: INK,
                opacity: nameIn,
              }}
            >
              <span>{acc.toFixed(2).replace(".", ",")}</span>
              <span style={{ fontSize: 34, letterSpacing: "0.02em", color: MUTED }}>
                %
              </span>
            </div>

            {hot && (
              <div
                style={{
                  position: "absolute",
                  left: 560,
                  top: y + 122,
                  width: 520,
                  height: 8,
                  background: INK,
                  transform: `scaleX(${rule})`,
                  transformOrigin: "0% 50%",
                }}
              />
            )}

            <div
              style={{
                position: "absolute",
                left: 1180,
                top: y + 28,
                opacity: f1In,
              }}
            >
              <Label size={12} color="rgba(23,24,26,0.46)">
                f1 macro
              </Label>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 40,
                  fontVariantNumeric: "tabular-nums",
                  marginTop: 8,
                  color: INK,
                }}
              >
                {f1.toFixed(4).replace(".", ",")}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: 118,
                top: y + 28,
                textAlign: "right",
                opacity: timeIn,
                transform: `translateY(${(1 - timeIn) * 10}px)`,
              }}
            >
              <Label size={12} color="rgba(23,24,26,0.46)">
                waktu latih
              </Label>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 36,
                  fontVariantNumeric: "tabular-nums",
                  marginTop: 8,
                  color: hot ? INK : "rgba(23,24,26,0.66)",
                }}
              >
                {row.time}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 900,
          opacity: prog(local, 40, 20),
        }}
      >
        <Label size={14} color="rgba(23,24,26,0.50)">
          satu data uji, tiga model, akurasi pada 3.274 pemain
        </Label>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 5 b: the number behind the sentence                           */
/* ------------------------------------------------------------------ */

const ScoreStat: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const mark = prog(local, 0, 30, easeInOutQuint);
  const l1 = prog(local, 240, 18, easeOutQuint);
  const l2 = prog(local, 252, 18, easeOutQuint);
  const l3 = prog(local, 264, 18, easeOutQuint);
  const inv = prog(local, 286, 22, easeInOutQuint);
  const classes = prog(local, 400, 22);
  const drift = prog(local, 0, 690, (t) => t);

  return (
    <Page>
      <div
        style={{
          position: "absolute",
          left: 700 - drift * 10,
          top: 170,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 380,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          color: INK,
          opacity: 0.12 * mark,
          transform: `scale(${1 + drift * 0.05})`,
          transformOrigin: "0% 0%",
        }}
      >
        90,53
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 300,
          width: 1000,
          fontSize: 116,
          fontWeight: 700,
          letterSpacing: "-0.045em",
          lineHeight: 1.04,
        }}
      >
        <div
          style={{
            clipPath: `inset(0 ${(1 - l1) * 100}% 0 0)`,
          }}
        >
          Rata-rata
        </div>
        <div
          style={{
            clipPath: `inset(0 ${(1 - l2) * 100}% 0 0)`,
          }}
        >
          menyembunyikan
        </div>
        <div style={{ height: 128, overflow: "hidden" }}>
          <div
            style={{
              transform: `translateY(${(1 - l3) * 100}%)`,
              display: "inline-block",
            }}
          >
            <span
              style={{
                position: "relative",
                display: "inline-block",
                padding: "2px 18px 12px",
                color: inv > 0.5 ? PAPER : INK,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  background: INK,
                  transform: `scaleX(${inv})`,
                  transformOrigin: "0% 50%",
                }}
              />
              <span style={{ position: "relative" }}>satu kelas.</span>
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 800,
          display: "flex",
          gap: 64,
          opacity: classes,
          transform: `translateY(${(1 - classes) * 14}px)`,
        }}
      >
        {[
          ["DEFENDER", "38,06", false],
          ["MIDFIELDER", "42,81", false],
          ["FORWARD", "19,12", true],
        ].map(([name, pct, hot]) => (
          <div key={name as string} style={{ ...mono(19) }}>
            <span style={{ color: hot ? INK : "rgba(23,24,26,0.34)" }}>
              {name as string}
            </span>
            <span
              style={{
                marginLeft: 14,
                color: hot ? INK : "rgba(23,24,26,0.34)",
                fontWeight: 600,
              }}
            >
              {pct as string}
            </span>
          </div>
        ))}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 6 a: confusion matrix                                         */
/* ------------------------------------------------------------------ */

const GX = 420;
const GY = 320;
const CW = 260;
const CH = 160;

const cellX = (c: number) => GX + c * CW;
const cellY = (r: number) => GY + r * CH;

const Confusion: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const heads = prog(local, 34, 20);
  const ghost = prog(local, 0, 22) * 0.14;
  const early = prog(local, 380, 20) * (1 - prog(local, 590, 16));
  const hit = prog(local, 570, 22);
  const redLine = prog(local, 592, 24, (t) => t);
  const redNote = prog(local, 620, 20);

  return (
    <Page>
      <div
        style={{
          position: "absolute",
          left: 1260,
          top: 250,
          width: 660,
          height: 538,
          opacity: ghost,
          mixBlendMode: "multiply",
          filter: "blur(2px) grayscale(1)",
        }}
      >
        <Img
          src={staticFile("fifa/assets/notebook-04-confusion.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 1160,
          top: 0,
          width: 360,
          height: 1080,
          background:
            "linear-gradient(90deg, rgba(231,231,228,0.95) 0%, rgba(231,231,228,0) 100%)",
        }}
      />

      {/* matrix hairlines: the grid is the chart, not decoration */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`vg-${i}`}
          style={{
            position: "absolute",
            left: GX + i * CW,
            top: GY,
            width: 1,
            height: 3 * CH,
            background: "rgba(23,24,26,0.10)",
            transform: `scaleY(${heads})`,
            transformOrigin: "50% 0%",
          }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`hg-${i}`}
          style={{
            position: "absolute",
            left: GX,
            top: GY + i * CH,
            width: 3 * CW,
            height: 1,
            background: "rgba(23,24,26,0.10)",
            transform: `scaleX(${heads})`,
            transformOrigin: "0% 50%",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: GX,
          top: 244,
          width: 3 * CW,
          display: "flex",
          justifyContent: "flex-end",
          opacity: heads,
        }}
      >
        <Label size={13} color="rgba(23,24,26,0.46)">
          ditebak
        </Label>
      </div>
      <div
        style={{
          position: "absolute",
          left: GX - 30 - 240,
          top: 244,
          width: 240,
          textAlign: "right",
          opacity: heads,
        }}
      >
        <Label size={13} color="rgba(23,24,26,0.46)">
          sebenarnya
        </Label>
      </div>

      {CLASSES.map((name, c) => (
        <div
          key={`c-${name}`}
          style={{
            position: "absolute",
            left: cellX(c),
            top: 278,
            width: CW,
            textAlign: "center",
            ...mono(17),
            color: "rgba(23,24,26,0.56)",
            opacity: heads,
          }}
        >
          {name}
        </div>
      ))}

      {CLASSES.map((name, r) => (
        <div
          key={`r-${name}`}
          style={{
            position: "absolute",
            left: GX - 30 - 240,
            top: cellY(r) + 66,
            width: 240,
            textAlign: "right",
            ...mono(17),
            color: "rgba(23,24,26,0.56)",
            opacity: heads,
          }}
        >
          {name}
        </div>
      ))}

      {MATRIX.map((row, r) =>
        row.map((value, c) => {
          const at = 210 + (r * 3 + c) * 6;
          const p = prog(local, at, 16, easeOutQuint);
          if (p <= 0) return null;
          const diag = r === c;
          const hero = r === 2 && c === 1;
          const scale = hero ? 1 + hit * 0.28 : 1;
          const color =
            value === 0
              ? "rgba(23,24,26,0.16)"
              : hero
                ? ALERT
                : diag
                  ? INK
                  : "rgba(23,24,26,0.42)";
          return (
            <div
              key={`m-${r}-${c}`}
              style={{
                position: "absolute",
                left: cellX(c),
                top: cellY(r) + 34,
                width: CW,
                textAlign: "center",
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 84,
                lineHeight: 1,
                fontWeight: diag || hero ? 600 : 500,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                color,
                opacity: p,
                transform: `scale(${scale * (0.94 + p * 0.06)})`,
                transformOrigin: "50% 50%",
              }}
            >
              {value.toLocaleString("id-ID")}
            </div>
          );
        })
      )}

      <div
        style={{
          position: "absolute",
          left: cellX(1) + 30,
          top: cellY(2) + 132,
          width: CW - 60,
          height: 3,
          background: ALERT,
          transform: `scaleX(${redLine})`,
          transformOrigin: "0% 50%",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: GX,
          top: 852,
          opacity: early,
        }}
      >
        <Label size={14} color="rgba(23,24,26,0.50)">
          626 penyerang di data uji / 524 dikenali benar
        </Label>
      </div>

      <div
        style={{
          position: "absolute",
          left: GX,
          top: 852,
          opacity: redNote,
          transform: `translateY(${(1 - redNote) * 8}px)`,
        }}
      >
        <Label size={15} color={ALERT}>
          forward dikira midfielder
        </Label>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 6 b: precision and recall                                     */
/* ------------------------------------------------------------------ */

const Odds: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const slide = prog(local, 0, 34, easeOutQuint);
  const inv = prog(local, 62, 26, easeInOutQuint);
  const note = prog(local, 168, 20);

  return (
    <Page>
      <div
        style={{
          position: "absolute",
          left: TAPE_X - (1 - slide) * 90,
          top: 400,
        }}
      >
        <Label size={19} color="rgba(23,24,26,0.50)">
          precision
        </Label>
      </div>
      <div
        style={{
          position: "absolute",
          left: TAPE_X - (1 - slide) * 90,
          top: 436,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums",
          color: INK,
        }}
      >
        91,45
      </div>

      <div
        style={{
          position: "absolute",
          left: 1052,
          top: 386,
          width: 566,
          height: 210,
          background: INK,
          transform: `scaleX(${inv})`,
          transformOrigin: "0% 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1090 + (1 - slide) * 90,
          top: 400,
        }}
      >
        <Label
          size={19}
          color={inv > 0.55 ? "rgba(246,246,243,0.72)" : "rgba(23,24,26,0.50)"}
        >
          recall
        </Label>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1090 + (1 - slide) * 90,
          top: 436,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums",
          color: inv > 0.55 ? PAPER : INK,
        }}
      >
        83,71
      </div>

      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 700,
          width: 620,
          opacity: note,
          transform: `translateY(${(1 - note) * 12}px)`,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            color: "rgba(23,24,26,0.66)",
          }}
        >
          Jarang salah menuduh penyerang.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1090,
          top: 700,
          width: 620,
          opacity: note,
          transform: `translateY(${(1 - note) * 12}px)`,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            color: INK,
          }}
        >
          Sering melewatkan penyerang asli.
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 6 c: Lamela                                                   */
/* ------------------------------------------------------------------ */

const LamelaShot: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const photo = prog(local, 0, 30, easeOutQuint);
  const wordA = prog(local, 34, 22, easeOutQuint);
  const wordB = prog(local, 46, 22, easeOutQuint);
  const note = prog(local, 320, 20);

  return (
    <Page zoom={1 + local * 0.000042}>
      <div
        style={{
          position: "absolute",
          left: TAPE_X,
          top: 250 + (1 - photo) * 28,
          width: 440,
          height: 550,
          padding: 12,
          boxSizing: "border-box",
          background: PAPER,
          outline: `1px solid ${HAIRLINE}`,
          opacity: photo,
          transform: `rotate(-1.2deg)`,
        }}
      >
        <Img
          src={staticFile("fifa/assets/lamela-2020.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 20%",
            filter: "grayscale(1) contrast(1.05) brightness(0.96)",
          }}
        />
      </div>

      <div style={{ position: "absolute", left: TAPE_X, top: 826, opacity: photo }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          ÉRIK LAMELA
        </div>
        <div
          style={{
            ...mono(13),
            color: "rgba(23,24,26,0.52)",
            lineHeight: 1.72,
            marginTop: 12,
          }}
        >
          <div>sayap kanan / sevilla</div>
          <div>foto 2020 / data fifa 23</div>
          <div>foto: steffen prößdorf / cc by-sa 4.0</div>
          <div>diubah: crop / duotone</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 700,
          top: 284,
        }}
      >
        <Label size={13} color="rgba(23,24,26,0.46)">
          lima dari 29 atribut
        </Label>
      </div>

      {LAMELA.map(([name, value], i) => {
        const rowIn = prog(local, 60 + i * 8, 18, easeOutQuint);
        const lit = prog(local, 180 + i * 10, 18, easeOutQuint);
        return (
          <React.Fragment key={name}>
            <div
              style={{
                position: "absolute",
                left: 700,
                top: 330 + i * 92,
                width: 260,
                ...mono(15),
                color: "rgba(23,24,26,0.44)",
                opacity: rowIn * (0.6 + lit * 0.4),
              }}
            >
              {name}
            </div>
            <div
              style={{
                position: "absolute",
                left: 940,
                top: 306 + i * 92,
                width: 236,
                textAlign: "right",
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 46,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                color: INK,
                opacity: rowIn * (0.24 + lit * 0.76),
                transform: `translateY(${(1 - rowIn) * 10}px)`,
              }}
            >
              {value}
            </div>
          </React.Fragment>
        );
      })}

      <div style={{ position: "absolute", left: 1240, top: 268, opacity: wordA }}>
        <Label size={13} color="rgba(23,24,26,0.46)">
          tercatat
        </Label>
      </div>
      <div style={{ position: "absolute", left: 1240, top: 296, overflow: "hidden", height: 110 }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            whiteSpace: "nowrap",
            transform: `translateY(${(1 - wordA) * 100}%)`,
          }}
        >
          PENYERANG
        </div>
      </div>

      <div style={{ position: "absolute", left: 1240, top: 700, opacity: wordB }}>
        <Label size={13} color="rgba(23,24,26,0.46)">
          menurut model
        </Label>
      </div>
      <div style={{ position: "absolute", left: 1240, top: 728, overflow: "hidden", height: 110 }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            whiteSpace: "nowrap",
            background: INK,
            color: PAPER,
            padding: "0 16px 6px",
            transform: `translateY(${(1 - wordB) * 100}%)`,
            display: "inline-block",
          }}
        >
          GELANDANG
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 700,
          top: 806,
          opacity: note,
        }}
      >
        <Label size={14} color="rgba(23,24,26,0.50)">
          contoh dari data uji, bukan temuan baru
        </Label>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene sheet wipe                                                    */
/* ------------------------------------------------------------------ */

const WIPES = [360, 900, 1380, 1680, 2100, S5 + S5_STAT, 3750, S6 + S6_ODDS, S6 + S6_LAMELA];

const SceneWipe: React.FC<{ frame: number }> = ({ frame }) => {
  const half = 10;
  for (const cut of WIPES) {
    const t = frame - (cut - half);
    if (t < 0 || t > half * 2) continue;
    const p = Easing.inOut(Easing.cubic)(clamp01(t / (half * 2)));
    const y = 1080 - p * 2160;
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: 1920,
          height: 1080,
          background: INK,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: 6,
            background: BONE,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: GRAIN,
            opacity: 0.07,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }
  return null;
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 360) {
    return (
      <Page>
        <Tape frame={frame} dim={1} />
        <ReaderRoll frame={frame} />
      </Page>
    );
  }
  if (frame < 900) return <TreeShot frame={frame - 360} />;
  if (frame < 1380) return <KnnShot frame={frame - 900} />;
  if (frame < 1680) return <ForestShot frame={frame - 1380} />;
  return <LeakShot frame={frame - 1680} />;
};

const Scene5: React.FC<{ frame: number }> = ({ frame }) =>
  frame < S5_STAT ? <ScoreLedger frame={frame} /> : <ScoreStat frame={frame - S5_STAT} />;

const Scene6: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < S6_ODDS) return <Confusion frame={frame} />;
  if (frame < S6_LAMELA) return <Odds frame={frame - S6_ODDS} />;
  return <LamelaShot frame={frame - S6_LAMELA} />;
};

export const FifaVideo2: React.FC = () => {
  const css = useLoadedFonts("fifa video 2 fonts");
  const frame = useCurrentFrame();

  let body: React.ReactNode;
  if (frame < S5) {
    body = <Scene4 frame={frame} />;
  } else if (frame < S6) {
    body = <Scene5 frame={frame - S5} />;
  } else {
    body = <Scene6 frame={frame - S6} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: BONE, overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {body}
      <Vignette />
      <SceneWipe frame={frame} />
    </AbsoluteFill>
  );
};
