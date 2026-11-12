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
  DEEP,
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
 * Video 1, scenes 1-3. 1920x1080, 30 fps, 5580 frames (3:06).
 *
 * Intro   0..180     dua tugas yang mirip, lalu yang pertama dipilih
 * Scene 1 180..1920  pemain tanpa wajah, papan bukti Lamela
 * Scene 2 1920..3810 rapor, bukan pertandingan
 * Scene 3 3810..5580 bersihkan data
 */

export const VIDEO1_FRAMES = 5580;

const INTRO_END = 180;
const S1 = 0;
const S2 = 1920;
const S3 = 3810;

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

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

const ATTR_NAMES = new Set(ATTRS.map(([n]) => n));

/** 84 data rows that fill the question mark, top to bottom. */
const ROWS = Array.from({ length: 84 }, (_, i) => {
  const parts: string[] = [];
  for (let k = 0; k < 5; k += 1) {
    const [name, value] = ATTRS[(i + k * 5) % ATTRS.length];
    parts.push(`${name} ${value}`);
  }
  return { y: 70 + i * 11.4, text: parts.join("  /  ") };
});


const META = [
  "Name",
  "Age",
  "Nationality",
  "NationalTeam",
  "Club",
  "BestPosition",
  "Positions",
  "Overall",
  "Potential",
  "Growth",
  "TotalStats",
  "BaseStats",
  "Value",
  "Wage",
  "ReleaseClause",
  "ContractUntil",
  "Height",
  "Weight",
  "PreferredFoot",
  "WeakFoot",
  "SkillMoves",
  "WorkRate",
  "BodyType",
  "RealFace",
  "AttackWorkRate",
  "DefenseWorkRate",
];

