import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BONE,
  FONT_SERIF,
  GRAIN,
  HAIRLINE,
  INK,
  MUTED,
  PAPER,
  Vignette,
  clamp01,
  easeInOutQuint,
  easeOutQuint,
  mono,
  prog,
  useLoadedFonts,
} from "./theme";

/**
 * Video 3, scenes 7-8. 1920x1080, 30 fps, 2580 frames (1:26).
 *
 * Scene 7      0..1350    lima atribut, lalu kalimat tentang peran penghubung
 * Scene 8   1350..2580    penutup, batasan, Lamela, lalu hitam
 *
 * Standalone: not wired into Video 1 or Video 2. Same palette, fonts, and cut
 * grammar. Duration is 1:26 because the closing black holds one second, not
 * the ten seconds a 1:35 target would leave empty.
 */

export const VIDEO3_FRAMES = 2580;

const S7_LINE = 840;
const S8 = 1350;
/** Beats inside scene 8, local to S8. */
const S8_LAMELA = 600;
const S8_BLACK = 1200;

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

type Imp = { name: string; size: number; value: string; hot: boolean };

const IMP: Imp[] = [
  { name: "SLIDINGTACKLE", size: 150, value: "0,0918", hot: false },
  { name: "FINISHING", size: 132, value: "0,0840", hot: false },
  { name: "HEADINGACCURACY", size: 112, value: "0,0725", hot: false },
  { name: "STANDINGTACKLE", size: 96, value: "0,0716", hot: false },
  { name: "VISION", size: 82, value: "0,0710", hot: true },
];

const WORD_TOP = 168;

/** Top edge of every word, stacked with a fixed leading per size. */
const TOPS = IMP.reduce<number[]>((acc, row, i) => {
  acc.push(i === 0 ? WORD_TOP : acc[i - 1] + IMP[i - 1].size * 1.02);
  return acc;
}, []);

