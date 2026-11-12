import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * FIFA 23 position classification - cold open type test.
 *
 * 18 seconds, 1920x1080, 30 fps. One world, one camera. No slide transitions:
 * the camera pulls back out of the data, pans to the ledger, pans to the
 * verdict, then hard cuts to the name card and back to paper.
 */
export const COLD_OPEN_FRAMES = 540;

const BONE = "#E7E7E4";
const INK = "#17181A";
const PAPER = "#F6F6F3";
const MUTED = "#6F7073";

const BLACK_START = 287; // 9.57 s
const PAPER_START = 379; // 12.63 s

/* ------------------------------------------------------------------ */
/* fonts                                                               */
/* ------------------------------------------------------------------ */

const fontStyles = () =>
  `
@font-face{font-family:"Inter Tight";src:url("${staticFile(
    "fifa/fonts/inter-tight-400-normal.woff2"
  )}") format("woff2");font-weight:400;font-style:normal;font-display:block;}
@font-face{font-family:"Inter Tight";src:url("${staticFile(
    "fifa/fonts/inter-tight-600-normal.woff2"
  )}") format("woff2");font-weight:600;font-style:normal;font-display:block;}
@font-face{font-family:"Inter Tight";src:url("${staticFile(
    "fifa/fonts/inter-tight-800-normal.woff2"
  )}") format("woff2");font-weight:800;font-style:normal;font-display:block;}
@font-face{font-family:"Instrument Serif";src:url("${staticFile(
    "fifa/fonts/instrument-serif-400-italic.woff2"
  )}") format("woff2");font-weight:400;font-style:italic;font-display:block;}
@font-face{font-family:"IBM Plex Mono";src:url("${staticFile(
    "fifa/fonts/ibm-plex-mono-400-normal.woff2"
  )}") format("woff2");font-weight:400;font-style:normal;font-display:block;}
@font-face{font-family:"IBM Plex Mono";src:url("${staticFile(
    "fifa/fonts/ibm-plex-mono-500-normal.woff2"
  )}") format("woff2");font-weight:500;font-style:normal;font-display:block;}
@font-face{font-family:"IBM Plex Mono";src:url("${staticFile(
    "fifa/fonts/ibm-plex-mono-600-normal.woff2"
  )}") format("woff2");font-weight:600;font-style:normal;font-display:block;}
@font-face{font-family:"Archivo Black";src:url("${staticFile(
    "fifa/fonts/archivo-black-400-normal.woff2"
  )}") format("woff2");font-weight:400;font-style:normal;font-display:block;}
`;

