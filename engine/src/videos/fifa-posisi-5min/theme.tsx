import React, { useEffect, useMemo, useState } from "react";
import { delayRender, continueRender, staticFile } from "remotion";

/**
 * Shared design tokens and helpers for the FIFA position video series.
 * Camera-free: each scene composes inside a 1920x1080 page.
 */

export const INK = "#17181A";
export const DEEP = "#1B1C1E";
export const BONE = "#E7E7E4";
export const PAPER = "#F6F6F3";
export const MUTED = "#6F7073";
export const ACCENT = "#3A3B3E";
export const ALERT = "#8C3B31";

/** Neutral hairline for card/print outlines. Never a colored border. */
export const HAIRLINE = "rgba(23,24,26,0.16)";

export const FONT_DISPLAY = '"Inter Tight", sans-serif';
export const FONT_SERIF = '"Instrument Serif", serif';
export const FONT_MONO = '"IBM Plex Mono", monospace';

export const fps = 30;

export const fontStyles = () =>
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

export const useLoadedFonts = (label = "fifa video fonts") => {
  const [handle] = useState(() => delayRender(label));
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

  return useMemo(() => fontStyles(), []);
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

/** Clamped 0..1 progress across [start, start + dur]. */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  ease: (t: number) => number = easeOut
) => ease(clamp01((frame - start) / dur));

export const mono = (size: number): React.CSSProperties => ({
  fontFamily: FONT_MONO,
  fontSize: size,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
});

export const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.55'/></svg>\")";

export const Vignette: React.FC = () => (
  <AbsoluteFillSafe>
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.05,
        mixBlendMode: "multiply",
        backgroundImage: GRAIN,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(12,12,12,0.10) 100%)",
      }}
    />
  </AbsoluteFillSafe>
);

const AbsoluteFillSafe: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div style={{ position: "absolute", inset: 0 }}>{children}</div>;

/**
 * No speaker captions and no edge furniture.
 *
 * The video never names who is speaking, and nothing is pinned to a corner or
 * to the top/bottom edge of the frame. Identity is carried by the voice change
 * alone.
 */