const LIMITS = [
  "LABEL = BESTPOSITION",
  "SATU MUSIM, PEMAIN LAKI-LAKI",
  "KIPER DIKELUARKAN",
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
/* scene 7 a: five words, five weights                                 */
/* ------------------------------------------------------------------ */

const WordsShot: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const kicker = prog(local, 250, 20);
  const note = prog(local, 690, 22);
  const inv = prog(local, 600, 26, easeInOutQuint);

  return (
    <Page zoom={1 + local * 0.000028}>
      <div style={{ position: "absolute", left: 118, top: 108, opacity: kicker }}>
        <Label size={15} color="rgba(23,24,26,0.48)">
          importance / lima atribut teratas
        </Label>
      </div>

      {IMP.map((row, i) => {
        const at = -26 + i * 9;
        const p = prog(local, at, 22, easeOutQuint);
        if (p <= 0) return null;
        const valueIn = prog(local, 300 + i * 12, 20, easeOutQuint);
        const isHot = row.hot;
        const block = isHot ? inv : 0;

        return (
          <React.Fragment key={row.name}>
            <div
              style={{
                position: "absolute",
                left: 118,
                top: TOPS[i],
                opacity: p,
                transform: `translateX(${(1 - p) * -56}px)`,
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  padding: "0 16px 4px",
                  marginLeft: -16,
                  fontSize: row.size,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {block > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      background: INK,
                      transform: `scaleX(${block})`,
                      transformOrigin: "0% 50%",
                    }}
                  />
                )}
                <span
                  style={{ position: "relative", color: block > 0.55 ? PAPER : INK }}
                >
                  {row.name}
                </span>
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                right: 118,
                top: TOPS[i] + row.size * 0.62,
                width: 220,
                textAlign: "right",
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 28,
                fontWeight: isHot ? 600 : 500,
                letterSpacing: "0.01em",
                fontVariantNumeric: "tabular-nums",
                color: INK,
                opacity: valueIn * (isHot ? 1 : 0.78),
                transform: `translateY(${(1 - valueIn) * 10}px)`,
              }}
            >
              {row.value}
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 118,
          top: 830,
          width: 900,
          opacity: note,
          transform: `translateY(${(1 - note) * 12}px)`,
        }}
      >
        <Label size={16} color="rgba(23,24,26,0.46)">
          importance bukan sebab akibat: angkanya menunjukkan apa yang dipakai
          model
        </Label>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 7 b: the line that reopens the question                       */
/* ------------------------------------------------------------------ */

const LineShot: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const chart = prog(local, 18, 40, easeOutQuint);
  const l1 = prog(local, -8, 22, easeOutQuint);
  const l2 = prog(local, 4, 22, easeOutQuint);
  const inv = prog(local, 66, 24, easeInOutQuint);
  const note = prog(local, 300, 22);
  const drift = prog(local, 0, 510, (t) => t);

  return (
    <Page>
      <div style={{ position: "absolute", left: 118, top: 120, width: 620 }}>
        {IMP.map((row, i) => {
          const p = prog(local, 2 + i * 3, 14);
          return (
            <div
              key={row.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                ...mono(15),
                letterSpacing: "0.04em",
                color: row.hot ? INK : "rgba(23,24,26,0.42)",
                opacity: p,
                marginBottom: 12,
              }}
            >
              <span>{row.name}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{row.value}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 1140 + (1 - chart) * 90,
          top: 556,
          width: 690,
          height: 440,
          opacity: chart * 0.22,
          mixBlendMode: "multiply",
        }}
      >
        <Img
          src={staticFile("fifa/assets/notebook-05-importance.png")}
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
          left: 118,
          top: 372 - drift * 6,
          width: 1300,
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: "-0.042em",
          lineHeight: 1.08,
        }}
      >
        <div style={{ clipPath: `inset(0 ${(1 - l1) * 100}% 0 0)` }}>
          Bukan dua kutub.
        </div>
        <div style={{ clipPath: `inset(0 ${(1 - l2) * 100}% 0 0)` }}>
          Ada peran{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              padding: "2px 6px 6px 12px",
              marginLeft: -12,
            }}
          >
            {inv > 0 && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: -4,
                  bottom: -18,
                  background: INK,
                  transform: `scaleX(${inv})`,
                  transformOrigin: "0% 50%",
                }}
              />
            )}
            <span style={{ position: "relative", color: inv > 0.55 ? PAPER : INK }}>
              penghubung
            </span>
          </span>
          .
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 118,
          top: 596,
          width: 940,
          opacity: note,
          transform: `translateY(${(1 - note) * 12}px)`,
        }}
      >
        <Label size={19} color="rgba(23,24,26,0.50)">
          empat pertama: dua untuk bertahan, dua untuk menyerang
        </Label>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 8 a: the closing sentence, then the limits                    */
/* ------------------------------------------------------------------ */

const SERIF: React.CSSProperties = {
  fontFamily: FONT_SERIF,
  fontStyle: "italic",
  fontWeight: 400,
};