const useLoadedFonts = () => {
  const [handle] = useState(() => delayRender("fifa cold open fonts"));
  useEffect(() => {
    let cancelled = false;
    const families = [
      '400 12px "IBM Plex Mono"',
      '500 12px "IBM Plex Mono"',
      '600 12px "IBM Plex Mono"',
      'italic 400 12px "Instrument Serif"',
      '400 12px "Archivo Black"',
      '400 12px "Inter Tight"',
      '600 12px "Inter Tight"',
      '800 12px "Inter Tight"',
    ];
    Promise.all(families.map((f) => document.fonts.load(f)))
      .then(() => document.fonts.ready)
      .then(() => {
        if (!cancelled) continueRender(handle);
      })
      .catch(() => {
        if (!cancelled) continueRender(handle);
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);
};

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

const ATTRS: Array<[string, number]> = [
  ["FINISHING", 74],
  ["DRIBBLING", 85],
  ["SHORTPASSING", 80],
  ["VISION", 78],
  ["STANDINGTACKLE", 50],
  ["SLIDINGTACKLE", 54],
  ["BALLCONTROL", 84],
  ["LONGPASSING", 75],
  ["CROSSING", 79],
  ["SHOTPOWER", 81],
  ["INTERCEPTIONS", 53],
  ["MARKING", 52],
  ["STAMINA", 69],
  ["ACCELERATION", 72],
  ["SPRINTSPEED", 64],
  ["AGILITY", 82],
  ["REACTIONS", 80],
  ["COMPOSURE", 78],
  ["POSITIONING", 76],
  ["PENALTIES", 68],
  ["CURVE", 76],
  ["FKAACCURACY", 70],
  ["LONGSHOTS", 72],
  ["VOLLEYS", 70],
  ["HEADINGACCURACY", 62],
  ["JUMPING", 64],
  ["STRENGTH", 58],
  ["AGGRESSION", 61],
  ["BALANCE", 79],
];

const ROWS = Array.from({ length: 82 }, (_, i) => {
  const parts: string[] = [];
  for (let k = 0; k < 5; k += 1) {
    const [name, value] = ATTRS[(i + k * 4) % ATTRS.length];
    parts.push(`${name} ${value}`);
  }
  return { y: 66 + i * 11.9, text: parts.join("  /  ") };
});

const LEDGER: Array<[string, number, boolean]> = [
  ["Finishing", 74, true],
  ["Dribbling", 85, true],
  ["Short passing", 80, true],
  ["Vision", 78, true],
  ["Standing tackle", 50, true],
  ["Sliding tackle", 54, false],
  ["Crossing", 79, false],
  ["Shot power", 81, false],
];

const WORDS = ["BEK", "GELANDANG", "PENYERANG", "GELANDANG"];

/* ------------------------------------------------------------------ */
/* camera                                                              */
/* ------------------------------------------------------------------ */

type Cam = { f: number; x: number; y: number; s: number };

const CAMS: Cam[] = [
  { f: 0, x: 1180, y: 470, s: 1.95 },
  { f: 39, x: 1170, y: 520, s: 1.62 },
  { f: 90, x: 1200, y: 600, s: 1.16 },
  { f: 104, x: 1195, y: 605, s: 1.18 },
  { f: 133, x: 428, y: 632, s: 1.38 },
  { f: 185, x: 452, y: 632, s: 1.42 },
  { f: 211, x: 1600, y: 500, s: 1.22 },
  { f: 286, x: 1615, y: 495, s: 1.27 },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const camAt = (frame: number): Cam => {
  if (frame <= CAMS[0].f) return CAMS[0];
  for (let i = 1; i < CAMS.length; i += 1) {
    const b = CAMS[i];
    const a = CAMS[i - 1];
    if (frame <= b.f) {
      const p = easeInOut(clamp01((frame - a.f) / (b.f - a.f)));
      return {
        f: frame,
        x: a.x + (b.x - a.x) * p,
        y: a.y + (b.y - a.y) * p,
        s: a.s + (b.s - a.s) * p,
      };
    }
  }
  return CAMS[CAMS.length - 1];
};

/* ------------------------------------------------------------------ */
/* small helpers                                                       */
/* ------------------------------------------------------------------ */

const mono = (size: number): React.CSSProperties => ({
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: size,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
});

const fade = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/* ------------------------------------------------------------------ */
/* scene A: the question mark                                          */
/* ------------------------------------------------------------------ */

const QuestionMark: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = easeOut(clamp01((frame - 4) / 36));
  const width = 900 * reveal;
  const seedIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seedOut = interpolate(frame, [16, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const out = interpolate(frame, [92, 104], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div
        style={{
          position: "absolute",
          left: 750,
          top: 30,
          width: 900,
          height: 1050,
        }}
      >
        <svg
          width={900}
          height={1050}
          viewBox="0 0 900 1050"
          aria-label="Tanda tanya dari baris data"
        >
          <defs>
            <mask
              id="qmask"
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={900}
              height={1050}
            >
              <text
                x={450}
                y={975}
                textAnchor="middle"
                fontFamily='"Archivo Black", sans-serif'
                fontSize={1200}
                fill="#FFFFFF"
                transform="translate(450 525) scale(1.3 1) translate(-450 -525)"
              >
                ?
              </text>
            </mask>
            <clipPath id="qreveal">
              <rect
                x={450 - width / 2}
                y={0}
                width={width}
                height={1050}
              />
            </clipPath>
          </defs>
          <g clipPath="url(#qreveal)">
            <g mask="url(#qmask)">
              {ROWS.map((row, i) => (
                <text
                  key={i}
                  x={450}
                  y={row.y}
                  textAnchor="middle"
                  fontFamily='"IBM Plex Mono", monospace'
                  fontSize={12.5}
                  fontWeight={600}
                  letterSpacing={1.4}
                  fill={INK}
                >
                  {row.text}
                </text>
              ))}
            </g>
            <text
              x={450}
              y={975}
              textAnchor="middle"
              fontFamily='"Archivo Black", sans-serif'
              fontSize={1200}
              fill="none"
              stroke={INK}
              strokeWidth={1.8}
              strokeOpacity={0.85}
              transform="translate(450 525) scale(1.3 1) translate(-450 -525)"
            >
              ?
            </text>
          </g>
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1178,
          top: 946,
          width: 12,
          height: 12,
          borderRadius: 999,
          background: INK,
          transform: `scale(${0.5 + seedIn * 0.7})`,
          opacity: seedIn * seedOut,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene B: the ledger                                                 */
/* ------------------------------------------------------------------ */

const Ledger: React.FC<{ frame: number }> = ({ frame }) => {
  const inP = interpolate(frame, [110, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 280,
        width: 640,
        opacity: inP,
        transform: `translateY(${(1 - inP) * 26}px)`,
      }}
    >
      {LEDGER.map(([name, value, strong], i) => {
        const p = interpolate(frame, [126 + i * 2, 152 + i * 2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={name}
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 92px",
              alignItems: "center",
              columnGap: 18,
              height: 84,
            }}
          >
            <span
              style={{
                ...mono(12),
                color: "rgba(23,24,26,0.34)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                ...mono(18),
                color: strong ? INK : MUTED,
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontSize: 62,
                fontWeight: strong ? 800 : 600,
                letterSpacing: "-0.035em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                minWidth: 92,
                textAlign: "right",
              }}
            >
              {Math.round(value * p)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene C: the verdict                                                */
/* ------------------------------------------------------------------ */

const Verdict: React.FC<{ frame: number }> = ({ frame }) => {
  const groupIn = interpolate(frame, [200, 214], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const marks = [213, 222, 231];
  let pos = 0;
  for (let i = 0; i < marks.length; i += 1) {
    if (frame >= marks[i]) pos = i + 1;
  }
  for (let i = 0; i < marks.length; i += 1) {
    const start = marks[i] - 4;
    if (frame >= start && frame < marks[i]) {
      pos = i + easeOut((frame - start) / 4);
    }
  }
  if (frame < marks[0] - 4) pos = 0;

  const underline = interpolate(frame, [240, 252], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const probIn = fade(frame, 230, 8);
  const prob = interpolate(frame, [232, 268], [0, 0.855], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const others = fade(frame, 254, 12);

  return (
    <div
      style={{
        position: "absolute",
        left: 1250,
        top: 330,
        width: 900,
        textAlign: "left",
        opacity: groupIn,
      }}
    >
      <div style={{ ...mono(15), color: MUTED, marginBottom: 22 }}>
        model memilih
      </div>

      <div style={{ height: 174, overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-pos * 220}px)` }}>
          {WORDS.map((word) => (
            <div
              key={word}
              style={{
                height: 174,
                marginBottom: 46,
                fontSize: 140,
                fontWeight: 800,
                lineHeight: "174px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          height: 7,
          width: 800,
          marginTop: 6,
          background: INK,
          transform: `scaleX(${underline})`,
          transformOrigin: "0% 50%",
        }}
      />

      <div
        style={{
          display: "inline-block",
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 92,
          lineHeight: 1,
          background: INK,
          color: PAPER,
          padding: "8px 20px 12px",
          marginLeft: -20,
          marginTop: 30,
          fontVariantNumeric: "tabular-nums",
          opacity: probIn,
        }}
      >
        {prob.toFixed(3).replace(".", ",")}
      </div>

      <div
        style={{
          display: "flex",
          gap: 52,
          justifyContent: "flex-start",
          marginTop: 22,
          ...mono(21),
          color: MUTED,
          opacity: others,
        }}
      >
        <span>
          DEFENDER <b style={{ color: INK, fontWeight: 500 }}>0,020</b>
        </span>
        <span>
          FORWARD <b style={{ color: INK, fontWeight: 500 }}>0,125</b>
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene D: name card                                                  */
/* ------------------------------------------------------------------ */

const NameCard: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - BLACK_START;
  const rise1 = interpolate(local, [2, 17], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rise2 = interpolate(local, [6, 21], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const metaIn = fade(local, 20, 12);
  const reportIn = fade(local, 30, 14);
  const rule = interpolate(local, [38, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const push = interpolate(local, [0, 91], [1, 1.035], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: INK,
        color: PAPER,
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${push})`,
          transformOrigin: "24% 42%",
        }}
      >
        <div style={{ position: "absolute", left: 120, top: 320 }}>
          <div
            style={{
              overflow: "hidden",
              paddingTop: 34,
              marginTop: -34,
              marginBottom: -34,
            }}
          >
            <div
              style={{
                fontSize: 184,
                fontWeight: 800,
                lineHeight: 0.94,
                letterSpacing: "-0.05em",
                transform: `translateY(${(1 - rise1) * 108}%)`,
              }}
            >
              ÉRIK
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 184,
                fontWeight: 800,
                lineHeight: 0.94,
                letterSpacing: "-0.05em",
                transform: `translateY(${(1 - rise2) * 108}%)`,
              }}
            >
              LAMELA
            </div>
          </div>
          <div
            style={{
              ...mono(20),
              marginTop: 34,
              color: "rgba(246,246,243,0.58)",
              opacity: metaIn,
              transform: `translateY(${(1 - metaIn) * 12}px)`,
            }}
          >
            sayap kanan / sevilla / 30 tahun
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 1150,
            top: 420,
            width: 640,
            opacity: reportIn,
            transform: `translateY(${(1 - reportIn) * 22}px)`,
          }}
        >
          <div style={{ ...mono(14), color: BONE, marginBottom: 16 }}>
            posisi di rapor data
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            PENYERANG
          </div>
          <div
            style={{
              height: 7,
              width: 430,
              background: BONE,
              marginTop: 14,
              transform: `scaleX(${rule})`,
              transformOrigin: "0% 50%",
            }}
          />
          <div
            style={{
              ...mono(14),
              color: "rgba(246,246,243,0.46)",
              marginTop: 22,
            }}
          >
            bestposition / data uji
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scene E: thesis                                                     */
/* ------------------------------------------------------------------ */

const Thesis: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - PAPER_START;
  const l1 = interpolate(local, [-9, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const l2 = interpolate(local, [-5, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rule = interpolate(local, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const noteIn = fade(local, 18, 14);
  const pull = interpolate(local, [0, 158], [1.09, 0.97], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: BONE,
        color: INK,
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 350,
          transform: `scale(${pull}) translateY(${(pull - 1) * 160}px)`,
          transformOrigin: "6% 24%",
        }}
      >
        <div
          style={{
            fontSize: 118,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.06,
            color: "rgba(23,24,26,0.46)",
            clipPath: `inset(0 ${(1 - l1) * 100}% 0 0)`,
          }}
        >
          Bukan posisi terbaik.
        </div>
        <div
          style={{
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1.04,
            opacity: l2,
            transform: `translateY(${(1 - l2) * 64}px)`,
          }}
        >
          Posisi yang{" "}
          <span
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              paddingBottom: 12,
              backgroundImage: `linear-gradient(${INK}, ${INK})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 100%",
              backgroundSize: `${rule * 100}% 6px`,
            }}
          >
            tercatat.
          </span>
        </div>
        <div style={{ ...mono(18), color: MUTED, marginTop: 74, opacity: noteIn }}>
          model menebak label / bukan menilai potensi
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.55'/></svg>\")";

export const FifaColdOpen: React.FC = () => {
  useLoadedFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const css = useMemo(() => fontStyles(), []);

  const cam = camAt(frame);
  const breath = Math.sin((frame / fps) * 0.62) * 1.2;
  const worldVisible = frame < BLACK_START;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BONE,
        fontFamily: '"Inter Tight", sans-serif',
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {worldVisible ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 2600,
            height: 1500,
            transformOrigin: "0 0",
            transform: `translate3d(${960 - cam.x * cam.s}px, ${
              540 - cam.y * cam.s + breath
            }px, 0) scale(${cam.s})`,
            background: BONE,
          }}
        >
          <QuestionMark frame={frame} />
          <Ledger frame={frame} />
          <Verdict frame={frame} />
        </div>
      ) : null}

      {frame >= BLACK_START && frame < PAPER_START ? (
        <NameCard frame={frame} />
      ) : null}

      {frame >= PAPER_START ? <Thesis frame={frame} /> : null}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: 0.05,
          mixBlendMode: "multiply",
          backgroundImage: GRAIN,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(23,24,26,0.10) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