const TOTALS = [
  "PaceTotal",
  "ShootingTotal",
  "PassingTotal",
  "DribblingTotal",
  "DefendingTotal",
  "PhysicalityTotal",
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

const GK = ["GKDiving", "GKHandling", "GKKicking", "GKPositioning", "GKReflexes"];

const FILLER = [
  "ID",
  "Photo",
  "Flag",
  "ClubLogo",
  "IntReputation",
  "JerseyNumber",
  "PreferredPositions",
];

const COLUMNS = [
  ...META,
  ...TOTALS,
  ...ATTRS.map(([n]) => n),
  ...RATINGS,
  ...GK,
  ...FILLER,
];

const LEDGER: Array<[string, number]> = [
  ["Finishing", 74],
  ["Dribbling", 85],
  ["ShortPassing", 80],
  ["Vision", 78],
  ["StandingTackle", 50],
];

const WORDS = ["BEK", "GELANDANG", "PENYERANG", "GELANDANG"];

const DROPPED = [
  "Overall",
  "Potential",
  "TotalStats",
  "BaseStats",
  "Growth",
  "GKDiving",
  "GKHandling",
  "GKKicking",
  "GKPositioning",
  "GKReflexes",
];

/* ------------------------------------------------------------------ */
/* page frame                                                          */
/* ------------------------------------------------------------------ */

const Page: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  fade?: number;
  zoom?: number;
}> = ({ children, bg = BONE, color = INK, fade = 1, zoom = 1 }) => (
  <AbsoluteFill
    style={{
      background: bg,
      color,
      fontFamily: '"Inter Tight", sans-serif',
      overflow: "hidden",
      opacity: fade,
      transform: zoom === 1 ? undefined : `scale(${zoom})`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* the question mark, one object in two tones                          */
/* ------------------------------------------------------------------ */

const MARK_W = 1000;
const MARK_H = 1080;
const MARK_BASE = 1062;
/** Archivo Black glyph box: 700 units tall, baseline at 0, 1000 upm. */
const MARK_FONT = 1500;
const MARK_SX = 1.16;
const MARK_SCALE = MARK_FONT / 1000;
/** Center the ink by its advance width, not by the ink box. */
const MARK_TX = MARK_W / 2 - 305.5 * MARK_SCALE * MARK_SX;
const MARK_TRANSFORM = `translate(${MARK_TX} ${MARK_BASE}) scale(${MARK_SX} 1) scale(${MARK_SCALE}) scale(1 -1)`;
const MARK_PATH =
  "M566 496Q566 457 549 426.5Q532 396 509 375Q486 354 451 329Q422 307 408.5 294Q395 281 395 267V246H224V296Q224 320 239 339.5Q254 359 286 389Q319 418 336.5 441Q354 464 354 492Q354 521 336 541.5Q318 562 288 562Q223 562 223 478Q223 460 224 451H40Q39 458 38 467Q37 476 37 489Q37 553 72 600.5Q107 648 169.5 674Q232 700 310 700Q386 700 444 675Q502 650 534 603.5Q566 557 566 496ZM212 0V185H410V0Z";

type MarkTone = "dark" | "paper";

/**
 * One giant question mark. The outline is a real path so the dash draw is
 * exact, and 84 mono data rows are masked by the same glyph. Both the cold
 * open and scene 1 use this, so the swap at 180 reads as the same object.
 */
const QuestionMark: React.FC<{
  tone: MarkTone;
  frame: number;
  left: number;
  id: string;
  outlineStart: number;
  outlineDur: number;
  rowStart: number;
  rowStagger?: number;
  rowDur?: number;
  scale?: number;
}> = ({
  tone,
  frame,
  left,
  id,
  outlineStart,
  outlineDur,
  rowStart,
  rowStagger = 0.35,
  rowDur = 8,
  scale = 1,
}) => {
  const draw = prog(frame, outlineStart, outlineDur, easeOutQuint);
  const dark = tone === "dark";
  const rowFill = dark ? "rgba(231,231,228,0.55)" : "rgba(23,24,26,0.78)";
  const outline = dark ? "rgba(231,231,228,0.32)" : "rgba(23,24,26,0.62)";

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 0,
        width: MARK_W,
        height: MARK_H,
        transform: `scale(${scale})`,
        transformOrigin: "50% 60%",
      }}
    >
      <svg width={MARK_W} height={MARK_H} viewBox={`0 0 ${MARK_W} ${MARK_H}`}>
        <defs>
          <mask
            id={`${id}-glyph`}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={MARK_W}
            height={MARK_H}
          >
            <path d={MARK_PATH} transform={MARK_TRANSFORM} fill="#FFFFFF" />
          </mask>
          <clipPath id={`${id}-draw`} clipPathUnits="userSpaceOnUse">
            <rect x={0} y={0} width={MARK_W} height={MARK_H * draw} />
          </clipPath>
        </defs>

        <g mask={`url(#${id}-glyph)`}>
          {ROWS.map((row, i) => {
            const p = prog(frame, rowStart + i * rowStagger, rowDur, easeOutQuint);
            if (p <= 0) return null;
            return (
              <text
                key={i}
                x={MARK_W / 2}
                y={row.y + (1 - p) * 6}
                textAnchor="middle"
                fontFamily='"IBM Plex Mono", monospace'
                fontSize={12}
                fontWeight={600}
                letterSpacing={1.1}
                fill={rowFill}
                opacity={p}
              >
                {row.text}
              </text>
            );
          })}
        </g>

        <g clipPath={`url(#${id}-draw)`}>
          <path
            d={MARK_PATH}
            transform={MARK_TRANSFORM}
            fill="none"
            stroke={outline}
            strokeWidth={1.7}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* intro: cold open on a dark page                                     */
/* ------------------------------------------------------------------ */

const ColdOpen: React.FC<{ frame: number }> = ({ frame }) => {
  const line = prog(frame, 0, 6, easeOutQuint);
  const kicker = prog(frame, 8, 16, easeOutQuint);
  const head = prog(frame, 14, 26, easeOutQuint);
  const or = prog(frame, 34, 12, easeOutQuint);
  const alt = prog(frame, 40, 18, easeOutQuint);
  const rule = prog(frame, 56, 14, easeOutQuint);
  const dim = prog(frame, 68, 12, easeInOutQuint);
  const note = prog(frame, 78, 14, easeOutQuint);
  const push = interpolate(frame, [92, INTRO_END], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const pushY = interpolate(frame, [92, INTRO_END], [0, -6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <Page bg={DEEP} color={BONE}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${push}) translateY(${pushY}px)`,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 540,
            width: 1684,
            height: 1,
            background: "rgba(231,231,228,0.4)",
            transform: `scaleX(${line * 0.32})`,
            transformOrigin: "0% 50%",
          }}
        />

        <QuestionMark
          tone="dark"
          frame={frame}
          left={932}
          id="cold-open-mark"
          outlineStart={4}
          outlineDur={22}
          rowStart={10}
          rowStagger={0.34}
          rowDur={8}
        />

        <div style={{ position: "absolute", left: 118, top: 300, width: 800 }}>
          <div style={{ overflow: "hidden", height: 20 }}>
            <div
              style={{
                ...mono(15),
                color: "rgba(231,231,228,0.55)",
                transform: `translateY(${(1 - kicker) * 100}%)`,
              }}
            >
              dua tugas yang mirip
            </div>
          </div>

          <div style={{ overflow: "hidden", height: 100, marginTop: 22 }}>
            <div
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                whiteSpace: "nowrap",
                color: BONE,
                transform: `translateY(${(1 - head) * 105}%)`,
              }}
            >
              TEBAK POSISI ASLI
            </div>
          </div>

          <div
            style={{
              height: 8,
              width: 700,
              background: BONE,
              marginTop: 16,
              transform: `scaleX(${rule})`,
              transformOrigin: "0% 50%",
            }}
          />

          <div style={{ overflow: "hidden", height: 20, marginTop: 24 }}>
            <div
              style={{
                ...mono(15),
                color: "rgba(231,231,228,0.55)",
                transform: `translateY(${(1 - or) * 100}%)`,
              }}
            >
              atau
            </div>
          </div>

          <div
            style={{
              overflow: "hidden",
              height: 74,
              marginTop: 24,
              opacity: 1 - dim * 0.58,
              transform: `translateX(${dim * 24}px)`,
            }}
          >
            <div
              style={{
                fontSize: 74,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                whiteSpace: "nowrap",
                color: "rgba(231,231,228,0.55)",
                transform: `translateY(${(1 - alt) * 105}%)`,
              }}
            >
              CEK COCOK DI RAPOR
            </div>
          </div>

          <div
            style={{
              ...mono(15),
              color: "rgba(231,231,228,0.55)",
              marginTop: 54,
              opacity: note,
            }}
          >
            video ini menguji yang pertama
          </div>
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 1 a: the question mark                                        */
/* ------------------------------------------------------------------ */

const DataQuestion: React.FC<{ frame: number }> = ({ frame }) => {
  // Local time so the answer mark draws in right after the intro cut.
  const f = frame - INTRO_END;
  const out = prog(f, 166, 14, (t) => t);
  // The mark is already inked when the paper sheet leaves, then settles by a
  // hair and creeps in for the rest of the shot. No empty page after the wipe.
  const settle = prog(f, 0, 20, easeOutQuint);
  const grow = 1.03 - settle * 0.03 + prog(f, 20, 146) * 0.02;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <QuestionMark
        tone="paper"
        frame={f}
        left={932}
        id="scene1-mark"
        outlineStart={-4}
        outlineDur={12}
        rowStart={-2}
        rowStagger={0.12}
        rowDur={6}
        scale={grow}
      />

      <div
        style={{
          position: "absolute",
          left: 118,
          top: 604,
          width: 600,
          ...mono(14),
          color: "rgba(23,24,26,0.44)",
          opacity: prog(f, -6, 18),
        }}
      >
        29 angka / 1 pemain / 3 kemungkinan
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene 1 b: chips fly into the spine                                 */
/* ------------------------------------------------------------------ */

const SPINE_X = 118;
const SPINE_Y = 150;
const SPINE_H = 25;

const ChipRun: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {ATTRS.map(([name, value], i) => {
      const start = 358 + i * 1.4;
      const land = start + 32;
      const p = prog(frame, start, 32, (t) => t);
      if (p <= 0) return null;
      // The 29 numbers peel off a column on the right, then settle into the
      // data spine on the left.
      const fromX = 1180;
      const fromY = 150 + i * 25;
      const x = fromX + (SPINE_X - fromX) * p;
      const y = fromY + (SPINE_Y + i * SPINE_H - fromY) * p;
      const appear = prog(frame, start, 8, (t) => t);
      const landed = frame >= land;
      const light = landed ? prog(frame, 880 + i * 3, 14) : 0;
      const arc = Math.sin(i * 1.9) * 26 * p * (1 - p) * 4;
      return (
        <div
          key={name}
          style={{
            position: "absolute",
            left: x + arc,
            top: y,
            width: 140 + 380 * p,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 14,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 13 + (1 - p) * 4,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: landed
              ? `rgba(23,24,26,${0.42 + light * 0.5})`
              : "rgba(23,24,26,0.72)",
            opacity: appear,
            whiteSpace: "nowrap",
          }}
        >
          <span>{name}</span>
          <span
            style={{
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
              color:
                landed && LEDGER.some(([n]) => n === name) ? INK : undefined,
            }}
          >
            {value}
          </span>
        </div>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* scene 1 c: the three words                                          */
/* ------------------------------------------------------------------ */

const WordRoll: React.FC<{ frame: number }> = ({ frame }) => {
  const inP = prog(frame, 584, 16);
  const out = prog(frame, 892, 14, (t) => t);
  const step = 12;
  const first = 604;
  let pos = 0;
  for (let i = 0; i < WORDS.length - 1; i += 1) {
    const at = first + i * step;
    if (frame >= at) {
      pos = i + 1;
    }
  }
  for (let i = 0; i < WORDS.length - 1; i += 1) {
    const at = first + i * step;
    if (frame >= at - 5 && frame < at) {
      pos = i + easeOut((frame - (at - 5)) / 5);
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 700,
        top: 372,
        width: 1120,
        opacity: inP * (1 - out),
        transform: `translateY(${(1 - inP) * 30}px)`,
      }}
    >
      <div style={{ ...mono(15), color: MUTED, marginBottom: 24 }}>
        mesin menebak
      </div>
      <div style={{ height: 190, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-pos * 226}px)` }}>
          {WORDS.map((word) => (
            <div
              key={word}
              style={{
                height: 190,
                marginBottom: 36,
                fontSize: 156,
                fontWeight: 800,
                lineHeight: "190px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene 1 d: five attributes                                          */
/* ------------------------------------------------------------------ */

const FiveLedger: React.FC<{ frame: number }> = ({ frame }) => {
  const out = prog(frame, 1192, 12, (t) => t);
  return (
    <div
      style={{
        position: "absolute",
        left: 720,
        top: 236,
        width: 1020,
        opacity: 1 - out,
      }}
    >
      {LEDGER.map(([name, value], i) => {
        const p = prog(frame, 896 + i * 7, 18);
        return (
          <div
            key={name}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 210px",
              alignItems: "baseline",
              columnGap: 24,
              height: 108,
              opacity: p,
              transform: `translateY(${(1 - p) * 22}px)`,
            }}
          >
            <span style={{ ...mono(19), color: MUTED }}>{name}</span>
            <span
              style={{
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                fontVariantNumeric: "tabular-nums",
                textAlign: "right",
              }}
            >
              {Math.round(value * p)}
            </span>
          </div>
        );
      })}
      <div
        style={{
          ...mono(15),
          color: MUTED,
          marginTop: 26,
          opacity: prog(frame, 1080, 16),
        }}
      >
        5 dari 29 atribut / Érik Lamela
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene 1 e: verdict                                                  */
/* ------------------------------------------------------------------ */

const Verdict: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - 1180 + 6;
  const title = prog(local, 0, 12);
  const word = prog(local, 2, 14);
  const rule = prog(local, 16, 18);
  const prob = interpolate(local, [18, 58], [0, 0.855], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const others = prog(local, 54, 16);

  return (
    <Page>
      <div style={{ position: "absolute", left: 118, top: 300 }}>
        <div style={{ ...mono(15), color: MUTED, opacity: title }}>
          model memilih
        </div>
        <div
          style={{
            fontSize: 168,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            marginTop: 24,
            opacity: word,
            transform: `translateY(${(1 - word) * 40}px)`,
          }}
        >
          GELANDANG
        </div>
        <div
          style={{
            height: 8,
            width: 880,
            background: INK,
            marginTop: 10,
            transform: `scaleX(${rule})`,
            transformOrigin: "0% 50%",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 118,
          top: 640,
          display: "flex",
          gap: 90,
          opacity: others,
          ...mono(22),
          color: MUTED,
        }}
      >
        <span>
          BEK{" "}
          <b style={{ color: INK, fontWeight: 600 }}>0,020</b>
        </span>
        <span>
          PENYERANG{" "}
          <b style={{ color: INK, fontWeight: 600 }}>0,125</b>
        </span>
        <span>
          GELANDANG{" "}
          <b
            style={{
              background: INK,
              color: BONE,
              padding: "2px 14px",
              borderRadius: 0,
              fontWeight: 600,
            }}
          >
            {prob.toFixed(3).replace(".", ",")}
          </b>
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 118,
          top: 420,
          textAlign: "right",
          opacity: prog(local, 30, 20),
        }}
      >
        <div
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontStyle: "italic",
            fontSize: 44,
            color: MUTED,
          }}
        >
          tapi rapornya bilang
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginTop: 8,
          }}
        >
          PENYERANG
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 1 f: the board                                                */
/* ------------------------------------------------------------------ */

const BOARD_W = 2800;
const BOARD_H = 1800;

type Point = { x: number; y: number };

const BOARD_ATTRS = ["Finishing", "Dribbling", "ShortPassing", "Vision", "StandingTackle"].map(
  (name) => ATTRS.find(([key]) => key === name)!
);

const Pin: React.FC<{ p: Point; at: number; frame: number }> = ({ p, at, frame }) => {
  if (frame < at) return null;
  const pop = prog(frame, at, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - 12,
        top: p.y - 12,
        width: 24,
        height: 24,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 34% 28%, #EFEFEC 0%, #AEB0B3 34%, #5E6165 66%, #26282B 100%)",
        boxShadow:
          "0 2px 4px rgba(23,24,26,0.30), inset 0 1px 1px rgba(255,255,255,0.45)",
        transform: `scale(${0.6 + pop * 0.4})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 7,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.55)",
        }}
      />
    </div>
  );
};

const BoardString: React.FC<{
  from: Point;
  to: Point;
  at: number;
  frame: number;
  sag?: number;
}> = ({ from, to, at, frame, sag = 44 }) => {
  const draw = prog(frame, at, 34, (t) => t);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 + sag;
  return (
    <path
      d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
      fill="none"
      stroke="rgba(23,24,26,0.40)"
      strokeWidth={2.5}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - draw}
    />
  );
};

const Print: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  src: string;
  at: number;
  frame: number;
  pos?: string;
}> = ({ x, y, w, h, rot, src, at, frame, pos = "50% 50%" }) => {
  const land = prog(frame, at, 26);
  if (land <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: PAPER,
        padding: 14,
        boxSizing: "border-box",
        outline: `1px solid ${HAIRLINE}`,
        transform: `rotate(${rot}deg) translateY(${(1 - land) * 24}px) scale(${
          0.975 + land * 0.025
        })`,
        transformOrigin: "50% 0%",
        opacity: Math.min(1, land * 2.4),
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          filter: "grayscale(1) contrast(1.04) brightness(0.96)",
        }}
      />
    </div>
  );
};

const PhotoCard: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - 1380;
  // One board, one continuous camera. Tight on the portrait, pull back to
  // show the evidence, hold, then dolly into the report card. No cut.
  const drift = prog(local, 0, 44, easeInOutQuint);
  const pull = prog(local, 44, 156, easeInOutQuint);
  const hold = prog(local, 200, 38, easeOutQuint);
  const dolly = prog(local, 238, 80, easeInOutQuint);
  const settle = prog(local, 318, 12, easeOutQuint);

  let cx: number;
  let cy: number;
  let scale: number;
  if (local < 44) {
    cx = 560 + drift * 8;
    cy = 690 + drift * 6;
    scale = 1.05 + drift * 0.002;
  } else if (local < 200) {
    cx = 568 + (1120 - 568) * pull;
    cy = 696 + (760 - 696) * pull;
    scale = 1.052 + (0.8 - 1.052) * pull;
  } else if (local < 238) {
    cx = 1120;
    cy = 760;
    scale = 0.8 + hold * 0.005;
  } else if (local < 318) {
    cx = 1120 + (1690 - 1120) * dolly;
    cy = 760 + (1300 - 760) * dolly;
    scale = 0.805 + (1.19 - 0.805) * dolly;
  } else {
    cx = 1690;
    cy = 1300;
    scale = 1.19 + settle * 0.015;
  }
  const rule = prog(local, 128, 26);
  const tagIn = prog(local, 152, 22);
  const clubCaption = prog(local, 108, 18);
  const crestCaption = prog(local, 140, 18);

  return (
    <Page>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: BOARD_W,
            height: BOARD_H,
            transformOrigin: "0 0",
            transform: `translate(${960 - cx * scale}px, ${540 - cy * scale}px) scale(${scale})`,
          }}
        >
          <svg
            width={BOARD_W}
            height={BOARD_H}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <BoardString from={{ x: 540, y: 272 }} to={{ x: 1350, y: 252 }} at={78} frame={local} sag={38} />
            <BoardString from={{ x: 540, y: 272 }} to={{ x: 1320, y: 1222 }} at={96} frame={local} sag={44} />
            <BoardString from={{ x: 1320, y: 1222 }} to={{ x: 1890, y: 932 }} at={146} frame={local} sag={34} />
            <BoardString from={{ x: 1990, y: 252 }} to={{ x: 1320, y: 1222 }} at={130} frame={local} sag={54} />
            <BoardString from={{ x: 1350, y: 252 }} to={{ x: 1890, y: 932 }} at={158} frame={local} sag={40} />
          </svg>

          <Print
            x={220}
            y={260}
            w={640}
            h={640}
            rot={-1.4}
            src="fifa/assets/lamela-2020.jpg"
            at={-20}
            frame={local}
            pos="50% 22%"
          />
          <Print
            x={1090}
            y={240}
            w={520}
            h={400}
            rot={1.8}
            src="fifa/assets/sevilla-stadium-2022.jpg"
            at={56}
            frame={local}
            pos="50% 56%"
          />
          <Print
            x={1780}
            y={240}
            w={420}
            h={320}
            rot={-1.1}
            src="fifa/assets/sevilla-crest-2024.jpg"
            at={118}
            frame={local}
            pos="50% 50%"
          />

          <div
            style={{
              position: "absolute",
              left: 980,
              top: 1210,
              width: 680,
              height: 470,
              padding: "34px 38px",
              boxSizing: "border-box",
              background: PAPER,
              outline: `1px solid ${HAIRLINE}`,
              transform: `rotate(-1.2deg) translateY(${(1 - prog(local, 96, 26)) * 22}px)`,
              opacity: prog(local, 96, 22),
            }}
          >
            <div style={{ ...mono(14), color: MUTED }}>posisi di rapor data</div>
            <div
              style={{
                fontSize: 62,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                marginTop: 12,
              }}
            >
              PENYERANG
            </div>
            <div
              style={{
                height: 4,
                width: 300,
                background: INK,
                marginTop: 14,
                transform: `scaleX(${rule})`,
                transformOrigin: "0% 50%",
              }}
            />
            <div style={{ ...mono(13), color: MUTED, marginTop: 22 }}>29 atribut</div>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                rowGap: 6,
                columnGap: 24,
                ...mono(14),
              }}
            >
              {BOARD_ATTRS.map(([name, value]) => (
                <React.Fragment key={name}>
                  <div style={{ color: MUTED }}>{name}</div>
                  <div style={{ fontWeight: 600 }}>{value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 1720,
              top: 920,
              width: 340,
              height: 210,
              padding: "28px 30px",
              boxSizing: "border-box",
              background: PAPER,
              outline: `1px solid ${HAIRLINE}`,
              transform: `rotate(2.2deg) translateY(${(1 - tagIn) * 20}px)`,
              opacity: tagIn,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <div
                style={{
                  fontSize: 92,
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                  lineHeight: 0.86,
                }}
              >
                29
              </div>
              <div style={{ ...mono(14) }}>atribut</div>
            </div>
            <div style={{ ...mono(12), color: MUTED, marginTop: 16 }}>
              3 kemungkinan posisi
            </div>
          </div>

          <div style={{ position: "absolute", left: 220, top: 934, width: 640 }}>
            <div style={{ ...mono(14), color: MUTED }}>pemain di balik 29 angka</div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.02,
                marginTop: 14,
              }}
            >
              ÉRIK LAMELA
            </div>
            <div style={{ ...mono(19), color: MUTED, marginTop: 14 }}>
              sayap kanan / sevilla
            </div>
            <div
              style={{
                marginTop: 20,
                ...mono(13),
                color: "rgba(23,24,26,0.52)",
                lineHeight: 1.7,
              }}
            >
              <div>foto 2020 / data fifa 23</div>
              <div>foto: steffen prößdorf / cc by-sa 4.0</div>
              <div>diubah: crop / duotone</div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 1090,
              top: 690,
              width: 520,
              opacity: clubCaption,
              transform: `translateY(${(1 - clubCaption) * 14}px)`,
            }}
          >
            <div style={{ ...mono(13), color: MUTED }}>klub</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: 8,
              }}
            >
              RAMÓN SÁNCHEZ-PIZJUÁN
            </div>
            <div style={{ ...mono(14), color: MUTED, marginTop: 8 }}>sevilla</div>
            <div
              style={{
                marginTop: 12,
                ...mono(12),
                color: "rgba(23,24,26,0.45)",
                lineHeight: 1.6,
              }}
            >
              <div>foto: niels98 / cc by-sa 4.0</div>
              <div>2022 / diubah: crop, duotone</div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 1780,
              top: 600,
              width: 420,
              opacity: crestCaption,
              transform: `translateY(${(1 - crestCaption) * 14}px)`,
            }}
          >
            <div style={{ ...mono(13), color: MUTED }}>kandang</div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: 8,
              }}
            >
              SEVILLA FC
            </div>
            <div
              style={{
                marginTop: 12,
                ...mono(12),
                color: "rgba(23,24,26,0.45)",
                lineHeight: 1.6,
              }}
            >
              <div>foto: carlosvdehabsburgo / cc by-sa 4.0</div>
              <div>2024 / diubah: crop, duotone</div>
            </div>
          </div>

          <Pin p={{ x: 540, y: 272 }} at={-20} frame={local} />
          <Pin p={{ x: 1350, y: 252 }} at={58} frame={local} />
          <Pin p={{ x: 1990, y: 252 }} at={120} frame={local} />
          <Pin p={{ x: 1320, y: 1222 }} at={100} frame={local} />
          <Pin p={{ x: 1890, y: 932 }} at={156} frame={local} />
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 1 g: thesis                                                   */
/* ------------------------------------------------------------------ */

const Thesis: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - 1710 + 12;
  const l1 = prog(local, 0, 14);
  const l2 = prog(local, 8, 16);
  const rule = prog(local, 16, 20);
  // Hold the two lines with a slow push. The scene wipe at 1920 removes it.
  const hold = prog(local, 40, 165, easeInOutQuint);
  const scale = 1 + hold * 0.035;
  const moveY = hold * -18;

  return (
    <Page>
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 352,
          transformOrigin: "20% 50%",
          transform: `translateY(${moveY}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.06,
            color: "rgba(23,24,26,0.44)",
            clipPath: `inset(0 ${(1 - l1) * 100}% 0 0)`,
          }}
        >
          Bukan posisi terbaik.
        </div>
        <div
          style={{
            fontSize: 136,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1.04,
            opacity: l2,
            transform: `translateY(${(1 - l2) * 56}px)`,
          }}
        >
          Posisi yang{" "}
          <span
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              paddingBottom: 10,
              backgroundImage: `linear-gradient(${INK}, ${INK})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 100%",
              backgroundSize: `${rule * 100}% 6px`,
            }}
          >
            tercatat.
          </span>
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 1 composition                                                 */
/* ------------------------------------------------------------------ */

const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 1380) {
    return (
      <Page>
        <DataQuestion frame={frame} />
        <ChipRun frame={frame} />
        <WordRoll frame={frame} />
        <FiveLedger frame={frame} />
      </Page>
    );
  }
  if (frame < 1710) {
    return <PhotoCard frame={frame} />;
  }
  return <Thesis frame={frame} />;
};

/* ------------------------------------------------------------------ */
/* scene 1 verdict overlay is a hard cut inside the scene              */
/* ------------------------------------------------------------------ */

const Scene1Root: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < INTRO_END) {
    return <ColdOpen frame={frame} />;
  }
  if (frame >= 1180 && frame < 1380) {
    return <Verdict frame={frame} />;
  }
  return <Scene1 frame={frame} />;
};

/* ------------------------------------------------------------------ */
/* scene 2                                                             */
/* ------------------------------------------------------------------ */

const WALL_X = 80;
const WALL_Y = 118;
const WALL_COL = 196;
const WALL_ROW = 88;
const WALL_COLS = 9;

const wallPos = (i: number) => {
  const col = i % WALL_COLS;
  const row = Math.floor(i / WALL_COLS);
  return { x: WALL_X + col * WALL_COL, y: WALL_Y + row * WALL_ROW };
};

const ColumnWall: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = interpolate(frame, [0, 1890], [0, -16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const recede = prog(frame, 480, 24, (t) => t);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateY(${drift}px)`,
      }}
    >
      {COLUMNS.map((name, i) => {
        if (name === "BestPosition" && frame >= 330) return null;
        const { x, y } = wallPos(i);
        const keep = ATTR_NAMES.has(name) || name === "BestPosition";
        const lit = keep ? prog(frame, 150 + (i % 11) * 2, 12) : 0;
        const drop = keep ? 0 : prog(frame, 176, 24, (t) => t);
        const keepOpacity =
          (0.36 + lit * 0.54) * (1 - recede * 0.965);
        return (
          <div
            key={`${name}-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: WALL_COL - 18,
              ...mono(15),
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              color: keep
                ? `rgba(23,24,26,${keepOpacity})`
                : `rgba(23,24,26,${0.34 - drop * 0.29})`,
              transform: `translateY(${drop * 130}px)`,
            }}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
};

const BestPositionPull: React.FC<{ frame: number }> = ({ frame }) => {
  const idx = META.indexOf("BestPosition");
  const start = wallPos(idx);
  const p1 = prog(frame, 330, 26, (t) => t);
  const p2 = prog(frame, 466, 26, (t) => t);
  if (p1 <= 0) return null;

  const midX = 640;
  const midY = 272;
  const endX = 118;
  const endY = 238;

  const x = start.x + (midX - start.x) * p1 + (endX - midX) * p2;
  const y = start.y + (midY - start.y) * p1 + (endY - midY) * p2;
  const size = 15 + 92 * p1 - 87 * p2;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: size,
        letterSpacing: p1 > 0.5 ? "-0.02em" : "0.05em",
        textTransform: "uppercase",
        fontWeight: p1 > 0.5 ? 600 : 500,
        color: p2 > 0.5 ? MUTED : INK,
        whiteSpace: "nowrap",
        background: BONE,
        padding: "6px 22px",
        marginLeft: -22,
        marginTop: -6,
      }}
    >
      BestPosition
    </div>
  );
};

const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;

  const taskIn = prog(local, 690, 20);
  const dropIn = prog(local, 870, 18);
  const strike = prog(local, 1010, 34);
  const rateIn = prog(local, 1260, 20);
  const redLine = prog(local, 1300, 30);
  const keyLabel = prog(local, 1340, 18);

  return (
    <Page zoom={1 + local * 0.000011}>
      <ColumnWall frame={local} />

      <BestPositionPull frame={local} />

      {local >= 500 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 250,
            width: 1260,
            height: 600,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, rgba(231,231,228,0.99) 0%, rgba(231,231,228,0.99) 52%, rgba(231,231,228,0.70) 74%, rgba(231,231,228,0) 100%)",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 8%, #000 92%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 8%, #000 92%, rgba(0,0,0,0) 100%)",
            opacity: prog(local, 500, 20),
          }}
        />
      )}

      {local >= 500 && (
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 300,
            opacity: prog(local, 500, 18),
          }}
        >
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
            }}
          >
            RAPOR: <span style={{ color: MUTED }}>PENYERANG</span>
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
            }}
          >
            MODEL:{" "}
            <span style={{ background: INK, color: BONE, padding: "0 16px 4px" }}>
              GELANDANG
            </span>
          </div>
        </div>
      )}

      {local >= 660 && (
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 588,
            width: 1000,
            opacity: taskIn,
            transform: `translateY(${(1 - taskIn) * 18}px)`,
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.22,
            }}
          >
            Model menebak label yang sudah tercatat, bukan menilai siapa yang
            lebih layak bermain.
          </div>
        </div>
      )}

      {local >= 850 && (
        <div
          style={{
            position: "absolute",
            left: 118,
            bottom: 170,
            width: 820,
            opacity: dropIn,
            transform: `translateY(${(1 - dropIn) * 18}px)`,
          }}
        >
          <div style={{ ...mono(13), color: MUTED, marginBottom: 12 }}>
            ikut dibuang
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 34,
              rowGap: 6,
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 15,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(23,24,26,0.62)",
            }}
          >
            {DROPPED.map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>
          <div
            style={{
              height: 2,
              background: INK,
              marginTop: 16,
              width: 760,
              transform: `scaleX(${strike})`,
              transformOrigin: "0% 50%",
              opacity: 0.72,
            }}
          />
        </div>
      )}

      {local >= 1240 && (
        <div
          style={{
            position: "absolute",
            right: 118,
            bottom: 150,
            width: 780,
            textAlign: "right",
            opacity: rateIn,
            transform: `translateY(${(1 - rateIn) * 18}px)`,
          }}
        >
          <div style={{ ...mono(13), color: MUTED, marginBottom: 14 }}>
            kolom yang bocor
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: "6px 14px",
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 15,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(23,24,26,0.66)",
            }}
          >
            {RATINGS.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <div
            style={{
              height: 8,
              background: ALERT,
              marginTop: 18,
              width: 720,
              marginLeft: "auto",
              transform: `scaleX(${redLine})`,
              transformOrigin: "100% 50%",
            }}
          />
          <div
            style={{
              ...mono(14),
              color: ALERT,
              marginTop: 12,
              opacity: keyLabel,
            }}
          >
            kunci jawaban
          </div>
        </div>
      )}
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 3                                                             */
/* ------------------------------------------------------------------ */

const ClassBar: React.FC<{ frame: number }> = ({ frame }) => {
  const grow = prog(frame, 470, 34, (t) => t);
  const labelIn = prog(frame, 520, 20);

  const segs = [
    { name: "DEFENDER", pct: 0.3806, count: "6.230", color: INK },
    {
      name: "MIDFIELDER",
      pct: 0.4281,
      count: "7.007",
      color: "rgba(23,24,26,0.42)",
    },
    { name: "FORWARD", pct: 0.1912, count: "3.130", color: "#A8A9AC" },
  ];

  let acc = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 118,
        top: 470,
        width: 1684,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 26,
          width: "100%",
          display: "flex",
          overflow: "hidden",
          transform: `scaleX(${grow})`,
          transformOrigin: "0% 50%",
        }}
      >
        {segs.map((s) => (
          <div
            key={s.name}
            style={{ width: `${s.pct * 100}%`, background: s.color }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          height: 92,
          marginTop: 18,
          opacity: labelIn,
        }}
      >
        {segs.map((s, i) => {
          const left = acc * 100;
          acc += s.pct;
          return (
            <div
              key={s.name}
              style={{
                position: "absolute",
                left: `${left}%`,
                paddingLeft: i === 0 ? 0 : 18,
              }}
            >
              <div
                style={{
                  ...mono(16),
                  color: INK,
                  fontWeight: 600,
                }}
              >
                {s.name}
              </div>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 17,
                  marginTop: 6,
                  color: MUTED,
                }}
              >
                {(s.pct * 100).toFixed(2).replace(".", ",")}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Counts: React.FC<{ frame: number }> = ({ frame }) => {
  const p = prog(frame, 720, 24);
  const items: Array<[string, number, string]> = [
    ["6.230", 0, "rgba(23,24,26,0.68)"],
    ["7.007", 38.06, "rgba(23,24,26,0.68)"],
    ["3.130", 80.87, INK],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 118,
        top: 640,
        width: 1684,
        height: 60,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {items.map(([v, left, color]) => (
        <div
          key={v}
          style={{
            position: "absolute",
            left: `${left}%`,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 42,
            letterSpacing: "0.02em",
            color,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
};

const SplitBar: React.FC<{ frame: number }> = ({ frame }) => {
  const p = prog(frame, 1180, 30, (t) => t);
  const label = prog(frame, 1240, 20);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 118,
        top: 760,
        width: 1684,
        opacity: p,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ ...mono(14), color: MUTED }}>split stratified 80:20</div>
        <div style={{ ...mono(14), color: MUTED }}>satu kali, dipakai tiga model</div>
      </div>
      <div style={{ display: "flex", height: 22 }}>
        <div
          style={{
            width: "80%",
            background: INK,
            transform: `scaleX(${p})`,
            transformOrigin: "0% 50%",
          }}
        />
        <div style={{ width: "20%", display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              width: "100%",
              background: "#8E9094",
              transform: `scaleX(${p})`,
              transformOrigin: "0% 50%",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          opacity: label,
        }}
      >
        <div style={{ ...mono(17), color: INK }}>13.093 latih</div>
        <div style={{ ...mono(17), color: MUTED }}>3.274 uji</div>
      </div>
    </div>
  );
};

const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;

  const n1 = interpolate(local, [0, 44], [17800, 18539], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const n2 = interpolate(local, [70, 104], [18539, 18420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const n3 = interpolate(local, [150, 196], [18420, 16367], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const value = local < 70 ? n1 : local < 150 ? n2 : n3;

  const dupIn = prog(local, 236, 18);
  const strikeDup = prog(local, 250, 22);

  return (
    <Page zoom={1 + local * 0.000013}>
      <div
        style={{
          position: "absolute",
          right: 118,
          top: 84,
          width: 620,
          height: 300,
          opacity: 0.18,
          mixBlendMode: "multiply",
        }}
      >
        <Img
          src={staticFile("fifa/assets/notebook-01-sebaran-kelas.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "grayscale(1)",
          }}
        />
      </div>

      <div style={{ position: "absolute", left: 118, top: 118 }}>
        <div style={{ ...mono(15), color: MUTED }}>pemain lapangan</div>
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 176,
            lineHeight: 1,
            letterSpacing: "-0.045em",
            fontVariantNumeric: "tabular-nums",
            marginTop: 12,
            color: INK,
          }}
        >
          {Math.round(value).toLocaleString("id-ID")}
        </div>
      </div>

      {local >= 232 && (
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 372,
            display: "flex",
            gap: 90,
            opacity: dupIn,
          }}
        >
          <div>
            <div style={{ position: "relative", width: 150 }}>
              <div
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 44,
                  fontVariantNumeric: "tabular-nums",
                  color: "rgba(23,24,26,0.86)",
                }}
              >
                119
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 30,
                  height: 3,
                  width: 104,
                  background: ALERT,
                  transform: `scaleX(${strikeDup})`,
                  transformOrigin: "0% 50%",
                }}
              />
            </div>
            <div style={{ ...mono(13), color: MUTED, marginTop: 4 }}>
              duplikat
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 44,
                fontVariantNumeric: "tabular-nums",
                color: "rgba(23,24,26,0.86)",
              }}
            >
              2.053
            </div>
            <div style={{ ...mono(13), color: MUTED, marginTop: 4 }}>
              penjaga gawang
            </div>
          </div>
        </div>
      )}

      <ClassBar frame={local} />

      {local >= 640 && (
        <div
          style={{
            position: "absolute",
            right: 118,
            top: 404,
            textAlign: "right",
            fontFamily: '"Instrument Serif", serif',
            fontStyle: "italic",
            fontSize: 50,
            color: MUTED,
            opacity: prog(local, 640, 20),
          }}
        >
          1 dari 5
        </div>
      )}

      <Counts frame={local} />
      <SplitBar frame={local} />
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene wipe: one sheet pulls every hard cut                          */
/* ------------------------------------------------------------------ */

const WIPES = [180, 1180, 1380, 1710, 1920, 3810];

const SceneWipe: React.FC<{ frame: number }> = ({ frame }) => {
  const half = 10;
  for (const cut of WIPES) {
    const t = frame - (cut - half);
    if (t < 0 || t > half * 2) continue;
    // Fastest exactly on the cut, where the sheet covers the frame.
    const p = Easing.inOut(Easing.cubic)(clamp01(t / (half * 2)));
    const y = 1080 - p * 2160;
    const bone = cut === 180;
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: y,
          width: 1920,
          height: 1080,
          background: bone ? BONE : INK,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: bone ? 2 : 6,
            background: bone ? INK : BONE,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: GRAIN,
            opacity: 0.07,
            mixBlendMode: bone ? "multiply" : "screen",
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

export const FifaVideo1: React.FC = () => {
  const css = useLoadedFonts("fifa video 1 fonts");
  const frame = useCurrentFrame();

  let body: React.ReactNode;
  if (frame < S2) {
    body = <Scene1Root frame={frame - S1} />;
  } else if (frame < S3) {
    body = <Scene2 frame={frame - S2} />;
  } else {
    body = <Scene3 frame={frame - S3} />;
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