const ClosingShot: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const l1 = prog(local, -8, 22, easeOutQuint);
  const l2 = prog(local, 4, 22, easeOutQuint);
  const l3 = prog(local, 16, 22, easeOutQuint);
  const l4 = prog(local, 28, 22, easeOutQuint);
  const limits = prog(local, 300, 24, easeOutQuint);

  return (
    <Page zoom={1 + local * 0.00005}>
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 190,
          width: 1300,
          fontSize: 124,
          fontWeight: 700,
          letterSpacing: "-0.045em",
          lineHeight: 1.08,
        }}
      >
        <div
          style={{
            clipPath: `inset(0 ${(1 - l1) * 100}% 0 0)`,
          }}
        >
          Data tidak
        </div>
        <div
          style={{
            clipPath: `inset(0 ${(1 - l2) * 100}% 0 0)`,
          }}
        >
          menggantikan mata.
        </div>
        <div
          style={{
            clipPath: `inset(0 ${(1 - l3) * 100}% 0 0)`,
          }}
        >
          Ia memberi cara lain
        </div>
        <div
          style={{
            clipPath: `inset(0 ${(1 - l4) * 100}% 0 0)`,
          }}
        >
          untuk <span style={SERIF}>bertanya.</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 118,
          top: 820,
          opacity: limits,
        }}
      >
        {LIMITS.map((line, i) => {
          const p = prog(local, 302 + i * 12, 20);
          return (
            <div
              key={line}
              style={{
                ...mono(18),
                letterSpacing: "0.06em",
                color: "rgba(23,24,26,0.52)",
                lineHeight: 1.86,
                opacity: p,
                transform: `translateY(${(1 - p) * 10}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene 8 b: the two readings of one player                           */
/* ------------------------------------------------------------------ */

const LamelaShot: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame;
  const photo = prog(local, -14, 30, easeOutQuint);
  const rapor = prog(local, -4, 22, easeOutQuint);
  const model = prog(local, 70, 22, easeOutQuint);
  const inv = prog(local, 92, 26, easeInOutQuint);
  const last = prog(local, 300, 24, easeOutQuint);
  const drift = prog(local, 0, 600, (t) => t);

  return (
    <Page>
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 168 + (1 - photo) * 26,
          width: 500,
          height: 620,
          padding: 12,
          boxSizing: "border-box",
          background: PAPER,
          outline: `1px solid ${HAIRLINE}`,
          opacity: photo * 0.9,
          transform: `rotate(-1.2deg)`,
        }}
      >
        <Img
          src={staticFile("fifa/assets/lamela-2020.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 12%",
            filter: "grayscale(1) contrast(1.05) brightness(0.96)",
          }}
        />
      </div>

      <div style={{ position: "absolute", left: 118, top: 826, opacity: photo }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          ÉRIK LAMELA
        </div>
        <div
          style={{
            ...mono(12),
            color: "rgba(23,24,26,0.52)",
            lineHeight: 1.8,
            marginTop: 10,
          }}
        >
          <div>foto 2020 / data fifa 23</div>
          <div>foto: steffen prößdorf / cc by-sa 4.0</div>
          <div>diubah: crop / duotone</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 740, top: 286 }}>
        <Label size={15} color="rgba(23,24,26,0.46)">
          <span style={{ opacity: rapor }}>rapor</span>
        </Label>
      </div>

      <div
        style={{
          position: "absolute",
          left: 740,
          top: 316 - drift * 3,
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: "-0.045em",
          lineHeight: 1.02,
          opacity: rapor,
          transform: `translateX(${(1 - rapor) * -40}px)`,
        }}
      >
        PENYERANG
      </div>

      <div style={{ position: "absolute", left: 740, top: 486 }}>
        <Label size={15} color="rgba(23,24,26,0.46)">
          <span style={{ opacity: model }}>model</span>
        </Label>
      </div>

      <div
        style={{
          position: "absolute",
          left: 740,
          top: 516,
          opacity: model,
          transform: `translateX(${(1 - model) * -40}px)`,
        }}
      >
        <span
          style={{
            position: "relative",
            display: "inline-block",
            padding: "4px 20px 10px",
            marginLeft: -20,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
          }}
        >
          {inv > 0 && (
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
          )}
          <span style={{ position: "relative", color: inv > 0.55 ? PAPER : INK }}>
            GELANDANG
          </span>
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 740,
          top: 700,
          width: 1020,
          opacity: last,
          transform: `translateY(${(1 - last) * 14}px)`,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.18,
            color: INK,
          }}
        >
          Mungkin keduanya benar.
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* scene sheet wipe                                                    */
/* ------------------------------------------------------------------ */

const WIPES = [S7_LINE, S8, S8 + S8_LAMELA];

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

const Scene7: React.FC<{ frame: number }> = ({ frame }) =>
  frame < S7_LINE ? (
    <WordsShot frame={frame} />
  ) : (
    <LineShot frame={frame - S7_LINE} />
  );

const Scene8: React.FC<{ frame: number }> = ({ frame }) =>
  frame < S8_LAMELA ? (
    <ClosingShot frame={frame} />
  ) : (
    <LamelaShot frame={frame - S8_LAMELA} />
  );

export const FifaVideo3: React.FC = () => {
  const css = useLoadedFonts("fifa video 3 fonts");
  const frame = useCurrentFrame();

  const body = frame < S8 ? <Scene7 frame={frame} /> : <Scene8 frame={frame - S8} />;
  const black = frame >= S8 + S8_BLACK;

  return (
    <AbsoluteFill style={{ backgroundColor: BONE, overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {body}
      <Vignette />
      <SceneWipe frame={frame} />
      {black && <AbsoluteFill style={{ background: INK }} />}
    </AbsoluteFill>
  );
};
